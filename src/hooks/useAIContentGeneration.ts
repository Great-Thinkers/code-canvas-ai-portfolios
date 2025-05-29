
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GenerateContentRequest {
  type: 'bio' | 'project-description' | 'skill-summary';
  context: {
    name?: string;
    title?: string;
    skills?: string[];
    experience?: any[];
    repositories?: any[];
    role?: string;
  };
}

export const useAIContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (request: GenerateContentRequest): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-portfolio-content', {
        body: request,
      });

      if (error) {
        throw error;
      }

      return data.content;
    } catch (err) {
      console.error('Error generating AI content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBio = async (context: GenerateContentRequest['context']) => {
    return generateContent({
      type: 'bio',
      context,
    });
  };

  const generateProjectDescription = async (context: GenerateContentRequest['context']) => {
    return generateContent({
      type: 'project-description',
      context,
    });
  };

  const generateSkillSummary = async (context: GenerateContentRequest['context']) => {
    return generateContent({
      type: 'skill-summary',
      context,
    });
  };

  return {
    generateContent,
    generateBio,
    generateProjectDescription,
    generateSkillSummary,
    isGenerating,
    error,
  };
};
