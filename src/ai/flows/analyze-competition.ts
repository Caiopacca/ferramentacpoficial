
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing Instagram competition.
 *
 * The flow takes a user's profile and up to two competitor profiles and returns a comparative analysis.
 *
 * @exports {
 *   analyzeCompetition: (input: AnalyzeCompetitionInput) => Promise<AnalyzeCompetitionOutput>;
 *   AnalyzeCompetitionInput: The input type for the analyzeCompetition function.
 *   AnalyzeCompetitionOutput: The return type for the analyzeCompetition function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCompetitionInputSchema = z.object({
  userProfile: z.string().describe('O @ do perfil do usuário no Instagram.'),
  competitorProfile1: z.string().describe('O @ do primeiro concorrente no Instagram.'),
  competitorProfile2: z.string().optional().describe('O @ do segundo concorrente no Instagram (opcional).'),
});
export type AnalyzeCompetitionInput = z.infer<
  typeof AnalyzeCompetitionInputSchema
>;

const AnalyzeCompetitionOutputSchema = z.object({
  analysis: z.string().describe('Uma análise comparativa em formato Markdown.'),
});
export type AnalyzeCompetitionOutput = z.infer<
  typeof AnalyzeCompetitionOutputSchema
>;

const analyzeCompetitionPrompt = ai.definePrompt({
  name: 'analyzeCompetitionPrompt',
  input: {
    schema: AnalyzeCompetitionInputSchema,
  },
  output: {
    schema: AnalyzeCompetitionOutputSchema,
  },
  prompt: `Você é um analista de inteligência competitiva. Compare o perfil do usuário {{{userProfile}}} com o(s) perfil(s) do(s) concorrente(s) {{{competitorProfile1}}}{{#if competitorProfile2}} e {{{competitorProfile2}}}{{/if}}.

Apresente uma tabela simples em Markdown com uma análise comparativa dos seguintes pontos:
- **Força da Bio:** Analise a clareza, a proposta de valor e se há uma chamada para ação (CTA) eficaz.
- **SEO no Nome/Usuário:** Avalie se o nome de usuário e o nome do perfil são otimizados para buscas (contêm palavras-chave relevantes para o nicho).
- **Consistência Visual:** Com base em uma análise conceitual, descreva a consistência da identidade visual (cores, fontes, estilo de imagem).

Termine com um insight estratégico principal, destacando uma oportunidade clara que o usuário pode explorar para superar o(s) concorrente(s). Seja direto, analítico e acionável.`,
});

const analyzeCompetitionFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitionFlow',
    inputSchema: AnalyzeCompetitionInputSchema,
    outputSchema: AnalyzeCompetitionOutputSchema,
  },
  async input => {
    const {output} = await analyzeCompetitionPrompt(input);
    return output!;
  }
);

export async function analyzeCompetition(
  input: AnalyzeCompetitionInput
): Promise<AnalyzeCompetitionOutput> {
  return analyzeCompetitionFlow(input);
}
