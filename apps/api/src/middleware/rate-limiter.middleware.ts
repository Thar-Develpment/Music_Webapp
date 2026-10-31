import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export function rateLimiter({
  windowMs = 60 * 1000,
  max = 100,
  message = "Too many requests. Please try again later.",
}: {
  windowMs?: number;
  max?: number;
  message?: string;
} = {}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "global";
    const key = `${req.baseUrl || ""}_${ip}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    if (record.count >= max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return next(new AppError(message, 429));
    }

    record.count++;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    next();
  };
}
