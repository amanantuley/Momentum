'use client';

import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import {
  format,
  getDaysInMonth,
  startOfMonth,
  addDays,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Flag,
  Calendar,
} from 'lucide-react';
import type { Task } from '@/lib/types';
import { getIcon } from '@/lib/task-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type TaskGridProps = {
  tasks: Task[];
  currentDate: Date;
  onToggleCompletion: (taskId: string, date: string) => void;
  onSetTaskName: (taskId: string, newName: string) => void;
  onDeleteTask: (taskId: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const priorityMap = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
} as const;


const TaskGrid: FC<TaskGridProps> = ({
  tasks,
  currentDate,
  onToggleCompletion,
  onSetTaskName,
  onDeleteTask,
  onPrevMonth,
  onNextMonth,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  const monthStart = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    addDays(monthStart, i)
  );

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingValue(task.name);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingValue.trim()) {
      onSetTaskName(taskId, editingValue);
    }
    setEditingTaskId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
        onDeleteTask(taskToDelete);
        setTaskToDelete(null);
    }
  }

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex-1">
            <CardTitle>Daily Progress</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-headline text-lg font-medium w-32 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <TooltipProvider>
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sm:w-[250px] sticky left-0 bg-card z-10">Task</TableHead>
                  {days.map(day => (
                    <TableHead
                      key={day.toString()}
                      className={cn(
                        'h-12 w-12 text-center',
                        isToday(day) && 'text-primary font-bold'
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <span>{format(day, 'E')[0]}</span>
                        <span>{format(day, 'd')}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => {
                  const TaskIcon = getIcon(task.icon);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium sticky left-0 bg-card z-10">
                        <div className="flex items-center gap-2 group">
                          <TaskIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div className="flex-1 flex flex-col gap-1">
                            {editingTaskId === task.id ? (
                              <Input
                                ref={inputRef}
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={() => handleSaveEdit(task.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(task.id);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                className="h-8"
                              />
                            ) : (
                              <span className="truncate" onClick={() => handleEditClick(task)}>{task.name}</span>
                            )}
                            <div className="flex items-center gap-2">
                              <Badge variant={priorityMap[task.priority]}>{task.priority}</Badge>
                              {task.deadline && (
                                <Tooltip>
                                  <TooltipTrigger>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Calendar className="h-3 w-3" />
                                          {format(parseISO(task.deadline), 'MMM d')}
                                      </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>Deadline: {format(parseISO(task.deadline), 'MMMM d, yyyy')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => handleEditClick(task)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setTaskToDelete(task.id)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                      {days.map(day => {
                        const dateString = format(day, 'yyyy-MM-dd');
                        const isCompleted = task.completions[dateString];
                        return (
                          <TableCell key={dateString} className="text-center p-0">
                            <button
                              onClick={() => onToggleCompletion(task.id, dateString)}
                              className={cn(
                                'flex h-16 w-14 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                                isCompleted
                                  ? 'bg-accent/50 hover:bg-accent/70'
                                  : 'hover:bg-muted'
                              )}
                              aria-label={`Mark ${task.name} as ${isCompleted ? 'incomplete' : 'complete'} for ${format(day, 'MMMM do')}`}
                            >
                              {isCompleted && (
                                <Check className="h-6 w-6 text-accent-foreground animate-checkmark" />
                              )}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this
                    task and all of its completion data.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskGrid;
