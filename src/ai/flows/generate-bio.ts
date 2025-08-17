
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating professional Instagram bios.
 *
 * The flow takes what the user does, who they help, and the main result they generate,
 * and returns three optimized bio options.
 *
 * @exports {
 *   generateBio: (input: GenerateBioInput) => Promise<GenerateBioOutput>;
 *   GenerateBioInput: The input type for the generateBio function.
 *   GenerateBioOutput: The return type for the generateBio function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateBioInputSchema = z.object({
  whatYouDo: z.string().describe('O que o profissional faz.'),
  whoYouHelp: z.string().describe('Para quem o profissional ajuda.'),
  mainResult: z.string().describe('O principal resultado que o profissional gera.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  introductoryMessage: z.string().describe('Uma frase de introdução curta e no tom de voz da persona escolhida.'),
  bios: z
    .array(z.string())
    .length(3)
    .describe(
      'Uma lista com 3 opções de biografias completas para o Instagram.'
    ),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

const basePrompt = `
**Dados para a Bio:**
- **O que faz:** {{{whatYouDo}}}
- **Para quem ajuda:** {{{whoYouHelp}}}
- **Principal resultado:** {{{mainResult}}}

**Instruções para a Resposta:**
1.  **Mensagem de Introdução (Obrigatório):** Crie uma mensagem de introdução com pelo menos 3 linhas, no seu tom de voz, explicando a importância de uma bio bem construída. A cada nova geração, crie uma variação diferente desta mensagem, mantendo o tom e as gírias da persona.

2.  **Criação das Bios:** Com base nos dados fornecidos, crie 3 opções de bios completas, prontas para copiar e colar, incluindo emojis estratégicos e uma chamada para ação clara para o link. Apresente as bios diretamente, sem usar 'Opção 1', 'Opção 2' ou 'Opção 3' como prefixo. Cada bio deve ser um item no array de strings de saída.

3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing, focado em **conversão**.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto ao ponto. "Pega a visão", "Sem caô".

SUA MISSÃO:
Sua missão é criar 3 opções de bio focadas em **conversão direta, clareza e autoridade**. As bios devem ser objetivas, destacar o resultado principal e ter um CTA forte e direto.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing, focada em **conexão**.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e envolvente. "Maneiro", "Tá ligado?".

SUA MISSÃO:
Sua missão é criar 3 opções de bio focadas em **conexão, storytelling e personalidade**. As bios devem despertar curiosidade, comunicar o propósito da marca e convidar o seguidor a fazer parte de uma comunidade.

${basePrompt}
`;

const bizuPrompt = ai.definePrompt({
  name: 'bizuGenerateBio',
  input: { schema: GenerateBioInputSchema },
  output: { schema: GenerateBioOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaGenerateBio',
  input: { schema: GenerateBioInputSchema },
  output: { schema: GenerateBioOutputSchema },
  prompt: resenhaBasePrompt,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    if (input.persona === 'bizu') {
      const { output } = await bizuPrompt(input);
      return output!;
    } else {
      const { output } = await resenhaPrompt(input);
      return output!;
    }
  }
);

export async function generateBio(
  input: GenerateBioInput
): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}
