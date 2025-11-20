'use server';

import { rateUserResponse } from '@/ai/flows/rate-user-response';
import { generateResponseSuggestions } from '@/ai/flows/generate-response-suggestions';
import { provideDetailedFeedback } from '@/ai/flows/provide-detailed-feedback';
import { generateAiResponse } from '@/ai/flows/generate-ai-response';
import type { AIFeedback } from './types';

export type GetAIFeedbackResult = {
  feedback: AIFeedback;
  aiReply: string;
  avgRating: number;
};

export async function getAIFeedback(
  message: string,
  category: string,
  role: string,
  previousMessage: string
): Promise<GetAIFeedbackResult> {
  try {
    const [rating, suggestions, detailedFeedback, aiResponse] = await Promise.all([
      rateUserResponse({ message, category }),
      generateResponseSuggestions({ message, category, role, previousMessage }),
      provideDetailedFeedback({ message, category }),
      generateAiResponse({
        userMessage: message,
        previousMessage,
        category,
        role,
      }),
    ]);

    const aiReply = aiResponse.response;
    
    const { grammar, tone, clarity, pragmaticEffectiveness } = rating;
    const avgRating = (grammar + tone + clarity + pragmaticEffectiveness) / 4;


    return { feedback: { rating, suggestions, detailedFeedback }, aiReply, avgRating };
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    // Return a default/error structure
    return {
      feedback: {
        rating: { grammar: 0, tone: 0, clarity: 0, pragmaticEffectiveness: 0, detailedFeedback: 'An error occurred while generating feedback.' },
        suggestions: { suggestions: ['Sorry, I couldn\'t generate suggestions.'] },
        detailedFeedback: { grammarFeedback: '', toneFeedback: '', clarityFeedback: '', pragmaticFeedback: '', correctedMessage: message }
      },
      aiReply: "I'm having a little trouble understanding. Could you please try rephrasing?",
      avgRating: 0,
    };
  }
}
