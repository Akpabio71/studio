import type {
  RateUserResponseOutput,
} from '@/ai/flows/rate-user-response';

import type {
    GenerateResponseSuggestionsOutput
} from '@/ai/flows/generate-response-suggestions';

import type {
    ProvideDetailedFeedbackOutput
} from '@/ai/flows/provide-detailed-feedback';
import { Timestamp } from 'firebase/firestore';


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
  sender: 'user' | 'ai';
  text: string;
  timestamp: number | Timestamp;
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
  userId: string;
  category: string;
  role: string;
  lastMessage: string;
  timestamp: number | Timestamp;
  // for client-side display logic, not in firestore
  userName?: string; 
  avatarUrl?: string;
  unreadCount?: number;
};

export type UserProfile = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}
