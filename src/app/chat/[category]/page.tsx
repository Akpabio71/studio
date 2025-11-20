import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat/ChatInterface';
import type { Message } from '@/lib/types';
import { categories } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function ChatPage({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const categoryInfo = categories.find(c => c.id === params.category);
  const roleId = searchParams.role || categoryInfo?.roles[0].id;

  if (!categoryInfo || !roleId) {
    notFound();
  }

  const roleInfo = categoryInfo.roles.find(r => r.id === roleId);

  if (!roleInfo) {
    notFound();
  }


  const initialMessages: Message[] = [
    {
      id: 'ai-initial',
      sender: 'ai',
      text: roleInfo.starter,
      timestamp: Date.now(),
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background">
        <Button asChild variant="ghost" size="icon" className="mr-2">
          <Link href="/categories">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
            <categoryInfo.icon className="w-6 h-6 text-primary"/>
            <div>
                <h1 className="text-lg font-semibold tracking-tight">{categoryInfo.name}</h1>
                <p className="text-sm text-muted-foreground">{roleInfo.name}</p>
            </div>
        </div>
      </header>
      <ChatInterface category={params.category} role={roleInfo.id} initialMessages={initialMessages} />
    </div>
  );
}
