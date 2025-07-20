import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redis';
import { logger } from '../utils/logger';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
  keyGenerator?: (req: Request) => string;
  condition?: (req: Request) => boolean;
  invalidatePattern?: string | string[];
}

/**
 * Cache middleware for GET requests
 */
export function cache(options: CacheOptions = {}) {
  const {
    ttl = 3600, // Default 1 hour
    keyPrefix = 'cache',
    keyGenerator,
    condition,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Check condition if provided
    if (condition && !condition(req)) {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      // Check if Redis is connected
      if (!redisService.getClient()) {
        logger.warn('Redis not connected, skipping cache');
        return next();
      }

      // Try to get from cache
      const cached = await redisService.get<any>(cacheKey);
      if (cached && cached.data) {
        logger.debug(`Cache hit: ${cacheKey}`);
        
        // Set cache headers
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        
        // Send cached response
        return res.status(cached.status || 200).json(cached.data);
      }

      // Cache miss - continue to route handler
      logger.debug(`Cache miss: ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('X-Cache-Key', cacheKey);

      // Store original send function
      const originalSend = res.json;

      // Override json method to cache the response
      res.json = function(data: any) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisService.set(
            cacheKey,
            {
              data,
              status: res.statusCode,
              timestamp: new Date().toISOString(),
            },
            ttl
          ).catch(err => {
            logger.error('Failed to cache response:', err);
          });
        }

        // Call original send
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      // Continue without caching on error
      next();
    }
  };
}

/**
 * Invalidate cache middleware
 */
export function invalidateCache(patterns?: string | string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!patterns) {
        // Invalidate based on request path
        const basePattern = `cache:${req.baseUrl}*`;
        await redisService.deletePattern(basePattern);
        logger.debug(`Invalidated cache pattern: ${basePattern}`);
      } else {
        // Invalidate specific patterns
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        for (const pattern of patternArray) {
          await redisService.deletePattern(pattern);
          logger.debug(`Invalidated cache pattern: ${pattern}`);
        }
      }
    } catch (error) {
      logger.error('Failed to invalidate cache:', error);
    }

    next();
  };
}

/**
 * Cache key generators
 */
export const cacheKeyGenerators = {
  /**
   * Generate key including user ID
   */
  withUser: (prefix: string) => (req: Request) => {
    const userId = req.user?.id || 'anonymous';
    return `${prefix}:${userId}:${req.originalUrl || req.url}`;
  },

  /**
   * Generate key including query parameters
   */
  withQuery: (prefix: string) => (req: Request) => {
    const query = JSON.stringify(req.query);
    return `${prefix}:${req.path}:${query}`;
  },

  /**
   * Generate key for specific resource
   */
  resource: (resourceType: string, idParam: string = 'id') => (req: Request) => {
    const id = req.params[idParam];
    return `${resourceType}:${id}`;
  },
};