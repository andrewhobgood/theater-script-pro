import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export function initSentry() {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.log('Sentry DSN not found, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development',
    integrations: [
      // Browser tracing integration
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
        // Capture interactions (clicks, scrolls, etc.)
        enableInp: true,
      }),
      // Replay integration for session recording
      new Sentry.Replay({
        // Mask all text content by default for privacy
        maskAllText: true,
        // Block all media elements
        blockAllMedia: true,
        // Sample rate for session replays
        sessionSampleRate: 0.1,
        // Sample rate for error replays
        errorSampleRate: 1.0,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION,
    // Capture unhandled promise rejections
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        // Remove auth tokens from headers
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers['x-api-key'];
        }
        // Remove sensitive data from URLs
        if (event.request.url) {
          event.request.url = event.request.url.replace(/token=[^&]+/, 'token=***');
          event.request.url = event.request.url.replace(/apiKey=[^&]+/, 'apiKey=***');
        }
      }
      
      // Don't send events in development unless explicitly enabled
      if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_SENTRY_ENABLE_IN_DEV) {
        return null;
      }
      
      return event;
    },
    // Additional options
    attachStacktrace: true,
    autoSessionTracking: true,
    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'Non-Error promise rejection captured',
      // Network errors that are expected
      'NetworkError',
      'Failed to fetch',
      // Common browser errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // React errors that are handled
      'ChunkLoadError',
      'Loading chunk',
      // Canceled requests
      'AbortError',
      'The operation was aborted',
    ],
    // Configure breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      // Don't log navigation to login pages (might contain tokens in URL)
      if (breadcrumb.category === 'navigation' && breadcrumb.data?.to?.includes('/auth')) {
        breadcrumb.data.to = '/auth/***';
      }
      return breadcrumb;
    },
  });

  console.log('Sentry initialized successfully');
}

// Export Sentry for use in other parts of the application
export { Sentry };