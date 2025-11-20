import type {
  RateUserResponseOutput,
} from '@/ai/flows/rate-user-response';

import type {
    GenerateResponseSuggestionsOutput
} from '@/ai/flows/generate-response-suggestions';

import type {
    ProvideDetailedFeedbackOutput
} from '@/ai/flows/provide-detailed-feedback';


export type CategoryRole = {
    id: string;
    name: string;
    starter: string;
}

export type CategoryInfo = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  roles: CategoryRole[];
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

export type Conversation = {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl: string;
  category: string;
  role: string;
};
