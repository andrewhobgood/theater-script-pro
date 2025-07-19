import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  size = "md"
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: "p-6",
    md: "p-12",
    lg: "p-16"
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Card className={cn("theater-card text-center", className)}>
      <CardContent className={cn(sizeClasses[size])}>
        <div className="space-y-4 max-w-md mx-auto">
          {icon && (
            <div className={cn("mx-auto text-muted-foreground", iconSizes[size])}>
              {icon}
            </div>
          )}
          <h3 className={cn("font-semibold", titleSizes[size])}>{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          {action && (
            <Button 
              variant={action.variant || "outline"}
              onClick={action.onClick}
              className="mt-4"
            >
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};