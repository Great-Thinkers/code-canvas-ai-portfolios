
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Check, Eye } from 'lucide-react';
import { availableTemplates, getTemplatesByCategory } from '@/data/templates';
import { TemplateTheme } from '@/types/templates';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (template: TemplateTheme) => void;
  onPreview: (template: TemplateTheme) => void;
}

export default function TemplateSelector({
  selectedTemplateId,
  onTemplateSelect,
  onPreview,
}: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateTheme['category']>('modern');

  const categories = [
    { id: 'modern' as const, label: 'Modern', count: getTemplatesByCategory('modern').length },
    { id: 'minimal' as const, label: 'Minimal', count: getTemplatesByCategory('minimal').length },
    { id: 'classic' as const, label: 'Classic', count: getTemplatesByCategory('classic').length },
    { id: 'creative' as const, label: 'Creative', count: getTemplatesByCategory('creative').length },
  ];

  const filteredTemplates = getTemplatesByCategory(activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as TemplateTheme['category'])}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="relative">
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplateId === template.id
                      ? 'ring-2 ring-primary shadow-lg'
                      : ''
                  }`}
                >
                  {template.isPremium && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-amber-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  
                  {selectedTemplateId === template.id && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="p-0">
                    <div 
                      className="h-48 bg-gradient-to-br rounded-t-lg"
                      style={{
                        background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`
                      }}
                    >
                      <div className="h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-lg font-semibold mb-2">{template.name}</div>
                          <div className="text-sm opacity-80">Preview</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => onPreview(template)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => onTemplateSelect(template)}
                          disabled={template.isPremium}
                        >
                          {selectedTemplateId === template.id ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
