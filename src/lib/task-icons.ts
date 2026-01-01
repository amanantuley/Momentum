import { Book, Dumbbell, Briefcase, BrainCircuit, type LucideIcon } from 'lucide-react';

export const taskIcons = {
  study: { icon: Book, label: 'Study' },
  workout: { icon: Dumbbell, label: 'Workout' },
  work: { icon: Briefcase, label: 'Work' },
  think: { icon: BrainCircuit, label: 'Think' },
} as const;

export type TaskIconName = keyof typeof taskIcons;

export const getIcon = (name: TaskIconName): LucideIcon => {
  return taskIcons[name].icon;
};
