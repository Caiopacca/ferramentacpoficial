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
  niche: z.string().describe('The user\u2019s niche (e.g., Dermatology, Advocacy, Restaurant).'),
  objective: z.string().describe('The user\u2019s objective (e.g., Attract Clients, Generate Authority).'),
});
export type GenerateContentIdeasInput = z.infer<
  typeof GenerateContentIdeasInputSchema
>;

const ContentIdeaSchema = z.object({
  format: z.enum(['Reel', 'Carousel', 'Story']).describe('The format of the content idea.'),
  title: z.string().describe('A magnetic title/hook for the content idea.'),
  description: z.string().describe('A brief description of the content idea.'),
});

const GenerateContentIdeasOutputSchema = z.object({
  contentIdeas: z.array(ContentIdeaSchema).length(7).describe('A list of 7 content ideas for the week.'),
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
  prompt: `Você é um diretor de conteúdo criativo para redes sociais. O usuário atua no nicho de {{{niche}}} e tem como objetivo {{{objective}}}. Gere uma lista com 7 ideias de conteúdo para uma semana no Instagram. Para cada ideia, especifique o formato (Reel, Carrossel ou Story), um título/gancho magnético e uma breve descrição do conteúdo. O tom deve ser criativo e inspirador.`,
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
