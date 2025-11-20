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
    id: 'dating',
    name: 'Dating',
    description: 'Navigate romantic conversations with confidence.',
    icon: Heart,
    roles: [
        { id: 'first-date', name: 'First Date', starter: "This is a nice place! I'm glad we could do this. So, what do you do for fun?" },
        { id: 'asking-someone-out', name: 'Asking Someone Out', starter: "Hey, I've really enjoyed talking with you. I was wondering if you'd like to get coffee sometime." },
        { id: 'online-dating-message', name: 'Online Dating Message', starter: "Hi! I saw on your profile that you're into hiking. Me too! What's your favorite trail?" },
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
