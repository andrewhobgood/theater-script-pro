import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Heart, GitCompare, Upload, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsToolbarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export const QuickActionsToolbar: React.FC<QuickActionsToolbarProps> = ({
  className,
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: <Search className="h-5 w-5" />, label: 'Search', color: 'bg-blue-500' },
    { icon: <Upload className="h-5 w-5" />, label: 'Upload', color: 'bg-green-500' },
    { icon: <GitCompare className="h-5 w-5" />, label: 'Compare', color: 'bg-purple-500' },
    { icon: <Heart className="h-5 w-5" />, label: 'Wishlist', color: 'bg-red-500' },
  ];

  return (
    <div className={cn(
      "fixed z-50 flex flex-col-reverse gap-3",
      position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
      className
    )}>
      <div className={cn(
        "flex flex-col-reverse gap-3 transition-all duration-300",
        isExpanded ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        {actions.map((action, index) => (
          <Button
            key={index}
            size="lg"
            className={cn(
              "h-12 w-12 rounded-full shadow-lg text-white border-0 hover:scale-110 transition-transform",
              action.color
            )}
          >
            {action.icon}
          </Button>
        ))}
      </div>

      <Button
        size="lg"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg bg-primary text-white border-0 hover:scale-110 transition-all",
          isExpanded && "rotate-45"
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};