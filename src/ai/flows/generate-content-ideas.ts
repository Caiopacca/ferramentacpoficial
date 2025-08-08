'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating content ideas based on a user's niche and objective.
 *
 * The flow takes a niche and objective as input and returns a list of 7 content ideas for a week, including format, title, and description.
 *
 * @exports {
 *   generateContentIdeas: (input: GenerateContentIdeasInput) => Promise<GenerateContentIdeasOutput>;
 *   GenerateContentIdeasInput: The input type for the generateContentIdeas function.
 *   GenerateContentIdeasOutput: The return type for the generateContentIdeas function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentIdeasInputSchema = z.object({
  niche: z.string().describe('O nicho de atuação do usuário (ex: Dermatologia, Advocacia, Restaurante).'),
  objective: z.string().describe('O objetivo do usuário (ex: Atrair Clientes, Gerar Autoridade).'),
});
export type GenerateContentIdeasInput = z.infer<
  typeof GenerateContentIdeasInputSchema
>;

const ContentIdeaSchema = z.object({
  format: z.enum(['Reel', 'Carousel', 'Story']).describe('O formato da ideia de conteúdo.'),
  title: z.string().describe('Um título ou gancho magnético para a ideia de conteúdo.'),
  description: z.string().describe('Uma breve descrição da ideia de conteúdo.'),
});

const GenerateContentIdeasOutputSchema = z.object({
  contentIdeas: z.array(ContentIdeaSchema).length(7).describe('Uma lista com 7 ideias de conteúdo para a semana.'),
});

export type GenerateContentIdeasOutput = z.infer<
  typeof GenerateContentIdeasOutputSchema
>;

const generateContentIdeasPrompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: {
    schema: GenerateContentIdeasInputSchema,
  },
  output: {
    schema: GenerateContentIdeasOutputSchema,
  },
  prompt: `Aja como um diretor de conteúdo criativo para redes sociais. O usuário atua no nicho de {{{niche}}} e seu objetivo é {{{objective}}}.

Gere um plano de conteúdo com 7 ideias para uma semana no Instagram. Para cada dia, forneça:
1.  **Formato:** Reel, Carrossel ou Story.
2.  **Título/Gancho:** Um título magnético e que prenda a atenção.
3.  **Descrição:** Um resumo claro e conciso do conteúdo.

O tom deve ser criativo, inspirador e alinhado com as melhores práticas de marketing de conteúdo.`,
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateContentIdeasPrompt(input);
    return output!;
  }
);

export async function generateContentIdeas(
  input: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}
