import { useState } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href && !item.current ? (
            <Link 
              to={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              item.current && "text-foreground font-medium"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};