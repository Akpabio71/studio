import type {
  RateUserResponseOutput,
  GenerateResponseSuggestionsOutput,
  ProvideDetailedFeedbackOutput,
} from '@/ai/flows/rate-user-response';


export type CategoryInfo = {
  id: 'business' | 'casual' | 'social' | 'special-needs-support';
  name: string;
  description: string;
  icon: React.ElementType;
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  feedback?: AIFeedback;
}

export interface AIFeedback {
  rating: RateUserResponseOutput;
  suggestions: GenerateResponseSuggestionsOutput;
  detailedFeedback: ProvideDetailedFeedbackOutput;
}

export type PerformanceData = {
  date: string;
  grammar: number;
  tone: number;
  clarity: number;
  pragmatics: number;
};

export type RecentMistake = {
  id: string;
  original: string;
  corrected: string;
  category: string;
};
