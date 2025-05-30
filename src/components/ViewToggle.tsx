
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface ViewToggleProps {
  isMobileView: boolean;
  onToggle: (isMobile: boolean) => void;
}

export function ViewToggle({ isMobileView, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 glass-card-premium rounded-2xl p-2 shadow-2xl border border-white/30 animate-float">
      <Button
        variant={!isMobileView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
          !isMobileView 
            ? 'btn-gradient-primary text-white shadow-lg shadow-indigo-500/30' 
            : 'text-slate-600 hover:bg-slate-100 micro-glow'
        } button-premium micro-bounce`}
      >
        <Monitor className="h-5 w-5" />
        <span className="hidden sm:inline font-medium">Desktop</span>
      </Button>
      <Button
        variant={isMobileView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
          isMobileView 
            ? 'btn-gradient-accent text-white shadow-lg shadow-cyan-500/30' 
            : 'text-slate-600 hover:bg-slate-100 micro-glow'
        } button-premium micro-bounce`}
      >
        <Smartphone className="h-5 w-5" />
        <span className="hidden sm:inline font-medium">Mobile</span>
      </Button>
    </div>
  );
}
