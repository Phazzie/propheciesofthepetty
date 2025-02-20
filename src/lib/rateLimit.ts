import rateLimit from 'express-rate-limit';
import { RateLimitError, ValidationError } from './errors';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = {
  reading: 5,    // 5 readings per 15 minutes
  auth: 10,      // 10 auth attempts per 15 minutes
  general: 100   // 100 general requests per 15 minutes
};

export const createRateLimiter = (type: keyof typeof MAX_REQUESTS) => {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: MAX_REQUESTS[type],
    handler: (_: any, __: any, ___: any, next: (arg0: RateLimitError) => void) => {
      next(new RateLimitError(
        `Too many ${type} attempts. Please try again in ${Math.ceil(RATE_LIMIT_WINDOW_MS / 60000)} minutes.`
      ));
    },
    keyGenerator: (request: { ip: any; headers: { [x: string]: string; }; }) => {
      return request.ip || request.headers['x-forwarded-for'] as string;
    }
  });
};

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.attempts = new Map();
    this.config = config;
  }

  check(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return;
    }

    if (now - attempt.firstAttempt > this.config.windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return;
    }

    if (attempt.count >= this.config.maxAttempts) {
      const timeLeft = Math.ceil((this.config.windowMs - (now - attempt.firstAttempt)) / 1000);
      throw new ValidationError(`Too many login attempts. Please try again in ${timeLeft} seconds.`);
    }

    attempt.count++;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000 // 15 minutes
});