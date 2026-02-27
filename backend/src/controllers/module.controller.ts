import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const progressSchema = z.object({
  moduleId: z.string().uuid(),
  completed: z.boolean(),
});

export const getModules = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const modules = await prisma.module.findMany({
      where: user?.adultModeEnabled ? {} : { isAdultOnly: false },
      orderBy: { order: 'asc' },
      include: {
        progress: {
          where: { userId },
          select: { completed: true, completedAt: true },
        },
      },
    });

    sendSuccess(res, modules, 'Modules fetched');
  } catch (err) {
    next(err);
  }
};

export const updateProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { moduleId, completed } = progressSchema.parse(req.body);

    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) {
      sendError(res, 'Module not found', 404);
      return;
    }

    if (module.isAdultOnly) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.adultModeEnabled) {
        sendError(res, 'Adult mode required for this module', 403);
        return;
      }
    }

    const progress = await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      create: { userId, moduleId, completed, completedAt: completed ? new Date() : null },
      update: { completed, completedAt: completed ? new Date() : null },
    });

    sendSuccess(res, progress, 'Progress updated');
  } catch (err) {
    next(err);
  }
};
