import { Router } from 'express';
import { logMood, getMoodReport } from '../controllers/mood.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', logMood);
router.get('/report', getMoodReport);

export default router;
