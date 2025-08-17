
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
  introductoryMessage: z.string().describe('Uma frase de introdução curta e no tom de voz da persona escolhida.'),
  emailBody: z.string().describe('O corpo do e-mail de prospecção fria.'),
});
export type GenerateColdEmailOutput = z.infer<
  typeof GenerateColdEmailOutputSchema
>;

const basePrompt = `
**Dados:**
- **Destinatário:** {{{jobTitle}}}
- **Objetivo do E-mail:** {{{objective}}}

**Sua tarefa é dupla:**
1.  **CRIAR INTRODUÇÃO (obrigatório):** Crie uma mensagem de introdução de 3 linhas, no seu tom de voz, que fale sobre prospecção por e-mail. A cada nova geração, crie uma variação diferente desta mensagem.
2.  **CRIAR CORPO DO E-MAIL:** Crie um corpo de e-mail frio, curto, profissional e altamente persuasivo, pronto para copiar e colar.

**Instruções para o Corpo do E-mail:**
1.  **Saudação:** Comece com "Olá [Nome],".
2.  **Gancho Rápido:** Inicie com uma observação relevante sobre o mercado ou um desafio comum enfrentado por um(a) {{{jobTitle}}}.
3.  **Apresentação e Solução:** Apresente a CP Marketing (agência focada em otimizar marketing de conteúdo) e conecte-a a uma solução.
4.  **Prova Social (Curta):** Mencione um resultado breve (ex: "Ajudamos empresas como a sua a...").
5.  **CTA (Chamada para Ação):** Deve ser de baixa fricção e alinhado ao objetivo: {{{objective}}}.
6.  **Encerramento:** Use um encerramento profissional.

**Formato de Saída:**
Seu output final deve ser um objeto JSON que segue rigorosamente o schema de saída. A introdução criada no passo 1 deve ser usada apenas no campo 'introductoryMessage'. O corpo do e-mail criado no passo 2 deve ser usado no campo 'emailBody'.
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Criar um e-mail com foco em **eficiência e resultado**. O texto deve ser curto, direto e focado em como você resolve um problema que custa dinheiro para o destinatário.

${basePrompt}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?". Você é carismática, envolvente e didática.

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
