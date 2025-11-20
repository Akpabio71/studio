'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { performanceHistory } from '@/lib/data';
import type { PerformanceData } from '@/lib/types';
import { useTheme } from '../ThemeProvider';

const chartConfig = {
  grammar: { label: 'Grammar', color: 'hsl(var(--chart-1))' },
  tone: { label: 'Tone', color: 'hsl(var(--chart-2))' },
  clarity: { label: 'Clarity', color: 'hsl(var(--chart-3))' },
  pragmatics: { label: 'Pragmatics', color: 'hsl(var(--chart-4))' },
};

export function PerformanceChart() {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#888' : '#333';


  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Your average scores for the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceHistory} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
               <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: tickColor, fontSize: 12 }}
                domain={[0, 100]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="grammar" fill="var(--color-grammar)" radius={4} />
              <Bar dataKey="tone" fill="var(--color-tone)" radius={4} />
              <Bar dataKey="clarity" fill="var(--color-clarity)" radius={4} />
              <Bar dataKey="pragmatics" fill="var(--color-pragmatics)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
