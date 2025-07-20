import { Request, Response, NextFunction } from 'express';
import { redisService, cacheKeys } from '../services/redis';
import { logger } from '../utils/logger';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

/**
 * Redis-based rate limiter middleware
 */
export function redisRateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    keyGenerator = (req) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later.',
  } = options;

  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate rate limit key
      const identifier = keyGenerator(req);
      const key = cacheKeys.rateLimit(identifier);

      // Get current count
      const current = await redisService.incr(key, windowSeconds);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());

      // Check if limit exceeded
      if (current > max) {
        logger.warn(`Rate limit exceeded for ${identifier}`);
        res.setHeader('Retry-After', Math.ceil(windowSeconds));
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message,
          retryAfter: windowSeconds,
        });
      }

      // Store original end method
      const originalEnd = res.end;
      
      // Override end method to handle skip options
      res.end = function(...args: any[]) {
        const statusCode = res.statusCode;
        
        // Determine if we should decrement the counter
        const shouldSkip = 
          (skipSuccessfulRequests && statusCode < 400) ||
          (skipFailedRequests && statusCode >= 400);

        if (shouldSkip) {
          // Decrement the counter
          redisService.decr(key).catch(err => {
            logger.error('Failed to decrement rate limit counter:', err);
          });
        }

        // Call original end
        return originalEnd.apply(this, args);
      };

      next();
    } catch (error) {
      logger.error('Redis rate limiter error:', error);
      // Continue without rate limiting on error
      next();
    }
  };
}

/**
 * Create rate limiter for API endpoints
 */
export const apiRateLimiter = redisRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip || 'unknown';
  },
});

/**
 * Create strict rate limiter for auth endpoints
 */
export const authRateLimiter = redisRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.',
});

/**
 * Create rate limiter for file uploads
 */
export const uploadRateLimiter = redisRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip || 'unknown',
  message: 'Upload limit exceeded, please try again later.',
});