import { AIFeedback } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface ResponseRatingProps {
  rating: AIFeedback['rating'];
}

const metrics: (keyof Omit<AIFeedback['rating'], 'briefExplanation'>)[] = [
  'grammar',
  'tone',
  'clarity',
  'pragmaticEffectiveness',
];

const metricLabels: Record<string, string> = {
  grammar: 'Grammar',
  tone: 'Tone',
  clarity: 'Clarity',
  pragmaticEffectiveness: 'Pragmatics',
};

export function ResponseRating({ rating }: ResponseRatingProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {metrics.map(metric => (
          <div key={metric} className="space-y-1">
            <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium">{metricLabels[metric]}</p>
                <p className="text-sm font-bold text-primary">{rating[metric]}%</p>
            </div>
            <Progress value={rating[metric]} className="h-2" />
          </div>
        ))}
      </div>
      {rating.briefExplanation && (
        <p className="text-xs text-muted-foreground italic">
          "{rating.briefExplanation}"
        </p>
      )}
    </div>
  );
}
