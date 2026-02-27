import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const adultSchema = z.object({
  consentAccepted: z.boolean().refine((v) => v === true, 'Consent must be accepted'),
});

export const enableAdultMode = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { consentAccepted } = adultSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (!user.age || user.age < 18) {
      sendError(res, 'You must be 18 or older to enable adult mode', 403);
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { adultModeEnabled: true, consentAccepted },
      select: { id: true, adultModeEnabled: true, consentAccepted: true },
    });

    sendSuccess(res, updated, 'Adult mode enabled');
  } catch (err) {
    next(err);
  }
};
