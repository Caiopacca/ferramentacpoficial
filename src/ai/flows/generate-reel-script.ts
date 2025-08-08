
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating 15-second Reel scripts.
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

const GenerateReelScriptOutputSchema = z.object({
  script: z.string().describe('O roteiro completo em formato Markdown, incluindo Gancho, Desenvolvimento, CTA e Sugestão de Áudio.'),
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

O resultado deve ser um plano de gravação claro e dinâmico, em formato Markdown, para que qualquer pessoa consiga entender e executar.

**Estrutura da Resposta:**

**1. Título Magnético:**
(Crie um título chamativo para o Reel)

**2. Plano de Cenas:**
Crie uma tabela em Markdown com as seguintes colunas: CENA, ÁUDIO/TEXTO e TEMPO.
| CENA | ÁUDIO/TEXTO | TEMPO |
| :--- | :--- | :--- |
| **(Gancho)** (Descreva a primeira cena visual de forma impactante. Ex: "Close no rosto com expressão de surpresa.") | (Texto que aparece na tela ou primeira frase falada. Ex: "Você está cometendo este erro...") | 0-3s |
| **(Desenvolvimento)** (Descreva a(s) cena(s) seguintes de forma dinâmica. Ex: "Corte rápido mostrando o jeito errado e depois o jeito certo.") | (Continue a narração ou os textos na tela, entregando o conteúdo de valor de forma clara e objetiva.) | 4-{{{developmentTime}}}s |
| **(CTA - Chamada para Ação)** (Descreva a cena final. Ex: "Apontando para o botão de seguir.") | (Texto ou narração com a chamada para ação. Ex: "Gostou? Me siga para mais dicas.") | Últimos 3s |

**3. Dica de Ouro:**
(Forneça uma dica de produção ou edição para deixar o vídeo mais profissional. Ex: "Use um corte a cada 2 segundos para manter o dinamismo.")

**4. Sugestão de Áudio em Alta:**
(Sugira um tipo de áudio/música que combine com o roteiro e esteja em alta. Ex: "Use um áudio de tutorial com batida eletrônica que esteja em alta no Reels.")`,
});

const generateReelScriptFlow = ai.defineFlow(
  {
    name: 'generateReelScriptFlow',
    inputSchema: GenerateReelScriptInputSchema,
    outputSchema: GenerateReelScriptOutputSchema,
  },
  async (input) => {
    const developmentTime = input.duration === 15 ? 12 : 25;
    
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
