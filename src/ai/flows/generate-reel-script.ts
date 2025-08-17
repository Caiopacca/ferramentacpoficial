
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating 15 and 30-second Reel scripts.
 *
 * It takes a niche and a theme and returns a structured script with hook, development, CTA, and audio suggestion.
 *
 * @exports {
 *   generateReelScript: (input: GenerateReelScriptInput) => Promise<GenerateReelScriptOutput>;
 *   GenerateReelScriptInput: The input type for the generateReelScript function.
 *   GenerateReelScriptOutput: The return type for the generateReelScript function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateReelScriptInputSchema = z.object({
  niche: z.string().describe('O nicho de atuação do usuário (ex: Nutrição, Finanças).'),
  theme: z.string().describe('O tema do vídeo (ex: Dica Rápida, Antes e Depois, Mito vs. Verdade).'),
  duration: z.number().describe('A duração do vídeo em segundos (15 ou 30).'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type GenerateReelScriptInput = z.infer<
  typeof GenerateReelScriptInputSchema
>;

const SceneSchema = z.object({
    scene: z.string().describe('A descrição da cena visual (ex: "Close no rosto com expressão de surpresa.").'),
    audioText: z.string().describe('O áudio ou texto que acompanha a cena (ex: "Você está cometendo este erro...").'),
    time: z.string().describe('O tempo da cena (ex: "0-3s").'),
});

const GenerateReelScriptOutputSchema = z.object({
  introductoryMessage: z.string().describe('Uma frase de introdução curta e no tom de voz da persona escolhida.'),
  title: z.string().describe('Um título chamativo e magnético para o Reel.'),
  scenePlan: z.array(SceneSchema).length(3).describe('Uma lista com as 3 cenas do roteiro (Gancho, Desenvolvimento, CTA).'),
  proTip: z.string().describe('Uma dica de produção ou edição para deixar o vídeo mais profissional.'),
  audioSuggestion: z.string().describe('Uma sugestão de áudio/música em alta que combine com o roteiro.'),
});
export type GenerateReelScriptOutput = z.infer<
  typeof GenerateReelScriptOutputSchema
>;

const PromptInputSchema = GenerateReelScriptInputSchema.extend({
    developmentTime: z.number(),
});

const basePrompt = `
**Sua tarefa:** Criar um roteiro prático e detalhado de {{{duration}}} segundos para um Reel do nicho de **{{{niche}}}** sobre o tema **{{{theme}}}**.

**Instruções para a Resposta:**
1.  **Mensagem de Introdução (Obrigatório):** Crie uma mensagem de introdução com pelo menos 3 linhas, no seu tom de voz, dando uma dica rápida sobre a importância de roteiros para vídeos. A cada nova geração, crie uma variação diferente desta mensagem, mantendo o tom e as gírias da persona.

2.  **Criação do Roteiro:** Desenvolva um roteiro completo seguindo os critérios abaixo.

3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída.

**Critérios para o Roteiro:**
- **Título (campo 'title'):** Crie um título chamativo para o Reel.
- **Plano de Cenas (campo 'scenePlan'):** Crie um array com 3 objetos (Gancho, Desenvolvimento, CTA).
  - **Gancho (item 1):** Cena visual impactante, texto/narração para os primeiros 3 segundos.
  - **Desenvolvimento (item 2):** Cena dinâmica, conteúdo de valor claro e objetivo. Tempo: "4s-{{{developmentTime}}}s".
  - **CTA (item 3):** Cena final clara com chamada para ação. Tempo: "Últimos 3s".
- **Dica de Ouro (campo 'proTip'):** Uma dica de produção/edição.
- **Sugestão de Áudio (campo 'audioSuggestion'):** Sugestão de áudio/música em alta.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre focado em **roteiros que vendem**.

COMO VOCÊ FALA:
"Papo reto", direto ao ponto.

SUA MISSÃO:
Criar um roteiro com foco em **clareza, autoridade e um CTA forte**. O gancho deve qualificar o espectador, o desenvolvimento deve resolver uma dor e o CTA deve levar a uma ação de negócio.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa focada em **roteiros que conectam**.

COMO VOCÊ FALA:
Criativa, magnética, didática.

SUA MISSÃO:
Criar um roteiro com foco em **storytelling, originalidade e engajamento**. O gancho deve gerar curiosidade, o desenvolvimento deve ser divertido ou emocionante e o CTA deve convidar para uma conversa.

${basePrompt}
`;


const bizuPrompt = ai.definePrompt({
  name: 'bizuGenerateReelScript',
  input: { schema: PromptInputSchema },
  output: { schema: GenerateReelScriptOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaGenerateReelScript',
  input: { schema: PromptInputSchema },
  output: { schema: GenerateReelScriptOutputSchema },
  prompt: resenhaBasePrompt,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async (input) => {
    const developmentTime = input.duration === 15 ? 12 : 27;
    
    const promptInput = {
        ...input,
        developmentTime,
    };

    if (input.persona === 'bizu') {
        const { output } = await bizuPrompt(promptInput);
        return output!;
    } else {
        const { output } = await resenhaPrompt(promptInput);
        return output!;
    }
  }
);

export async function generateReelScript(
  input: GenerateReelScriptInput
): Promise<GenerateReelScriptOutput> {
  return generateReelScriptFlow(input);
}
