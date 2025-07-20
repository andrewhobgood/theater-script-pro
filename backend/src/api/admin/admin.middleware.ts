import { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { supabaseAdmin } from '../../services/supabase';

// Composite middleware that combines authentication and admin role check
export const requireAdmin = [
  authenticate,
  requireRole('admin')
];

// Enhanced admin authentication with additional security checks
export async function enhancedAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // First run basic authentication
    await authenticate(req, res, (error) => {
      if (error) return next(error);
    });

    // Check if user has admin role
    if (!req.profile || req.profile.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }

    // Check if admin account is active and not suspended
    if (req.profile.is_suspended) {
      throw new AppError('Admin account is suspended', 403);
    }

    // Optional: Check for admin-specific permissions or IP restrictions
    // This could be expanded based on security requirements

    // Log admin access
    logAdminAccess(req.user!.id, req.path, req.method);

    next();
  } catch (error) {
    next(error);
  }
}

// Middleware to check specific admin permissions
export function requireAdminPermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.profile || req.profile.role !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      // Check specific permission in admin_permissions table
      const { data: adminPermission, error } = await supabaseAdmin
        .from('admin_permissions')
        .select('*')
        .eq('admin_id', req.user!.id)
        .eq('permission', permission)
        .single();

      if (error || !adminPermission) {
        throw new AppError(`Permission '${permission}' required`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Rate limiting for sensitive admin operations
export function adminRateLimit(maxRequests: number = 10, windowMinutes: number = 15) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const key = `${req.user.id}:${req.path}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const requestData = requests.get(key);

    if (!requestData || now > requestData.resetTime) {
      requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (requestData.count >= maxRequests) {
      const retryAfter = Math.ceil((requestData.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return next(new AppError('Too many requests', 429));
    }

    requestData.count++;
    next();
  };
}

// Log admin access for audit trail
async function logAdminAccess(adminId: string, path: string, method: string) {
  try {
    await supabaseAdmin
      .from('admin_access_logs')
      .insert({
        admin_id: adminId,
        path,
        method,
        accessed_at: new Date().toISOString()
      });
  } catch (error) {
    // Log error but don't block the request
    logger.error('Error logging admin access:', error);
  }
}