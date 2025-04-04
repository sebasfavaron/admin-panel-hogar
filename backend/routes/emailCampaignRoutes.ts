import { Router } from 'express';
import {
  getEmailCampaigns,
  getEmailCampaign,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  sendCampaign,
  previewRecipients,
} from '../controllers/emailCampaignController';
import { validateEmailCampaign } from '../middleware/emailCampaignValidation';

const router = Router();

router.get('/', getEmailCampaigns);
router.get('/:id', getEmailCampaign);
router.post('/preview-recipients', previewRecipients);
router.post('/', validateEmailCampaign, createEmailCampaign);
router.put('/:id', validateEmailCampaign, updateEmailCampaign);
router.delete('/:id', deleteEmailCampaign);
router.post('/:id/send', sendCampaign);

export default router;
