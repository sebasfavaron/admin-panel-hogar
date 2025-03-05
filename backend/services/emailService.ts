import sgMail from '@sendgrid/mail';
import EmailCampaign from '../models/EmailCampaign';
import Collaborator from '../models/Collaborator';
import { Op } from 'sequelize';
import pLimit from 'p-limit';

// Validate environment variables at startup
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
  console.error('Invalid or missing SENDGRID_API_KEY in environment variables');
}

if (
  !SENDGRID_FROM_EMAIL ||
  SENDGRID_FROM_EMAIL === 'no-reply@yourorphanage.org'
) {
  console.error(
    'Invalid or missing SENDGRID_FROM_EMAIL in environment variables'
  );
}

// Initialize SendGrid with API key
sgMail.setApiKey(SENDGRID_API_KEY || '');

interface FilterOptions {
  helpType?: 'financial' | 'physical' | 'both';
  lastContactBefore?: Date;
  lastContactAfter?: Date;
}

class EmailServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'EmailServiceError';
    if (cause instanceof Error) {
      console.error('Original error:', {
        name: cause.name,
        message: cause.message,
        stack: cause.stack,
      });
    }
  }
}

export const emailService = {
  async getFilteredCollaborators(
    filters: FilterOptions
  ): Promise<Collaborator[]> {
    try {
      console.log('Applying filters:', JSON.stringify(filters, null, 2));
      const where: any = {};

      if (filters.helpType) {
        where.help_type = filters.helpType;
      }

      if (filters.lastContactBefore || filters.lastContactAfter) {
        where.last_contact = {};
        if (filters.lastContactBefore) {
          where.last_contact[Op.lte] = filters.lastContactBefore;
        }
        if (filters.lastContactAfter) {
          where.last_contact[Op.gte] = filters.lastContactAfter;
        }
      }

      const collaborators = await Collaborator.findAll({ where });
      return collaborators;
    } catch (error) {
      throw new EmailServiceError('Failed to filter collaborators', error);
    }
  },

  async sendBulkEmail(
    campaignId: string,
    filters?: FilterOptions
  ): Promise<void> {
    const transaction = await EmailCampaign.sequelize?.transaction();

    try {
      console.log(`Starting bulk email send for campaign ${campaignId}`);
      console.log('SendGrid configuration:', {
        apiKeyConfigured: !!SENDGRID_API_KEY,
        fromEmail: SENDGRID_FROM_EMAIL,
        environment: process.env.NODE_ENV,
      });

      // Lock the campaign record to prevent concurrent sends
      const campaign = await EmailCampaign.findByPk(campaignId, {
        transaction,
        lock: true,
      });

      if (!campaign) {
        throw new EmailServiceError('Campaign not found');
      }

      if (campaign.status === 'sent') {
        throw new EmailServiceError('Campaign has already been sent');
      }

      const recipients = await this.getFilteredCollaborators(filters || {});
      if (!recipients.length) {
        throw new EmailServiceError('No recipients found matching the filters');
      }

      console.log(`Found ${recipients.length} recipients matching filters`);

      // Update campaign status and recipients in a single transaction
      await Promise.all([
        campaign.setRecipients(recipients, {
          transaction,
          hooks: false, // Prevent recipient count hook
        }),
        campaign.update(
          {
            status: 'sent',
            sent_at: new Date(),
            recipient_count: recipients.length,
          },
          {
            transaction,
            hooks: false, // Prevent unnecessary hooks
          }
        ),
      ]);

      // For development, skip actual sending but show what would be sent
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Development mode - simulating email send');
      //   console.log(
      //     'Would send to:',
      //     recipients.map((r) => ({ email: r.email, name: r.name }))
      //   );

      //   await transaction.commit();
      //   return;
      // }

      // Send emails in batches
      const batchSize = 500; // SendGrid recommendation
      const rateLimit = pLimit(5); // Limit concurrent requests
      const batches = [];
      const totalBatches = Math.ceil(recipients.length / batchSize);

      console.log(
        `Splitting recipients into ${totalBatches} batches of up to ${batchSize} each`
      );

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;

        batches.push(
          rateLimit(async () => {
            try {
              console.log(
                `Processing batch ${batchNumber}/${totalBatches} (${batch.length} recipients)`
              );

              if (!SENDGRID_FROM_EMAIL) {
                throw new Error('SENDGRID_FROM_EMAIL is not configured');
              }
              const emailData = {
                to: batch.map((r) => ({ email: r.email, name: r.name })),
                from: { email: SENDGRID_FROM_EMAIL, name: 'Orphanage Admin' },
                subject: campaign.subject,
                html: campaign.body,
                trackingSettings: {
                  clickTracking: { enable: true },
                  openTracking: { enable: true },
                },
              };

              await sgMail.sendMultiple(emailData);
              console.log(
                `Successfully sent batch ${batchNumber}/${totalBatches}`
              );
            } catch (error: any) {
              console.error(
                `Error sending batch ${batchNumber}/${totalBatches}:`,
                {
                  error: error.message,
                  response: error.response?.body,
                }
              );
              throw error;
            }
          })
        );
      }

      // Wait for all email batches to complete before marking as sent
      await Promise.all(batches);
      console.log('All batches sent successfully');

      // Commit the transaction after successful send
      await transaction.commit();
      console.log(
        `Campaign ${campaignId} completed successfully with ${recipients.length} recipients`
      );
    } catch (error: any) {
      if (transaction) await transaction.rollback();

      console.error('Failed to send bulk email:', {
        error: error.message,
        response: error.response?.body,
        stack: error.stack,
      });

      throw new EmailServiceError(
        error instanceof EmailServiceError
          ? error.message
          : 'Failed to send bulk email campaign',
        error
      );
    }
  },
};
