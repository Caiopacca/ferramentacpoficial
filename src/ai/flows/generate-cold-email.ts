
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

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateColdEmailInputSchema = z.object({
  jobTitle: z.string().describe('O cargo do destinatário do e-mail.'),
  objective: z.string().describe('O objetivo do e-mail.'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
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

const basePrompt = `
Sua tarefa é criar um corpo de e-mail frio, curto, profissional e altamente persuasivo.

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

O texto final deve ser limpo, pronto para ser copiado e colado.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto ao ponto. "Papo reto", "Sem caô".

SUA MISSÃO:
Criar um e-mail com foco em **eficiência e resultado**. O texto deve ser curto, direto e focado em como você resolve um problema que custa dinheiro para o destinatário.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. "Maneiro", "Tá ligado?".

SUA MISSÃO:
Criar um e-mail com foco em **curiosidade e conexão**. O texto deve ser mais pessoal, gerar um ponto de identificação e despertar o interesse em saber mais.

${basePrompt}
`;

const bizuPrompt = ai.definePrompt({
  name: 'bizuGenerateColdEmail',
  input: { schema: GenerateColdEmailInputSchema },
  output: { schema: GenerateColdEmailOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaGenerateColdEmail',
  input: { schema: GenerateColdEmailInputSchema },
  output: { schema: GenerateColdEmailOutputSchema },
  prompt: resenhaBasePrompt,
});

const generateColdEmailFlow = ai.defineFlow(
  {
    name: 'generateColdEmailFlow',
    inputSchema: GenerateColdEmailInputSchema,
    outputSchema: GenerateColdEmailOutputSchema,
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

export async function generateColdEmail(
  input: GenerateColdEmailInput
): Promise<GenerateColdEmailOutput> {
  return generateColdEmailFlow(input);
}
