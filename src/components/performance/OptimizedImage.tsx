import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/loading-skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate WebP and fallback sources
  const getWebPSrc = (originalSrc: string) => {
    if (originalSrc.includes('placeholder.svg') || originalSrc.startsWith('data:')) {
      return originalSrc;
    }
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const shouldLoad = priority || isInView;

  return (
    <div className={cn("relative overflow-hidden", className)} ref={imgRef}>
      {!isLoaded && !isError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {shouldLoad && (
        <picture>
          <source srcSet={getWebPSrc(src)} type="image/webp" />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              isError && "hidden",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
      
      {isError && placeholder && (
        <div className="flex items-center justify-center bg-muted text-muted-foreground">
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
};

// Responsive image component
export const ResponsiveImage: React.FC<OptimizedImageProps & {
  sizes?: string;
  srcSet?: string;
}> = ({ sizes = "100vw", srcSet, ...props }) => {
  return (
    <OptimizedImage
      {...props}
      className={cn("w-full h-auto", props.className)}
    />
  );
};