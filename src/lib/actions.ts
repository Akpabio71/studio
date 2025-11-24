'use server';

import { rateUserResponse } from '@/ai/flows/rate-user-response';
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
    const [feedbackResult, aiResponse] = await Promise.all([
      rateUserResponse({ message, category, role, previousMessage }),
      generateAiResponse({
        userMessage: message,
        previousMessage,
        category,
        role,
      }),
    ]);

    const aiReply = aiResponse.response;
    
    const { rating } = feedbackResult;
    const { grammar, tone, clarity, pragmaticEffectiveness } = rating;
    const avgRating = Math.round((grammar + tone + clarity + pragmaticEffectiveness) / 4);

    return { feedback: feedbackResult, aiReply, avgRating };
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    // Return a default/error structure
    return {
      feedback: {
        rating: { grammar: 0, tone: 0, clarity: 0, pragmaticEffectiveness: 0, briefExplanation: 'An error occurred while generating feedback.' },
        suggestions: { suggestions: ['Sorry, I couldn\'t generate suggestions.'] },
        detailedFeedback: { grammarFeedback: '', toneFeedback: '', clarityFeedback: '', pragmaticFeedback: '', correctedMessage: message }
      },
      aiReply: "I'm having a little trouble understanding. Could you please try rephrasing?",
      avgRating: 0,
    };
  }
}
