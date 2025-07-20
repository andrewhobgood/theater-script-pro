import { Request, Response, NextFunction } from 'express';
import { getUserFromToken, getUserProfile } from '../services/supabase';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authorization token provided', 401);
    }
    
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      throw new AppError('Invalid or expired token', 401);
    }
    
    // Get user profile with role information
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      throw new AppError('User profile not found', 404);
    }
    
    // Attach user and profile to request
    req.user = user;
    req.profile = profile;
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new AppError('Authentication failed', 401));
    }
  }
}

// Middleware to check specific roles
export function requireRole(...allowedRoles: ('playwright' | 'theater_company' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.profile) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!allowedRoles.includes(req.profile.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    
    next();
  };
}

// Middleware for optional authentication (doesn't fail if no token)
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (user) {
      const profile = await getUserProfile(user.id);
      if (profile) {
        req.user = user;
        req.profile = profile;
      }
    }
    
    next();
  } catch (error) {
    // Log error but continue without authentication
    logger.error('Optional auth error:', error);
    next();
  }
}