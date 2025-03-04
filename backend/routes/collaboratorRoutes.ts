import { Router } from 'express';
import {
  getCollaborators,
  getCollaborator,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../controllers/collaboratorController';
import { validateCollaborator } from '../middleware/collaboratorValidation';

const router = Router();

router.get('/', getCollaborators);
router.get('/:id', getCollaborator);
router.post('/', validateCollaborator, createCollaborator);
router.put('/:id', validateCollaborator, updateCollaborator);
router.delete('/:id', deleteCollaborator);

export default router;
