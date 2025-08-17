
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
  bios: z
    .array(z.string())
    .length(3)
    .describe(
      'Uma lista com 3 opções de biografias completas para o Instagram.'
    ),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

const basePrompt = `
Com base nisso, crie 3 opções de bios completas, prontas para copiar e colar, incluindo emojis estratégicos e uma chamada para ação clara para o link.
Apresente as bios diretamente, sem usar 'Opção 1', 'Opção 2' ou 'Opção 3' como prefixo. Cada bio deve ser um item no array de strings de saída.
O profissional respondeu às seguintes perguntas:

O que ele faz: {{{whatYouDo}}}
Para quem ele ajuda: {{{whoYouHelp}}}
Principal resultado que gera: {{{mainResult}}}
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Sua fala é o "carioquês" raiz, direto e afiado. Não é só sobre usar gírias, mas sobre a cadência. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral", "Já é", "Coé", "Mermão". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Sua missão é criar 3 opções de bio focadas em conversão direta, clareza e autoridade.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Não é só usar gírias, é sobre o ritmo. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?", "Tamo junto", "Papo de", "Já era". Você é carismática, engraçada, envolvente e didática.

SUA MISSÃO:
Sua missão é criar 3 opções de bio focadas em conexão, storytelling e personalidade.

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
