
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

const AnalyzeCopyInputSchema = z.object({
  caption: z.string().describe('A legenda do post a ser analisada.'),
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


const analyzeCopyPrompt = ai.definePrompt({
  name: 'analyzeCopyPrompt',
  input: {
    schema: AnalyzeCopyInputSchema,
  },
  output: {
    schema: AnalyzeCopyOutputSchema,
  },
  prompt: `Você é um revisor e copywriter sênior, especialista em comunicação persuasiva para redes sociais. Analise a seguinte legenda de post:

"{{{caption}}}"

Sua tarefa é avaliar o texto com base nos três pilares do copywriting e apresentar o resultado em um JSON estruturado.

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

Seja profissional, construtivo e direto ao ponto. O objetivo é ajudar o usuário a melhorar suas habilidades de escrita para conversão.`,
});

const analyzeCopyFlow = ai.defineFlow(
  {
    name: 'analyzeCopyFlow',
    inputSchema: AnalyzeCopyInputSchema,
    outputSchema: AnalyzeCopyOutputSchema,
  },
  async input => {
    const {output} = await analyzeCopyPrompt(input);
    return output!;
  }
);

export async function analyzeCopy(
  input: AnalyzeCopyInput
): Promise<AnalyzeCopyOutput> {
  return analyzeCopyFlow(input);
}
