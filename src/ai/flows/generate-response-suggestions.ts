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
  message: z.string().describe('The user message to generate response suggestions for.'),
  category: z.string().describe('The category of the conversation.'),
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
  prompt: `You are an AI assistant designed to provide alternative response suggestions for user messages in various conversation categories.

  Given the following user message and conversation category, generate at least three alternative response suggestions.

  User Message: {{{message}}}
  Conversation Category: {{{category}}}

  Ensure the suggestions are optimized for grammar, tone, clarity, and pragmatic effectiveness.
  Format the suggestions as a JSON array of strings.
  `, // Ensure valid JSON format
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
