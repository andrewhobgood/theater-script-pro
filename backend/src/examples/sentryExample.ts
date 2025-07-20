import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { captureException, captureMessage } from '../middleware/sentry';
import * as Sentry from '@sentry/node';

/**
 * Example routes demonstrating Sentry error tracking usage
 * This file can be safely deleted after understanding the implementation
 */

// Example 1: Capturing a handled error
export const exampleHandledError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate some operation that might fail
    const result = await riskyDatabaseOperation();
    res.json({ success: true, result });
  } catch (error) {
    // Capture the error with additional context
    captureException(error as Error, {
      endpoint: '/example/handled-error',
      userId: req.user?.id,
      requestData: {
        method: req.method,
        query: req.query,
        body: req.body,
      },
    });
    
    // Still return a proper response
    res.status(500).json({ 
      error: 'An error occurred during the operation',
      message: 'The error has been logged and will be investigated',
    });
  }
};

// Example 2: Using AppError (operational errors)
export const exampleOperationalError = (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.query;
  
  if (type === 'validation') {
    // This is an operational error - won't be sent to Sentry
    throw new AppError('Invalid input provided', 400, {
      field: 'type',
      value: type,
      allowedValues: ['user', 'admin', 'guest'],
    });
  }
  
  if (type === 'server') {
    // This will be sent to Sentry because status >= 500
    throw new AppError('Internal server error occurred', 500);
  }
  
  res.json({ message: 'No error triggered' });
};

// Example 3: Performance monitoring
export const examplePerformanceMonitoring = async (req: Request, res: Response) => {
  // Start a transaction
  const transaction = Sentry.startTransaction({
    op: 'api.example.performance',
    name: 'Example Performance Operation',
  });
  
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
  
  try {
    // Create spans for different operations
    const dbSpan = transaction.startChild({
      op: 'db.query',
      description: 'Fetch user data',
    });
    
    await simulateDatabaseQuery();
    dbSpan.finish();
    
    const processingSpan = transaction.startChild({
      op: 'processing',
      description: 'Process user data',
    });
    
    await simulateDataProcessing();
    processingSpan.finish();
    
    transaction.setStatus('ok');
    res.json({ message: 'Performance monitoring example completed' });
  } catch (error) {
    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
};

// Example 4: Adding user context
export const exampleUserContext = (req: Request, res: Response) => {
  // This would typically be done in authentication middleware
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      ip_address: req.ip,
    });
  }
  
  // Capture a message with user context
  captureMessage('User performed sensitive action', 'warning', {
    action: 'delete-account',
    timestamp: new Date().toISOString(),
  });
  
  res.json({ message: 'User context set' });
};

// Example 5: Custom breadcrumbs
export const exampleBreadcrumbs = async (req: Request, res: Response) => {
  // Add breadcrumb for incoming request
  Sentry.addBreadcrumb({
    category: 'api',
    message: 'Processing example request',
    level: 'info',
    data: {
      endpoint: req.path,
      method: req.method,
      query: req.query,
    },
  });
  
  try {
    // Simulate multiple steps with breadcrumbs
    Sentry.addBreadcrumb({
      category: 'database',
      message: 'Connecting to database',
      level: 'debug',
    });
    
    await simulateDatabaseQuery();
    
    Sentry.addBreadcrumb({
      category: 'cache',
      message: 'Cache miss, fetching from source',
      level: 'warning',
    });
    
    const result = await simulateDataProcessing();
    
    res.json({ success: true, result });
  } catch (error) {
    // The breadcrumbs will be included with the error report
    throw error;
  }
};

// Helper functions for examples
async function riskyDatabaseOperation() {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (Math.random() < 0.5) {
    throw new Error('Database connection failed');
  }
  return { data: 'Success' };
}

async function simulateDatabaseQuery() {
  await new Promise(resolve => setTimeout(resolve, 200));
}

async function simulateDataProcessing() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { processed: true, timestamp: new Date().toISOString() };
}