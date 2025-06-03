
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ContentType = 'bio' | 'project' | 'skill' | 'experience' | 'summary';
export type ContentTone = 'professional' | 'casual' | 'creative';
export type ContentLength = 'short' | 'medium' | 'long';

interface GenerateContentOptions {
  type: ContentType;
  context: any;
  tone?: ContentTone;
  length?: ContentLength;
}

interface AIGenerationResult {
  content: string;
  type: ContentType;
  success: boolean;
}

export function useAIContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<AIGenerationResult | null>(null);

  const generateContent = async (options: GenerateContentOptions): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log('Generating AI content:', options);

      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: options,
      });

      if (error) {
        console.error('AI generation error:', error);
        toast.error('Failed to generate content. Please try again.');
        return null;
      }

      if (!data.success) {
        console.error('AI generation failed:', data.error);
        toast.error(data.error || 'Failed to generate content');
        return null;
      }

      setLastGenerated(data);
      toast.success('Content generated successfully!');
      return data.content;

    } catch (error) {
      console.error('Unexpected AI generation error:', error);
      toast.error('An unexpected error occurred while generating content');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBio = async (context: any, tone: ContentTone = 'professional', length: ContentLength = 'medium') => {
    return generateContent({ type: 'bio', context, tone, length });
  };

  const generateProjectDescription = async (context: any, tone: ContentTone = 'professional', length: ContentLength = 'medium') => {
    return generateContent({ type: 'project', context, tone, length });
  };

  const generateSkillDescription = async (skill: string, tone: ContentTone = 'professional') => {
    return generateContent({ type: 'skill', context: { skill }, tone, length: 'short' });
  };

  const generateExperienceSummary = async (context: any, tone: ContentTone = 'professional', length: ContentLength = 'medium') => {
    return generateContent({ type: 'experience', context, tone, length });
  };

  const generateProfessionalSummary = async (context: any, tone: ContentTone = 'professional', length: ContentLength = 'medium') => {
    return generateContent({ type: 'summary', context, tone, length });
  };

  return {
    isGenerating,
    lastGenerated,
    generateContent,
    generateBio,
    generateProjectDescription,
    generateSkillDescription,
    generateExperienceSummary,
    generateProfessionalSummary,
  };
}
