
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
Sua tarefa é criar um roteiro prático e detalhado de {{{duration}}} segundos para um Reel do nicho de **{{{niche}}}** sobre o tema **{{{theme}}}**.

O resultado deve ser um JSON estruturado, contendo um plano de gravação claro e dinâmico.

**1. Título (campo 'title'):**
Crie um título chamativo para o Reel.

**2. Plano de Cenas (campo 'scenePlan'):**
Crie um array com 3 objetos, um para cada cena do vídeo, seguindo a estrutura: Gancho, Desenvolvimento e CTA.
- **Gancho (item 1):**
  - scene: Descreva a primeira cena visual de forma impactante. Seja específico sobre a ação e a expressão.
  - audioText: Forneça a frase exata para a narração ou texto que aparece na tela.
  - time: "0-3s"
- **Desenvolvimento (item 2):**
  - scene: Descreva a(s) cena(s) seguintes de forma dinâmica e detalhada. Sugira ações e cortes.
  - audioText: Escreva a narração completa ou os textos que explicam o conteúdo de valor de forma clara e objetiva.
  - time: "4s-{{{developmentTime}}}s"
- **CTA (item 3):**
  - scene: Descreva a cena final de forma clara.
  - audioText: Forneça a narração ou texto exato para a chamada para ação.
  - time: "Últimos 3s"

**3. Dica de Ouro (campo 'proTip'):**
Forneça uma dica de produção ou edição para deixar o vídeo mais profissional.

**4. Sugestão de Áudio em Alta (campo 'audioSuggestion'):**
Sugira um tipo de áudio/música que combine com o roteiro e esteja em alta.
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
