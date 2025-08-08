
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hashtag strategies.
 *
 * It takes a primary keyword and location information, and returns three groups of hashtags
 * along with a string of all hashtags ready for copying.
 *
 * @exports {
 *   generateHashtags: (input: GenerateHashtagsInput) => Promise<GenerateHashtagsOutput>;
 *   GenerateHashtagsInput: The input type for the generateHashtags function.
 *   GenerateHashtagsOutput: The return type for the generateHashtags function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  keyword: z.string().describe('A palavra-chave principal do negócio do usuário (ex: "harmonização facial").'),
  locationType: z.enum(['local', 'national']).describe('O tipo de atuação do negócio.'),
  city: z.string().optional().describe('A cidade onde o negócio atua (se local).'),
  state: z.string().optional().describe('O estado onde o negócio atua (se local).'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  strategy: z.string().describe('A estratégia completa de hashtags em formato Markdown, com os 3 grupos.'),
  hashtagsForCopying: z.string().describe('Uma string única com todas as hashtags geradas, separadas por espaço.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

const generateHashtagsPrompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {
    schema: GenerateHashtagsInputSchema,
  },
  output: {
    schema: GenerateHashtagsOutputSchema,
  },
  prompt: `Você é um especialista em alcance orgânico no Instagram. O usuário atua no nicho de **{{{keyword}}}**.
A atuação dele é **{{#if (eq locationType "local")}}local, na cidade de {{{city}}}, {{{state}}}{{else}}nacional (online){{/if}}**.

Sua tarefa é dupla:
1.  Gerar uma estratégia de hashtags em formato Markdown com três grupos distintos e atuais.
2.  Gerar uma string única contendo todas as hashtags geradas, prontas para copiar e colar.

**Instruções para a Estratégia em Markdown (campo 'strategy'):**

**1. Hashtags de Nicho Específico**
(Forneça de 5 a 7 hashtags de cauda longa, muito específicas e atuais para o nicho de {{{keyword}}})

**2. Hashtags de Volume Médio**
(Forneça de 5 a 7 hashtags mais amplas, com maior volume de publicações, mas ainda relevantes para o público-alvo)

**3. Hashtags de Localização**
{{#if (eq locationType "local")}}
(Forneça 5 hashtags de localização estratégica para {{{city}}} e {{{state}}}. Use variações como #{{keyword}}{{{city}}}, #{{{city}}}{{{state}}}, etc.)
{{else}}
(Como o negócio é nacional, foque em hashtags de alcance mais amplo, como #brasil, ou relacionadas a serviços online. Forneça 3 opções.)
{{/if}}

**Instruções para a String de Cópia (campo 'hashtagsForCopying'):**
Junte todas as hashtags geradas acima em uma única string, separadas por um espaço. Ex: "#hashtag1 #hashtag2 #hashtag3"`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await generateHashtagsPrompt(input);
    return output!;
  }
);

export async function generateHashtags(
  input: GenerateHashtagsInput
): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}
