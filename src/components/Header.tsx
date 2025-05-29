
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  geminiApiKey: string;
  onApiKeyChange: (key: string) => void;
  onExport: () => void;
  onImport: (data: string) => void;
  onClearAll: () => void;
}

export function Header({ 
  isDark, 
  onToggleTheme, 
  geminiApiKey, 
  onApiKeyChange,
  onExport,
  onImport,
  onClearAll
}: HeaderProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        onImport(data);
        toast({
          title: "Import Successful",
          description: "Tasks have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import tasks. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks and settings? This action cannot be undone.')) {
      onClearAll();
      toast({
        title: "Data Cleared",
        description: "All tasks and settings have been cleared.",
      });
    }
  };

  return (
    <header className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-border-light dark:border-border-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-secondary-blue rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">
              Natural Language Task Manager
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Gemini API Key Input */}
            <div className="hidden md:flex items-center space-x-2">
              <Label htmlFor="api-key" className="text-sm font-medium whitespace-nowrap">
                Gemini API Key:
              </Label>
              <Input
                id="api-key"
                type="password"
                value={geminiApiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-64 text-sm"
              />
            </div>

            {/* Import/Export */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="hidden sm:flex"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="hidden sm:flex"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="hidden sm:flex text-error-red hover:bg-error-red/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDark}
                onCheckedChange={onToggleTheme}
                className="data-[state=checked]:bg-primary-blue"
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Mobile API Key Input */}
        <div className="md:hidden pb-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="api-key-mobile" className="text-sm font-medium">
              Gemini API Key:
            </Label>
            <Input
              id="api-key-mobile"
              type="password"
              value={geminiApiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="flex-1 text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
