
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { parseWithGemini } from '../utils/geminiApi';
import { ParsedTask } from '../types/task';

interface TaskInputProps {
  onTaskCreate: (task: ParsedTask) => void;
  useAI: boolean;
  onToggleAI: (useAI: boolean) => void;
  geminiApiKey?: string;
}

export function TaskInput({ onTaskCreate, useAI, onToggleAI, geminiApiKey }: TaskInputProps) {
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
      
      if (useAI && geminiApiKey) {
        try {
          parsedTask = await parseWithGemini(input, geminiApiKey);
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
    <div className="space-y-4">
      {/* AI Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch
            id="ai-toggle"
            checked={useAI}
            onCheckedChange={onToggleAI}
            className="data-[state=checked]:bg-primary-blue"
          />
          <Label htmlFor="ai-toggle" className="flex items-center space-x-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary-blue" />
            <span>Use AI Processing</span>
          </Label>
        </div>
        {useAI && !geminiApiKey && (
          <div className="text-xs text-warning-orange">
            Gemini API key required
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe your task naturally... 
Examples:
• Finish landing page Aman by 11pm 20th June
• Call client Rajeev tomorrow 5pm
• Review budget P1 Sarah by Friday 2pm"
          className="min-h-[120px] text-base bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm border-2 border-border-light dark:border-border-dark focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-200 resize-none"
          disabled={isLoading}
        />
        
        {/* Real-time Preview */}
        {preview && (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-lg p-3 border border-border-light dark:border-border-dark max-w-xs">
            <div className="text-xs text-muted-foreground mb-1">Preview:</div>
            <div className="space-y-1">
              <div className="text-sm font-medium truncate">{preview.name}</div>
              {preview.assignee && (
                <div className="text-xs text-muted-foreground">👤 {preview.assignee}</div>
              )}
              {preview.dueDate && (
                <div className="text-xs text-muted-foreground">
                  📅 {preview.dueDate.toLocaleDateString()}
                </div>
              )}
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                preview.priority === 'P1' ? 'bg-priority-p1/20 text-priority-p1' :
                preview.priority === 'P2' ? 'bg-priority-p2/20 text-priority-p2' :
                preview.priority === 'P3' ? 'bg-priority-p3/20 text-priority-p3' :
                'bg-priority-p4/20 text-priority-p4'
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
        className="w-full h-12 text-base font-medium bg-primary-blue hover:bg-secondary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {useAI ? 'Processing with AI...' : 'Creating Task...'}
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </>
        )}
      </Button>

      {/* Keyboard Hint */}
      <div className="text-center text-xs text-muted-foreground">
        Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd+Enter</kbd> to add task
      </div>
    </div>
  );
}
