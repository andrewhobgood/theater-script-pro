import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-muted rounded-md animate-pulse", className)} />
);

export const LoadingSkeleton = Skeleton; // Alias for backward compatibility

export const ScriptCardSkeleton: React.FC = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-32 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

export const ScriptListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ScriptCardSkeleton key={index} />
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    <Skeleton className="h-8 w-64" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);