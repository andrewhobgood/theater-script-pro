import { useState } from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  loading?: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertTriangle className="h-8 w-8 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      default:
        return <Info className="h-8 w-8 text-primary" />;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "warning":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="w-full max-w-md mx-4 animate-scale-in">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {getIcon()}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
            
            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <EnhancedButton
                variant={getConfirmVariant()}
                onClick={onConfirm}
                loading={loading}
                disabled={loading}
              >
                {confirmText}
              </EnhancedButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};