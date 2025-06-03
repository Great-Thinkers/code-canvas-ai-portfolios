
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAIContentGeneration, ContentType, ContentTone, ContentLength } from "@/hooks/useAIContentGeneration";

interface AIContentButtonProps {
  contentType: ContentType;
  context: any;
  onContentGenerated: (content: string) => void;
  tone?: ContentTone;
  length?: ContentLength;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function AIContentButton({
  contentType,
  context,
  onContentGenerated,
  tone = 'professional',
  length = 'medium',
  variant = 'outline',
  size = 'sm',
  className,
  children
}: AIContentButtonProps) {
  const { isGenerating, generateContent } = useAIContentGeneration();

  const handleGenerate = async () => {
    const generatedContent = await generateContent({
      type: contentType,
      context,
      tone,
      length
    });

    if (generatedContent) {
      onContentGenerated(generatedContent);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 mr-2" />
      )}
      {children || (isGenerating ? 'Generating...' : 'Generate with AI')}
    </Button>
  );
}
