import React, { useRef, useState, useCallback } from 'react';

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  threshold?: number;
}

export function GestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onTap,
  onDoubleTap,
  onLongPress,
  className = '',
  threshold = 50
}: GestureHandlerProps) {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const [isLongPress, setIsLongPress] = useState(false);
  const initialDistance = useRef(0);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    touchEnd.current = { x: touch.clientX, y: touch.clientY };
    setIsLongPress(false);

    // Handle pinch
    if (e.touches.length === 2) {
      initialDistance.current = getTouchDistance(e.touches);
    }

    // Handle long press
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true);
        onLongPress();
      }, 500);
    }
  }, [onLongPress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };

    // Handle pinch
    if (e.touches.length === 2 && onPinch) {
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialDistance.current;
      onPinch(scale);
    }

    // Clear long press if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, [onPinch]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Don't process swipes if it was a long press
    if (isLongPress) {
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check for swipe gestures
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
      return;
    }

    // Handle tap gestures
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap
      if (onDoubleTap) {
        onDoubleTap();
      }
    } else {
      // Single tap
      setTimeout(() => {
        const timeSinceTouch = Date.now() - now;
        if (timeSinceTouch >= 300 && onTap) {
          onTap();
        }
      }, 300);
    }

    lastTap.current = now;
  }, [threshold, isLongPress, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap]);

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
}

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pull to refresh at the top of the scroll
    const scrollTop = e.currentTarget.scrollTop;
    setCanPull(scrollTop === 0);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canPull || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      setPullDistance(Math.min(diff, threshold * 1.5));
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setCanPull(false);
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance > 0 ? pullDistance : 0}px)`,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center h-16 w-16"
          style={{ top: `-${64 - pullDistance}px` }}
        >
          <div 
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
            style={{
              opacity: isRefreshing ? 1 : refreshProgress,
              transform: `rotate(${isRefreshing ? 0 : refreshProgress * 360}deg)`
            }}
          />
        </div>
      )}
      
      {children}
    </div>
  );
}