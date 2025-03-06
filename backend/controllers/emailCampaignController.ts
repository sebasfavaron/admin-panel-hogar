import { Request, Response } from 'express';
import EmailCampaign from '../models/EmailCampaign';
import { emailService } from '../services/emailService';

export const getEmailCampaigns = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaigns = await EmailCampaign.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching email campaigns' });
  }
};

export const getEmailCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaign = await EmailCampaign.findByPk(req.params.id, {
      include: ['recipients'],
    });
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching campaign' });
  }
};

export const createEmailCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaign = await EmailCampaign.create({
      ...req.body,
      status: 'draft',
    });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: 'Error creating campaign' });
  }
};

export const updateEmailCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaign = await EmailCampaign.findByPk(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    if (campaign.status === 'sent') {
      res.status(400).json({ error: 'Cannot update a sent campaign' });
      return;
    }

    await campaign.update(req.body);
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: 'Error updating campaign' });
  }
};

export const deleteEmailCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaign = await EmailCampaign.findByPk(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    if (campaign.status === 'sent') {
      res.status(400).json({ error: 'Cannot delete a sent campaign' });
      return;
    }

    await campaign.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting campaign' });
  }
};

export const sendCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { filters } = req.body;

  try {
    const campaign = await EmailCampaign.findByPk(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    if (campaign.status === 'sent') {
      res.status(400).json({ error: 'Campaign has already been sent' });
      return;
    }

    // Start sending process but don't wait for it
    emailService.sendBulkEmail(req.params.id, filters).catch((error) => {
      console.error('Background send failed:', error);
    });

    // Return success immediately
    res.json({
      message: 'Campaign sending started',
      campaignId: req.params.id,
    });
  } catch (error) {
    console.error('Error initiating campaign send:', error);
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error initiating campaign send',
    });
  }
};

export const previewRecipients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filters } = req.body;
    const recipients = await emailService.getFilteredCollaborators(filters);

    res.json({
      count: recipients.length,
      sample: recipients.slice(0, 5).map((r) => ({
        name: r.name,
        email: r.email,
        help_type: r.help_type,
        last_contact: r.last_contact,
      })),
    });
  } catch (error) {
    console.error('Error in previewRecipients:', error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Error previewing recipients',
      details: error instanceof Error ? error.stack : undefined,
    });
  }
};
