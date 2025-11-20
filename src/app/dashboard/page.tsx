'use client';
import { AppShell } from '@/components/AppShell';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { Message } from '@/lib/types';
import { collectionGroup, query, where, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';


export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const mistakesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        // This is a collection group query, it requires an index in firestore
        // For now, this will likely fail without the index.
        return query(
            collectionGroup(firestore, 'messages'),
            where('sender', '==', 'user'),
            where('feedback.detailedFeedback.correctedMessage', '!=', null),
            orderBy('feedback.detailedFeedback.correctedMessage'),
            orderBy('timestamp', 'desc'),
            limit(5)
        );
    }, [user, firestore]);

    const { data: recentMistakes, loading } = useCollection<Message>(mistakesQuery);


  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              An overview of your communication progress.
            </p>
          </div>

          <AnalyticsSummary />

          <PerformanceChart />

          <Card>
            <CardHeader>
              <CardTitle>Recent Mistakes</CardTitle>
              <CardDescription>
                Review recent corrections to learn and improve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Original</TableHead>
                    <TableHead className="w-1/3">Corrected</TableHead>
                    <TableHead className="w-1/3 text-right">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
                  {!loading && recentMistakes.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No mistakes to show yet.</TableCell></TableRow>}
                  {recentMistakes.map(mistake => (
                    <TableRow key={mistake.id}>
                      <TableCell className="font-medium text-muted-foreground line-through">
                        {mistake.text}
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        {mistake.feedback?.detailedFeedback.correctedMessage}
                      </TableCell>
                      <TableCell className="text-right">Mixed</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
