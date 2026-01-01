import type { TaskIconName } from './task-icons';

export interface Task {
  id: string;
  name: string;
  icon: TaskIconName;
  completions: Record<string, boolean>; // 'YYYY-MM-DD' -> boolean
}
