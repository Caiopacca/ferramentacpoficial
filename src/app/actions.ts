
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
import {
  generateBio,
  type GenerateBioInput,
  type GenerateBioOutput,
} from '@/ai/flows/generate-bio';

export async function handleGenerateContent(
  data: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  try {
    const result = await generateContentIdeas(data);
    return result;
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw new Error('Failed to generate content ideas. Please try again.');
  }
}

export async function handleAnalyzeCompetition(
    data: AnalyzeCompetitionInput
  ): Promise<AnalyzeCompetitionOutput> {
    try {
      const result = await analyzeCompetition(data);
      return result;
    } catch (error) {
      console.error('Error analyzing competition:', error);
      throw new Error('Failed to analyze competition. Please try again.');
    }
  }

export async function handleGenerateBio(
  data: GenerateBioInput
): Promise<GenerateBioOutput> {
  try {
    const result = await generateBio(data);
    return result;
  } catch (error) {
    console.error('Error generating bio:', error);
    throw new Error('Failed to generate bio. Please try again.');
  }
}
