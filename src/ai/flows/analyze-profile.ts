
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

const PillarSchema = z.object({
    title: z.string().describe('O título do pilar (ex: SEO e Posicionamento de Marca).'),
    score: z.number().describe('A nota de 0 a 10 para este pilar.'),
    impactAnalysis: z.string().describe('A análise de impacto no negócio para este pilar.'),
    actionPlan: z.string().describe('O plano de ação claro e acionável para este pilar.'),
});

const AnalyzeProfileOutputSchema = z.object({
  username: z.string(),
  overallScore: z.number().describe('A nota geral de performance comercial de 0 a 100.'),
  executiveSummary: z.string().describe('Um parágrafo curto e direto com o ponto mais forte e a oportunidade de melhoria mais crítica.'),
  pillars: z.array(PillarSchema).length(5).describe('Uma lista detalhada dos 5 pilares de conversão analisados.'),
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

Seu output deve ser um JSON estruturado. Siga rigorosamente a estrutura do schema de saída.

**1. Nota Geral de Performance Comercial:**
Uma nota geral de 0 a 100 que representa a capacidade do perfil em atrair, engajar e converter seguidores em clientes. Considere o impacto combinado de todos os critérios abaixo na jornada do cliente. Preencha o campo 'overallScore'.

**2. Resumo Executivo Estratégico:**
Um parágrafo curto e direto, destacando o ponto mais forte do perfil (a principal alavanca de crescimento atual) e a oportunidade de melhoria mais crítica, aquela que, se corrigida, trará o maior impacto nos resultados de negócio. Preencha o campo 'executiveSummary'.

**3. Diagnóstico Detalhado por Pilares de Conversão:**
Para cada um dos 5 pilares abaixo, preencha um objeto no array 'pillars' com:
- **title**: O nome do pilar.
- **score**: Uma nota de 0 a 10.
- **impactAnalysis**: Uma análise de impacto no negócio: explique a nota avaliando como o pilar, em seu estado atual, impacta positiva ou negativamente a percepção de valor, a confiança e a decisão de compra do público. Use uma linguagem simples e didática.
- **actionPlan**: Um plano de ação claro e acionável: Dê uma recomendação que seja uma micro-estratégia, não apenas uma dica.

**Os 5 Pilares são:**

- **Pilar 1: SEO e Posicionamento de Marca (Nome de Usuário e Nome de Perfil)**
  - Análise de Impacto: Avalie se o nome de usuário e o nome do perfil usam palavras-chave que atraem o público certo e posicionam a marca como especialista no nicho. Explique por que isso é importante para ser encontrado por novos clientes.
  - Plano de Ação: Sugira uma otimização clara para o nome e o @ para melhorar a encontrabilidade e reforçar a autoridade.

- **Pilar 2: Força da Proposta de Valor (Biografia)**
  - Análise de Impacto: Avalie a clareza da proposta de valor. Em 3 segundos, um visitante entende o que o perfil oferece, para quem e por que deveria se importar? A chamada para ação (CTA) é forte? Explique como uma boa bio transforma visitantes em seguidores.
  - Plano de Ação: Forneça uma sugestão de reescrita da bio focada em conversão, com uma promessa clara e um CTA irresistível.

- **Pilar 3: Otimização do Ponto de Contato (Link da Bio)**
  - Análise de Impacto: Avalie se o link é um ponto de contato estratégico (ex: site, WhatsApp) ou um beco sem saída. A página de destino está otimizada? Explique como o link é a porta de entrada para uma venda.
  - Plano de Ação: Sugira a melhor estratégia de link para o negócio e recomende melhorias para a página de destino.

- **Pilar 4: Percepção de Valor e Autoridade (Feed - Últimos 9 posts)**
  - Análise de Impacto: Avalie se o feed transmite profissionalismo. A identidade visual é coesa e eleva a percepção de valor? O conteúdo resolve dores reais ou é genérico? Explique como o feed constrói a confiança do cliente.
  - Plano de Ação: Forneça diretrizes para a identidade visual e uma sugestão de linha editorial focada em construir autoridade.

- **Pilar 5: Jornada do Cliente (Destaques)**
  - Análise de Impacto: Avalie se os destaques guiam o novo seguidor, quebrando objeções e conduzindo à venda (ex: "Comece Aqui", "Resultados"). Explique como os destaques funcionam como um 'menu' para clientes em potencial.
  - Plano de Ação: Sugira uma estrutura de destaques ideal para guiar o cliente do primeiro contato à decisão de compra.
  
Preencha o campo 'username' no output com o valor de entrada.`,
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
