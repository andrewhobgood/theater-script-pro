import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: number;
  focusVisible: boolean;
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 100,
    focusVisible: true
  });

  useEffect(() => {
    // Check user's system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Load saved preferences
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences({
        ...parsed,
        reducedMotion: parsed.reducedMotion ?? prefersReducedMotion,
        highContrast: parsed.highContrast ?? prefersHighContrast
      });
    } else {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }));
    }
  }, []);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('accessibility-preferences', JSON.stringify(newPreferences));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  const manageFocus = {
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);
      return () => container.removeEventListener('keydown', handleTabKey);
    },

    restoreFocus: (element: HTMLElement) => {
      element.focus();
    },

    focusFirstElement: (container: HTMLElement) => {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  };

  const checkColorContrast = (foreground: string, background: string): number => {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string) => {
      // This is a simplified implementation
      // Real implementation would parse RGB values and calculate relative luminance
      return 0.5; // Placeholder
    };

    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  return {
    preferences,
    updatePreference,
    announceToScreenReader,
    manageFocus,
    checkColorContrast
  };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = () => {
  const handleKeyDown = (e: KeyboardEvent, actions: Record<string, () => void>) => {
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const createKeyHandler = (actions: Record<string, () => void>) => {
    return (e: KeyboardEvent) => handleKeyDown(e, actions);
  };

  return { handleKeyDown, createKeyHandler };
};