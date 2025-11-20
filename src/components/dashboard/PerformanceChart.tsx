'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useTheme } from '../ThemeProvider';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Conversation, PerformanceData } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
  avg: { label: 'Average', color: 'hsl(var(--chart-1))' },
};

export function PerformanceChart() {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#888' : '#333';
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemo(() => {
    if (!user?.uid || !firestore) return null;
    return query(collection(firestore, 'conversations'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(7));
  }, [user?.uid, firestore]);

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);
  
  const performanceHistory: PerformanceData[] = useMemo(() => {
    if (!conversations) return [];
    
    return conversations.map(convo => {
      const avg = (convo.totalScore && convo.messageCount) ? Math.round(convo.totalScore / convo.messageCount) : 0;
      const date = convo.timestamp && typeof convo.timestamp === 'object' && 'seconds' in convo.timestamp 
        ? format(new Date(convo.timestamp.seconds * 1000), 'MMM d')
        : format(new Date(), 'MMM d');
        
      return {
        date,
        avg,
        grammar: 0, // Placeholder, not used in chart
        tone: 0, // Placeholder
        clarity: 0, // Placeholder
        pragmatics: 0, // Placeholder
      }
    }).reverse();

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
               <Legend content={<ChartLegendContent />} />
              <Bar dataKey="avg" fill="var(--color-avg)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>}
      </CardContent>
    </Card>
  );
}
