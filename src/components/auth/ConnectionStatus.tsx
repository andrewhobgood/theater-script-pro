
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getApiUrl } from '@/config/api';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus = ({ className }: ConnectionStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(getApiUrl('/health'), {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          setStatus('connected');
          setError(null);
        } else {
          setStatus('disconnected');
          setError(`Server returned ${response.status}`);
        }
      } catch (error: any) {
        setStatus('disconnected');
        if (error.name === 'AbortError') {
          setError('Connection timeout');
        } else if (error instanceof TypeError) {
          setError('Server unavailable');
        } else {
          setError(error.message);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <Alert className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking server connection...</AlertDescription>
      </Alert>
    );
  }

  if (status === 'connected') {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Connected to server
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Unable to connect to server: {error}
      </AlertDescription>
    </Alert>
  );
};
