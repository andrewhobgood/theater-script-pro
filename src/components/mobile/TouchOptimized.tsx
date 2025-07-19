import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Share, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TouchOptimizedCardProps {
  title: string;
  author: string;
  description: string;
  image?: string;
  rating: number;
  price: string;
  onLike?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function TouchOptimizedCard({ 
  title, 
  author, 
  description, 
  image, 
  rating, 
  price, 
  onLike, 
  onShare, 
  onDownload,
  className 
}: TouchOptimizedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 80;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setSwipeOffset(limitedDiff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap back or trigger action based on swipe distance
    if (Math.abs(swipeOffset) > 40) {
      if (swipeOffset > 0) {
        // Swipe right - like action
        setIsLiked(true);
        onLike?.();
      } else {
        // Swipe left - share action
        onShare?.();
      }
    }
    
    setSwipeOffset(0);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <Card 
      ref={cardRef}
      className={cn("touch-optimized-card overflow-hidden", className)}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        {image && (
          <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/20">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 right-3">{price}</Badge>
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">by {author}</p>
          </div>
          
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({rating})</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          {/* Touch-Optimized Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full touch-target",
                  isLiked && "text-red-500"
                )}
                onClick={handleLike}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full touch-target"
                onClick={onShare}
              >
                <Share className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full touch-target"
                onClick={onDownload}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
            
            <Button className="h-12 px-6 touch-target">
              View Script
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Swipe Indicators */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4">
          <div 
            className={cn(
              "w-12 h-12 rounded-full bg-red-500 flex items-center justify-center transition-opacity",
              swipeOffset > 20 ? "opacity-100" : "opacity-30"
            )}
          >
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div 
            className={cn(
              "w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center transition-opacity",
              swipeOffset < -20 ? "opacity-100" : "opacity-30"
            )}
          >
            <Share className="h-6 w-6 text-white" />
          </div>
        </div>
      )}
    </Card>
  );
}

interface SwipeableCarouselProps {
  children: React.ReactNode[];
  className?: string;
}

export function SwipeableCarousel({ children, className }: SwipeableCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < children.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < children.length - 1 ? currentIndex + 1 : children.length - 1);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div 
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={goToPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={goToNext}
        disabled={currentIndex === children.length - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors touch-target",
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}