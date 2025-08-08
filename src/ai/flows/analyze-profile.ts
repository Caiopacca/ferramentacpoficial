
'use server';

/**
 * @fileOverview This file defines a Genkit flow for diagnosing Instagram profile performance.
 *
 * It takes a username and provides a score and improvement points.
 *
 * @exports {
 *   analyzeProfile: (input: AnalyzeProfileInput) => Promise<AnalyzeProfileOutput>;
 *   AnalyzeProfileInput: The input type for the analyzeProfile function.
 *   AnalyzeProfileOutput: The return type for the analyzeProfile function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProfileInputSchema = z.object({
  username: z.string().describe('O @ do perfil do Instagram a ser analisado.'),
});
export type AnalyzeProfileInput = z.infer<typeof AnalyzeProfileInputSchema>;

const AnalyzeProfileOutputSchema = z.object({
  analysis: z.string().describe('O diagnóstico completo em formato Markdown.'),
});
export type AnalyzeProfileOutput = z.infer<typeof AnalyzeProfileOutputSchema>;

const analyzeProfilePrompt = ai.definePrompt({
  name: 'analyzeProfilePrompt',
  input: {
    schema: AnalyzeProfileInputSchema,
  },
  output: {
    schema: AnalyzeProfileOutputSchema,
  },
  prompt: `Você é um especialista em marketing digital e otimização de perfis do Instagram. Analise o perfil com o nome de usuário {{{username}}} e forneça um diagnóstico completo.

Seu output deve ser em formato Markdown, com os seguintes elementos:

**1. Nota Geral de Performance**
- Atribua uma nota geral de 0 a 100 para o perfil, representando a saúde e otimização geral.

**2. Diagnóstico por Critérios**
Analise cada um dos pontos abaixo. Para cada critério, forneça:
- Uma **nota de 0 a 10**.
- Uma **análise curta** explicando a nota.
- Uma **recomendação prática e acionável** de melhoria.

Os critérios são:
- **SEO do Nome e Usuário:** O nome de usuário (@) e o nome do perfil estão otimizados com palavras-chave relevantes para o nicho? É fácil encontrar o perfil?
- **Força da Biografia:** A bio é clara? Apresenta a proposta de valor? Contém uma Chamada para Ação (CTA) forte?
- **Qualidade do Link na Bio:** O link direciona para um local estratégico (ex: Linktree, site, WhatsApp)? A página de destino é otimizada?
- **Consistência Visual do Feed:** As últimas 9 postagens seguem uma identidade visual coesa (cores, fontes, estilo)? O feed é visualmente atraente?
- **Estrutura dos Destaques:** Os destaques estão organizados, com capas padronizadas e títulos estratégicos (ex: "Sobre mim", "Serviços", "Clientes")?

Use um tom profissional e de diagnóstico, como se estivesse apresentando um relatório para um cliente.`,
});

const analyzeProfileFlow = ai.defineFlow(
  {
    name: 'analyzeProfileFlow',
    inputSchema: AnalyzeProfileInputSchema,
    outputSchema: AnalyzeProfileOutputSchema,
  },
  async input => {
    const {output} = await analyzeProfilePrompt(input);
    return output!;
  }
);

export async function analyzeProfile(
  input: AnalyzeProfileInput
): Promise<AnalyzeProfileOutput> {
  return analyzeProfileFlow(input);
}
