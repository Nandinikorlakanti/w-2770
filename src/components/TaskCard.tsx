
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
      case 'P1': return 'bg-priority-p1/20 text-priority-p1 border-priority-p1/30';
      case 'P2': return 'bg-priority-p2/20 text-priority-p2 border-priority-p2/30';
      case 'P3': return 'bg-priority-p3/20 text-priority-p3 border-priority-p3/30';
      case 'P4': return 'bg-priority-p4/20 text-priority-p4 border-priority-p4/30';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
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
      group relative bg-white dark:bg-dark-card rounded-xl border border-border-light dark:border-border-dark
      shadow-sm hover:shadow-xl transition-all duration-200 ease-smooth
      hover:-translate-y-1 hover:border-primary-blue/20 
      ${task.completed ? 'opacity-60' : ''}
      ${dateStatus === 'overdue' ? 'ring-1 ring-error-red/20' : ''}
      ${dateStatus === 'today' ? 'ring-1 ring-warning-orange/20' : ''}
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={toggleComplete}
              className="data-[state=checked]:bg-success-green data-[state=checked]:border-success-green"
            />
            
            {isEditing ? (
              <Input
                value={editedTask.name}
                onChange={(e) => setEditedTask(prev => ({ ...prev, name: e.target.value }))}
                className="text-base font-medium"
                autoFocus
              />
            ) : (
              <h3 className={`text-base font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
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
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
              dateStatus === 'overdue' ? 'text-error-red' :
              dateStatus === 'today' ? 'text-warning-orange' :
              dateStatus === 'tomorrow' ? 'text-primary-blue' :
              'text-muted-foreground'
            }`}>
              <Clock className="h-4 w-4" />
              <span>Due: {formatDueDate(task.dueDate)}</span>
              {dateStatus === 'overdue' && !task.completed && (
                <span className="px-2 py-1 bg-error-red/20 text-error-red rounded-full text-xs font-medium">
                  Overdue
                </span>
              )}
              {dateStatus === 'today' && (
                <span className="px-2 py-1 bg-warning-orange/20 text-warning-orange rounded-full text-xs font-medium">
                  Due Today
                </span>
              )}
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created: {task.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-success-green hover:bg-success-green/90 text-white"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
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
                className="hover:bg-primary-blue/10 hover:border-primary-blue/20"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(task.id)}
                className="hover:bg-error-red/10 hover:border-error-red/20 hover:text-error-red"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          )}

          {!isEditing && task.completed && (
            <div className="flex items-center text-success-green text-sm font-medium">
              <Check className="h-4 w-4 mr-1" />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Subtle gradient overlay for completed tasks */}
      {task.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-success-green/5 to-transparent rounded-xl pointer-events-none" />
      )}
    </div>
  );
}
