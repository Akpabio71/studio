import { GenerateResponseSuggestionsOutput } from '@/ai/flows/generate-response-suggestions';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Lightbulb, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResponseSuggestionsProps {
  suggestions: GenerateResponseSuggestionsOutput;
}

export function ResponseSuggestions({ suggestions }: ResponseSuggestionsProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggestions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Response Suggestions</h4>
            <p className="text-sm text-muted-foreground">
              Here are a few alternative ways to phrase your message.
            </p>
          </div>
          <div className="grid gap-2">
            {suggestions.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group relative flex items-start justify-between rounded-md border p-3 text-sm"
              >
                <p className="flex-1 pr-8">"{suggestion}"</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(suggestion)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
