import {
  Model,
  DataTypes,
  Optional,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/database';
import Collaborator from './Collaborator';

export type EmailCampaignStatus = 'draft' | 'sent';

// Define attributes interface
export interface EmailCampaignAttributes {
  id: string;
  subject: string;
  body: string;
  sent_at?: Date;
  status: EmailCampaignStatus;
  recipient_count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes interface (optional fields during creation)
export interface EmailCampaignCreationAttributes
  extends Optional<
    EmailCampaignAttributes,
    'id' | 'sent_at' | 'status' | 'recipient_count' | 'createdAt' | 'updatedAt'
  > {}

// Define the EmailCampaign class
class EmailCampaign
  extends Model<EmailCampaignAttributes, EmailCampaignCreationAttributes>
  implements EmailCampaignAttributes
{
  public id!: string;
  public subject!: string;
  public body!: string;
  public sent_at?: Date;
  public status!: EmailCampaignStatus;
  public recipient_count!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods
  public getRecipients!: BelongsToManyGetAssociationsMixin<Collaborator>;
  public setRecipients!: (
    recipients: Collaborator[],
    options?: any
  ) => Promise<any>;

  // Define recipients association property
  public readonly recipients?: Collaborator[];

  // Association method
  public static associate(models: any): void {
    // Will be defined in associations.ts
  }
}

EmailCampaign.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent'),
      defaultValue: 'draft',
      allowNull: false,
    },
    recipient_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'EmailCampaign',
    tableName: 'EmailCampaigns',
    hooks: {
      afterCreate: async (campaign: EmailCampaign, options) => {
        try {
          // Update the recipient_count when specific associations exist
          if (
            options?.include &&
            Array.isArray(options.include) &&
            options.include.length
          ) {
            await campaign.update(
              { recipient_count: (campaign as any).recipients?.length || 0 },
              { transaction: options.transaction }
            );
          }
        } catch (error) {
          console.error('Error in afterCreate hook:', error);
        }
      },
      afterBulkCreate: async (campaigns: EmailCampaign[], options) => {
        try {
          // Process campaigns with recipients
          for (const campaign of campaigns) {
            if ((campaign as any).recipients?.length) {
              await campaign.update(
                {
                  recipient_count: (campaign as any).recipients.length,
                },
                { transaction: options.transaction }
              );
            }
          }
        } catch (error) {
          console.error('Error in afterBulkCreate hook:', error);
        }
      },
    },
  }
);

export default EmailCampaign;
