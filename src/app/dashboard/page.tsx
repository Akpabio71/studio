'use client';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import { categories } from '@/lib/data';
import { getOpenChats } from '@/lib/chats';
=======
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { Message } from '@/lib/types';
import { collectionGroup, query, where, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';

>>>>>>> 9862010c71e3ec3ed7576961659f90718861b1c8

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const mistakesQuery = useMemo(() => {
        if (!user?.uid || !firestore) return null;
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
    }, [user?.uid, firestore]);

    const { data: recentMistakes, loading } = useCollection<Message>(mistakesQuery);


  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              An overview of your communication progress.
            </p>
          </div>

<<<<<<< HEAD
          <div>
            <h2 className="text-xl font-semibold">Open Chats</h2>
            <p className="mt-1 text-muted-foreground">Continue recent conversations or jump back into practice.</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {getOpenChats().map(chat => {
              const category = categories.find(c => c.id === chat.categoryId);
              return (
                <Card key={chat.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                          <CardTitle className="text-lg">{chat.name}</CardTitle>
                          <CardDescription className="mt-1">{category?.name}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {chat.unread > 0 && (
                            <span className="inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs px-2 py-0.5">{chat.unread}</span>
                          )}
                          <div className="text-sm text-muted-foreground">{new Date(chat.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <a href={`/chat/${chat.categoryId}?role=${chat.roleId}`} className="text-primary underline">Open</a>
                      <div className="text-xs text-muted-foreground">Role: {chat.roleId}</div>
                    </div>
                    {chat.lastMessageSnippet && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{chat.lastMessageSnippet}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
=======
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}><AnalyticsSummary /></div>

          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}><PerformanceChart /></div>

          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
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
>>>>>>> 9862010c71e3ec3ed7576961659f90718861b1c8
          </div>
        </div>
      </div>
    </AppShell>
  );
}
