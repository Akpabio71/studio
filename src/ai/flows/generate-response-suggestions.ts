'use server';

/**
 * @fileOverview A flow to generate alternative response suggestions for a user's message.
 *
 * - generateResponseSuggestions - A function that generates alternative response suggestions.
 * - GenerateResponseSuggestionsInput - The input type for the generateResponseSuggestions function.
 * - GenerateResponseSuggestionsOutput - The return type for the generateResponseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseSuggestionsInputSchema = z.object({
  previousMessage: z.string().describe("The AI's last message to the user."),
  message: z.string().describe('The user message to generate response suggestions for.'),
  category: z.string().describe('The category of the conversation.'),
  role: z.string().describe('The sub-role within the category.'),
});
export type GenerateResponseSuggestionsInput = z.infer<
  typeof GenerateResponseSuggestionsInputSchema
>;

const GenerateResponseSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of alternative response suggestions.'),
});
export type GenerateResponseSuggestionsOutput = z.infer<
  typeof GenerateResponseSuggestionsOutputSchema
>;

export async function generateResponseSuggestions(
  input: GenerateResponseSuggestionsInput
): Promise<GenerateResponseSuggestionsOutput> {
  return generateResponseSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponseSuggestionsPrompt',
  input: {schema: GenerateResponseSuggestionsInputSchema},
  output: {schema: GenerateResponseSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to help users improve their communication.
The user is practicing their communication skills in a specific scenario.

Conversation Category: {{{category}}}
Conversation Role: {{{role}}}

The AI said:
"{{{previousMessage}}}"

The User replied:
"{{{message}}}"

Your task is to provide three better response suggestions for the user. These suggestions should be appropriate and natural replies to the AI's message, guiding the user on how they could have responded more effectively. The user's original reply might be good, or it might be irrelevant. Your suggestions should always be a proper response to the AI's message.

Format the suggestions as a JSON array of strings.
  `, 
});

const generateResponseSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateResponseSuggestionsFlow',
    inputSchema: GenerateResponseSuggestionsInputSchema,
    outputSchema: GenerateResponseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
