
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
  prompt: `Você é um especialista sênior em marketing e otimização de perfis do Instagram. Sua tarefa é realizar um diagnóstico detalhado e profissional do perfil {{{username}}}.

Seu output deve ser um relatório completo em formato Markdown. Siga rigorosamente a estrutura abaixo:

# Diagnóstico de Perfil: {{{username}}}

**Nota Geral de Performance: (Sua nota de 0 a 100 aqui)**
*Uma nota geral que representa a saúde e otimização do perfil. Considere o impacto combinado de todos os critérios abaixo.*

## Resumo Executivo
*Um parágrafo curto e direto, destacando o ponto mais forte do perfil e a oportunidade de melhoria mais crítica e de maior impacto.*

---

## Diagnóstico Detalhado por Critérios

Para cada um dos 5 critérios abaixo, forneça:
1.  **Uma nota de 0 a 10**.
2.  **Uma análise objetiva** explicando a nota (o que está bom e o que está ruim).
3.  **Uma recomendação clara e acionável** sobre como melhorar.

### 1. SEO (Nome de Usuário e Nome de Perfil)
- **Nota (0-10):**
- **Análise:** (Avalie se o nome de usuário e o nome do perfil usam palavras-chave relevantes para o nicho, facilitando a busca e a identificação).
- **Recomendação:** (Sugira como otimizar o nome e o @ para melhorar a encontrabilidade).

### 2. Força da Biografia
- **Nota (0-10):**
- **Análise:** (Avalie a clareza da proposta de valor, a força da chamada para ação (CTA) e se a bio comunica eficazmente o que o perfil oferece).
- **Recomendação:** (Dê uma sugestão prática para reescrever ou ajustar a bio para aumentar a conversão).

### 3. Qualidade do Link da Bio
- **Nota (0-10):**
- **Análise:** (Avalie se o link é estratégico, como Linktree, site ou WhatsApp, e se a página de destino está otimizada e alinhada com a promessa da bio).
- **Recomendação:** (Sugira melhorias para o link ou para a página de destino para maximizar os cliques).

### 4. Consistência Visual do Feed (Últimos 9 posts)
- **Nota (0-10):**
- **Análise:** (Avalie se o feed tem uma identidade visual coesa: paleta de cores, fontes, estilo de imagem/design. O feed parece profissional e atraente?).
- **Recomendação:** (Forneça dicas para criar ou manter uma identidade visual forte e consistente).

### 5. Estrutura e Conteúdo dos Destaques
- **Nota (0-10):**
- **Análise:** (Avalie a organização dos destaques. Eles possuem capas padronizadas? Os títulos são estratégicos, como "Serviços", "Clientes", "Comece Aqui"? O conteúdo é relevante?).
- **Recomendação:** (Sugira uma estrutura de destaques ideal para o nicho do perfil, incluindo que tipo de conteúdo colocar em cada um).

Use um tom profissional, de especialista, como se estivesse entregando um relatório valioso para um cliente.`,
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
