
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTemplateAccess } from '@/hooks/useTemplateAccess';
import { isTemplatePremiuTemplate } from '@/data/premiumTemplates';
import { getTemplateById } from '@/data/templates';
import TemplatePreviewModal from './TemplatePreviewModal';

interface RestrictedTemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
}

export default function RestrictedTemplateSelector({
  selectedTemplateId,
  onTemplateSelect
}: RestrictedTemplateSelectorProps) {
  const { checkTemplateAccess, hasPremiuAccess } = useTemplateAccess();
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const templates = [
    'modern-minimal',
    'creative-bold', 
    'classic-professional',
    'elegant-simple',
    'minimalist-modern',
    'tech-modern',
    'futuristic-gradient',
    'neon-cyberpunk'
  ];

  const handleTemplateSelect = (templateId: string) => {
    const isPremium = isTemplatePremiuTemplate(templateId);
    const accessInfo = checkTemplateAccess(templateId, isPremium);
    
    if (accessInfo.canAccess) {
      onTemplateSelect(templateId);
    }
  };

  const handlePreview = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setPreviewTemplate(template);
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose Template</h3>
        {!hasPremiuAccess && (
          <Link to="/pricing">
            <Button size="sm" className="gap-2">
              <Crown className="h-4 w-4" />
              Unlock Premium
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((templateId) => {
          const template = getTemplateById(templateId);
          if (!template) return null;

          const isPremium = isTemplatePremiuTemplate(templateId);
          const accessInfo = checkTemplateAccess(templateId, isPremium);
          const isSelected = selectedTemplateId === templateId;

          return (
            <Card 
              key={templateId}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${!accessInfo.canAccess ? 'opacity-75' : ''}`}
            >
              {isPremium && (
                <Badge 
                  className="absolute top-2 right-2 z-10 bg-amber-500 text-white"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}

              <CardHeader className="pb-2">
                <div className="aspect-video bg-gradient-to-br rounded-lg flex items-center justify-center text-white text-sm"
                     style={{
                       background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`
                     }}>
                  {template.name}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(templateId)}
                    className="flex-1"
                  >
                    Preview
                  </Button>

                  {accessInfo.canAccess ? (
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm" 
                      onClick={() => handleTemplateSelect(templateId)}
                      className="flex-1"
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  ) : (
                    <Link to="/pricing" className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onSelect={(template) => {
          handleTemplateSelect(template.id);
          setIsPreviewOpen(false);
        }}
        isSelected={previewTemplate?.id === selectedTemplateId}
      />
    </div>
  );
}
