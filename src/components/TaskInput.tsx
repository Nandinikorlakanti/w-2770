
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles, Zap } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { parseWithGemini } from '../utils/geminiApi';
import { ParsedTask } from '../types/task';

interface TaskInputProps {
  onTaskCreate: (task: ParsedTask) => void;
  useAI: boolean;
  onToggleAI: (useAI: boolean) => void;
}

export function TaskInput({ onTaskCreate, useAI, onToggleAI }: TaskInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<ParsedTask | null>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Real-time preview with basic parsing
    if (value.trim()) {
      const parsed = parseNaturalLanguage(value);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      let parsedTask: ParsedTask;
      
      if (useAI) {
        try {
          const apiKey = import.meta.env.VITE_AI_API_KEY;
          if (!apiKey) {
            throw new Error('AI API key not found');
          }
          parsedTask = await parseWithGemini(input, apiKey);
        } catch (error) {
          console.error('AI parsing failed, falling back to basic parsing:', error);
          parsedTask = parseNaturalLanguage(input);
        }
      } else {
        parsedTask = parseNaturalLanguage(input);
      }
      
      onTaskCreate(parsedTask);
      setInput('');
      setPreview(null);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4 glass-card-premium p-6 rounded-2xl animate-float">
          <Switch
            id="ai-toggle"
            checked={useAI}
            onCheckedChange={onToggleAI}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-600"
          />
          <Label htmlFor="ai-toggle" className="flex items-center space-x-3 text-base font-semibold cursor-pointer">
            {useAI ? 
              <Zap className="h-5 w-5 text-purple-600 animate-pulse" /> : 
              <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
            }
            <span className="text-gradient-primary font-poppins">
              {useAI ? 'AI Processing' : 'Smart Processing'}
            </span>
          </Label>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative form-field-premium">
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe your task naturally... e.g., 'Review project proposal by Friday for John'"
          className="min-h-[140px] text-base form-input-premium resize-none font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl"
          disabled={isLoading}
        />
        
        {/* Real-time Preview */}
        {preview && (
          <div className="absolute top-4 right-4 glass-card-premium p-4 rounded-xl max-w-xs shadow-2xl animate-fade-in-up border border-indigo-200/50 dark:border-slate-600/50">
            <div className="text-xs text-cyan-600 dark:text-cyan-400 mb-3 font-semibold uppercase tracking-wide">Preview</div>
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{preview.name}</div>
              {preview.assignee && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="text-indigo-500">👤</span> 
                  <span className="font-medium">{preview.assignee}</span>
                </div>
              )}
              {preview.dueDate && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="text-purple-500">📅</span> 
                  <span className="font-medium">{preview.dueDate.toLocaleDateString()}</span>
                </div>
              )}
              <div className={`priority-badge ${
                preview.priority === 'P1' ? 'priority-badge-p1' :
                preview.priority === 'P2' ? 'priority-badge-p2' :
                preview.priority === 'P3' ? 'priority-badge-p3' :
                'priority-badge-p4'
              }`}>
                {preview.priority}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="w-full h-16 text-lg font-bold btn-gradient-primary disabled:opacity-50 disabled:cursor-not-allowed button-premium micro-bounce rounded-xl font-poppins"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            {useAI ? 'Processing with AI...' : 'Creating Task...'}
          </>
        ) : (
          <>
            <Plus className="mr-3 h-6 w-6" />
            Add Task
          </>
        )}
      </Button>

      {/* Keyboard Hint */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Press <kbd className="px-3 py-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-300 shadow-md border border-slate-300 dark:border-slate-500">Cmd+Enter</kbd> to add task
      </div>
    </div>
  );
}
