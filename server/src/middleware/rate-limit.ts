import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Rate limiter for login attempts
 * Max 5 attempts per 15 minutes per IP address
 */
const loginRateLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 15 * 60, // 15 minutes in seconds
  blockDuration: 15 * 60, // Block for 15 minutes after exceeding limit
});

/**
 * Middleware to rate limit login attempts by IP address
 */
export const rateLimitLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    // Bypass IP rate limiting in development mode to allow repeated testing
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    await loginRateLimiter.consume(ipAddress);
    next();
  } catch (error: any) {
    if (error.msBeforeNext) {
      const minutesRemaining = Math.ceil(error.msBeforeNext / 60000);
      res.status(429).json({
        error: 'Too many login attempts',
        message: `Too many login attempts from this IP. Please try again in ${minutesRemaining} minute(s).`,
        retryAfter: error.msBeforeNext,
      });
      return;
    }

    // If it's not a rate limit error, pass to error handler
    next(error);
  }
};

/**
 * Reset rate limit for an IP address (used after successful login)
 */
export const resetLoginRateLimit = async (ipAddress: string): Promise<void> => {
  try {
    await loginRateLimiter.delete(ipAddress);
  } catch (error) {
    console.error('Error resetting rate limit:', error);
  }
};
