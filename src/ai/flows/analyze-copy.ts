
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing post copywriting.
 *
 * It takes a post caption and provides a score for hook, clarity, and CTA, along with improvement points.
 *
 * @exports {
 *   analyzeCopy: (input: AnalyzeCopyInput) => Promise<AnalyzeCopyOutput>;
 *   AnalyzeCopyInput: The input type for the analyzeCopy function.
 *   AnalyzeCopyOutput: The return type for the analyzeCopy function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCopyInputSchema = z.object({
  caption: z.string().describe('A legenda do post a ser analisada.'),
});
export type AnalyzeCopyInput = z.infer<typeof AnalyzeCopyInputSchema>;

const AnalyzeCopyOutputSchema = z.object({
  analysis: z.string().describe('O "Boletim de Performance" em formato Markdown.'),
});
export type AnalyzeCopyOutput = z.infer<typeof AnalyzeCopyOutputSchema>;

const analyzeCopyPrompt = ai.definePrompt({
  name: 'analyzeCopyPrompt',
  input: {
    schema: AnalyzeCopyInputSchema,
  },
  output: {
    schema: AnalyzeCopyOutputSchema,
  },
  prompt: `Você é um revisor e copywriter sênior, especialista em comunicação persuasiva para redes sociais. Analise a seguinte legenda de post:

"{{{caption}}}"

Sua tarefa é avaliar o texto com base nos três pilares do copywriting e apresentar o resultado em formato de 'Boletim de Performance'. Para cada pilar, atribua uma nota de 0 a 10 e, se a nota for inferior a 8, forneça uma sugestão clara e específica de melhoria.

**Estrutura do Boletim de Performance:**

**1. Força do Gancho (Hook)**
- **Nota (0-10):** (Sua nota aqui)
- **Análise:** (Breve análise explicando por que você deu essa nota para as primeiras duas linhas).
- **Sugestão de Melhoria (se nota < 8):** (Uma alternativa de gancho ou uma dica para torná-lo mais magnético).

**2. Clareza da Oferta/Mensagem**
- **Nota (0-10):** (Sua nota aqui)
- **Análise:** (A mensagem principal do post está clara? O valor foi bem comunicado?).
- **Sugestão de Melhoria (se nota < 8):** (Como reescrever a parte central para torná-la mais clara e direta).

**3. Eficácia da Chamada para Ação (CTA)**
- **Nota (0-10):** (Sua nota aqui)
- **Análise:** (O CTA é claro, único e incentiva a ação imediata?).
- **Sugestão de Melhoria (se nota < 8):** (Uma sugestão de CTA mais forte ou uma maneira de posicioná-lo melhor).

Use um tom de mentor, profissional e construtivo. O objetivo é ajudar o usuário a melhorar suas habilidades de escrita.`,
});

const analyzeCopyFlow = ai.defineFlow(
  {
    name: 'analyzeCopyFlow',
    inputSchema: AnalyzeCopyInputSchema,
    outputSchema: AnalyzeCopyOutputSchema,
  },
  async input => {
    const {output} = await analyzeCopyPrompt(input);
    return output!;
  }
);

export async function analyzeCopy(
  input: AnalyzeCopyInput
): Promise<AnalyzeCopyOutput> {
  return analyzeCopyFlow(input);
}
