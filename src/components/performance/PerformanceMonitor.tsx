import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    if (!isDev) return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      
      setMetrics({
        lcp: 0, // Will be updated by Web Vitals
        fid: 0, // Will be updated by Web Vitals
        cls: 0, // Will be updated by Web Vitals
        fcp: Math.round(fcp),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart)
      });
    };

    // Get connection information
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Web Vitals measurement (simplified)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => prev ? { ...prev, lcp: Math.round(entry.startTime) } : null);
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          setMetrics(prev => prev ? { ...prev, cls: Number(((entry as any).value).toFixed(3)) } : null);
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

    return () => {
      window.removeEventListener('load', measurePerformance);
      observer.disconnect();
    };
  }, []);

  const getScoreColor = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, needs: 4000 },
      fid: { good: 100, needs: 300 },
      cls: { good: 0.1, needs: 0.25 },
      fcp: { good: 1800, needs: 3000 },
      ttfb: { good: 800, needs: 1800 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'secondary';

    if (value <= threshold.good) return 'default';
    if (value <= threshold.needs) return 'secondary';
    return 'destructive';
  };

  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
          aria-label="Toggle performance monitor"
        >
          <Activity className="h-4 w-4" />
        </button>
        
        <Badge variant="outline" className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          {connectionType}
        </Badge>
      </div>

      {isVisible && (
        <Card className="mt-2 w-64 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">LCP</span>
                <Badge variant={getScoreColor('lcp', metrics.lcp)} className="text-xs">
                  {metrics.lcp}ms
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">FCP</span>
                <Badge variant={getScoreColor('fcp', metrics.fcp)} className="text-xs">
                  {metrics.fcp}ms
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">TTFB</span>
                <Badge variant={getScoreColor('ttfb', metrics.ttfb)} className="text-xs">
                  {metrics.ttfb}ms
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">CLS</span>
                <Badge variant={getScoreColor('cls', metrics.cls)} className="text-xs">
                  {metrics.cls}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};