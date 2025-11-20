import Link from 'next/link';
import Image from 'next/image';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { conversations } from '@/lib/data';
import { Search, Plus } from 'lucide-react';

export default function ConversationsPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-0 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg">
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
            <div className="divide-y">
              {conversations.map(convo => (
                <Link
                  key={convo.id}
                  href={`/chat/${convo.category}?role=${convo.role}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={convo.avatarUrl} alt={convo.userName} />
                    <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{convo.userName}</p>
                      <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                      {convo.unreadCount > 0 && (
                        <Badge className="h-5 w-5 flex items-center justify-center p-0">{convo.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
