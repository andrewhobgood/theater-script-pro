import { redisService, cacheKeys } from './redis';
import { logger } from '../utils/logger';
import crypto from 'crypto';

interface SessionData {
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  lastActivity: string;
  metadata?: Record<string, any>;
}

/**
 * Session management service using Redis
 */
export class SessionService {
  private static readonly SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds
  private static readonly SESSION_PREFIX = 'session:';

  /**
   * Create a new session
   */
  static async create(userId: string, email: string, role: string, metadata?: Record<string, any>): Promise<string> {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionData: SessionData = {
      userId,
      email,
      role,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      metadata,
    };

    const key = cacheKeys.session(sessionId);
    await redisService.set(key, sessionData, this.SESSION_TTL);
    
    logger.info(`Session created for user ${userId}`);
    return sessionId;
  }

  /**
   * Get session data
   */
  static async get(sessionId: string): Promise<SessionData | null> {
    const key = cacheKeys.session(sessionId);
    const sessionData = await redisService.get<SessionData>(key);
    
    if (sessionData) {
      // Update last activity
      sessionData.lastActivity = new Date().toISOString();
      await redisService.set(key, sessionData, this.SESSION_TTL);
    }
    
    return sessionData;
  }

  /**
   * Update session data
   */
  static async update(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
    const key = cacheKeys.session(sessionId);
    const sessionData = await redisService.get<SessionData>(key);
    
    if (!sessionData) {
      return false;
    }
    
    const updatedSession = {
      ...sessionData,
      ...updates,
      lastActivity: new Date().toISOString(),
    };
    
    await redisService.set(key, updatedSession, this.SESSION_TTL);
    return true;
  }

  /**
   * Delete session
   */
  static async delete(sessionId: string): Promise<void> {
    const key = cacheKeys.session(sessionId);
    await redisService.delete(key);
    logger.info(`Session ${sessionId} deleted`);
  }

  /**
   * Delete all sessions for a user
   */
  static async deleteUserSessions(userId: string): Promise<void> {
    const pattern = `${this.SESSION_PREFIX}*`;
    const keys = await redisService.getClient().keys(pattern);
    
    for (const key of keys) {
      const sessionData = await redisService.get<SessionData>(key);
      if (sessionData && sessionData.userId === userId) {
        await redisService.delete(key);
      }
    }
    
    logger.info(`All sessions deleted for user ${userId}`);
  }

  /**
   * Check if session exists
   */
  static async exists(sessionId: string): Promise<boolean> {
    const key = cacheKeys.session(sessionId);
    return await redisService.exists(key);
  }

  /**
   * Get active session count for a user
   */
  static async getUserSessionCount(userId: string): Promise<number> {
    const pattern = `${this.SESSION_PREFIX}*`;
    const keys = await redisService.getClient().keys(pattern);
    
    let count = 0;
    for (const key of keys) {
      const sessionData = await redisService.get<SessionData>(key);
      if (sessionData && sessionData.userId === userId) {
        count++;
      }
    }
    
    return count;
  }

  /**
   * Extend session TTL
   */
  static async extend(sessionId: string): Promise<boolean> {
    const key = cacheKeys.session(sessionId);
    const sessionData = await redisService.get<SessionData>(key);
    
    if (!sessionData) {
      return false;
    }
    
    sessionData.lastActivity = new Date().toISOString();
    await redisService.set(key, sessionData, this.SESSION_TTL);
    return true;
  }
}