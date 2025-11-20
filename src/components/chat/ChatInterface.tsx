'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import type { Message, AIFeedback } from '@/lib/types';
import { getAIFeedback } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


interface ChatInterfaceProps {
  category: string;
  role: string;
  initialMessages: Message[];
  conversationId: string | null;
}

export function ChatInterface({ category, role, initialMessages, conversationId }: ChatInterfaceProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !user || !firestore || !conversationId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const userMessageForDb = { 
        text: userMessage.text,
        sender: userMessage.sender,
        timestamp: serverTimestamp() 
    };
    
    const messagesCollection = collection(firestore, 'conversations', conversationId, 'messages');
    
    let userMessageRefId: string | null = null;
    try {
        const docRef = await addDoc(messagesCollection, userMessageForDb);
        userMessageRefId = docRef.id;
    } catch(e: any) {
        const permissionError = new FirestorePermissionError({
            path: messagesCollection.path,
            operation: 'create',
            requestResourceData: userMessageForDb,
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
        // Revert optimistic UI update
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        return;
    }


    const lastAIMessage = messages.filter(m => m.sender === 'ai').pop();

    const result = await getAIFeedback(currentInput, category, role, lastAIMessage?.text || '');
    
    // Update user message with feedback
    if (userMessageRefId) {
        const userMessageDocRef = doc(firestore, 'conversations', conversationId, 'messages', userMessageRefId);
        const feedbackUpdate: { feedback: AIFeedback, avgRating: number } = { feedback: result.feedback, avgRating: result.avgRating };
        updateDoc(userMessageDocRef, feedbackUpdate).catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: userMessageDocRef.path,
                operation: 'update',
                requestResourceData: feedbackUpdate
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
    
     setMessages(prev =>
      prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, feedback: result.feedback, avgRating: result.avgRating } : msg
      )
    );

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      text: result.aiReply,
      sender: 'ai',
      timestamp: Date.now(),
    };

    const aiMessageForDb = { ...aiMessage, id: undefined, timestamp: serverTimestamp() };
    addDoc(collection(firestore, 'conversations', conversationId, 'messages'), aiMessageForDb).catch(async (serverError) => {
         const permissionError = new FirestorePermissionError({
            path: collection(firestore, 'conversations', conversationId, 'messages').path,
            operation: 'create',
            requestResourceData: aiMessageForDb
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    // Update conversation last message and scores
    if (conversationId) {
        const conversationRef = doc(firestore, 'conversations', conversationId);
        const conversationUpdate = {
            lastMessage: result.aiReply,
            timestamp: serverTimestamp(),
            messageCount: increment(1),
            totalScore: increment(result.avgRating),
        };
        updateDoc(conversationRef, conversationUpdate).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: conversationRef.path,
                operation: 'update',
                requestResourceData: conversationUpdate
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="max-w-md w-full space-y-2">
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-16 min-h-[48px] max-h-48"
            rows={1}
            disabled={isLoading || !conversationId}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !conversationId}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>
    </div>
  );
}
