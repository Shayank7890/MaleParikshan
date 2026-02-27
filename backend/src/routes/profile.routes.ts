import { Router } from 'express';
import { setupProfile, getProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/setup', setupProfile);
router.get('/me', getProfile);

export default router;
