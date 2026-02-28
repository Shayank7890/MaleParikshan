import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ================================
   GEMINI INIT
================================ */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ================================
   VALIDATION
================================ */

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  mode: z.enum(["normal", "adult"]).default("normal"),
});

/* ================================
   SAFETY FILTER
================================ */

const explicitPatterns =
  /(how to have sex|sexual positions|explicit|porn link|nude)/i;

const illegalPatterns =
  /(rape|child porn|minor sex|how to assault)/i;

const selfHarmPatterns =
  /(suicide|kill myself|self harm|cutting)/i;

const isBlocked = (message: string): boolean => {
  return (
    explicitPatterns.test(message) ||
    illegalPatterns.test(message) ||
    selfHarmPatterns.test(message)
  );
};

const safeRedirect =
  "I can’t assist with explicit or harmful content. Male Parikshan focuses on responsible, educational guidance about men’s health, discipline, and emotional strength.";

/* ================================
   PROMPT BUILDER
================================ */

const buildSystemPrompt = (mode: "normal" | "adult") => {
  const base = `
You are Male Parikshan AI — an educational men's health assistant.

Tone:
- Calm
- Masculine
- Disciplined
- Respectful
- Non-judgmental

STRICT RULES:
- No explicit sexual techniques
- No graphic descriptions
- No medical diagnosis
- No illegal advice
- Redirect harmful content
`;

  if (mode === "adult") {
    return (
      base +
      `
Adult Mode:
- Consent education
- Porn vs reality awareness
- Emotional accountability
- Impulse control
- Still no explicit details
`
    );
  }

  return (
    base +
    `
Normal Mode:
- Hygiene education
- Sleep health
- Emotional strength
- Discipline and self-control
`
    );
};

/* ================================
   GEMINI CALL (FIXED CORRECTLY)
================================ */

const generateAIResponse = async (
  message: string,
  mode: "normal" | "adult"
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: buildSystemPrompt(mode),
    });

    const result = await model.generateContent(message);

    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm currently unable to respond. Please try again later.";
  }
};

/* ================================
   CHAT CONTROLLER
================================ */

export const chat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    const { message, mode } = chatSchema.parse(req.body);

    /* -------- Adult Mode Gate -------- */
    if (mode === "adult") {
      if (!user.age || user.age < 18 || !user.adultModeEnabled) {
        sendError(res, "Adult mode not permitted.", 403);
        return;
      }
    }

    /* -------- Safety Filter -------- */
    if (isBlocked(message)) {
      const log = await prisma.chatLog.create({
        data: { userId, message, response: safeRedirect },
      });

      sendSuccess(
        res,
        {
          message: log.message,
          response: log.response,
          timestamp: log.timestamp,
        },
        "Safe response generated"
      );
      return;
    }

    /* -------- Gemini Generation -------- */
    const aiResponse = await generateAIResponse(message, mode);

    /* -------- Store in DB -------- */
    const log = await prisma.chatLog.create({
      data: { userId, message, response: aiResponse },
    });

    sendSuccess(
      res,
      {
        message: log.message,
        response: log.response,
        timestamp: log.timestamp,
      },
      "Response generated"
    );
  } catch (err) {
    next(err);
  }
};

/* ================================
   CHAT HISTORY
================================ */

export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const userId = req.user.userId;

    const logs = await prisma.chatLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 50,
      select: { message: true, response: true, timestamp: true },
    });

    sendSuccess(res, logs, "Chat history fetched");
  } catch (err) {
    next(err);
  }
};