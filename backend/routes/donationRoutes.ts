import { Router } from 'express';
import {
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationsByCollaborator,
} from '../controllers/donationController';
import { validateDonation } from '../middleware/donationValidation';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getDonations);
router.get('/:id', getDonation);
router.get('/collaborator/:collaboratorId', getDonationsByCollaborator);
router.post('/', requireRole(['admin']), validateDonation, createDonation);
router.put('/:id', requireRole(['admin']), validateDonation, updateDonation);
router.delete('/:id', requireRole(['admin']), deleteDonation);

export default router;
