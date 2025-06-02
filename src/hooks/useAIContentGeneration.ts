
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ContentType = "bio" | "project_description" | "skill_summary" | "experience_summary";

export interface GenerateContentOptions {
  contentType: ContentType;
  tone: string;
  currentContent?: string;
  customPrompt?: string;
}

export function useAIContentGeneration() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const generateContent = async (options: GenerateContentOptions): Promise<string | null> => {
    if (!user) {
      toast.error("User not authenticated");
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-portfolio-content", {
        body: {
          userId: user.id,
          ...options,
        },
      });

      if (error) {
        console.error("Error generating content:", error);
        toast.error("Failed to generate content");
        return null;
      }

      if (data?.content) {
        setGeneratedContent(data.content);
        return data.content;
      } else {
        toast.error("No content was generated");
        return null;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearGeneratedContent = () => {
    setGeneratedContent("");
  };

  return {
    generateContent,
    generatedContent,
    isGenerating,
    clearGeneratedContent,
  };
}
