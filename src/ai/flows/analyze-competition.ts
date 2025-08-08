
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
  prompt: `Você é um especialista em análise de marketing para Instagram. Sua tarefa é fazer uma análise competitiva detalhada e acionável.

**Perfis para Análise:**
- **Usuário:** {{{userProfile}}}
- **Concorrente 1:** {{{competitorProfile1}}}
{{#if competitorProfile2}}- **Concorrente 2:** {{{competitorProfile2}}}{{/if}}

**Estrutura da Análise:**

**1. Tabela Comparativa Geral**
Crie uma tabela em Markdown comparando os perfis nos seguintes quesitos. Seja conciso e direto na tabela.
| Critério | {{{userProfile}}} | {{{competitorProfile1}}} |{{#if competitorProfile2}} {{{competitorProfile2}}} |{{/if}}
| :--- | :--- | :--- |{{#if competitorProfile2}} :--- |{{/if}}
| **Força da Bio** (Clareza, proposta de valor, CTA) | (Sua avaliação aqui) | (Sua avaliação aqui) |{{#if competitorProfile2}} (Sua avaliação aqui) |{{/if}}
| **SEO no Nome/Usuário** (Uso de palavras-chave) | (Sua avaliação aqui) | (Sua avaliação aqui) |{{#if competitorProfile2}} (Sua avaliação aqui) |{{/if}}
| **Consistência Visual** (Conceitual: cores, fontes, estilo) | (Sua avaliação aqui) | (Sua avaliação aqui) |{{#if competitorProfile2}} (Sua avaliação aqui) |{{/if}}

**2. Análise Detalhada e Insights**
Agora, para cada perfil, escreva uma breve análise dos pontos fortes e fracos com base nos critérios da tabela.

- **Análise de {{{userProfile}}}:**
  - **Pontos Fortes:** (Liste 1-2 pontos positivos)
  - **Pontos a Melhorar:** (Liste 1-2 pontos de melhoria)

- **Análise de {{{competitorProfile1}}}:**
  - **Pontos Fortes:** (Liste 1-2 pontos positivos)
  - **Pontos Fracos:** (Liste 1-2 pontos fracos que o usuário pode explorar)

{{#if competitorProfile2}}
- **Análise de {{{competitorProfile2}}}:**
  - **Pontos Fortes:** (Liste 1-2 pontos positivos)
  - **Pontos Fracos:** (Liste 1-2 pontos fracos que o usuário pode explorar)
{{/if}}

**3. Insight Estratégico Principal**
Com base em toda a análise, forneça **um insight estratégico principal e acionável** para que o perfil {{{userProfile}}} possa se diferenciar e superar a concorrência. Destaque a oportunidade mais clara e imediata.`,
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
