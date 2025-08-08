
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating cold email subject lines.
 *
 * It takes a recipient's job title and an email objective and returns 5 subject line options.
 *
 * @exports {
 *   generateEmailSubject: (input: GenerateEmailSubjectInput) => Promise<GenerateEmailSubjectOutput>;
 *   GenerateEmailSubjectInput: The input type for the generateEmailSubject function.
 *   GenerateEmailSubjectOutput: The return type for the generateEmailSubject function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailSubjectInputSchema = z.object({
  jobTitle: z.string().describe('O cargo do destinatário do e-mail.'),
  objective: z.string().describe('O objetivo do e-mail.'),
});
export type GenerateEmailSubjectInput = z.infer<
  typeof GenerateEmailSubjectInputSchema
>;

const GenerateEmailSubjectOutputSchema = z.object({
  subjects: z
    .array(z.string())
    .length(5)
    .describe('Uma lista com 5 opções de assuntos de e-mail.'),
});
export type GenerateEmailSubjectOutput = z.infer<
  typeof GenerateEmailSubjectOutputSchema
>;

const generateEmailSubjectPrompt = ai.definePrompt({
  name: 'generateEmailSubjectPrompt',
  input: {
    schema: GenerateEmailSubjectInputSchema,
  },
  output: {
    schema: GenerateEmailSubjectOutputSchema,
  },
  prompt: `Você é um copywriter sênior, um estrategista de marketing especialista em criar títulos de e-mail para prospecção fria que são impossíveis de ignorar. Sua missão é gerar 5 opções de assuntos que garantam uma alta taxa de abertura.

**Destinatário:** {{{jobTitle}}}
**Objetivo do E-mail:** {{{objective}}}

**Instruções para os Títulos:**
1.  **Seja Magnético, Não Vendedor:** O título não deve parecer uma venda. Ele precisa despertar curiosidade, gerar urgência ou ser ultra-específico.
2.  **Use Gatilhos Mentais:** Incorpore gatilhos como:
    *   **Curiosidade:** "Uma pergunta sobre [tópico relevante para o cargo]"
    *   **Especificidade:** "Ideia para otimizar [área específica] em 10 minutos"
    *   **Prova Social:** "Como a [Empresa Conhecida] resolveu [problema comum]"
    *   **Urgência/Exclusividade:** "Convite para [cargo]"
3.  **Curto e Direto:** Idealmente, menos de 6 palavras. Otimizado para visualização em mobile.
4.  **Personalização Implícita:** O título deve fazer o {{{jobTitle}}} sentir que o e-mail foi pensado para ele, mesmo sem usar o nome.

Gere 5 opções de alto impacto, prontas para usar. Cada assunto deve ser um item no array de strings de saída.`,
});

const generateEmailSubjectFlow = ai.defineFlow(
  {
    name: 'generateEmailSubjectFlow',
    inputSchema: GenerateEmailSubjectInputSchema,
    outputSchema: GenerateEmailSubjectOutputSchema,
  },
  async input => {
    const {output} = await generateEmailSubjectPrompt(input);
    return output!;
  }
);

export async function generateEmailSubject(
  input: GenerateEmailSubjectInput
): Promise<GenerateEmailSubjectOutput> {
  return generateEmailSubjectFlow(input);
}
