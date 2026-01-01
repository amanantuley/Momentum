'use client';

import { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { Plus } from 'lucide-react';
import type { Task, TaskPriority } from '@/lib/types';
import Header from '@/components/layout/header';
import TaskGrid from '@/components/tasks/task-grid';
import ProgressSummary from '@/components/tasks/progress-summary';
import { TaskInputDialog } from '@/components/tasks/task-input-dialog';
import { Button } from '@/components/ui/button';
import { type TaskIconName } from '@/lib/task-icons';

const initialTasks: Task[] = [
  { id: '1', name: 'Morning Meditation', icon: 'think', priority: 'medium', completions: { '2024-07-01': true, '2024-07-03': true } },
  { id: '2', name: 'Workout Session', icon: 'workout', priority: 'high', completions: { '2024-07-02': true } },
  { id: '3', name: 'Read 10 pages', icon: 'study', priority: 'low', completions: { '2024-07-01': true, '2024-07-02': true, '2024-07-04': true } },
  { id: '4', name: 'Deep Work Block', icon: 'work', priority: 'high', completions: {} },
];

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddTask = (
    name: string,
    icon: TaskIconName,
    priority: TaskPriority,
    deadline?: string,
    notes?: string
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      icon,
      priority,
      deadline,
      notes,
      completions: {},
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleToggleCompletion = (taskId: string, date: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCompletions = { ...task.completions };
          if (newCompletions[date]) {
            delete newCompletions[date];
          } else {
            newCompletions[date] = true;
          }
          return { ...task, completions: newCompletions };
        }
        return task;
      })
    );
  };
  
  const handleSetTaskName = (taskId: string, newName: string) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? {...task, name: newName} : task));
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handlePrevMonth = () => setCurrentDate(current => subMonths(current, 1));
  const handleNextMonth = () => setCurrentDate(current => addMonths(current, 1));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TaskInputDialog onAddTask={handleAddTask}>
        <Header addTaskTrigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        } />
      </TaskInputDialog>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <TaskGrid
            tasks={tasks}
            currentDate={currentDate}
            onToggleCompletion={handleToggleCompletion}
            onSetTaskName={handleSetTaskName}
            onDeleteTask={handleDeleteTask}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <ProgressSummary tasks={tasks} currentDate={currentDate} />
        </div>
      </main>
    </div>
  );
}
