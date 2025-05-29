
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useAIContentGeneration } from '@/hooks/useAIContentGeneration';
import { toast } from 'sonner';

interface AIContentGeneratorProps {
  type: 'bio' | 'project-description' | 'skill-summary';
  context: {
    name?: string;
    title?: string;
    skills?: string[];
    experience?: any[];
    repositories?: any[];
    role?: string;
  };
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function AIContentGenerator({
  type,
  context,
  value,
  onChange,
  placeholder,
  label,
}: AIContentGeneratorProps) {
  const { generateContent, isGenerating } = useAIContentGeneration();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGenerate = async () => {
    try {
      const content = await generateContent({ type, context });
      onChange(content);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    }
  };

  const handleGenerateVariations = async () => {
    try {
      const variations = await Promise.all([
        generateContent({ type, context }),
        generateContent({ type, context }),
        generateContent({ type, context }),
      ]);
      setSuggestions(variations);
    } catch (error) {
      toast.error('Failed to generate variations. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate with AI
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateVariations}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Variations
            </Button>
          </div>
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px]"
        disabled={isGenerating}
      />

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Suggestions:</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  onChange(suggestion);
                  setSuggestions([]);
                  toast.success('Content applied!');
                }}
              >
                <p className="text-sm">{suggestion}</p>
                <Badge variant="secondary" className="mt-2">
                  Click to use
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
