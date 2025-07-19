import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'button';
  lines?: number;
}

export const LoadingSkeleton = ({ 
  className, 
  variant = 'text',
  lines = 1 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted rounded";

  if (variant === 'card') {
    return (
      <div className={cn("theater-card p-6 space-y-4", className)}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-20 bg-muted rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 flex-1 bg-muted rounded animate-pulse" />
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn("rounded-full", baseClasses, className)} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn("h-10 w-24", baseClasses, className)} />
    );
  }

  // Text variant (default)
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4", 
            baseClasses,
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  );
};