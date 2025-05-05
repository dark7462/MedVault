// Summarize medical history.
'use server';
/**
 * @fileOverview Summarizes the patient's medical history.
 *
 * - summarizeMedicalHistory - A function that handles the summarization of medical history.
 * - SummarizeMedicalHistoryInput - The input type for the summarizeMedicalHistory function.
 * - SummarizeMedicalHistoryOutput - The return type for the summarizeMedicalHistory function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeMedicalHistoryInputSchema = z.object({
  medicalHistory: z.string().describe('The complete medical history of the patient.'),
});
export type SummarizeMedicalHistoryInput = z.infer<typeof SummarizeMedicalHistoryInputSchema>;

const SummarizeMedicalHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient medical history.'),
});
export type SummarizeMedicalHistoryOutput = z.infer<typeof SummarizeMedicalHistoryOutputSchema>;

export async function summarizeMedicalHistory(input: SummarizeMedicalHistoryInput): Promise<SummarizeMedicalHistoryOutput> {
  return summarizeMedicalHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalHistoryPrompt',
  input: {
    schema: z.object({
      medicalHistory: z.string().describe('The complete medical history of the patient.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the patient medical history.'),
    }),
  },
  prompt: `You are a medical professional summarizing a patient\'s medical history. Provide a concise summary of the following medical history:\n\n{{{medicalHistory}}}`, 
});

const summarizeMedicalHistoryFlow = ai.defineFlow<
  typeof SummarizeMedicalHistoryInputSchema,
  typeof SummarizeMedicalHistoryOutputSchema
>({
  name: 'summarizeMedicalHistoryFlow',
  inputSchema: SummarizeMedicalHistoryInputSchema,
  outputSchema: SummarizeMedicalHistoryOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
