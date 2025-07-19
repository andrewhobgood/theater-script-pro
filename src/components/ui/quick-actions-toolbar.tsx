import { useState } from "react";
import { Plus, Search, Filter, Star, Download, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
}

interface QuickActionsToolbarProps {
  actions: QuickAction[];
  className?: string;
  maxVisible?: number;
}

export const QuickActionsToolbar = ({ 
  actions, 
  className, 
  maxVisible = 3 
}: QuickActionsToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleActions = actions.slice(0, maxVisible);
  const hiddenActions = actions.slice(maxVisible);

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm",
      className
    )}>
      {/* Visible Actions */}
      {visibleActions.map((action) => (
        <EnhancedButton
          key={action.id}
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled}
          icon={<action.icon className="h-4 w-4" />}
          className="hover:scale-105 transition-transform"
        >
          <span className="hidden sm:inline">{action.label}</span>
        </EnhancedButton>
      ))}

      {/* Overflow Menu */}
      {hiddenActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hiddenActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};