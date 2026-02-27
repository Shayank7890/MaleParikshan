import { Router } from 'express';
import { getModules, updateProgress } from '../controllers/module.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getModules);
router.post('/progress', updateProgress);

export default router;
