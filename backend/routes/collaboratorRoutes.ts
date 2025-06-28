import { Router } from 'express';
import {
  getCollaborators,
  getCollaborator,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../controllers/collaboratorController';
import { validateCollaborator } from '../middleware/collaboratorValidation';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getCollaborators);
router.get('/:id', getCollaborator);
router.post(
  '/',
  requireRole(['admin']),
  validateCollaborator,
  createCollaborator
);
router.put(
  '/:id',
  requireRole(['admin']),
  validateCollaborator,
  updateCollaborator
);
router.delete('/:id', requireRole(['admin']), deleteCollaborator);

export default router;
