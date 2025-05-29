
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { TaskStats as TaskStatsType } from '../types/task';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Calendar,
      color: 'text-primary-blue bg-primary-blue/10'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-success-green bg-success-green/10'
    },
    {
      label: 'Due Today',
      value: stats.dueToday,
      icon: Clock,
      color: 'text-warning-orange bg-warning-orange/10'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-error-red bg-error-red/10'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Task Overview</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-blue">{completionRate}%</div>
          <div className="text-sm text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-blue to-success-green h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold mb-1">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
