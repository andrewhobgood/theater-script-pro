# Sentry Error Tracking Setup

This document provides instructions for configuring and using Sentry error tracking in Theater Script Pro.

## Overview

Sentry has been integrated into both the frontend and backend applications to provide:
- Real-time error tracking and alerting
- Performance monitoring
- Session replay (frontend only)
- Release tracking and source map support
- User context tracking
- Custom error handling

## Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### Backend (.env)
```env
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

### Sentry CLI Configuration

Update `.sentryclirc` files in both the root and backend directories with your Sentry organization details:

```ini
[defaults]
url=https://sentry.io/
org=your-org-name
project=your-project-name

[auth]
token=your-sentry-auth-token
```

## Features Implemented

### Frontend

1. **Error Boundary**: Automatically catches and reports unhandled errors
   - Location: `src/components/error/ErrorBoundary.tsx`
   - Wraps the entire application in `src/main.tsx`

2. **Performance Monitoring**: Tracks page load and navigation performance
   - React Router integration via `SentryRoutes`
   - Custom performance tracking hooks

3. **Session Replay**: Records user sessions when errors occur
   - Masks sensitive content by default
   - Only records on error (100% error replay rate)

4. **Custom Error Hook**: `useSentryError` for manual error tracking
   - Location: `src/hooks/useSentryError.ts`
   - Methods: `captureError`, `captureMessage`, `withErrorBoundary`

### Backend

1. **Express Middleware Integration**:
   - Request tracking: `sentryRequestHandler`
   - Error handling: `sentryErrorHandler`
   - User context: `sentryUserContext`

2. **Performance Monitoring**:
   - Automatic instrumentation of Node.js libraries
   - Custom transaction tracking
   - Database query spans

3. **Error Classification**:
   - Operational errors (4xx) are not sent to Sentry
   - System errors (5xx) are automatically captured
   - Unhandled rejections are captured with context

## Usage Examples

### Frontend Error Tracking

```typescript
import { useSentryError } from '@/hooks/useSentryError';

function MyComponent() {
  const { captureError, captureMessage } = useSentryError();

  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error as Error, {
        component: 'MyComponent',
        action: 'handleAction',
        userId: currentUser.id
      });
    }
  };

  // Log important events
  const logEvent = () => {
    captureMessage('Important event occurred', 'info', {
      timestamp: new Date().toISOString()
    });
  };
}
```

### Backend Error Tracking

```typescript
import { captureException } from '../middleware/sentry';

export const myController = async (req: Request, res: Response) => {
  try {
    const result = await someOperation();
    res.json(result);
  } catch (error) {
    captureException(error as Error, {
      endpoint: req.path,
      userId: req.user?.id,
      requestData: req.body
    });
    res.status(500).json({ error: 'Operation failed' });
  }
};
```

### Performance Monitoring

```typescript
// Frontend
const { measurePerformance } = useSentryPerformance();

await measurePerformance('data-processing', async () => {
  await processLargeDataset();
});

// Backend
const transaction = Sentry.startTransaction({
  op: 'api.endpoint',
  name: 'Process Payment'
});

const dbSpan = transaction.startChild({
  op: 'db.query',
  description: 'Fetch user payment methods'
});
// ... perform operation
dbSpan.finish();
transaction.finish();
```

## Source Maps

Source maps are generated for production builds and should be uploaded to Sentry:

```bash
# Build the applications
npm run build
cd backend && npm run build && cd ..

# Upload source maps
./scripts/upload-sourcemaps.sh
```

## Best Practices

1. **Sensitive Data**: Never log passwords, API keys, or personal information
2. **Error Context**: Always provide relevant context when capturing errors
3. **User Identification**: Set user context after authentication
4. **Performance**: Use sampling rates to control data volume
5. **Environments**: Use different DSNs for development/staging/production

## Monitoring Dashboard

Access your Sentry dashboard to:
- View real-time errors and their stack traces
- Monitor performance metrics
- Watch session replays
- Set up alerts and notifications
- Track error trends and patterns

## Troubleshooting

### Errors Not Appearing in Sentry

1. Check that `SENTRY_DSN` is set correctly
2. Verify the environment matches your Sentry project settings
3. Check browser console for Sentry initialization messages
4. Ensure errors are not filtered by `ignoreErrors` configuration

### Source Maps Not Working

1. Ensure source maps are generated during build
2. Verify the release version matches between app and Sentry
3. Check that source maps are uploaded before deployment
4. Confirm URL prefixes match your deployment

### Performance Issues

1. Reduce `tracesSampleRate` if too much data is being sent
2. Disable session replay in high-traffic scenarios
3. Use `beforeSend` to filter unnecessary events

## Security Considerations

1. **Data Scrubbing**: Sensitive data is automatically filtered
2. **PII Handling**: User emails and IDs are only sent when explicitly set
3. **Error Details**: Stack traces are only shown in development
4. **Rate Limiting**: Sentry has built-in rate limiting to prevent abuse

## Maintenance

- Regularly review error trends and fix recurring issues
- Update Sentry SDK versions with npm updates
- Adjust sampling rates based on usage and quotas
- Archive old releases to manage storage