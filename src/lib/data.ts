import { Briefcase, MessageSquare, Heart, Users } from 'lucide-react';
import type { CategoryInfo, PerformanceData, RecentMistake, Conversation } from './types';

export const categories: CategoryInfo[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Practice professional communication for workplace scenarios.',
    icon: Briefcase,
    roles: [
      { id: 'sales-pitch', name: 'Sales Pitch', starter: "Welcome! Thanks for meeting with me. I'd love to show you how our product can help your company." },
      { id: 'investment-meeting', name: 'Investment Meeting', starter: "Thanks for your time. What questions do you have about our business plan?" },
      { id: 'performance-review', name: 'Performance Review', starter: "Let's discuss your performance over the last quarter. How do you feel it went?" },
    ]
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Chat informally with friends and acquaintances.',
    icon: MessageSquare,
    roles: [
        { id: 'making-plans', name: 'Making Plans', starter: "Hey! What are you up to this weekend? We should hang out." },
        { id: 'catching-up', name: 'Catching Up', starter: "It's been a while! How have you been?" },
        { id: 'discussing-hobbies', name: 'Discussing Hobbies', starter: "I've been getting into hiking lately. Do you have any favorite hobbies?" },
    ]
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Engage in social situations like parties or networking events.',
    icon: Users,
    roles: [
        { id: 'networking-event', name: 'Networking Event', starter: "Hi, I'm new here. What brings you to this event?" },
        { id: 'party-introduction', name: 'Party Introduction', starter: "Hey there, I don't think we've met. I'm a friend of the host. What's your name?" },
        { id: 'dinner-conversation', name: 'Dinner Conversation', starter: "This food is amazing! Have you tried the risotto?" },
    ]
  },
  {
    id: 'special-needs-support',
    name: 'Special Needs Support',
    description: 'Communicate effectively in supportive and understanding contexts.',
    icon: Heart,
    roles: [
        { id: 'expressing-feelings', name: 'Expressing Feelings', starter: "It's a safe space to talk. How are you feeling right now?" },
        { id: 'offering-support', name: 'Offering Support', starter: "I'm here for you. Is there anything I can do to help?" },
        { id: 'talk-through-challenge', name: 'Talking Through a Challenge', starter: "That sounds really tough. Can you tell me more about what's happening?" },
    ]
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    userName: 'Sales Coach',
    lastMessage: "Perfect! Let's practice that pitch.",
    timestamp: '10:42 AM',
    unreadCount: 2,
    avatarUrl: 'https://picsum.photos/seed/1/200/200',
    category: 'business',
    role: 'sales-pitch'
  },
  {
    id: '2',
    userName: 'Friend',
    lastMessage: 'Totally, let’s catch up this weekend!',
    timestamp: '9:15 AM',
    unreadCount: 0,
    avatarUrl: 'https://picsum.photos/seed/2/200/200',
    category: 'casual',
    role: 'catching-up'
  },
  {
    id: '3',
    userName: 'Networking Pro',
    lastMessage: 'Great connecting with you!',
    timestamp: 'Yesterday',
    unreadCount: 0,
    avatarUrl: 'https://picsum.photos/seed/3/200/200',
    category: 'social',
    role: 'networking-event'
  },
  {
    id: '4',
    userName: 'Support Guide',
    lastMessage: 'I am here to listen.',
    timestamp: '2 days ago',
    unreadCount: 1,
    avatarUrl: 'https://picsum.photos/seed/4/200/200',
    category: 'special-needs-support',
    role: 'expressing-feelings'
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
