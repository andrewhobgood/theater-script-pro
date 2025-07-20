import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Skip CSRF for these paths
const CSRF_SKIP_PATHS = [
  '/health',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/payments/webhook', // Stripe webhook needs to skip CSRF
  '/api/v1', // API info endpoint
];

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

// CSRF protection middleware
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for certain paths
  if (CSRF_SKIP_PATHS.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Skip CSRF for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // Get token from cookie
  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  
  // Get token from header
  const headerToken = req.get(CSRF_HEADER_NAME);

  // Verify tokens match
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    logger.warn('CSRF token validation failed', {
      path: req.path,
      method: req.method,
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
      match: cookieToken === headerToken,
    });
    
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Your request could not be validated. Please refresh and try again.',
    });
  }

  next();
}

// Middleware to set CSRF token in cookie
export function setCSRFToken(req: Request, res: Response, next: NextFunction) {
  // Check if token already exists
  if (!req.cookies[CSRF_COOKIE_NAME]) {
    const token = generateCSRFToken();
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // Must be accessible by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  
  next();
}

// Endpoint to get CSRF token
export function getCSRFToken(req: Request, res: Response) {
  const token = req.cookies[CSRF_COOKIE_NAME] || generateCSRFToken();
  
  if (!req.cookies[CSRF_COOKIE_NAME]) {
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  
  res.json({ token });
}