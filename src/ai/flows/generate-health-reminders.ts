// 'use server'
'use server';

/**
 * @fileOverview Generates health reminders based on a patient's medical documents.
 *
 * - generateHealthReminders - A function that generates health reminders.
 * - GenerateHealthRemindersInput - The input type for the generateHealthReminders function.
 * - GenerateHealthRemindersOutput - The return type for the generateHealthReminders function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateHealthRemindersInputSchema = z.object({
  medicalDocuments: z
    .string()
    .describe(
      'A string containing the patient medical documents, concatenated and separated by newlines.'
    ),
});
export type GenerateHealthRemindersInput = z.infer<typeof GenerateHealthRemindersInputSchema>;

const GenerateHealthRemindersOutputSchema = z.object({
  reminders: z
    .string()
    .describe('A list of health reminders, each on a new line.'),
});
export type GenerateHealthRemindersOutput = z.infer<typeof GenerateHealthRemindersOutputSchema>;

export async function generateHealthReminders(
  input: GenerateHealthRemindersInput
): Promise<GenerateHealthRemindersOutput> {
  return generateHealthRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthRemindersPrompt',
  input: {
    schema: z.object({
      medicalDocuments: z
        .string()
        .describe(
          'A string containing the patient medical documents, concatenated and separated by newlines.'
        ),
    }),
  },
  output: {
    schema: z.object({
      reminders: z
        .string()
        .describe('A list of health reminders, each on a new line.'),
    }),
  },
  prompt: `You are a helpful AI assistant that generates health reminders for patients based on their medical documents.

  Given the following medical documents, generate a list of health reminders, each on a new line.

  Medical Documents:
  {{medicalDocuments}}
  `,
});

const generateHealthRemindersFlow = ai.defineFlow<
  typeof GenerateHealthRemindersInputSchema,
  typeof GenerateHealthRemindersOutputSchema
>(
  {
    name: 'generateHealthRemindersFlow',
    inputSchema: GenerateHealthRemindersInputSchema,
    outputSchema: GenerateHealthRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
