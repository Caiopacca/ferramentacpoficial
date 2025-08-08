
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

const GenerateReelScriptInputSchema = z.object({
  niche: z.string().describe('O nicho de atuação do usuário (ex: Nutrição, Finanças).'),
  theme: z.string().describe('O tema do vídeo (ex: Dica Rápida, Antes e Depois, Mito vs. Verdade).'),
  duration: z.number().describe('A duração do vídeo em segundos (15 ou 30).'),
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

const generateReelScriptPrompt = ai.definePrompt({
  name: 'generateReelScriptPrompt',
  input: {
    schema: PromptInputSchema,
  },
  output: {
    schema: GenerateReelScriptOutputSchema,
  },
  prompt: `Você é um diretor de conteúdo e roteirista especialista em viralização no Instagram. Sua tarefa é criar um roteiro prático e detalhado de {{{duration}}} segundos para um Reel do nicho de **{{{niche}}}** sobre o tema **{{{theme}}}**.

O resultado deve ser um JSON estruturado, contendo um plano de gravação claro e dinâmico.

**1. Título Magnético (campo 'title'):**
Crie um título chamativo para o Reel.

**2. Plano de Cenas (campo 'scenePlan'):**
Crie um array com 3 objetos, um para cada cena do vídeo, seguindo a estrutura: Gancho, Desenvolvimento e CTA.
- **Gancho (item 1):**
  - scene: Descreva a primeira cena visual de forma impactante. Ex: "Close no rosto com expressão de surpresa."
  - audioText: Texto que aparece na tela ou primeira frase falada. Ex: "Você está cometendo este erro..."
  - time: "0-3s"
- **Desenvolvimento (item 2):**
  - scene: Descreva a(s) cena(s) seguintes de forma dinâmica. Ex: "Corte rápido mostrando o jeito errado e depois o jeito certo."
  - audioText: Continue a narração ou os textos na tela, entregando o conteúdo de valor de forma clara e objetiva.
  - time: "4-{{{developmentTime}}}s"
- **CTA (item 3):**
  - scene: Descreva a cena final. Ex: "Apontando para o botão de seguir."
  - audioText: Texto ou narração com a chamada para ação. Ex: "Gostou? Me siga para mais dicas."
  - time: "Últimos 3s"

**3. Dica de Ouro (campo 'proTip'):**
Forneça uma dica de produção ou edição para deixar o vídeo mais profissional. Ex: "Use um corte a cada 2 segundos para manter o dinamismo."

**4. Sugestão de Áudio em Alta (campo 'audioSuggestion'):**
Sugira um tipo de áudio/música que combine com o roteiro e esteja em alta. Ex: "Use um áudio de tutorial com batida eletrônica que esteja em alta no Reels."`,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async (input) => {
    const developmentTime = input.duration === 15 ? 12 : 27;
    
    const {output} = await generateReelScriptPrompt({
        ...input,
        developmentTime,
    });
    return output!;
  }
);

export async function generateReelScript(
  input: GenerateReelScriptInput
): Promise<GenerateReelScriptOutput> {
  return generateReelScriptFlow(input);
}
