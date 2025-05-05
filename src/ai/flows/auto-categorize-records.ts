'use server';

/**
 * @fileOverview Automatically categorizes medical records using AI.
 *
 * - autoCategorizeRecord - A function that handles the auto categorization process.
 * - AutoCategorizeRecordInput - The input type for the autoCategorizeRecord function.
 * - AutoCategorizeRecordOutput - The return type for the autoCategorizeRecord function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AutoCategorizeRecordInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the medical record document.'),
});
export type AutoCategorizeRecordInput = z.infer<typeof AutoCategorizeRecordInputSchema>;

const AutoCategorizeRecordOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the medical record document (e.g., Lab Report, Prescription, Scan).'
    ),
  doctorName: z.string().describe('The name of the doctor mentioned in the document.'),
  dateOfIssue: z.string().describe('The date the document was issued.'),
  hospitalClinicName: z.string().describe('The name of the hospital or clinic.'),
});
export type AutoCategorizeRecordOutput = z.infer<typeof AutoCategorizeRecordOutputSchema>;

export async function autoCategorizeRecord(
  input: AutoCategorizeRecordInput
): Promise<AutoCategorizeRecordOutput> {
  return autoCategorizeRecordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizeRecordPrompt',
  input: {
    schema: z.object({
      documentText: z
        .string()
        .describe('The text content of the medical record document.'),
    }),
  },
  output: {
    schema: z.object({
      category: z
        .string()
        .describe(
          'The category of the medical record document (e.g., Lab Report, Prescription, Scan).'
        ),
      doctorName: z.string().describe('The name of the doctor mentioned in the document.'),
      dateOfIssue: z.string().describe('The date the document was issued.'),
      hospitalClinicName: z.string().describe('The name of the hospital or clinic.'),
    }),
  },
  prompt: `You are an AI assistant specializing in categorizing medical records. Analyze the provided document text and extract the following information:\n\n- Category: Determine the type of medical record document (e.g., Lab Report, Prescription, Scan, Vaccination Record)..\n- Doctor's Name: Extract the name of the doctor mentioned in the document.\n- Date of Issue: Identify the date the document was issued. If not explicitly mentioned, provide your best estimate.\n- Hospital/Clinic Name: Identify the name of the hospital or clinic that issued the document.\n\nDocument Text: {{{documentText}}}`,
});

const autoCategorizeRecordFlow = ai.defineFlow<
  typeof AutoCategorizeRecordInputSchema,
  typeof AutoCategorizeRecordOutputSchema
>({
  name: 'autoCategorizeRecordFlow',
  inputSchema: AutoCategorizeRecordInputSchema,
  outputSchema: AutoCategorizeRecordOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
