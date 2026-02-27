import { Router } from 'express';
import { enableAdultMode } from '../controllers/adult.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/enable', enableAdultMode);

export default router;
