'use server';

/**
 * @fileOverview A flow that provides detailed feedback on a user's message, including corrections and explanations.
 *
 * - provideDetailedFeedback - A function that handles the process of providing detailed feedback.
 * - ProvideDetailedFeedbackInput - The input type for the provideDetailedFeedback function.
 * - ProvideDetailedFeedbackOutput - The return type for the provideDetailedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideDetailedFeedbackInputSchema = z.object({
  message: z.string().describe('The user message to provide feedback on.'),
  category: z.string().describe('The category of the conversation (e.g., Business, Casual).'),
});
export type ProvideDetailedFeedbackInput = z.infer<typeof ProvideDetailedFeedbackInputSchema>;

const ProvideDetailedFeedbackOutputSchema = z.object({
  grammarFeedback: z.string().describe('Detailed feedback on grammar, including corrections.'),
  toneFeedback: z.string().describe('Detailed feedback on the tone of the message.'),
  clarityFeedback: z.string().describe('Detailed feedback on the clarity of the message.'),
  pragmaticFeedback: z.string().describe('Detailed feedback on the pragmatic effectiveness of the message.'),
  correctedMessage: z.string().describe('The corrected version of the message.'),
});
export type ProvideDetailedFeedbackOutput = z.infer<typeof ProvideDetailedFeedbackOutputSchema>;

export async function provideDetailedFeedback(input: ProvideDetailedFeedbackInput): Promise<ProvideDetailedFeedbackOutput> {
  return provideDetailedFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideDetailedFeedbackPrompt',
  input: {schema: ProvideDetailedFeedbackInputSchema},
  output: {schema: ProvideDetailedFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides detailed feedback on user messages.

You will receive a user message and the category of the conversation.
Your task is to provide feedback on the grammar, tone, clarity, and pragmatic effectiveness of the message.
Also, provide a corrected version of the message.

Message: {{{message}}}
Category: {{{category}}}

Provide detailed feedback in the following format:
{
  "grammarFeedback": "Detailed feedback on grammar, including corrections.",
  "toneFeedback": "Detailed feedback on the tone of the message.",
  "clarityFeedback": "Detailed feedback on the clarity of the message.",
  "pragmaticFeedback": "Detailed feedback on the pragmatic effectiveness of the message.",
  "correctedMessage": "The corrected version of the message."
}
`,
});

const provideDetailedFeedbackFlow = ai.defineFlow(
  {
    name: 'provideDetailedFeedbackFlow',
    inputSchema: ProvideDetailedFeedbackInputSchema,
    outputSchema: ProvideDetailedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
