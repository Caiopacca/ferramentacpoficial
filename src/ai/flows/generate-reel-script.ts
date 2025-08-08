
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
  duration: z.number().describe('A duração do vídeo em segundos (15 ou 30).'),
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

const PromptInputSchema = GenerateReelScriptInputSchema.extend({
    developmentTime: z.number(),
});

const generateReelScriptPrompt = ai.definePrompt({
  name: 'generateReelScriptPrompt',
  input: {
    schema: PromptInputSchema,
  },
  output: {
    schema: GenerateReelScriptOutputSchema,
  },
  prompt: `Você é um roteirista de vídeos curtos especialista em viralização no Instagram. Crie um roteiro magnético e atual de {{{duration}}} segundos para um Reel do nicho de **{{{niche}}}** sobre o tema **{{{theme}}}**.

O roteiro deve ser prático, pronto para gravar e usar as melhores práticas de 2024 para retenção.

Estruture a resposta em Markdown, usando os seguintes títulos exatamente como estão abaixo:

**Gancho Viral (0-3s):**
(Texto ou ação visual para prender a atenção imediatamente. Pense em uma frase polêmica, uma pergunta intrigante ou uma cena visualmente chocante.)

**Desenvolvimento Rápido (4-{{{developmentTime}}}s):**
(Conteúdo principal, explicado de forma clara e rápida. Use transições dinâmicas se for um vídeo com cenas. Se for um vídeo falado, use frases curtas e diretas.)

**CTA - Chamada para Ação (Últimos 3s):**
(O que o usuário deve fazer em seguida. O CTA deve ser claro, direto e de baixa fricção. Ex: "Me segue para mais dicas" ou "Comente 'EU QUERO'")

**Sugestão de Áudio em Alta:**
(Sugira um tipo de áudio ou música que combine com o roteiro e que esteja em alta no Instagram. Ex: "Use um áudio de tutorial que esteja em alta" ou "Música eletrônica animada de alguma trend recente.")`,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async (input) => {
    const developmentTime = input.duration === 15 ? 12 : 25;
    
    const {output} = await generateReelScriptPrompt({
        ...input,
        developmentTime,
    });
    return output!;
  }
);

export async function generateReelScript(
  input: GenerateReelScriptInput
): Promise<GenerateReelScriptOutput> {
  return generateReelScriptFlow(input);
}
