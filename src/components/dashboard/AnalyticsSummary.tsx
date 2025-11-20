'use client';
import { ArrowUp, MessagesSquare, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useUser } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Conversation } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


export function AnalyticsSummary() {
    const { user } = useUser();
    const firestore = useFirestore();

    const conversationsQuery = useMemo(() => {
        if (!firestore || !user?.uid) return null;
        return query(collection(firestore, 'conversations'), where('userId', '==', user.uid));
    }, [firestore, user?.uid]);

    const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);

    const { totalConversations, avgPerformance, weeklyImprovement, isWeeklyImprovementPositive } = useMemo(() => {
        if (!conversations || conversations.length === 0) {
            return { totalConversations: 0, avgPerformance: 0, weeklyImprovement: 0, isWeeklyImprovementPositive: true };
        }

        const totalConversations = conversations.length;
        
        const totalMessages = conversations.reduce((acc, c) => acc + (c.messageCount || 0), 0);
        const totalScore = conversations.reduce((acc, c) => acc + (c.totalScore || 0), 0);
        const avgPerformance = totalMessages > 0 ? Math.round(totalScore / totalMessages) : 0;
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const lastWeekConversations = conversations.filter(c => c.timestamp && (c.timestamp as any).toDate() > oneWeekAgo);
        const previousWeekConversations = conversations.filter(c => c.timestamp && (c.timestamp as any).toDate() > twoWeeksAgo && (c.timestamp as any).toDate() <= oneWeekAgo);

        const lastWeekTotalMessages = lastWeekConversations.reduce((acc, c) => acc + (c.messageCount || 0), 0);
        const lastWeekTotalScore = lastWeekConversations.reduce((acc, c) => acc + (c.totalScore || 0), 0);
        const lastWeekAvg = lastWeekTotalMessages > 0 ? lastWeekTotalScore / lastWeekTotalMessages : 0;

        const previousWeekTotalMessages = previousWeekConversations.reduce((acc, c) => acc + (c.messageCount || 0), 0);
        const previousWeekTotalScore = previousWeekConversations.reduce((acc, c) => acc + (c.totalScore || 0), 0);
        const previousWeekAvg = previousWeekTotalMessages > 0 ? previousWeekTotalScore / previousWeekTotalMessages : 0;

        const weeklyImprovement = previousWeekAvg > 0 ? Math.round(((lastWeekAvg - previousWeekAvg) / previousWeekAvg) * 100) : (lastWeekAvg > 0 ? 100 : 0);
        
        return { totalConversations, avgPerformance, weeklyImprovement, isWeeklyImprovementPositive: weeklyImprovement >= 0 };
    }, [conversations]);


    if (loading) {
        return (
             <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-6 w-12" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-6 w-16" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-36" /></CardHeader><CardContent><Skeleton className="h-6 w-12" /></CardContent></Card>
             </div>
        )
    }


  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
          <MessagesSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConversations}</div>
          <p className="text-xs text-muted-foreground">over all time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgPerformance}%</div>
          <p className="text-xs text-muted-foreground">Average score across all metrics</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Improvement</CardTitle>
          <ArrowUp className={`h-4 w-4 text-muted-foreground ${!isWeeklyImprovementPositive && 'transform rotate-180 text-destructive'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyImprovement}%</div>
          <p className="text-xs text-muted-foreground">compared to last week</p>
        </CardContent>
      </Card>
    </div>
  );
}
