
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

const PersonaSchema = z.enum(['bizu', 'resenha']);

const AnalyzeProfileInputSchema = z.object({
  username: z.string().describe('O @ do perfil do Instagram a ser analisado.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
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

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

COMO VOCÊ FALA:
Sua fala é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral", "Já é", "Coé", "Mermão". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Sua única missão é analisar o perfil do Instagram {{{username}}} e entregar um diagnóstico focado em **performance e conversão**. Sua análise deve ser objetiva, baseada em métricas de negócio e focada em encontrar o caminho mais curto para o resultado financeiro.

A tarefa é realizar um diagnóstico detalhado e profissional do perfil {{{username}}}.

Seu output deve ser um JSON estruturado. Siga rigorosamente a estrutura do schema de saída.

**1. Nota Geral de Performance Comercial:**
Uma nota geral de 0 a 100 que representa a capacidade do perfil em atrair, engajar e **converter seguidores em clientes**.

**2. Resumo Executivo Estratégico:**
Um parágrafo curto e direto, destacando a **principal alavanca de crescimento** e a **melhoria mais crítica** para o negócio.

**3. Diagnóstico Detalhado por Pilares de Conversão:**
Para cada um dos 5 pilares, forneça uma análise de impacto e um plano de ação focados em **resultados de negócio**:
- **Pilar 1: SEO e Posicionamento de Marca:** Como o nome e o @ impactam a **encontrabilidade por clientes qualificados**.
- **Pilar 2: Força da Proposta de Valor (Bio):** A bio **converte visitantes em seguidores** de forma eficaz? O CTA é claro?
- **Pilar 3: Otimização do Ponto de Contato (Link da Bio):** O link é uma **porta de entrada otimizada para vendas**?
- **Pilar 4: Percepção de Valor e Autoridade (Feed):** O feed **constrói a confiança necessária para a compra**? O conteúdo resolve dores que levam à venda?
- **Pilar 5: Jornada do Cliente (Destaques):** Os destaques funcionam como um **funil de vendas, guiando o cliente** do interesse à decisão?

Preencha o campo 'username' no output com o valor de entrada.
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?", "Tamo junto", "Papo de", "Já era". Você é carismática, envolvente e didática.

SUA MISSÃO:
Sua única missão é analisar o perfil do Instagram {{{username}}} e entregar um diagnóstico focado em **comunicação e narrativa de marca**. Sua análise deve ser criativa, explicando como os elementos do perfil impactam a **conexão emocional** com o público.

A tarefa é realizar um diagnóstico detalhado e profissional do perfil {{{username}}}.

Seu output deve ser um JSON estruturado. Siga rigorosamente a estrutura do schema de saída.

**1. Nota Geral de Performance Comercial:**
Uma nota geral de 0 a 100 que representa a capacidade do perfil em **atrair, engajar e criar uma comunidade fiel**.

**2. Resumo Executivo Estratégico:**
Um parágrafo curto e direto, destacando o **ponto mais forte da comunicação** atual e a **oportunidade de melhoria mais crítica** para gerar mais conexão.

**3. Diagnóstico Detalhado por Pilares de Conversão:**
Para cada um dos 5 pilares, forneça uma análise de impacto e um plano de ação focados em **branding e storytelling**:
- **Pilar 1: SEO e Posicionamento de Marca:** O nome e o @ **contam uma história** e se conectam com a identidade da audiência?
- **Pilar 2: Força da Proposta de Valor (Bio):** A bio **desperta curiosidade e emoção**? Ela convida para uma conversa?
- **Pilar 3: Otimização do Ponto de Contato (Link da Bio):** A página de destino oferece uma **experiência de marca coesa**?
- **Pilar 4: Percepção de Valor e Autoridade (Feed):** O feed tem uma **identidade visual que encanta**? O conteúdo gera conversas e compartilhamentos?
- **Pilar 5: Jornada do Cliente (Destaques):** Os destaques contam a **história da marca e de seus clientes**, construindo uma narrativa?

Preencha o campo 'username' no output com o valor de entrada.
`;


const bizuPrompt = ai.definePrompt({
  name: 'bizuAnalyzeProfile',
  input: { schema: AnalyzeProfileInputSchema },
  output: { schema: AnalyzeProfileOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaAnalyzeProfile',
  input: { schema: AnalyzeProfileInputSchema },
  output: { schema: AnalyzeProfileOutputSchema },
  prompt: resenhaBasePrompt,
});


const analyzeProfileFlow = ai.defineFlow(
  {
    name: 'analyzeProfileFlow',
    inputSchema: AnalyzeProfileInputSchema,
    outputSchema: AnalyzeProfileOutputSchema,
  },
  async input => {
    if (input.persona === 'bizu') {
      const { output } = await bizuPrompt(input);
      return output!;
    } else {
      const { output } = await resenhaPrompt(input);
      return output!;
    }
  }
);

export async function analyzeProfile(
  input: AnalyzeProfileInput
): Promise<AnalyzeProfileOutput> {
  return analyzeProfileFlow(input);
}

    