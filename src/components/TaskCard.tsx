
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Edit, Trash2, User, Clock, Check, X } from 'lucide-react';
import { Task } from '../types/task';
import { formatDueDate, isOverdue, isDueToday, isDueTomorrow } from '../utils/taskParser';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    name: task.name,
    assignee: task.assignee || '',
    priority: task.priority
  });

  const handleSave = () => {
    onUpdate(task.id, {
      name: editedTask.name,
      assignee: editedTask.assignee || undefined,
      priority: editedTask.priority,
      updatedAt: new Date()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({
      name: task.name,
      assignee: task.assignee || '',
      priority: task.priority
    });
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(task.id, {
      completed: !task.completed,
      updatedAt: new Date()
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'P2': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
      case 'P3': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'P4': return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (isOverdue(task.dueDate) && !task.completed) {
      return 'overdue';
    } else if (isDueToday(task.dueDate)) {
      return 'today';
    } else if (isDueTomorrow(task.dueDate)) {
      return 'tomorrow';
    }
    return 'normal';
  };

  const dateStatus = getDateStatus();

  return (
    <div className={`
      group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
      shadow-sm hover:shadow-xl transition-all duration-200 ease-smooth
      hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-600
      ${task.completed ? 'opacity-60' : ''}
      ${dateStatus === 'overdue' ? 'ring-1 ring-red-400/30' : ''}
      ${dateStatus === 'today' ? 'ring-1 ring-orange-400/30' : ''}
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={toggleComplete}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            
            {isEditing ? (
              <Input
                value={editedTask.name}
                onChange={(e) => setEditedTask(prev => ({ ...prev, name: e.target.value }))}
                className="text-base font-medium text-slate-900 dark:text-slate-100"
                autoFocus
              />
            ) : (
              <h3 className={`text-base font-medium ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {task.name}
              </h3>
            )}
          </div>
          
          {/* Priority Badge */}
          {isEditing ? (
            <Select 
              value={editedTask.priority} 
              onValueChange={(value: 'P1' | 'P2' | 'P3' | 'P4') => 
                setEditedTask(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
                <SelectItem value="P3">P3</SelectItem>
                <SelectItem value="P4">P4</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Assignee */}
          {(task.assignee || isEditing) && (
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
              <User className="h-4 w-4" />
              {isEditing ? (
                <Input
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Assignee name"
                  className="text-sm"
                />
              ) : (
                <span>Assigned to: {task.assignee}</span>
              )}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-2 text-sm ${
              dateStatus === 'overdue' ? 'text-red-600 dark:text-red-400' :
              dateStatus === 'today' ? 'text-orange-600 dark:text-orange-400' :
              dateStatus === 'tomorrow' ? 'text-blue-600 dark:text-blue-400' :
              'text-slate-600 dark:text-slate-300'
            }`}>
              <Clock className="h-4 w-4" />
              <span>Due: {formatDueDate(task.dueDate)}</span>
              {dateStatus === 'overdue' && !task.completed && (
                <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-medium">
                  Overdue
                </span>
              )}
              {dateStatus === 'today' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-medium">
                  Due Today
                </span>
              )}
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>Created: {task.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="text-slate-700 dark:text-slate-300"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 dark:hover:text-blue-300"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(task.id)}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:border-red-600 dark:hover:text-red-300"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          )}

          {!isEditing && task.completed && (
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <Check className="h-4 w-4 mr-1" />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Subtle gradient overlay for completed tasks */}
      {task.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl pointer-events-none" />
      )}
    </div>
  );
}
