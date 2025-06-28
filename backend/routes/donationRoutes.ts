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
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', getDonations);
router.get('/:id', getDonation);
router.get('/collaborator/:collaboratorId', getDonationsByCollaborator);
router.post('/', auth, validateDonation, createDonation);
router.put('/:id', auth, validateDonation, updateDonation);
router.delete('/:id', auth, deleteDonation);

export default router;
