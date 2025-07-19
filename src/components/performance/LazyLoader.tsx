import React, { Suspense, lazy } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface LazyLoaderProps {
  factory: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  factory, 
  fallback = <LoadingSkeleton className="h-64 w-full" />,
  children 
}) => {
  const LazyComponent = lazy(factory);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent>{children}</LazyComponent>
    </Suspense>
  );
};

// Pre-built lazy components for common use cases
export const LazyScriptCard = lazy(() => import('@/components/scripts/ScriptCard').then(module => ({ default: module.ScriptCard })));
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyScriptDetail = lazy(() => import('@/pages/ScriptDetail'));
export const LazyAnalytics = lazy(() => import('@/pages/Analytics'));

// Preload utilities
export const preloadComponent = (factory: () => Promise<any>) => {
  const componentImport = factory();
  return componentImport;
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  preloadComponent(() => import('@/pages/Dashboard'));
  preloadComponent(() => import('@/pages/Scripts'));
  preloadComponent(() => import('@/pages/Profile'));
};