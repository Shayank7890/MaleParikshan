import { Router } from 'express';
import { register, login, guestLogin } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/guest', guestLogin);

export default router;
