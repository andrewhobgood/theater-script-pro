import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Redis client with connection pooling
 */
class RedisService {
  private client: Redis | null = null;
  private isConnected = false;

  /**
   * Initialize Redis connection
   */
  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      this.client = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          logger.warn(`Redis retry attempt ${times}, delay: ${delay}ms`);
          return delay;
        },
        enableReadyCheck: true,
        lazyConnect: false,
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        logger.info('Redis client connection closed');
        this.isConnected = false;
      });

      // Wait for connection
      await this.client.ping();
      logger.info('Redis connection established successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Get Redis client instance
   */
  getClient(): Redis {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  /**
   * Cache wrapper with TTL
   */
  async cache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600 // Default 1 hour
  ): Promise<T> {
    try {
      const client = this.getClient();
      
      // Try to get from cache
      const cached = await client.get(key);
      if (cached) {
        logger.debug(`Cache hit for key: ${key}`);
        return JSON.parse(cached);
      }

      // Cache miss - fetch data
      logger.debug(`Cache miss for key: ${key}`);
      const data = await fetchFn();
      
      // Store in cache
      await client.set(key, JSON.stringify(data), 'EX', ttl);
      
      return data;
    } catch (error) {
      logger.error(`Cache error for key ${key}:`, error);
      // Fallback to direct fetch on cache error
      return fetchFn();
    }
  }

  /**
   * Delete cache entry
   */
  async delete(key: string): Promise<void> {
    try {
      const client = this.getClient();
      await client.del(key);
      logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to delete cache key ${key}:`, error);
    }
  }

  /**
   * Delete multiple cache entries by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const client = this.getClient();
      const keys = await client.keys(pattern);
      
      if (keys.length > 0) {
        await client.del(...keys);
        logger.debug(`Deleted ${keys.length} cache entries matching pattern: ${pattern}`);
      }
    } catch (error) {
      logger.error(`Failed to delete cache pattern ${pattern}:`, error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = this.getClient();
      const exists = await client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`Failed to check existence of key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set value with TTL
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const client = this.getClient();
      const serialized = JSON.stringify(value);
      
      if (ttl) {
        await client.set(key, serialized, 'EX', ttl);
      } else {
        await client.set(key, serialized);
      }
      
      logger.debug(`Set cache for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to set cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = this.getClient();
      const value = await client.get(key);
      
      if (value) {
        return JSON.parse(value);
      }
      
      return null;
    } catch (error) {
      logger.error(`Failed to get cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const client = this.getClient();
      const value = await client.incr(key);
      
      if (ttl && value === 1) {
        await client.expire(key, ttl);
      }
      
      return value;
    } catch (error) {
      logger.error(`Failed to increment key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Decrement counter
   */
  async decr(key: string): Promise<number> {
    try {
      const client = this.getClient();
      return await client.decr(key);
    } catch (error) {
      logger.error(`Failed to decrement key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set hash field
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const client = this.getClient();
      await client.hset(key, field, JSON.stringify(value));
      logger.debug(`Set hash field ${field} for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to set hash field ${field} for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get hash field
   */
  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const client = this.getClient();
      const value = await client.hget(key, field);
      
      if (value) {
        return JSON.parse(value);
      }
      
      return null;
    } catch (error) {
      logger.error(`Failed to get hash field ${field} for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get all hash fields
   */
  async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const client = this.getClient();
      const hash = await client.hgetall(key);
      const result: Record<string, T> = {};
      
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value as any;
        }
      }
      
      return result;
    } catch (error) {
      logger.error(`Failed to get all hash fields for key ${key}:`, error);
      return {};
    }
  }

  /**
   * Add to set
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      const client = this.getClient();
      return await client.sadd(key, ...members);
    } catch (error) {
      logger.error(`Failed to add to set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get set members
   */
  async smembers(key: string): Promise<string[]> {
    try {
      const client = this.getClient();
      return await client.smembers(key);
    } catch (error) {
      logger.error(`Failed to get set members for ${key}:`, error);
      return [];
    }
  }

  /**
   * Check if member exists in set
   */
  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const client = this.getClient();
      const result = await client.sismember(key, member);
      return result === 1;
    } catch (error) {
      logger.error(`Failed to check set membership for ${key}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const redisService = new RedisService();

// Export cache keys namespace helper
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  script: (scriptId: string) => `script:${scriptId}`,
  scripts: {
    list: (params: any) => `scripts:list:${JSON.stringify(params)}`,
    byUser: (userId: string) => `scripts:user:${userId}`,
    perusal: (scriptId: string) => `scripts:perusal:${scriptId}`,
  },
  license: (licenseId: string) => `license:${licenseId}`,
  licenses: {
    byUser: (userId: string) => `licenses:user:${userId}`,
    byScript: (scriptId: string) => `licenses:script:${scriptId}`,
  },
  payment: (paymentId: string) => `payment:${paymentId}`,
  session: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
};