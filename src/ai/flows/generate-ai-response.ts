'use server';

/**
 * @fileOverview A flow to generate a contextual AI response in a conversation.
 *
 * - generateAiResponse - Generates a contextual AI response.
 * - GenerateAiResponseInput - The input type for the generateAiResponse function.
 * - GenerateAiResponseOutput - The return type for the generateAiResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiResponseInputSchema = z.object({
  userMessage: z.string().describe("The user's most recent message."),
  previousMessage: z.string().describe("The AI's last message to the user."),
  category: z.string().describe('The high-level category of the conversation (e.g., Business).'),
  role: z.string().describe('The specific role-play scenario within the category (e.g., Sales Pitch).'),
});
export type GenerateAiResponseInput = z.infer<typeof GenerateAiResponseInputSchema>;

const GenerateAiResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user.'),
});
export type GenerateAiResponseOutput = z.infer<typeof GenerateAiResponseOutputSchema>;


export async function generateAiResponse(input: GenerateAiResponseInput): Promise<GenerateAiResponseOutput> {
    return generateAiResponseFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateAiResponsePrompt',
  input: {schema: GenerateAiResponseInputSchema},
  output: {schema: GenerateAiResponseOutputSchema},
  prompt: `You are an AI assistant facilitating a role-playing conversation. Your goal is to keep the conversation flowing naturally based on the scenario.

Conversation Scenario:
- Category: {{{category}}}
- Role: {{{role}}}

Conversation History:
- You said: "{{{previousMessage}}}"
- The user replied: "{{{userMessage}}}"

Your task is to generate a natural, in-character response that continues the conversation. Your response should be directly related to what the user said. Do not act as a language tutor; just play your role.
`,
});


const generateAiResponseFlow = ai.defineFlow(
    {
        name: 'generateAiResponseFlow',
        inputSchema: GenerateAiResponseInputSchema,
        outputSchema: GenerateAiResponseOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
