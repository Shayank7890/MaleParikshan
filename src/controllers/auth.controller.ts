import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(13).max(120),
  language: z.enum(['English', 'Hindi']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      sendError(res, 'Email already registered', 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        age: data.age,
        language: data.language || 'English',
      },
      select: { id: true, email: true, age: true, language: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email!, isGuest: false });
    sendSuccess(res, { user, token }, 'Registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = signToken({ userId: user.id, email: user.email!, isGuest: false });
    const { password: _, ...safeUser } = user;
    sendSuccess(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const guestLogin = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.create({
      data: { isGuest: true },
      select: { id: true, isGuest: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, isGuest: true });
    sendSuccess(res, { user, token }, 'Guest session created', 201);
  } catch (err) {
    next(err);
  }
};
