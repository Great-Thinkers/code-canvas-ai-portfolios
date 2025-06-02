
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Loader2, Copy, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AIContentGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentGenerated: (content: string, type: string) => void;
  currentContent?: string;
  contentType: "bio" | "project_description" | "skill_summary" | "experience_summary";
}

const contentTypes = [
  {
    id: "bio",
    title: "Professional Bio",
    description: "Generate a compelling professional biography",
  },
  {
    id: "project_description", 
    title: "Project Description",
    description: "Create engaging descriptions for your projects",
  },
  {
    id: "skill_summary",
    title: "Skills Summary", 
    description: "Summarize your technical skills and expertise",
  },
  {
    id: "experience_summary",
    title: "Experience Summary",
    description: "Highlight your professional experience",
  },
];

const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal and business-focused" },
  { id: "casual", label: "Casual", description: "Friendly and approachable" },
  { id: "creative", label: "Creative", description: "Innovative and artistic" },
  { id: "technical", label: "Technical", description: "Detail-oriented and precise" },
];

export default function AIContentGeneratorDialog({
  open,
  onOpenChange,
  onContentGenerated,
  currentContent = "",
  contentType,
}: AIContentGeneratorDialogProps) {
  const { user } = useAuth();
  const [selectedTone, setSelectedTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerate = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-portfolio-content", {
        body: {
          userId: user.id,
          contentType,
          tone: selectedTone,
          currentContent,
          customPrompt: customPrompt.trim() || undefined,
        },
      });

      if (error) {
        console.error("Error generating content:", error);
        toast.error("Failed to generate content");
        return;
      }

      if (data?.content) {
        setGeneratedContent(data.content);
        toast.success("Content generated successfully!");
      } else {
        toast.error("No content was generated");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    onContentGenerated(generatedContent, contentType);
    onOpenChange(false);
    toast.success("Content applied to your portfolio!");
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const currentContentType = contentTypes.find(type => type.id === contentType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generator
          </DialogTitle>
          <DialogDescription>
            Generate AI-powered content for your {currentContentType?.title.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Type Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-1">{currentContentType?.title}</h3>
            <p className="text-sm text-muted-foreground">
              {currentContentType?.description}
            </p>
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Writing Tone</Label>
            <RadioGroup
              value={selectedTone}
              onValueChange={setSelectedTone}
              className="grid grid-cols-2 gap-4"
            >
              {toneOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                    selectedTone === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={option.id}
                      className="font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-3">
            <Label htmlFor="custom-prompt" className="text-base font-medium">
              Additional Instructions (Optional)
            </Label>
            <Textarea
              id="custom-prompt"
              placeholder="Add any specific requirements or focus areas..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* Current Content Preview */}
          {currentContent && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Current Content</Label>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground">
                  {currentContent.length > 200 
                    ? `${currentContent.substring(0, 200)}...` 
                    : currentContent}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="min-w-[200px]"
            >
              {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate Content"}
              {!isGenerating && <Sparkles className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4">
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Generated Content</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-card border rounded-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedContent}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary">
                    {generatedContent.split(' ').length} words
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUseContent}>
                    Use This Content
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
