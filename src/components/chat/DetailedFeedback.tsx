import { ProvideDetailedFeedbackOutput } from '@/ai/flows/provide-detailed-feedback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DetailedFeedbackProps {
  feedback: ProvideDetailedFeedbackOutput;
}

export function DetailedFeedback({ feedback }: DetailedFeedbackProps) {
  const feedbackItems = [
    { title: 'Grammar', content: feedback.grammarFeedback },
    { title: 'Tone', content: feedback.toneFeedback },
    { title: 'Clarity', content: feedback.clarityFeedback },
    { title: 'Pragmatics', content: feedback.pragmaticFeedback },
  ];

  return (
    <div className="space-y-4">
        <div>
            <h4 className="font-medium">Corrected Message</h4>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 p-3 bg-green-500/10 rounded-md">
                {feedback.correctedMessage}
            </p>
        </div>
      <Accordion type="single" collapsible className="w-full">
        <h4 className="font-medium mb-2">Detailed Breakdown</h4>
        {feedbackItems.map(item => (
            item.content && (
                <AccordionItem value={item.title} key={item.title}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            )
        ))}
      </Accordion>
    </div>
  );
}
