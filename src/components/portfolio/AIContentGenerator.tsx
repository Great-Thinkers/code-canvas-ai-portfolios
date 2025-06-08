
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { useAIContentGeneration } from '@/hooks/useAIContentGeneration';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress'; // Assuming you have a Progress component

interface AIContentGeneratorProps {
  type: 'bio' | 'project_description' | 'skill_summary' | 'experience_summary';
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
  const { generateContent, isGenerating: isGeneratingContent } = useAIContentGeneration();
  const { subscription, usage, canUseAI, loading: subscriptionLoading } = useSubscription();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const maxGenerations = useMemo(() => {
    if (!subscription || !subscription.plan || typeof subscription.plan.max_ai_generations !== 'number') return 0;
    return subscription.plan.max_ai_generations;
  }, [subscription]);

  const currentGenerationCount = useMemo(() => {
    return usage?.ai_generations_count || 0;
  }, [usage]);

  const generationsRemaining = useMemo(() => {
    if (maxGenerations === -1) return Infinity; // Unlimited
    return Math.max(0, maxGenerations - currentGenerationCount);
  }, [maxGenerations, currentGenerationCount]);

  const hasReachedLimit = useMemo(() => {
    if (maxGenerations === -1) return false; // Unlimited
    return currentGenerationCount >= maxGenerations;
  }, [currentGenerationCount, maxGenerations]);

  // Combine isGeneratingContent with subscriptionLoading for disabling buttons
  const isGenerating = isGeneratingContent || subscriptionLoading;

  const handleGenerate = async () => {
    if (!canUseAI || hasReachedLimit) {
      // Toast messages are handled by useAIContentGeneration hook or below
      if (!canUseAI) toast.error("Upgrade your plan to generate content.");
      else if (hasReachedLimit) toast.error("You've reached your generation limit.");
      return;
    }
    try {
      const content = await generateContent({ 
        type: type === 'project_description' ? 'project' : type === 'skill_summary' ? 'skill' : type === 'experience_summary' ? 'experience' : type,
        context,
        tone: 'professional'
      });
      if (content) {
        onChange(content);
        toast.success('Content generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    }
  };

  const handleGenerateVariations = async () => {
    try {
      const variations = await Promise.all(
        (['professional', 'casual', 'creative'] as const).map(tone =>
          generateContent({
            type: type === 'project_description' ? 'project' : type === 'skill_summary' ? 'skill' : type === 'experience_summary' ? 'experience' : type,
            context,
            tone
          })
        )
      );
      const validVariations = (variations.filter(Boolean) as string[]).slice(0, 3); // Take up to 3
      setSuggestions(validVariations);
    } catch (error) {
      toast.error('Failed to generate variations. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{label}</label>
          {/* Action Buttons Group */}
          <div className="flex gap-2">
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || !canUseAI || hasReachedLimit}
                className="flex items-center gap-2"
              >
                {isGeneratingContent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateVariations}
                disabled={isGenerating || !canUseAI || hasReachedLimit}
                className="flex items-center gap-2"
              >
                 {isGeneratingContent ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Variations
              </Button>
          </div>
        </div>
      )}

      {/* Subscription Status/Limit Info */}
      {!subscriptionLoading && !canUseAI && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div>
            AI content generation is disabled.
            <Link href="/dashboard/settings/billing" className="font-semibold underline ml-1 hover:text-yellow-800">
              Upgrade your plan
            </Link> to enable this feature.
          </div>
        </div>
      )}

      {!subscriptionLoading && canUseAI && maxGenerations > 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between items-center">
            <span>
              AI Generations Used: {currentGenerationCount} / {maxGenerations === -1 ? 'Unlimited' : maxGenerations}
            </span>
            {generationsRemaining <= 5 && maxGenerations !== -1 && ( // Show warning if 5 or less remain
               <span className={`text-xs ${generationsRemaining === 0 ? 'text-red-500 font-semibold' : 'text-yellow-600'}`}>
                 {generationsRemaining === 0 ? "Limit reached" : `${generationsRemaining} remaining`}
               </span>
            )}
          </div>
          {maxGenerations !== -1 && (
             <Progress value={(currentGenerationCount / maxGenerations) * 100} className="h-2" />
          )}
           {hasReachedLimit && maxGenerations !== -1 && (
            <div className="p-2 mt-1 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 flex items-center gap-2">
              <Info className="h-4 w-4 text-red-500" />
              <div>
                You've reached your generation limit.
                <Link href="/dashboard/settings/billing" className="font-semibold underline ml-1 hover:text-red-700">
                  Upgrade
                </Link> for more.
              </div>
            </div>
          )}
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px]"
        disabled={isGenerating || !canUseAI || hasReachedLimit}
      />

      {suggestions.length > 0 && canUseAI && (
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
