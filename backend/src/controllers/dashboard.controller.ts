import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const [user, streak, recentMood, moduleProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, email: true, age: true, language: true,
          adultModeEnabled: true, isGuest: true,
          profile: {
            select: { bmi: true, riskScore: true, activityLevel: true, goals: true },
          },
        },
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.moodLog.findFirst({ where: { userId }, orderBy: { logDate: 'desc' } }),
      prisma.moduleProgress.count({ where: { userId, completed: true } }),
    ]);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Basic health score calculation (0-100)
    let healthScore = 50;
    if (user.profile) {
      const bmi = user.profile.bmi ?? 22;
      const riskScore = user.profile.riskScore ?? 50;
      healthScore = Math.max(0, Math.min(100, 100 - riskScore + (bmi >= 18.5 && bmi <= 24.9 ? 10 : 0)));
    }

    sendSuccess(res, {
      user,
      healthScore: Math.round(healthScore),
      streak: streak
        ? { current: streak.currentStreak, longest: streak.longestStreak, target: streak.targetDays }
        : null,
      todayMood: recentMood?.mood ?? null,
      modulesCompleted: moduleProgress,
    }, 'Dashboard loaded');
  } catch (err) {
    next(err);
  }
};
