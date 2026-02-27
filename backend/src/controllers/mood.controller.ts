import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const moodSchema = z.object({
  mood: z.enum(['calm', 'angry', 'low', 'confident', 'neutral']),
  note: z.string().max(500).optional(),
});

export const logMood = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = moodSchema.parse(req.body);

    const log = await prisma.moodLog.create({
      data: { userId, ...data },
    });

    sendSuccess(res, log, 'Mood logged', 201);
  } catch (err) {
    next(err);
  }
};

export const getMoodReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const logs = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { logDate: 'desc' },
      take: 30,
    });

    // Aggregate mood counts
    const summary: Record<string, number> = {};
    logs.forEach((l) => {
      summary[l.mood] = (summary[l.mood] || 0) + 1;
    });

    sendSuccess(res, { logs, summary }, 'Mood report fetched');
  } catch (err) {
    next(err);
  }
};
