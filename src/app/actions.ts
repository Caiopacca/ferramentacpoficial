
'use server';

import {
  generateContentIdeas,
  type GenerateContentIdeasInput,
  type GenerateContentIdeasOutput,
} from '@/ai/flows/generate-content-ideas';
import { z } from 'zod';

const formSchema = z.object({
  niche: z.string(),
  objective: z.string(),
});

export async function handleGenerateContent(
  data: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  const parsedData = formSchema.parse(data);

  try {
    const result = await generateContentIdeas(parsedData);
    return result;
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw new Error('Failed to generate content ideas. Please try again.');
  }
}
