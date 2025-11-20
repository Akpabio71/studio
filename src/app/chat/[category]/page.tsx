'use client';
import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat/ChatInterface';
import type { Message } from '@/lib/types';
import { categories } from '@/lib/data';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';

export default function ChatPage({ params: { category: categoryId } }: { params: { category: string }}) {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleId = searchParams.get('role');
  let conversationId = searchParams.get('conversationId');

  const categoryInfo = categories.find(c => c.id === categoryId);

  if (!categoryInfo || !roleId) {
    notFound();
  }
  
  const roleInfo = categoryInfo.roles.find(r => r.id === roleId);
  
  if (!roleInfo) {
    notFound();
  }

  const [localConversationId, setLocalConversationId] = useState(conversationId);

  const messagesQuery = useMemo(() => {
    if (!firestore || !localConversationId) return null;
    return query(collection(firestore, 'conversations', localConversationId, 'messages'), orderBy('timestamp'));
  }, [firestore, localConversationId]);

  const { data: messages, loading: messagesLoading } = useCollection<Message>(messagesQuery);
  
  const initialAiMessage: Message = {
      id: 'ai-initial',
      sender: 'ai',
      text: roleInfo.starter,
      timestamp: Date.now(),
  };

  useEffect(() => {
    if (!conversationId && user && firestore && !messagesLoading && messages.length === 0) {
      const createConversation = async () => {
        const newConversationRef = doc(collection(firestore, 'conversations'));
        const newConversation = {
          userId: user.uid,
          category: categoryId,
          role: roleId,
          timestamp: serverTimestamp(),
          lastMessage: roleInfo.starter,
        };
        await setDoc(newConversationRef, newConversation);
        
        const conversationId = newConversationRef.id;
        setLocalConversationId(conversationId);

        const initialMessageForDb = { ...initialAiMessage, timestamp: serverTimestamp() };
        await addDoc(collection(firestore, 'conversations', conversationId, 'messages'), initialMessageForDb);
        
        router.replace(`/chat/${categoryId}?role=${roleId}&conversationId=${conversationId}`);
      };
      createConversation();
    }
  }, [conversationId, user, firestore, categoryId, roleId, roleInfo.starter, router, messages.length, messagesLoading, initialAiMessage]);


  const initialMessages = messages.length > 0 ? messages : [initialAiMessage];

  if (userLoading || (!conversationId && !messagesLoading) || (conversationId && messagesLoading)) {
      return (
          <div className="flex items-center justify-center h-screen">
              <div className="text-lg">Loading chat...</div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background">
        <Button asChild variant="ghost" size="icon" className="mr-2">
          <Link href="/conversations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{roleInfo.name}</h1>
            <p className="text-sm text-muted-foreground">{categoryInfo.name}</p>
          </div>
        </div>
      </header>
      <ChatInterface
        category={categoryId}
        role={roleInfo.id}
        initialMessages={initialMessages}
        conversationId={localConversationId}
       />
    </div>
  );
}
