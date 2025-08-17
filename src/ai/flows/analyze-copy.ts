
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing post copywriting.
 *
 * It takes a post caption and provides scores for hook, clarity, and CTA, along with an overall score and improvement points.
 *
 * @exports {
 *   analyzeCopy: (input: AnalyzeCopyInput) => Promise<AnalyzeCopyOutput>;
 *   AnalyzeCopyInput: The input type for the analyzeCopy function.
 *   AnalyzeCopyOutput: The return type for the analyzeCopy function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const AnalyzeCopyInputSchema = z.object({
  caption: z.string().describe('A legenda do post a ser analisada.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type AnalyzeCopyInput = z.infer<typeof AnalyzeCopyInputSchema>;

const PillarSchema = z.object({
    pillarName: z.string().describe('O nome do pilar (ex: Força do Gancho).'),
    score: z.number().min(0).max(10).describe('A nota de 0 a 10 para este pilar.'),
    analysis: z.string().describe('A análise explicando a nota para este pilar.'),
    suggestion: z.string().describe('A sugestão de melhoria clara e acionável para este pilar.'),
});

const AnalyzeCopyOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('A nota geral de performance da legenda, de 0 a 100.'),
  executiveSummary: z.string().describe('Um resumo curto destacando o ponto mais forte e a melhoria mais crítica.'),
  pillars: z.array(PillarSchema).length(3).describe('Uma lista com a análise detalhada dos 3 pilares do copywriting.'),
});
export type AnalyzeCopyOutput = z.infer<typeof AnalyzeCopyOutputSchema>;


const basePrompt = `
Sua tarefa é avaliar o texto com base nos três pilares do copywriting e apresentar o resultado em um JSON estruturado.

**Legenda para análise:**
"{{{caption}}}"

**1. Pilares de Análise:**
Para cada um dos 3 pilares abaixo, preencha um objeto no array 'pillars':
- **pillarName**: O nome do pilar.
- **score**: Atribua uma nota de 0 a 10.
- **analysis**: Faça uma breve análise explicando por que você deu essa nota.
- **suggestion**: Forneça uma sugestão clara e específica de melhoria.

**Os 3 Pilares são:**
- **Força do Gancho (Hook):** Avalie as primeiras duas linhas. Elas capturam a atenção? Geram curiosidade?
- **Clareza da Mensagem:** A mensagem principal do post está clara? O valor foi bem comunicado? É fácil de entender?
- **Eficácia da Chamada para Ação (CTA):** O CTA é claro, único e incentiva uma ação imediata e específica?

**2. Nota Geral (campo 'overallScore'):**
Calcule uma nota geral de 0 a 100, baseada na média ponderada das notas dos pilares. Dê mais peso para o Gancho e o CTA.

**3. Resumo Executivo (campo 'executiveSummary'):**
Escreva um parágrafo curto e direto, destacando o ponto mais forte da legenda e a oportunidade de melhoria mais crítica (aquela que trará o maior impacto).
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing, focado em **conversão**. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Analisar a legenda com um olhar clínico para **vendas**. A legenda vende? O CTA é forte? A mensagem leva à ação?

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing, focada em **conexão**. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?". Você é carismática, envolvente e didática.

SUA MISSÃO:
Analisar a legenda com um olhar criativo para **engajamento**. A legenda conecta? O gancho é magnético? O texto gera conversa?

${basePrompt}
`;


const bizuPrompt = ai.definePrompt({
  name: 'bizuAnalyzeCopy',
  input: { schema: AnalyzeCopyInputSchema },
  output: { schema: AnalyzeCopyOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaAnalyzeCopy',
  input: { schema: AnalyzeCopyInputSchema },
  output: { schema: AnalyzeCopyOutputSchema },
  prompt: resenhaBasePrompt,
});

const analyzeCopyFlow = ai.defineFlow(
  {
    name: 'analyzeCopyFlow',
    inputSchema: AnalyzeCopyInputSchema,
    outputSchema: AnalyzeCopyOutputSchema,
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

export async function analyzeCopy(
  input: AnalyzeCopyInput
): Promise<AnalyzeCopyOutput> {
  return analyzeCopyFlow(input);
}
