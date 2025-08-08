
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
import {
  analyzeProfile,
  type AnalyzeProfileInput,
  type AnalyzeProfileOutput,
} from '@/ai/flows/analyze-profile';
import {
  calculateRoi,
  type CalculateRoiInput,
  type CalculateRoiOutput,
} from '@/ai/flows/calculate-roi';
import {
  analyzeCopy,
  type AnalyzeCopyInput,
  type AnalyzeCopyOutput,
} from '@/ai/flows/analyze-copy';
import {
    generateReelScript,
    type GenerateReelScriptInput,
    type GenerateReelScriptOutput,
} from '@/ai/flows/generate-reel-script';
import {
    analyzeAd,
    type AnalyzeAdInput,
    type AnalyzeAdOutput,
} from '@/ai/flows/analyze-ad';
import {
    generateHashtags,
    type GenerateHashtagsInput,
    type GenerateHashtagsOutput,
} from '@/ai/flows/generate-hashtags';
import {
    generateEmailSubject,
    type GenerateEmailSubjectInput,
    type GenerateEmailSubjectOutput,
} from '@/ai/flows/generate-email-subject';
import {
    generateColdEmail,
    type GenerateColdEmailInput,
    type GenerateColdEmailOutput,
} from '@/ai/flows/generate-cold-email';
import {
    calculateTrafficInvestment,
    type CalculateTrafficInvestmentInput,
    type CalculateTrafficInvestmentOutput,
} from '@/ai/flows/calculate-traffic-investment';


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

export async function handleAnalyzeProfile(
  data: AnalyzeProfileInput
): Promise<AnalyzeProfileOutput> {
  try {
    const result = await analyzeProfile(data);
    return result;
  } catch (error) {
    console.error('Error analyzing profile:', error);
    throw new Error('Failed to analyze profile. Please try again.');
  }
}

export async function handleCalculateRoi(
  data: CalculateRoiInput
): Promise<CalculateRoiOutput> {
  try {
    const result = await calculateRoi(data);
    return result;
  } catch (error) {
    console.error('Error calculating ROI:', error);
    throw new Error('Failed to calculate ROI. Please try again.');
  }
}

export async function handleAnalyzeCopy(
  data: AnalyzeCopyInput
): Promise<AnalyzeCopyOutput> {
  try {
    const result = await analyzeCopy(data);
    return result;
  } catch (error) {
    console.error('Error analyzing copy:', error);
    throw new Error('Failed to analyze copy. Please try again.');
  }
}

export async function handleGenerateReelScript(
    data: GenerateReelScriptInput
    ): Promise<GenerateReelScriptOutput> {
    try {
        const result = await generateReelScript(data);
        return result;
    } catch (error) {
        console.error('Error generating reel script:', error);
        throw new Error('Failed to generate reel script. Please try again.');
    }
}

export async function handleAnalyzeAd(
    data: AnalyzeAdInput
    ): Promise<AnalyzeAdOutput> {
    try {
        const result = await analyzeAd(data);
        return result;
    } catch (error) {
        console.error('Error analyzing ad:', error);
        throw new Error('Failed to analyze ad. Please try again.');
    }
}

export async function handleGenerateHashtags(
    data: GenerateHashtagsInput
    ): Promise<GenerateHashtagsOutput> {
    try {
        const result = await generateHashtags(data);
        return result;
    } catch (error) {
        console.error('Error generating hashtags:', error);
        throw new Error('Failed to generate hashtags. Please try again.');
    }
}

export async function handleGenerateEmailSubject(
    data: GenerateEmailSubjectInput
    ): Promise<GenerateEmailSubjectOutput> {
    try {
        const result = await generateEmailSubject(data);
        return result;
    } catch (error) {
        console.error('Error generating email subjects:', error);
        throw new Error('Failed to generate email subjects. Please try again.');
    }
}

export async function handleGenerateColdEmail(
    data: GenerateColdEmailInput
    ): Promise<GenerateColdEmailOutput> {
    try {
        const result = await generateColdEmail(data);
        return result;
    } catch (error) {
        console.error('Error generating cold email:', error);
        throw new Error('Failed to generate cold email. Please try again.');
    }
}

export async function handleCalculateTrafficInvestment(
    data: CalculateTrafficInvestmentInput
    ): Promise<CalculateTrafficInvestmentOutput> {
    try {
        const result = await calculateTrafficInvestment(data);
        return result;
    } catch (error) {
        console.error('Error calculating traffic investment:', error);
        throw new Error('Failed to calculate traffic investment. Please try again.');
    }
}
