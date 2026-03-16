"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetLoginRateLimit = exports.rateLimitLogin = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
/**
 * Rate limiter for login attempts
 * Max 5 attempts per 15 minutes per IP address
 */
const loginRateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 5, // Number of attempts
    duration: 15 * 60, // 15 minutes in seconds
    blockDuration: 15 * 60, // Block for 15 minutes after exceeding limit
});
/**
 * Middleware to rate limit login attempts by IP address
 */
const rateLimitLogin = async (req, res, next) => {
    try {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        // Bypass IP rate limiting in development mode to allow repeated testing
        if (process.env.NODE_ENV !== 'production') {
            return next();
        }
        await loginRateLimiter.consume(ipAddress);
        next();
    }
    catch (error) {
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
exports.rateLimitLogin = rateLimitLogin;
/**
 * Reset rate limit for an IP address (used after successful login)
 */
const resetLoginRateLimit = async (ipAddress) => {
    try {
        await loginRateLimiter.delete(ipAddress);
    }
    catch (error) {
        console.error('Error resetting rate limit:', error);
    }
};
exports.resetLoginRateLimit = resetLoginRateLimit;
