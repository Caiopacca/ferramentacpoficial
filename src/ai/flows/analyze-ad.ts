
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing ad campaigns.
 *
 * It takes a target audience, ad copy, and image/video description and returns an alignment score and analysis.
 *
 * @exports {
 *   analyzeAd: (input: AnalyzeAdInput) => Promise<AnalyzeAdOutput>;
 *   AnalyzeAdInput: The input type for the analyzeAd function.
 *   AnalyzeAdOutput: The return type for the analyzeAd function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAdInputSchema = z.object({
  targetAudience: z.string().describe('O público-alvo do anúncio.'),
  adCopy: z.string().describe('O texto do anúncio.'),
  imageDescription: z.string().describe('A descrição da imagem ou vídeo do anúncio.'),
});
export type AnalyzeAdInput = z.infer<typeof AnalyzeAdInputSchema>;

const AnalyzeAdOutputSchema = z.object({
  analysis: z.string().describe('A "Nota de Alinhamento Estratégico" e a análise em formato Markdown.'),
});
export type AnalyzeAdOutput = z.infer<typeof AnalyzeAdOutputSchema>;

const analyzeAdPrompt = ai.definePrompt({
  name: 'analyzeAdPrompt',
  input: {
    schema: AnalyzeAdInputSchema,
  },
  output: {
    schema: AnalyzeAdOutputSchema,
  },
  prompt: `Você é um estrategista de mídia paga sênior. Um usuário quer avaliar a coerência de um anúncio antes de publicá-lo. Os dados são:

- **Público-alvo:** {{{targetAudience}}}
- **Texto do anúncio:** {{{adCopy}}}
- **Descrição da imagem/vídeo:** {{{imageDescription}}}

Forneça sua análise no seguinte formato Markdown:

**Nota de Alinhamento Estratégico:** (sua nota de 0 a 100 aqui)

**Análise:**
(Um parágrafo curto apontando o ponto mais forte da combinação e um ponto de melhoria para aumentar a conexão com o público-alvo.)`,
});

const analyzeAdFlow = ai.defineFlow(
  {
    name: 'analyzeAdFlow',
    inputSchema: AnalyzeAdInputSchema,
    outputSchema: AnalyzeAdOutputSchema,
  },
  async input => {
    const {output} = await analyzeAdPrompt(input);
    return output!;
  }
);

export async function analyzeAd(
  input: AnalyzeAdInput
): Promise<AnalyzeAdOutput> {
  return analyzeAdFlow(input);
}
