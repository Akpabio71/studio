import { Briefcase, MessageSquare, Heart, Users } from 'lucide-react';
import type { CategoryInfo, PerformanceData, RecentMistake } from './types';

export const categories: CategoryInfo[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Practice professional communication for workplace scenarios.',
    icon: Briefcase,
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Chat informally with friends and acquaintances.',
    icon: MessageSquare,
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Engage in social situations like parties or networking events.',
    icon: Users,
  },
  {
    id: 'special-needs-support',
    name: 'Special Needs Support',
    description: 'Communicate effectively in supportive and understanding contexts.',
    icon: Heart,
  },
];

export const analyticsSummary = {
  messageCount: 124,
  performanceScore: 88,
  improvement: 5,
};

export const performanceHistory: PerformanceData[] = [
  { date: 'May 1', grammar: 75, tone: 80, clarity: 85, pragmatics: 70 },
  { date: 'May 2', grammar: 78, tone: 82, clarity: 88, pragmatics: 75 },
  { date: 'May 3', grammar: 80, tone: 85, clarity: 90, pragmatics: 80 },
  { date: 'May 4', grammar: 82, tone: 88, clarity: 92, pragmatics: 85 },
  { date: 'May 5', grammar: 85, tone: 90, clarity: 95, pragmatics: 88 },
  { date: 'May 6', grammar: 88, tone: 92, clarity: 96, pragmatics: 90 },
  { date: 'May 7', grammar: 90, tone: 94, clarity: 97, pragmatics: 92 },
];

export const recentMistakes: RecentMistake[] = [
    {
        id: '1',
        original: "I can't to go to the meeting.",
        corrected: "I can't go to the meeting.",
        category: 'Grammar',
    },
    {
        id: '2',
        original: "Give me the report now.",
        corrected: "Could you please send me the report when you have a moment?",
        category: 'Tone',
    },
    {
        id: '3',
        original: "The thing is, like, we should probably, you know, do it.",
        corrected: "We should proceed with this initiative.",
        category: 'Clarity',
    }
];

export const profileSettings = {
    language: 'en-us',
    goal: 'confidence',
    experienceLevel: 'intermediate',
};
