import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, iconClassName }: { className?: string, iconClassName?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-2xl font-bold font-headline text-primary', className)}>
      <MessageCircle className={cn('h-7 w-7', iconClassName)} />
      <h1 className="tracking-tight">VerbalEdge</h1>
    </div>
  );
}
