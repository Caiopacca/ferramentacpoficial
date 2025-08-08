
'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating potential ROI on marketing spend.
 *
 * @exports calculateRoi
 * @exports CalculateRoiInput
 * @exports CalculateRoiOutput
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRoiInputSchema = z.object({
  ticket: z.number().positive('O ticket médio deve ser um número positivo.'),
  currentCustomers: z.number().int().nonnegative('O número de clientes atuais não pode ser negativo.'),
  investment: z.number().positive('O investimento deve ser um número positivo.'),
});
export type CalculateRoiInput = z.infer<typeof CalculateRoiInputSchema>;

const CalculateRoiOutputSchema = z.object({
  analysis: z.string().describe('O relatório financeiro em formato Markdown.'),
});
export type CalculateRoiOutput = z.infer<typeof CalculateRoiOutputSchema>;

const calculateRoiPrompt = ai.definePrompt({
  name: 'calculateRoiPrompt',
  input: {
    schema: CalculateRoiInputSchema,
  },
  output: {
    schema: CalculateRoiOutputSchema,
  },
  prompt: `Você é um consultor financeiro focado em marketing. O usuário forneceu os seguintes dados:

- **Ticket médio por cliente:** R$ {{{ticket}}}
- **Clientes atuais por mês:** {{{currentCustomers}}}
- **Investimento desejado em anúncios:** R$ {{{investment}}}

Calcule e apresente um relatório simples em Markdown. O relatório deve conter:
1.  **Ponto de Equilíbrio:** O número de novos clientes necessários por mês para cobrir o investimento (investimento / ticket médio).
2.  **Projeções de Lucro Líquido:** Uma tabela mostrando o lucro líquido (Novas Receitas - Investimento) se o marketing aumentar as vendas em 10%, 20% e 30% sobre os clientes atuais.

Use um tom direto e focado em resultados financeiros. Seja claro e organize os números de forma fácil de entender.`,
});

const calculateRoiFlow = ai.defineFlow(
  {
    name: 'calculateRoiFlow',
    inputSchema: CalculateRoiInputSchema,
    outputSchema: CalculateRoiOutputSchema,
  },
  async input => {
    const {output} = await calculateRoiPrompt(input);
    return output!;
  }
);

export async function calculateRoi(
  input: CalculateRoiInput
): Promise<CalculateRoiOutput> {
  return calculateRoiFlow(input);
}
