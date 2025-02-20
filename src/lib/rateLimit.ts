import rateLimit from 'express-rate-limit';
import { RateLimitError } from './errors';

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