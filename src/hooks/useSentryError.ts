import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

interface ErrorContext {
  [key: string]: any;
}

interface UseSentryErrorReturn {
  captureError: (error: Error, context?: ErrorContext) => void;
  captureMessage: (message: string, level?: Sentry.SeverityLevel, context?: ErrorContext) => void;
  withErrorBoundary: <T extends (...args: any[]) => any>(
    fn: T,
    context?: ErrorContext
  ) => T;
}

export function useSentryError(): UseSentryErrorReturn {
  const captureError = useCallback((error: Error, context?: ErrorContext) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      Sentry.captureException(error);
    });
    
    // Also log to console in development
    if (import.meta.env.MODE === 'development') {
      console.error('Error captured:', error, context);
    }
  }, []);

  const captureMessage = useCallback(
    (message: string, level: Sentry.SeverityLevel = 'info', context?: ErrorContext) => {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('additional', context);
        }
        Sentry.captureMessage(message, level);
      });
      
      // Also log to console in development
      if (import.meta.env.MODE === 'development') {
        console.log(`[${level.toUpperCase()}] ${message}`, context);
      }
    },
    []
  );

  const withErrorBoundary = useCallback(
    <T extends (...args: any[]) => any>(fn: T, context?: ErrorContext): T => {
      return ((...args: Parameters<T>) => {
        try {
          return fn(...args);
        } catch (error) {
          captureError(error as Error, {
            ...context,
            functionName: fn.name,
            arguments: args,
          });
          throw error;
        }
      }) as T;
    },
    [captureError]
  );

  return {
    captureError,
    captureMessage,
    withErrorBoundary,
  };
}

// Hook for performance monitoring
export function useSentryPerformance() {
  const startTransaction = useCallback(
    (name: string, op: string = 'navigation') => {
      const transaction = Sentry.startTransaction({ name, op });
      Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
      
      return {
        finish: () => transaction.finish(),
        setData: (key: string, value: any) => transaction.setData(key, value),
        setStatus: (status: string) => transaction.setStatus(status),
      };
    },
    []
  );

  const measurePerformance = useCallback(
    async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
      const transaction = startTransaction(name, 'task');
      try {
        const result = await fn();
        transaction.setStatus('ok');
        return result;
      } catch (error) {
        transaction.setStatus('internal_error');
        throw error;
      } finally {
        transaction.finish();
      }
    },
    [startTransaction]
  );

  return {
    startTransaction,
    measurePerformance,
  };
}