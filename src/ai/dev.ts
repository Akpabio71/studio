import { config } from 'dotenv';
config();

import '@/ai/flows/generate-response-suggestions.ts';
import '@/ai/flows/provide-detailed-feedback.ts';
import '@/ai/flows/rate-user-response.ts';
import '@/ai/flows/generate-ai-response.ts';
