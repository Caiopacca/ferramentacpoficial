
'use server';

import {
  generateContentIdeas,
  type GenerateContentIdeasInput,
  type GenerateContentIdeasOutput,
} from '@/ai/flows/generate-content-ideas';
import {
  analyzeCompetition,
  type AnalyzeCompetitionInput,
  type AnalyzeCompetitionOutput,
} from '@/ai/flows/analyze-competition';
import { z } from 'zod';

const generateContentFormSchema = z.object({
  niche: z.string(),
  objective: z.string(),
});

export async function handleGenerateContent(
  data: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  const parsedData = generateContentFormSchema.parse(data);

  try {
    const result = await generateContentIdeas(parsedData);
    return result;
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw new Error('Failed to generate content ideas. Please try again.');
  }
}

const analyzeCompetitionFormSchema = z.object({
    userProfile: z.string().min(1, 'O seu perfil é obrigatório.'),
    competitorProfile1: z.string().min(1, 'O perfil do concorrente 1 é obrigatório.'),
    competitorProfile2: z.string().optional(),
});


export async function handleAnalyzeCompetition(
    data: AnalyzeCompetitionInput
  ): Promise<AnalyzeCompetitionOutput> {
    const parsedData = analyzeCompetitionFormSchema.parse(data);
  
    try {
      const result = await analyzeCompetition(parsedData);
      return result;
    } catch (error) {
      console.error('Error analyzing competition:', error);
      throw new Error('Failed to analyze competition. Please try again.');
    }
  }
