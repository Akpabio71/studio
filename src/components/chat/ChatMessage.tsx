'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, ChevronsUpDown } from 'lucide-react';
import { ResponseRating } from './ResponseRating';
import { ResponseSuggestions } from './ResponseSuggestions';
import { DetailedFeedback } from './DetailedFeedback';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const isUserSender = message.sender === 'user';
  const { user } = useUser();

  return (
    <div className={cn('flex items-start gap-3', isUserSender ? 'justify-end' : 'justify-start')}>
      {!isUserSender && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn('max-w-md w-full space-y-2', isUserSender ? 'order-1' : 'order-2')}>
        <div
          className={cn(
            'p-3 rounded-lg',
            isUserSender ? 'bg-primary text-primary-foreground' : 'bg-card border'
          )}
        >
          <p className="text-base whitespace-pre-wrap">{message.text}</p>
        </div>

        {isUserSender && message.feedback && (
          <Collapsible open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
            <div className="p-3 rounded-lg bg-card border space-y-4">
              <ResponseRating rating={message.feedback.rating} />
              <CollapsibleContent className="space-y-4 animate-accordion-down">
                <DetailedFeedback feedback={message.feedback.detailedFeedback} />
              </CollapsibleContent>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
                <ResponseSuggestions suggestions={message.feedback.suggestions} />
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                        Detailed Feedback
                        <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                </CollapsibleTrigger>
            </div>
          </Collapsible>
        )}
      </div>
      {isUserSender && (
         <Avatar className="h-8 w-8 order-2">
           {user?.photoURL && <Avatar.Image src={user.photoURL} />}
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
