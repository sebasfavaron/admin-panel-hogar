import { Router } from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { validateLogin, validateRegister } from '../middleware/authValidation';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.get('/profile', auth, getProfile);

export default router;
