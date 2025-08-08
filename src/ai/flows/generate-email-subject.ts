
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating cold email subject lines.
 *
 * It takes a recipient's job title and an email objective and returns 5 subject line options.
 *
 * @exports {
 *   generateEmailSubject: (input: GenerateEmailSubjectInput) => Promise<GenerateEmailSubjectOutput>;
 *   GenerateEmailSubjectInput: The input type for the generateEmailSubject function.
 *   GenerateEmailSubjectOutput: The return type for the generateEmailSubject function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailSubjectInputSchema = z.object({
  jobTitle: z.string().describe('O cargo do destinatário do e-mail.'),
  objective: z.string().describe('O objetivo do e-mail.'),
});
export type GenerateEmailSubjectInput = z.infer<
  typeof GenerateEmailSubjectInputSchema
>;

const GenerateEmailSubjectOutputSchema = z.object({
  subjects: z
    .array(z.string())
    .length(5)
    .describe('Uma lista com 5 opções de assuntos de e-mail.'),
});
export type GenerateEmailSubjectOutput = z.infer<
  typeof GenerateEmailSubjectOutputSchema
>;

const generateEmailSubjectPrompt = ai.definePrompt({
  name: 'generateEmailSubjectPrompt',
  input: {
    schema: GenerateEmailSubjectInputSchema,
  },
  output: {
    schema: GenerateEmailSubjectOutputSchema,
  },
  prompt: `Você é um especialista em prospecção fria por e-mail. Um usuário precisa enviar um e-mail para um {{{jobTitle}}} com o objetivo de {{{objective}}}.

Gere 5 opções de assuntos (títulos) de e-mail curtos, magnéticos e profissionais que aumentem a taxa de abertura.
Apresente as opções diretamente, sem usar uma lista numerada. Cada assunto deve ser um item no array de strings de saída.`,
});

const generateEmailSubjectFlow = ai.defineFlow(
  {
    name: 'generateEmailSubjectFlow',
    inputSchema: GenerateEmailSubjectInputSchema,
    outputSchema: GenerateEmailSubjectOutputSchema,
  },
  async input => {
    const {output} = await generateEmailSubjectPrompt(input);
    return output!;
  }
);

export async function generateEmailSubject(
  input: GenerateEmailSubjectInput
): Promise<GenerateEmailSubjectOutput> {
  return generateEmailSubjectFlow(input);
}
