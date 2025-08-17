
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating cold email subject lines.
 *
 * It takes a recipient's job title and an email objective and returns 5 subject line options.
 *
 * @exports {
 *   generateEmailSubject: (input: GenerateEmailSubjectInput) => Promise<GenerateEmailSubjectOutput>;
 *   GenerateEmailSubjectInput: The input type for the generateEmailSubject function;
 *   GenerateEmailSubjectOutput: The return type for the generateEmailSubject function;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateEmailSubjectInputSchema = z.object({
  jobTitle: z.string().describe('O cargo do destinatário do e-mail.'),
  objective: z.string().describe('O objetivo do e-mail.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type GenerateEmailSubjectInput = z.infer<
  typeof GenerateEmailSubjectInputSchema
>;

const GenerateEmailSubjectOutputSchema = z.object({
  introductoryMessage: z.string().describe('Uma frase de introdução curta e no tom de voz da persona escolhida.'),
  subjects: z
    .array(z.string())
    .length(5)
    .describe('Uma lista com 5 opções de assuntos de e-mail.'),
});
export type GenerateEmailSubjectOutput = z.infer<
  typeof GenerateEmailSubjectOutputSchema
>;

const basePrompt = `
**Destinatário:** {{{jobTitle}}}
**Objetivo do E-mail:** {{{objective}}}

**Instruções para a Resposta:**
1.  **Mensagem de Introdução (Obrigatório):** Crie uma mensagem de introdução com pelo menos 3 linhas, no seu tom de voz, explicando a importância de um assunto de e-mail matador. A cada nova geração, crie uma variação diferente desta mensagem.
2.  **Criação dos Títulos:** Gere 5 opções de assuntos de alto impacto, prontos para usar. Cada assunto deve ser um item no array de strings 'subjects'.
    - **Seja Magnético, Não Vendedor:** O título não deve parecer uma venda. Ele precisa despertar curiosidade, gerar urgência ou ser ultra-específico.
    - **Use Gatilhos Mentais:** Incorpore gatilhos como Curiosidade, Especificidade, Prova Social ou Urgência.
    - **Curto e Direto:** Idealmente, menos de 6 palavras. Otimizado para mobile.
    - **Personalização Implícita:** O título deve fazer o {{{jobTitle}}} sentir que o e-mail foi pensado para ele, mesmo sem usar o nome.
3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Criar 5 assuntos **diretos e ultra-específicos**. O foco é parecer um e-mail de negócios importante, não marketing. Pense em "Reunião sobre X", "Ponto rápido sobre Y".

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?". Você é carismática, envolvente e didática.

SUA MISSÃO:
Criar 5 assuntos **curiosos e que quebram o padrão**. O foco é fazer o destinatário pensar "O que é isso?". Pense em "uma ideia para você", "sua opinião sobre isto".

${basePrompt}
`;


const bizuPrompt = ai.definePrompt({
  name: 'bizuGenerateEmailSubject',
  input: { schema: GenerateEmailSubjectInputSchema },
  output: { schema: GenerateEmailSubjectOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaGenerateEmailSubject',
  input: { schema: GenerateEmailSubjectInputSchema },
  output: { schema: GenerateEmailSubjectOutputSchema },
  prompt: resenhaBasePrompt,
});


const generateEmailSubjectFlow = ai.defineFlow(
  {
    name: 'generateEmailSubjectFlow',
    inputSchema: GenerateEmailSubjectInputSchema,
    outputSchema: GenerateEmailSubjectOutputSchema,
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

export async function generateEmailSubject(
  input: GenerateEmailSubjectInput
): Promise<GenerateEmailSubjectOutput> {
  return generateEmailSubjectFlow(input);
}
