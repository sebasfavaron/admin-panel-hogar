import { Router } from 'express';
import {
  getCollaborators,
  getCollaborator,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../controllers/collaboratorController';
import { validateCollaborator } from '../middleware/collaboratorValidation';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', getCollaborators);
router.get('/:id', getCollaborator);
router.post('/', validateCollaborator, createCollaborator);
router.put('/:id', auth, validateCollaborator, updateCollaborator);
router.delete('/:id', auth, deleteCollaborator);

export default router;
