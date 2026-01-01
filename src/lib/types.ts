import type { TaskIconName } from './task-icons';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  icon: TaskIconName; // Represents category for now
  priority: TaskPriority;
  deadline?: string; // YYYY-MM-DD
  notes?: string;
  completions: Record<string, boolean>;
}
