import * as Sentry from "@sentry/react";

// Simplified Sentry configuration
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.log('Sentry DSN not found, skipping Sentry initialization');
    return;
  }

  console.log('Initializing Sentry...');

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      debug: import.meta.env.DEV,
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      beforeSend(event) {
        // Filter out errors we don't want to track
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Non-Error promise rejection')) {
            return null;
          }
        }
        return event;
      },
    });

    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

// Re-export Sentry for use in other parts of the app
export { Sentry };