import { Router } from 'express';
import { chat, getChatHistory } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', chat);
router.get('/history', getChatHistory);

export default router;
