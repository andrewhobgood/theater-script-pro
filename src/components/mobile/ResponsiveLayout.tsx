import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'split' | 'sidebar';
}

export function ResponsiveLayout({ 
  children, 
  className, 
  variant = 'default' 
}: ResponsiveLayoutProps) {
  const layoutClasses = {
    default: "container mx-auto px-4 py-6 md:py-8",
    centered: "container mx-auto px-4 py-6 md:py-8 max-w-4xl",
    split: "container mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8",
    sidebar: "container mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
  };

  return (
    <div className={cn(layoutClasses[variant], className)}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className 
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8'
  };

  const gridCols = [
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={cn('grid', gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export function ResponsiveStack({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  className
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    responsive: 'flex flex-col md:flex-row'
  };

  const spacingClasses = {
    sm: direction === 'horizontal' || direction === 'responsive' 
      ? 'space-x-2 md:space-x-2' 
      : 'space-y-2',
    md: direction === 'horizontal' || direction === 'responsive'
      ? 'space-x-4 md:space-x-4'
      : 'space-y-4',
    lg: direction === 'horizontal' || direction === 'responsive'
      ? 'space-x-6 md:space-x-6'
      : 'space-y-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  return (
    <div className={cn(
      directionClasses[direction],
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
}

interface MobileHiddenProps {
  children: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MobileHidden({ children, breakpoint = 'md' }: MobileHiddenProps) {
  const breakpointClasses = {
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block'
  };

  return (
    <div className={breakpointClasses[breakpoint]}>
      {children}
    </div>
  );
}

interface MobileOnlyProps {
  children: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MobileOnly({ children, breakpoint = 'md' }: MobileOnlyProps) {
  const breakpointClasses = {
    sm: 'block sm:hidden',
    md: 'block md:hidden',
    lg: 'block lg:hidden',
    xl: 'block xl:hidden'
  };

  return (
    <div className={breakpointClasses[breakpoint]}>
      {children}
    </div>
  );
}