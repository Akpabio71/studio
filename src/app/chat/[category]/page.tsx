import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat/ChatInterface';
import type { Message } from '@/lib/types';
import { categories } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function ChatPage({ params }: { params: { category: string } }) {
  const categoryInfo = categories.find(c => c.id === params.category);

  if (!categoryInfo) {
    notFound();
  }

  const initialMessages: Message[] = [
    {
      id: 'ai-initial',
      sender: 'ai',
      text: `Welcome to the ${categoryInfo.name} chat! Let's start our conversation. How can I help you today?`,
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
            <h1 className="text-lg font-semibold tracking-tight">{categoryInfo.name}</h1>
        </div>
      </header>
      <ChatInterface category={params.category} initialMessages={initialMessages} />
    </div>
  );
}
