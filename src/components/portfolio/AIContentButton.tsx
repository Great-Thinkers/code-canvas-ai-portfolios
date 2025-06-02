
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AIContentGeneratorDialog from "./AIContentGeneratorDialog";

interface AIContentButtonProps {
  contentType: "bio" | "project_description" | "skill_summary" | "experience_summary";
  currentContent?: string;
  onContentGenerated: (content: string) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export default function AIContentButton({
  contentType,
  currentContent,
  onContentGenerated,
  variant = "outline",
  size = "sm",
  className,
}: AIContentButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleContentGenerated = (content: string, type: string) => {
    onContentGenerated(content);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={className}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate with AI
      </Button>

      <AIContentGeneratorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onContentGenerated={handleContentGenerated}
        currentContent={currentContent}
        contentType={contentType}
      />
    </>
  );
}
