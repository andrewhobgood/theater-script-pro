import { useEffect } from 'react';

export const useAppLogger = () => {
  useEffect(() => {
    // Log app initialization
    console.log('🚀 APP INITIALIZED:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
      environment: import.meta.env.MODE
    });

    // Log all unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('🔥 UNHANDLED ERROR:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔥 UNHANDLED PROMISE REJECTION:', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString()
      });
    };

    // Log all React errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      console.log('🔥 CONSOLE ERROR INTERCEPTED:', {
        args,
        stack: new Error().stack,
        timestamp: new Date().toISOString()
      });
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    // Log performance metrics
    const logPerformance = () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        console.log('⚡ PERFORMANCE METRICS:', {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          pageLoad: timing.loadEventEnd - timing.navigationStart,
          firstPaint: window.performance.getEntriesByType('paint')?.[0]?.startTime,
          timestamp: new Date().toISOString()
        });
      }
    };

    if (document.readyState === 'complete') {
      logPerformance();
    } else {
      window.addEventListener('load', logPerformance);
    }
  }, []);
};