import { useCallback } from 'react';
import { Sentry } from '@/config/sentry';

// Custom hook for Sentry error reporting in React components
export const useSentryError = () => {
  const reportError = useCallback((error: Error, context?: Record<string, any>) => {
    try {
      if (context) {
        // Add context to scope
        Sentry.withScope((scope) => {
          Object.entries(context).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
          Sentry.captureException(error);
        });
      } else {
        Sentry.captureException(error);
      }
    } catch (sentryError) {
      console.error('Failed to report error to Sentry:', sentryError);
      console.error('Original error:', error);
    }
  }, []);

  const reportMessage = useCallback((message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    try {
      Sentry.captureMessage(message, level);
    } catch (sentryError) {
      console.error('Failed to report message to Sentry:', sentryError);
    }
  }, []);

  return {
    reportError,
    reportMessage,
  };
};