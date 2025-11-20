'use client';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useCollection, useUser, useDoc } from '@/firebase';
import { Conversation, UserProfile } from '@/lib/types';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { formatDistanceToNow } from 'date-fns';
import { categories } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function ConversationItem({ convo }: { convo: Conversation }) {
  const { data: userProfile, loading } = useDoc<UserProfile>('users', convo.userId);
  const categoryInfo = categories.find(c => c.id === convo.category);
  const roleInfo = categoryInfo?.roles.find(r => r.id === convo.role);

  if (loading) {
    return (
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const timestamp = convo.timestamp && typeof convo.timestamp === 'object' && 'seconds' in convo.timestamp 
    ? new Date(convo.timestamp.seconds * 1000)
    : new Date();

  return (
     <Link
      href={`/chat/${convo.category}?role=${convo.role}&conversationId=${convo.id}`}
      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
    >
      <Avatar className="h-12 w-12">
        {userProfile?.photoURL && <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName || ''} />}
        <AvatarFallback>{(userProfile?.displayName || 'U').charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{roleInfo?.name || "Conversation"}</p>
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true })}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
        </div>
      </div>
    </Link>
  )
}


export default function ConversationsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'conversations'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: conversations, loading } = useCollection<Conversation>(conversationsQuery);

  return (
    <AppShell>
      <div className="container mx-auto px-0 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg animate-fade-in-up">
          <header className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Chats</h1>
              <Button size="icon" variant="ghost" asChild>
                <Link href="/categories">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">New Chat</span>
                </Link>
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
                <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>}
            {!loading && conversations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-up">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                    <h2 className="mt-4 text-xl font-semibold">No Chats Yet</h2>
                    <p className="mt-2 text-muted-foreground">Start a new conversation to see it here.</p>
                    <Button asChild className="mt-4">
                        <Link href="/categories">Start a Chat</Link>
                    </Button>
                </div>
            )}
            <div className="divide-y">
              {conversations.map((convo, index) => (
                <div
                  key={convo.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <ConversationItem convo={convo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
