import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

// Placeholder AI response logic - replace with real AI API integration later
const generateAIResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('bmi') || lowerMsg.includes('weight')) {
    return 'Maintaining a healthy BMI (18.5–24.9) is important for overall men\'s health. Regular exercise and a balanced diet are key. Complete your health profile to get personalized insights!';
  }
  if (lowerMsg.includes('sleep')) {
    return 'Adults need 7–9 hours of sleep per night. Poor sleep can impact testosterone levels, mood, and physical performance. Try to maintain a consistent sleep schedule.';
  }
  if (lowerMsg.includes('stress') || lowerMsg.includes('anxiety')) {
    return 'Managing stress is crucial for men\'s health. Try mindfulness, regular exercise, and talking to someone you trust. If stress is overwhelming, please consider speaking with a mental health professional.';
  }
  if (lowerMsg.includes('nofap') || lowerMsg.includes('streak')) {
    return 'Consistency is key! Many men report improved focus, energy, and confidence with better self-control habits. Track your progress using the streak tracker. You\'ve got this!';
  }
  if (lowerMsg.includes('testosterone')) {
    return 'Testosterone levels are influenced by sleep, diet, exercise, and stress. Resistance training, adequate zinc intake, and healthy sleep can naturally support testosterone levels.';
  }

  return 'Thank you for your question. Male Parikshan is here to support your health journey. For personalized advice, complete your health profile. Remember, small consistent steps lead to big changes!';
};

export const chat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { message } = chatSchema.parse(req.body);

    const response = generateAIResponse(message);

    const log = await prisma.chatLog.create({
      data: { userId, message, response },
    });

    sendSuccess(res, { message: log.message, response: log.response, timestamp: log.timestamp }, 'Response generated');
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const logs = await prisma.chatLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
      select: { message: true, response: true, timestamp: true },
    });

    sendSuccess(res, logs, 'Chat history fetched');
  } catch (err) {
    next(err);
  }
};
