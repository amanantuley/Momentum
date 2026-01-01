'use client';

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { taskIcons, type TaskIconName } from '@/lib/task-icons';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Task name must be at least 2 characters.',
  }),
  icon: z.custom<TaskIconName>(val =>
    Object.keys(taskIcons).includes(val as string)
  ),
});

type TaskInputDialogProps = {
  children: ReactNode;
  onAddTask: (name: string, icon: Task['icon']) => void;
};

export function TaskInputDialog({ children, onAddTask }: TaskInputDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: 'work',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTask(values.name, values.icon);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            What new habit do you want to track?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Read for 15 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      {Object.entries(taskIcons).map(([key, { icon: Icon, label }]) => (
                        <FormItem key={key} className="flex-1">
                          <FormControl>
                             <RadioGroupItem value={key} className="sr-only" />
                          </FormControl>
                          <Label
                            className={cn(
                              'flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                              field.value === key && 'border-primary'
                            )}
                          >
                             <Icon className="mb-2 h-6 w-6" />
                             {label}
                          </Label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
