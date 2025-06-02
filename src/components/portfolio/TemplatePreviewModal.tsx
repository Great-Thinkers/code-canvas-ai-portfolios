
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, ExternalLink } from 'lucide-react';
import { TemplateTheme } from '@/types/templates';

interface TemplatePreviewModalProps {
  template: TemplateTheme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: TemplateTheme) => void;
  isSelected?: boolean;
}

export default function TemplatePreviewModal({
  template,
  open,
  onOpenChange,
  onSelect,
  isSelected,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {template.name}
                {template.isPremium && (
                  <Badge className="bg-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {template.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Preview */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="h-96 bg-gradient-to-br flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">{template.name}</div>
                <div className="text-lg opacity-90">Template Preview</div>
                <div className="mt-4 text-sm opacity-75">
                  Full preview available after selection
                </div>
              </div>
            </div>
          </div>

          {/* Template Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <div className="space-y-2">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Design Details</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {template.category}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Typography:</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {template.typography.fontFamily}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Color Palette:</span>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(template.colors).slice(0, 4).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close Preview
            </Button>
            <Button
              onClick={() => {
                onSelect(template);
                onOpenChange(false);
              }}
              disabled={template.isPremium}
              className="flex-1"
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Selected
                </>
              ) : (
                'Select Template'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
