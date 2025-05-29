
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { TaskInput } from '../components/TaskInput';
import { TaskCard } from '../components/TaskCard';
import { TaskStats } from '../components/TaskStats';
import { Task, TaskStats as TaskStatsType, ParsedTask } from '../types/task';
import { saveTasks, loadTasks, saveSettings, loadSettings, exportTasks, importTasks, clearAllData } from '../utils/storage';
import { isOverdue, isDueToday, isDueTomorrow } from '../utils/taskParser';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SortAsc } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'name'>('created');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [isDark, setIsDark] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const savedTasks = loadTasks();
    const savedSettings = loadSettings();
    
    setTasks(savedTasks);
    setUseAI(savedSettings.useAI);
    setGeminiApiKey(savedSettings.geminiApiKey || '');
    
    // Set theme
    if (savedSettings.theme === 'dark' || (savedSettings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings({
      useAI,
      theme: 'system',
      geminiApiKey: geminiApiKey || undefined
    });
  }, [useAI, geminiApiKey]);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const createTask = (parsedTask: ParsedTask) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...parsedTask,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    toast({
      title: "Task Created",
      description: `"${parsedTask.name}" has been added to your tasks.`,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Task Deleted",
        description: `"${task.name}" has been removed.`,
      });
    }
  };

  const handleExport = () => {
    const data = exportTasks(tasks);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Tasks have been exported successfully.",
    });
  };

  const handleImport = (data: string) => {
    const importedTasks = importTasks(data);
    setTasks(prev => [...importedTasks, ...prev]);
  };

  const handleClearAll = () => {
    setTasks([]);
    setGeminiApiKey('');
    setUseAI(false);
    clearAllData();
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => task.dueDate && isOverdue(task.dueDate) && !task.completed);
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        
        case 'priority':
          const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        
        case 'name':
          return a.name.localeCompare(b.name);
        
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [tasks, searchQuery, filterBy, sortBy]);

  // Calculate stats
  const stats: TaskStatsType = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(task => task.dueDate && isOverdue(task.dueDate) && !task.completed).length;
    const dueToday = tasks.filter(task => task.dueDate && isDueToday(task.dueDate) && !task.completed).length;
    const dueTomorrow = tasks.filter(task => task.dueDate && isDueTomorrow(task.dueDate) && !task.completed).length;

    return { total, completed, overdue, dueToday, dueTomorrow };
  }, [tasks]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-dark-bg text-text-primary-dark' : 'bg-light-bg text-text-primary-light'
    }`}>
      <Header
        isDark={isDark}
        onToggleTheme={handleThemeToggle}
        geminiApiKey={geminiApiKey}
        onApiKeyChange={setGeminiApiKey}
        onExport={handleExport}
        onImport={handleImport}
        onClearAll={handleClearAll}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Task Input */}
            <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
              <TaskInput
                onTaskCreate={createTask}
                useAI={useAI}
                onToggleAI={setUseAI}
                geminiApiKey={geminiApiKey}
              />
            </div>

            {/* Stats */}
            <TaskStats stats={stats} />
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Search */}
            <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, assignees, or priorities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Created Date</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <div key={task.id} className="animate-fade-in">
                    <TaskCard
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl border border-border-light dark:border-border-dark">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterBy !== 'all' 
                      ? "Try adjusting your search or filters"
                      : "Create your first task to get started!"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
