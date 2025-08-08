
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating 15-second Reel scripts.
 *
 * It takes a niche and a theme and returns a structured script with hook, development, CTA, and audio suggestion.
 *
 * @exports {
 *   generateReelScript: (input: GenerateReelScriptInput) => Promise<GenerateReelScriptOutput>;
 *   GenerateReelScriptInput: The input type for the generateReelScript function.
 *   GenerateReelScriptOutput: The return type for the generateReelScript function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReelScriptInputSchema = z.object({
  niche: z.string().describe('O nicho de atuação do usuário (ex: Nutrição, Finanças).'),
  theme: z.string().describe('O tema do vídeo (ex: Dica Rápida, Antes e Depois, Mito vs. Verdade).'),
});
export type GenerateReelScriptInput = z.infer<
  typeof GenerateReelScriptInputSchema
>;

const GenerateReelScriptOutputSchema = z.object({
  script: z.string().describe('O roteiro completo em formato Markdown, incluindo Gancho, Desenvolvimento, CTA e Sugestão de Áudio.'),
});
export type GenerateReelScriptOutput = z.infer<
  typeof GenerateReelScriptOutputSchema
>;

const generateReelScriptPrompt = ai.definePrompt({
  name: 'generateReelScriptPrompt',
  input: {
    schema: GenerateReelScriptInputSchema,
  },
  output: {
    schema: GenerateReelScriptOutputSchema,
  },
  prompt: `Você é um roteirista de vídeos curtos especialista em viralização no Instagram. Crie um roteiro de 15 segundos para um Reel do nicho de **{{{niche}}}** sobre o tema **{{{theme}}}**.

Estruture a resposta em Markdown, usando os seguintes títulos exatamente como estão abaixo:

**Gancho (0-3s):**
(Texto ou ação visual para prender a atenção imediatamente)

**Desenvolvimento (4-12s):**
(Conteúdo principal, explicado de forma clara e rápida)

**CTA - Chamada para Ação (13-15s):**
(O que o usuário deve fazer em seguida. Ex: "Me segue para mais dicas" ou "Comente 'EU QUERO'")

**Sugestão de Áudio:**
(Sugira um tipo de áudio ou música que combine com o roteiro. Ex: "Música eletrônica animada" ou "Áudio em alta de tutorial")`,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async input => {
    const {output} = await generateReelScriptPrompt(input);
    return output!;
  }
);

export async function generateReelScript(
  input: GenerateReelScriptInput
): Promise<GenerateReelScriptOutput> {
  return generateReelScriptFlow(input);
}
