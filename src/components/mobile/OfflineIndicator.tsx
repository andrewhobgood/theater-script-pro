import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => setShowOfflineAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <>
      {/* Connection Status Badge */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Badge 
          variant={isOnline ? "default" : "destructive"} 
          className="flex items-center gap-1"
        >
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Offline Alert */}
      {showOfflineAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 md:hidden">
          <Alert variant="destructive" className="mobile-slide-up">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You're offline. Some features may not work.</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOfflineAlert(false)}
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}

interface OfflineContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function OfflineContent({ children, fallback }: OfflineContentProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function OfflineFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">You're offline</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Check your internet connection and try again. Some content may be available offline.
      </p>
      <Button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Retry Connection
      </Button>
    </div>
  );
}