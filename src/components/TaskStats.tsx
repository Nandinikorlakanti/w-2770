
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
      gradient: 'from-indigo-500 to-indigo-700',
      bgGradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40',
      shadowColor: 'shadow-indigo-500/30'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-700',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40',
      shadowColor: 'shadow-green-500/30'
    },
    {
      label: 'Due Today',
      value: stats.dueToday,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40',
      shadowColor: 'shadow-orange-500/30'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-700',
      bgGradient: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40',
      shadowColor: 'shadow-red-500/30'
    }
  ];

  return (
    <div className="glass-card-premium p-8 shadow-2xl animate-glow">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gradient-primary font-poppins">Task Overview</h2>
        <div className="text-right">
          <div className="text-4xl font-bold text-gradient-primary font-poppins">
            {completionRate}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Completion Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg animate-glow"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        {statItems.map((item, index) => (
          <div 
            key={item.label} 
            className={`text-center p-6 rounded-xl bg-gradient-to-br ${item.bgGradient} border border-white/50 dark:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-xl task-card-hover animate-fade-in-up ${item.shadowColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-r ${item.gradient} shadow-lg ${item.shadowColor} animate-pulse-soft`}>
              <item.icon className="h-7 w-7 text-white" />
            </div>
            <div className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100 font-poppins">{item.value}</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
