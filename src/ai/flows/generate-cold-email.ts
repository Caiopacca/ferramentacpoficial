
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating cold email bodies.
 *
 * It takes a recipient's job title and an email objective and returns a persuasive email body.
 *
 * @exports {
 *   generateColdEmail: (input: GenerateColdEmailInput) => Promise<GenerateColdEmailOutput>;
 *   GenerateColdEmailInput: The input type for the generateColdEmail function.
 *   GenerateColdEmailOutput: The return type for the generateColdEmail function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColdEmailInputSchema = z.object({
  jobTitle: z.string().describe('O cargo do destinatário do e-mail.'),
  objective: z.string().describe('O objetivo do e-mail.'),
});
export type GenerateColdEmailInput = z.infer<
  typeof GenerateColdEmailInputSchema
>;

const GenerateColdEmailOutputSchema = z.object({
  emailBody: z.string().describe('O corpo do e-mail de prospecção fria.'),
});
export type GenerateColdEmailOutput = z.infer<
  typeof GenerateColdEmailOutputSchema
>;

const generateColdEmailPrompt = ai.definePrompt({
  name: 'generateColdEmailPrompt',
  input: {
    schema: GenerateColdEmailInputSchema,
  },
  output: {
    schema: GenerateColdEmailOutputSchema,
  },
  prompt: `Você é um copywriter sênior especialista em prospecção B2B. Sua tarefa é criar um corpo de e-mail frio, curto, profissional e altamente persuasivo.

O e-mail é enviado pela 'CP Marketing', uma agência focada em otimizar o marketing de conteúdo e gerar resultados de negócio.

**Destinatário:** {{{jobTitle}}}
**Objetivo do E-mail:** {{{objective}}}

**Instruções para o Corpo do E-mail:**
1.  **Saudação:** Comece com uma saudação profissional, como "Olá [Nome],".
2.  **Gancho Rápido:** Inicie com uma observação relevante e concisa sobre o mercado ou um desafio comum enfrentado por um(a) {{{jobTitle}}}. Isso mostra que você fez sua pesquisa.
3.  **Apresentação e Solução:** Apresente a CP Marketing de forma sucinta e conecte-a a uma solução para o desafio mencionado. Fale sobre benefícios, não sobre características.
4.  **Prova Social (Curta):** Mencione brevemente um resultado ou tipo de cliente que gera credibilidade (ex: "Ajudamos empresas como a sua a...").
5.  **Chamada para Ação (CTA) Clara e Leve:** O CTA deve ser de baixa fricção. Em vez de "Comprar agora", use algo alinhado ao objetivo: {{{objective}}}. Por exemplo, "Teria 15 minutos na próxima semana para uma breve chamada?".
6.  **Encerramento:** Use um encerramento profissional.

O tom deve ser respeitoso, direto e focado em gerar valor para o destinatário, não em apenas vender. O texto final deve ser limpo, pronto para ser copiado e colado.`,
});

const generateColdEmailFlow = ai.defineFlow(
  {
    name: 'generateColdEmailFlow',
    inputSchema: GenerateColdEmailInputSchema,
    outputSchema: GenerateColdEmailOutputSchema,
  },
  async input => {
    const {output} = await generateColdEmailPrompt(input);
    return output!;
  }
);

export async function generateColdEmail(
  input: GenerateColdEmailInput
): Promise<GenerateColdEmailOutput> {
  return generateColdEmailFlow(input);
}
