'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { useTheme } from '../ThemeProvider';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Message, Conversation } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
  grammar: { label: 'Grammar', color: 'hsl(var(--chart-1))' },
  tone: { label: 'Tone', color: 'hsl(var(--chart-2))' },
  clarity: { label: 'Clarity', color: 'hsl(var(--chart-3))' },
  pragmatics: { label: 'Pragmatics', color: 'hsl(var(--chart-4))' },
};

export function PerformanceChart() {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#888' : '#333';
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'conversations'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(7));
  }, [user, firestore]);

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);
  
  const performanceHistory = useMemo(() => {
    if (!conversations) return [];
    
    // This part is complex because we need to get messages for each conversation,
    // which would require another hook or data fetching strategy inside a component,
    // which is not ideal. For now, we will return empty data.
    // A better implementation would be to denormalize the average scores into the conversation document.
    return [];

  }, [conversations]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Your average scores for the last 7 conversations.</CardDescription>
      </CardHeader>
      <CardContent>
          {loading && <div>Loading...</div>}
          {!loading && performanceHistory.length === 0 && <div className="text-center text-muted-foreground py-8">Not enough data to display chart.</div>}
        {performanceHistory.length > 0 && <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
        </ChartContainer>}
      </CardContent>
    </Card>
  );
}
