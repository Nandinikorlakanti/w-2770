
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onClearAll: () => void;
}

export function Header({ 
  onClearAll
}: HeaderProps) {
  const { toast } = useToast();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      onClearAll();
      toast({
        title: "Data Cleared",
        description: "All tasks have been cleared.",
      });
    }
  };

  return (
    <header className="header-gradient backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl animate-glow border border-white/20">
              <Settings className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-poppins text-white">
                Smart Task Manager
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Premium Edition
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            {/* Clear All */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm bg-white/10 button-premium micro-bounce"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
