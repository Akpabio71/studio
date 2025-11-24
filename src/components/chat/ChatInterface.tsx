'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import type { Message } from '@/lib/types';
// Call the server via a standard API route instead of importing server actions directly
import { Skeleton } from '../ui/skeleton';

interface ChatInterfaceProps {
  category: string;
  role: string;
  initialMessages: Message[];
}

export function ChatInterface({ category, role, initialMessages }: ChatInterfaceProps) {
  const categoryInfo = categories.find(c => c.id === category);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    const lastAIMessage = messages.filter(m => m.sender === 'ai').pop();

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, category, role, previousMessage: lastAIMessage?.text || '' }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.reply ?? 'Sorry, I could not get a response.';

      // Optionally attach placeholder feedback until server-side feedback is wired
      setMessages(prev =>
        prev.map(msg => (msg.id === userMessage.id ? { ...msg, feedback: undefined } : msg))
      );

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: reply,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat send error', err);
      const errMessage: Message = {
        id: `ai-error-${Date.now()}`,
        text: "Sorry — something went wrong. Try again later.",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
        {categoryInfo && (
          <div className="flex items-center gap-3">
            <categoryInfo.icon className="w-6 h-6 text-primary" />
            <div>
              <div className="text-sm font-semibold">{categoryInfo.name}</div>
              <div className="text-xs text-muted-foreground">Role: {role}</div>
            </div>
          </div>
        )}
      </div>
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
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
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
