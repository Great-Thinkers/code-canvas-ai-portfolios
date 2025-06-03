
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check } from "lucide-react";
import { useAIContentGeneration, ContentType, ContentTone, ContentLength } from "@/hooks/useAIContentGeneration";
import { toast } from "sonner";

interface AIContentGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: ContentType;
  context: any;
  onAccept: (content: string) => void;
  initialContent?: string;
}

export default function AIContentGeneratorDialog({
  open,
  onOpenChange,
  contentType,
  context,
  onAccept,
  initialContent = ""
}: AIContentGeneratorDialogProps) {
  const { isGenerating, generateContent } = useAIContentGeneration();
  const [tone, setTone] = useState<ContentTone>('professional');
  const [length, setLength] = useState<ContentLength>('medium');
  const [generatedContent, setGeneratedContent] = useState(initialContent);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const content = await generateContent({
      type: contentType,
      context,
      tone,
      length
    });

    if (content) {
      setGeneratedContent(content);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success('Content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAccept = () => {
    if (generatedContent) {
      onAccept(generatedContent);
      onOpenChange(false);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'bio': return 'Bio';
      case 'project': return 'Project Description';
      case 'skill': return 'Skill Description';
      case 'experience': return 'Experience Summary';
      case 'summary': return 'Professional Summary';
      default: return 'Content';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate {getContentTypeLabel()} with AI
          </DialogTitle>
          <DialogDescription>
            Customize the tone and length, then generate AI-powered content for your portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tone</Label>
            <RadioGroup value={tone} onValueChange={(value) => setTone(value as ContentTone)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">Professional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual">Casual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="creative" id="creative" />
                <Label htmlFor="creative">Creative</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Length Selection */}
          {contentType !== 'skill' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Length</Label>
              <RadioGroup value={length} onValueChange={(value) => setLength(value as ContentLength)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated Content</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder="Generated content will appear here..."
                className="min-h-[120px]"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={!generatedContent}
              className="flex-1"
            >
              Use This Content
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
