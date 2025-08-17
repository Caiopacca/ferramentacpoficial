
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing ad campaigns.
 *
 * It takes a target audience, ad copy, and image/video description and returns a detailed analysis
 * including an overall score, executive summary, and a breakdown by key pillars.
 *
 * @exports {
 *   analyzeAd: (input: AnalyzeAdInput) => Promise<AnalyzeAdOutput>;
 *   AnalyzeAdInput: The input type for the analyzeAd function.
 *   AnalyzeAdOutput: The return type for the analyzeAd function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const AnalyzeAdInputSchema = z.object({
  targetAudience: z.string().describe('O público-alvo do anúncio.'),
  adCopy: z.string().describe('O texto do anúncio.'),
  imageDescription: z.string().describe('A descrição da imagem ou vídeo do anúncio.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type AnalyzeAdInput = z.infer<typeof AnalyzeAdInputSchema>;

const PillarSchema = z.object({
    pillarName: z.string().describe('O nome do pilar (ex: Alinhamento Público-Copy).'),
    score: z.number().min(0).max(10).describe('A nota de 0 a 10 para este pilar.'),
    analysis: z.string().describe('A análise explicando a nota para este pilar, destacando pontos fortes e fracos.'),
    suggestion: z.string().describe('A sugestão de melhoria clara e acionável para este pilar.'),
});

const AnalyzeAdOutputSchema = z.object({
  alignmentScore: z.number().min(0).max(100).describe('A nota geral de alinhamento estratégico do anúncio, de 0 a 100.'),
  executiveSummary: z.string().describe('Um resumo curto destacando o potencial do anúncio e a melhoria mais crítica.'),
  pillars: z.array(PillarSchema).length(3).describe('Uma lista com a análise detalhada dos 3 pilares do anúncio.'),
});
export type AnalyzeAdOutput = z.infer<typeof AnalyzeAdOutputSchema>;

const basePrompt = `
Sua tarefa é avaliar o anúncio com base em 3 pilares críticos e apresentar o resultado em um JSON estruturado.

**Dados do Anúncio:**
- **Público-alvo:** {{{targetAudience}}}
- **Texto do anúncio (Copy):** {{{adCopy}}}
- **Descrição da imagem/vídeo (Criativo):** {{{imageDescription}}}

**1. Pilares de Análise:**
Para cada um dos 3 pilares abaixo, preencha um objeto no array 'pillars':
- **pillarName**: O nome do pilar.
- **score**: Atribua uma nota de 0 a 10.
- **analysis**: Faça uma análise profissional explicando a nota. Destaque um ponto forte e um ponto fraco.
- **suggestion**: Forneça uma sugestão prática e específica para melhorar o alinhamento.

**Os 3 Pilares são:**
- **Alinhamento Público-Copy:** A copy (texto) fala a língua do público-alvo? Aborda suas dores e desejos? A mensagem é relevante para {{{targetAudience}}}?
- **Alinhamento Copy-Criativo:** A imagem/vídeo (descrito em {{{imageDescription}}}) complementa e reforça a mensagem da copy? A combinação é harmoniosa e impactante?
- **Clareza da Oferta e CTA:** A oferta ou proposta de valor está clara no anúncio como um todo? A Chamada para Ação (CTA) é fácil de entender, visível e incentiva a ação desejada?

**2. Nota Geral de Alinhamento (campo 'alignmentScore'):**
Calcule uma nota geral de 0 a 100, baseada na média ponderada das notas dos pilares. Um anúncio desalinhado não converte.

**3. Resumo Executivo (campo 'executiveSummary'):**
Escreva um parágrafo curto e direto. Comece com um veredito sobre o potencial do anúncio (ex: "Este anúncio tem bom potencial, mas..." ou "Este anúncio está desalinhado e precisa de ajustes críticos..."). Em seguida, aponte a melhoria mais importante que o usuário deve fazer.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Sua fala é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Analisar o anúncio com foco em **performance, clareza e conversão**. Seja brutalmente honesto sobre o que funciona e o que não funciona para gerar vendas.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?". Você é carismática, envolvente e didática.

SUA MISSÃO:
Analisar o anúncio com foco em **conexão, storytelling e impacto visual**. Avalie se o anúncio consegue contar uma história e gerar uma resposta emocional no público.

${basePrompt}
`;

const bizuPrompt = ai.definePrompt({
  name: 'bizuAnalyzeAd',
  input: { schema: AnalyzeAdInputSchema },
  output: { schema: AnalyzeAdOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaAnalyzeAd',
  input: { schema: AnalyzeAdInputSchema },
  output: { schema: AnalyzeAdOutputSchema },
  prompt: resenhaBasePrompt,
});


const analyzeAdFlow = ai.defineFlow(
  {
    name: 'analyzeAdFlow',
    inputSchema: AnalyzeAdInputSchema,
    outputSchema: AnalyzeAdOutputSchema,
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

export async function analyzeAd(
  input: AnalyzeAdInput
): Promise<AnalyzeAdOutput> {
  return analyzeAdFlow(input);
}
