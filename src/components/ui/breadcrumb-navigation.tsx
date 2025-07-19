import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items = [],
  className,
  showHome = true,
}) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({ label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> });
    }
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      const label = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
              
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className={cn(
                  "flex items-center gap-1",
                  isLast ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};