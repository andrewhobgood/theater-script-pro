import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Type, Eye, Volume2, Contrast } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  largeButtons: boolean;
  screenReaderMode: boolean;
}

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    largeButtons: false,
    screenReaderMode: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Large buttons
    if (settings.largeButtons) {
      root.classList.add('large-buttons');
    } else {
      root.classList.remove('large-buttons');
    }
    
    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      reducedMotion: false,
      largeButtons: false,
      screenReaderMode: false
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 z-50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility Settings
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Font Size: {settings.fontSize}%
              </Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={75}
                max={150}
                step={25}
                className="w-full"
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                High Contrast
              </Label>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <Label>Reduce Motion</Label>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            {/* Large Buttons */}
            <div className="flex items-center justify-between">
              <Label>Large Buttons</Label>
              <Switch
                checked={settings.largeButtons}
                onCheckedChange={(checked) => updateSetting('largeButtons', checked)}
              />
            </div>

            {/* Screen Reader Mode */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Screen Reader Mode
              </Label>
              <Switch
                checked={settings.screenReaderMode}
                onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
              />
            </div>

            {/* Reset Button */}
            <Button 
              onClick={resetSettings}
              variant="outline"
              className="w-full"
            >
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};