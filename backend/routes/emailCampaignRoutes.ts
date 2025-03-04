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
import {
  validateEmailCampaign,
  validateSend,
} from '../middleware/emailCampaignValidation';

const router = Router();

router.get('/', getEmailCampaigns);
router.get('/:id', getEmailCampaign);
router.post('/', validateEmailCampaign, createEmailCampaign);
router.put('/:id', validateEmailCampaign, updateEmailCampaign);
router.delete('/:id', deleteEmailCampaign);
router.post('/:id/send', validateSend, sendCampaign);
router.post('/preview-recipients', validateSend, previewRecipients);

export default router;
