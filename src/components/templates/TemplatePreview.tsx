import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  role: string;
  style: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  isPremium?: boolean;
}

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export default function TemplatePreview({
  template,
  isOpen,
  onClose,
  onSelect,
}: TemplatePreviewProps) {
  if (!template) return null;

  const handleSelect = () => {
    onSelect(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-display">
              {template.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{template.category}</Badge>
              {template.isPremium && (
                <Badge className="bg-brand-500 text-white hover:bg-brand-600">
                  Premium
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Image */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
              <img
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open("#", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Preview
              </Button>
              <Button className="flex-1" onClick={handleSelect}>
                Select Template
              </Button>
            </div>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Optimized for</h3>
              <p className="text-sm capitalize">
                {template.role.replace("-", " ")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Design Style</h3>
              <div className="flex flex-wrap gap-2">
                {template.style.map((style) => (
                  <Badge key={style} variant="outline" className="capitalize">
                    {style.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="capitalize">
                    {feature.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
