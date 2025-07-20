import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSentryError } from '@/hooks/useSentryError';
import { Sentry } from '@/config/sentry';

/**
 * Example component demonstrating Sentry error tracking usage
 * This file can be safely deleted after understanding the implementation
 */
export function SentryExample() {
  const { reportError, reportMessage } = useSentryError();

  // Example 1: Capturing a handled error
  const handleError = () => {
    try {
      throw new Error('This is a test error');
    } catch (error) {
      reportError(error as Error, {
        component: 'SentryExample',
        action: 'handleError',
        additionalInfo: 'This is a demonstration of error capturing',
      });
    }
  };

  // Example 2: Capturing a message
  const handleMessage = () => {
    reportMessage('User performed an important action', 'info');
  };

  // Example 3: Risky function
  const riskyFunction = () => {
    const random = Math.random();
    if (random < 0.5) {
      throw new Error('Random error occurred!');
    }
    return 'Success!';
  };

  // Example 5: User context
  const setUserContext = () => {
    Sentry.setUser({
      id: '12345',
      email: 'user@example.com',
      username: 'testuser',
    });
    reportMessage('User context set', 'info');
  };

  // Example 6: Custom breadcrumb
  const addBreadcrumb = () => {
    Sentry.addBreadcrumb({
      message: 'User clicked custom breadcrumb button',
      category: 'user-action',
      level: 'info',
      data: {
        buttonId: 'breadcrumb-button',
        timestamp: new Date().toISOString(),
      },
    });
    reportMessage('Breadcrumb added', 'info');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sentry Error Tracking Examples</CardTitle>
        <CardDescription>
          Examples of how to use Sentry error tracking in the application.
          These are for demonstration purposes only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleError} variant="destructive">
            Capture Handled Error
          </Button>
          
          <Button onClick={handleMessage} variant="secondary">
            Capture Info Message
          </Button>
          
          <Button 
            onClick={() => {
              try {
                const result = riskyFunction();
                alert(result);
              } catch (error) {
                alert('Error was captured and sent to Sentry');
              }
            }}
            variant="outline"
          >
            Test Risky Function (50% chance of error)
          </Button>
          
          <Button onClick={() => alert('Performance monitoring removed')} variant="outline">
            Test Performance Monitoring
          </Button>
          
          <Button onClick={setUserContext} variant="outline">
            Set User Context
          </Button>
          
          <Button onClick={addBreadcrumb} variant="outline">
            Add Custom Breadcrumb
          </Button>
          
          <Button 
            onClick={() => {
              throw new Error('Unhandled error - will be caught by ErrorBoundary');
            }}
            variant="destructive"
          >
            Throw Unhandled Error
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Note: In production, errors are automatically sent to Sentry.</p>
          <p>Check the browser console for additional logging in development mode.</p>
        </div>
      </CardContent>
    </Card>
  );
}