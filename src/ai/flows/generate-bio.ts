
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating professional Instagram bios.
 *
 * The flow takes what the user does, who they help, and the main result they generate,
 * and returns three optimized bio options.
 *
 * @exports {
 *   generateBio: (input: GenerateBioInput) => Promise<GenerateBioOutput>;
 *   GenerateBioInput: The input type for the generateBio function.
 *   GenerateBioOutput: The return type for the generateBio function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBioInputSchema = z.object({
  whatYouDo: z.string().describe('O que o profissional faz.'),
  whoYouHelp: z.string().describe('Para quem o profissional ajuda.'),
  mainResult: z.string().describe('O principal resultado que o profissional gera.'),
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  bios: z
    .array(z.string())
    .length(3)
    .describe(
      'Uma lista com 3 opções de biografias completas para o Instagram.'
    ),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

const generateBioPrompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: {
    schema: GenerateBioInputSchema,
  },
  output: {
    schema: GenerateBioOutputSchema,
  },
  prompt: `Você é um copywriter especialista em criar biografias de Instagram que convertem. Um profissional respondeu às seguintes perguntas:

O que ele faz: {{{whatYouDo}}}
Para quem ele ajuda: {{{whoYouHelp}}}
Principal resultado que gera: {{{mainResult}}}

Com base nisso, crie 3 opções de bios completas, prontas para copiar e colar, incluindo emojis estratégicos e uma chamada para ação clara para o link.
Apresente as bios diretamente, sem usar 'Opção 1', 'Opção 2' ou 'Opção 3' como prefixo. Cada bio deve ser um item no array de strings de saída.`,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const {output} = await generateBioPrompt(input);
    return output!;
  }
);

export async function generateBio(
  input: GenerateBioInput
): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}
