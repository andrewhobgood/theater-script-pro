import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

// Sentry request handler - should be one of the first middleware
export const sentryRequestHandler = Sentry.Handlers.requestHandler();

// Sentry tracing handler - should be one of the first middleware
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();

// Sentry error handler - should be after all other middleware and before error handlers
export const sentryErrorHandler = Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all errors with status code 500 or higher
    if (error.status && error.status >= 500) {
      return true;
    }
    // Capture all errors without status code
    if (!error.status) {
      return true;
    }
    return false;
  },
});

// Custom middleware to add user context to Sentry
export const sentryUserContext = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    });
  } else {
    Sentry.setUser(null);
  }
  next();
};

// Middleware to create transaction for specific routes
export const sentryTransaction = (transactionName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: transactionName,
      data: {
        method: req.method,
        url: req.url,
      },
    });

    Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

    res.on('finish', () => {
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  };
};

// Helper to capture exceptions with additional context
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional', context);
    }
    Sentry.captureException(error);
  });
};

// Helper to capture messages with additional context
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional', context);
    }
    Sentry.captureMessage(message, level);
  });
};