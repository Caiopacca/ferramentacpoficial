
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
  prompt: `Você é um consultor de marketing digital sênior, especialista em transformar perfis do Instagram em máquinas de aquisição de clientes. Sua análise é estratégica, focada em resultados de negócio e vai além de dicas superficiais. Sua tarefa é realizar um diagnóstico detalhado e profissional do perfil {{{username}}}.

Seu output deve ser um relatório completo em formato Markdown. Siga rigorosamente a estrutura abaixo:

# Diagnóstico Estratégico de Perfil: {{{username}}}

**Nota Geral de Performance Comercial: (Sua nota de 0 a 100 aqui)**
*Uma nota geral que representa a capacidade do perfil em atrair, engajar e converter seguidores em clientes. Considere o impacto combinado de todos os critérios abaixo na jornada do cliente.*

## Resumo Executivo Estratégico
*Um parágrafo curto e direto, destacando o ponto mais forte do perfil (a principal alavanca de crescimento atual) e a oportunidade de melhoria mais crítica, aquela que, se corrigida, trará o maior impacto nos resultados de negócio.*

---

## Diagnóstico Detalhado por Pilares de Conversão

Para cada um dos 5 pilares abaixo, forneça:
1.  **Uma nota de 0 a 10**.
2.  **Uma análise de impacto no negócio**: explique a nota avaliando como o pilar, em seu estado atual, impacta positiva ou negativamente a percepção de valor, a confiança e a decisão de compra do público.
3.  **Um plano de ação claro e acionável**: Dê uma recomendação que seja uma micro-estratégia, não apenas uma dica.

### 1. SEO e Posicionamento de Marca (Nome de Usuário e Nome de Perfil)
- **Nota (0-10):**
- **Análise de Impacto:** (Avalie se o nome de usuário e o nome do perfil usam palavras-chave que atraem o público certo e posicionam a marca como especialista no nicho. O perfil é facilmente encontrado por quem precisa da solução que ele oferece?).
- **Plano de Ação:** (Sugira uma otimização clara para o nome e o @ para melhorar a encontrabilidade por clientes em potencial e reforçar a autoridade).

### 2. Força da Proposta de Valor (Biografia)
- **Nota (0-10):**
- **Análise de Impacto:** (Avalie a clareza da proposta de valor. Em 3 segundos, um visitante entende o que o perfil oferece, para quem e por que deveria se importar? A chamada para ação (CTA) é forte o suficiente para levar o visitante ao próximo passo do funil?).
- **Plano de Ação:** (Forneça uma sugestão de reescrita da bio focada em conversão, com uma promessa clara e um CTA irresistível).

### 3. Otimização do Ponto de Contato (Link da Bio)
- **Nota (0-10):**
- **Análise de Impacto:** (Avalie se o link é um ponto de contato estratégico (ex: site, WhatsApp, página de vendas) ou um beco sem saída. A página de destino está otimizada para conversão, oferecendo uma experiência coesa com a promessa da bio?).
- **Plano de Ação:** (Sugira a melhor estratégia de link para o objetivo do negócio e recomende melhorias para a página de destino, visando maximizar a captura de leads ou vendas).

### 4. Percepção de Valor e Autoridade (Feed - Últimos 9 posts)
- **Nota (0-10):**
- **Análise de Impacto:** (Avalie se o feed transmite profissionalismo e autoridade. A identidade visual (cores, fontes, estilo) é coesa e eleva a percepção de valor do produto/serviço? O conteúdo resolve dores reais do público-alvo ou é apenas genérico?).
- **Plano de Ação:** (Forneça diretrizes estratégicas para a identidade visual e uma sugestão de linha editorial para os próximos posts, focada em construir autoridade e desejo).

### 5. Jornada do Cliente (Destaques)
- **Nota (0-10):**
- **Análise de Impacto:** (Avalie a organização dos destaques como uma jornada guiada para o novo seguidor. Eles possuem capas padronizadas e títulos estratégicos que quebram objeções e conduzem à venda (ex: "Comece Aqui", "Resultados", "Serviços", "Bastidores")?).
- **Plano de Ação:** (Sugira uma estrutura de destaques ideal para guiar o cliente em potencial desde o primeiro contato até a decisão de compra, incluindo que tipo de conteúdo colocar em cada um).

Use um tom de consultor sênior, confiante e focado em resultados. O objetivo é entregar um relatório que o cliente pagaria caro para ter.`,
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
