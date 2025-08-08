
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hashtag strategies.
 *
 * It takes a primary keyword and returns three groups of hashtags.
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
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  strategy: z.string().describe('A estratégia completa de hashtags em formato Markdown, com os 3 grupos.'),
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

Crie uma estratégia de hashtags para ele copiar e colar. Apresente a resposta em formato Markdown com três grupos distintos e rotulados, exatamente como abaixo:

**1. Hashtags de Nicho Específico**
(Forneça de 5 a 7 hashtags de cauda longa, muito específicas para o nicho)

**2. Hashtags de Volume Médio**
(Forneça de 5 a 7 hashtags mais amplas, com maior volume de publicações, mas ainda relevantes)

**3. Hashtags de Localização**
(Forneça 3 hashtags de localização, se a palavra-chave sugerir um negócio local. Se não, informe que não se aplica.)`,
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
