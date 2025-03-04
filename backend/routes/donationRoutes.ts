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

const router = Router();

router.get('/', getDonations);
router.get('/:id', getDonation);
router.post('/', validateDonation, createDonation);
router.put('/:id', validateDonation, updateDonation);
router.delete('/:id', deleteDonation);
router.get('/collaborator/:collaboratorId', getDonationsByCollaborator);

export default router;
