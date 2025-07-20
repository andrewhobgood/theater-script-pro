import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { csrfProtection, setCSRFToken, getCSRFToken } from './middleware/csrf';
import { logger } from './utils/logger';
import { sentryRequestHandler, sentryTracingHandler, sentryErrorHandler, sentryUserContext } from './middleware/sentry';

// Import routes
import authRoutes from './api/auth';
import scriptRoutes from './api/scripts';
import licenseRoutes from './api/licenses';
import paymentRoutes from './api/payments';
import userRoutes from './api/users';
import { adminRoutes } from './api/admin';

export const createApp = () => {
  const app = express();

  // Sentry middleware (must be first)
  app.use(sentryRequestHandler);
  app.use(sentryTracingHandler);

  // Basic middleware
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  
  // Add Sentry user context
  app.use(sentryUserContext);
  
  // CSRF protection
  app.use(setCSRFToken);
  app.use(csrfProtection);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  // API version endpoint
  app.get('/api/v1', (req, res) => {
    res.json({
      message: 'Theater Script Pro API v1',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/api/v1/auth',
        scripts: '/api/v1/scripts',
        licenses: '/api/v1/licenses',
        payments: '/api/v1/payments',
        users: '/api/v1/users',
        admin: '/api/v1/admin',
        csrf: '/api/v1/csrf-token',
      },
    });
  });

  // CSRF token endpoint
  app.get('/api/v1/csrf-token', getCSRFToken);

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/scripts', scriptRoutes);
  app.use('/api/v1/licenses', licenseRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // Error handling
  app.use(notFoundHandler);
  
  // Sentry error handler (must be before any other error middleware)
  app.use(sentryErrorHandler);
  
  app.use(errorHandler);

  return app;
};