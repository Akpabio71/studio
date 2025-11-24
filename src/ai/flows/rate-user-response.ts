'use server';

/**
 * @fileOverview AI flow to rate user responses based on grammar, tone, clarity, and pragmatic effectiveness.
 *
 * Exports:
 *   - rateUserResponse: The main function to rate a user's response.
 *   - RateUserResponseInput: The input type for the rateUserResponse function.
 *   - RateUserResponseOutput: The output type for the rateUserResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RateUserResponseInputSchema = z.object({
  message: z.string().describe('The user message to be rated.'),
  category: z.string().describe('The category of the conversation (e.g., Business, Casual).'),
  role: z.string().describe('The specific role-play scenario within the category (e.g., Sales Pitch).'),
  previousMessage: z.string().describe("The AI's last message to the user."),
});

export type RateUserResponseInput = z.infer<typeof RateUserResponseInputSchema>;

const RateUserResponseOutputSchema = z.object({
  rating: z.object({
    grammar: z.number().min(0).max(100).describe('Rating (0-100) for grammar accuracy.'),
    tone: z.number().min(0).max(100).describe('Rating (0-100) for appropriateness of tone.'),
    clarity: z.number().min(0).max(100).describe('Rating (0-100) for clarity and conciseness.'),
    pragmaticEffectiveness: z
      .number().min(0).max(100)
      .describe('Rating (0-100) for how effectively the message achieves its intended purpose.'),
    briefExplanation: z.string().optional().describe('A brief (1-2 sentence) explanation of the overall ratings.'),
  }),
  suggestions: z.object({
    suggestions: z.array(z.string()).length(3).describe('An array of three alternative response suggestions for the user.'),
  }),
  detailedFeedback: z.object({
    grammarFeedback: z.string().describe('Detailed feedback on grammar, including corrections.'),
    toneFeedback: z.string().describe('Detailed feedback on the tone of the message.'),
    clarityFeedback: z.string().describe('Detailed feedback on the clarity of the message.'),
    pragmaticFeedback: z.string().describe('Detailed feedback on the pragmatic effectiveness of the message.'),
    correctedMessage: z.string().describe('The corrected version of the user\'s message.'),
  })
});

export type RateUserResponseOutput = z.infer<typeof RateUserResponseOutputSchema>;

export async function rateUserResponse(input: RateUserResponseInput): Promise<RateUserResponseOutput> {
  return rateUserResponseFlow(input);
}

const rateUserResponsePrompt = ai.definePrompt({
  name: 'rateUserResponsePrompt',
  input: {schema: RateUserResponseInputSchema},
  output: {schema: RateUserResponseOutputSchema},
  prompt: `You are an AI assistant designed to evaluate user messages and provide comprehensive feedback to help them improve their communication skills.

  The user is practicing in the following scenario:
  - Conversation Category: "{{category}}"
  - Conversation Role: "{{role}}"
  
  The last message from the AI was:
  "{{{previousMessage}}}"

  The user replied with:
  "{{{message}}}"

  Your task is to perform the following actions:
  1.  **Rate the user's message**: On a scale of 0-100, rate it for grammar, tone, clarity, and pragmatic effectiveness. Provide a brief, one-sentence overall explanation for your ratings.
  2.  **Provide detailed feedback**: Explain the ratings for each category (grammar, tone, clarity, pragmatics) and provide a fully corrected version of the user's message.
  3.  **Generate response suggestions**: Provide exactly three alternative suggestions for how the user could have replied to the AI's last message. These suggestions should be natural and effective within the conversational context.

  Please provide the full analysis in a single JSON object matching the required output schema.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const rateUserResponseFlow = ai.defineFlow(
  {
    name: 'rateUserResponseFlow',
    inputSchema: RateUserResponseInputSchema,
    outputSchema: RateUserResponseOutputSchema,
  },
  async input => {
    const {output} = await rateUserResponsePrompt(input);
    return output!;
  }
);
