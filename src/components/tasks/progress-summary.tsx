'use client';

import type { FC } from 'react';
import {
  getDaysInMonth,
  getDaysInYear,
  isSameMonth,
  isSameYear,
  parseISO,
} from 'date-fns';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProgressSummaryProps = {
  tasks: Task[];
  currentDate: Date;
};

const chartConfig = {
  completion: {
    label: 'Completion',
  },
} satisfies ChartConfig;

const ProgressSummary: FC<ProgressSummaryProps> = ({ tasks, currentDate }) => {
  const calculateCompletionData = (
    tasks: Task[],
    date: Date,
    period: 'month' | 'year'
  ) => {
    const totalDays =
      period === 'month' ? getDaysInMonth(date) : getDaysInYear(date);
    const isSamePeriod = period === 'month' ? isSameMonth : isSameYear;

    let totalCompletions = 0;
    const taskData = tasks.map(task => {
      const completionsInPeriod = Object.keys(task.completions).filter(
        dateString => isSamePeriod(parseISO(dateString), date)
      ).length;
      totalCompletions += completionsInPeriod;
      return {
        name: task.name,
        completion: Math.round((completionsInPeriod / totalDays) * 100),
      };
    });

    const overallCompletion = tasks.length > 0 ? Math.round((totalCompletions / (totalDays * tasks.length)) * 100) : 0;
    
    return { taskData, overallCompletion };
  };

  const { taskData: monthlyData, overallCompletion: overallMonthly } = calculateCompletionData(tasks, currentDate, 'month');
  const { taskData: yearlyData, overallCompletion: overallYearly } = calculateCompletionData(tasks, currentDate, 'year');
  
  const overallMonthlyChartData = [{ name: 'overall', completion: overallMonthly, fill: 'hsl(var(--primary))' }];
  const overallYearlyChartData = [{ name: 'overall', completion: overallYearly, fill: 'hsl(var(--primary))' }];

  const renderBarChart = (data: typeof monthlyData) => (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10 }}>
        <XAxis type="number" dataKey="completion" hide />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={120}
          className="truncate"
        />
        <Bar dataKey="completion" fill="hsl(var(--primary))" radius={4}>
          <LabelList
            dataKey="completion"
            position="right"
            offset={8}
            className="fill-foreground font-semibold"
            formatter={(value: number) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );

  const renderRadialChart = (data: typeof overallMonthlyChartData, period: string) => (
     <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full max-h-[250px]"
      >
        <RadialBarChart
          data={data}
          startAngle={90}
          endAngle={-270}
          innerRadius="70%"
          outerRadius="100%"
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="completion"
            cornerRadius={8}
            background={{ fill: 'hsl(var(--muted))' }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-headline text-primary">
              {data[0].completion}%
            </span>
            <span className="text-sm text-muted-foreground">{period} Avg.</span>
        </div>
      </ChartContainer>
  )

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
        <CardDescription>
          A look at your task completion rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-4">Completion per Task (Monthly)</h3>
                {monthlyData.length > 0 ? (
                  renderBarChart(monthlyData)
                ) : (
                  <p className="text-muted-foreground text-center h-[250px] flex items-center justify-center">No tasks to display.</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-center">Overall Completion</h3>
                 {renderRadialChart(overallMonthlyChartData, 'Monthly')}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-4">Completion per Task (Yearly)</h3>
                 {yearlyData.length > 0 ? (
                  renderBarChart(yearlyData)
                ) : (
                  <p className="text-muted-foreground text-center h-[250px] flex items-center justify-center">No tasks to display.</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-center">Overall Completion</h3>
                {renderRadialChart(overallYearlyChartData, 'Yearly')}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
