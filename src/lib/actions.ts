'use server';

import { rateUserResponse } from '@/ai/flows/rate-user-response';
import { generateResponseSuggestions } from '@/ai/flows/generate-response-suggestions';
import { provideDetailedFeedback } from '@/ai/flows/provide-detailed-feedback';
import type { AIFeedback } from './types';

export type GetAIFeedbackResult = {
  feedback: AIFeedback;
  aiReply: string;
};

const aiReplies: Record<string, string> = {
    business: "Thank you for your input. From a business perspective, how would you quantify the impact of this proposal?",
    casual: "Oh, cool! What makes you say that?",
    social: "That's so interesting! I'd love to hear more about your experience with that.",
    'special-needs-support': "Thank you for sharing that with me. It is brave to talk about it. Can you explain how that feels?"
};

export async function getAIFeedback(
  message: string,
  category: string
): Promise<GetAIFeedbackResult> {
  try {
    const [rating, suggestions, detailedFeedback] = await Promise.all([
      rateUserResponse({ message, category }),
      generateResponseSuggestions({ message, category }),
      provideDetailedFeedback({ message, category }),
    ]);

    const aiReply = aiReplies[category.toLowerCase()] || "That's interesting. Can you elaborate?";

    return { feedback: { rating, suggestions, detailedFeedback }, aiReply };
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    // Return a default/error structure
    return {
      feedback: {
        rating: { grammar: 0, tone: 0, clarity: 0, pragmaticEffectiveness: 0, detailedFeedback: 'An error occurred while generating feedback.' },
        suggestions: { suggestions: ['Sorry, I couldn\'t generate suggestions.'] },
        detailedFeedback: { grammarFeedback: '', toneFeedback: '', clarityFeedback: '', pragmaticFeedback: '', correctedMessage: message }
      },
      aiReply: "I'm having a little trouble understanding. Could you please try rephrasing?"
    };
  }
}
