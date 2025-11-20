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
});

export type RateUserResponseInput = z.infer<typeof RateUserResponseInputSchema>;

const RateUserResponseOutputSchema = z.object({
  grammar: z.number().describe('Rating (0-100) for grammar accuracy.'),
  tone: z.number().describe('Rating (0-100) for appropriateness of tone.'),
  clarity: z.number().describe('Rating (0-100) for clarity and conciseness.'),
  pragmaticEffectiveness: z
    .number()
    .describe('Rating (0-100) for how effectively the message achieves its intended purpose.'),
  detailedFeedback: z.string().optional().describe('Detailed feedback and corrections.'),
});

export type RateUserResponseOutput = z.infer<typeof RateUserResponseOutputSchema>;

export async function rateUserResponse(input: RateUserResponseInput): Promise<RateUserResponseOutput> {
  return rateUserResponseFlow(input);
}

const rateUserResponsePrompt = ai.definePrompt({
  name: 'rateUserResponsePrompt',
  input: {schema: RateUserResponseInputSchema},
  output: {schema: RateUserResponseOutputSchema},
  prompt: `You are an AI assistant designed to evaluate user messages and provide feedback.

  Rate the following message on a scale of 0-100 for grammar, tone, clarity, and pragmatic effectiveness, considering that the conversation category is "{{category}}".

  Message: {{{message}}}

  Provide detailed feedback with corrections, and generate an explanation for each of the rating scores assigned to grammar, tone, clarity, and pragmaticEffectiveness.

  Ensure that the output is in JSON format.  The "detailedFeedback" should include specific suggestions for improvement and be limited to 2-3 sentences.`,config: {
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
