
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Palette, Type, Layout, RotateCcw } from 'lucide-react';
import { TemplateTheme, TemplateCustomization } from '@/types/templates';

interface ThemeCustomizerProps {
  template: TemplateTheme;
  customization: TemplateCustomization;
  onChange: (customization: TemplateCustomization) => void;
  onReset: () => void;
}

export default function ThemeCustomizer({
  template,
  customization,
  onChange,
  onReset,
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState('colors');

  const updateColors = (colorKey: string, value: string) => {
    onChange({
      ...customization,
      colors: {
        ...customization.colors,
        [colorKey]: value,
      },
    });
  };

  const updateTypography = (key: string, value: string) => {
    onChange({
      ...customization,
      typography: {
        ...customization.typography,
        [key]: value,
      },
    });
  };

  const updateLayout = (key: string, value: string) => {
    onChange({
      ...customization,
      layout: {
        ...customization.layout,
        [key]: value,
      },
    });
  };

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    onChange({
      ...customization,
      sections: {
        ...customization.sections,
        visibility: {
          ...customization.sections?.visibility,
          [sectionId]: visible,
        },
      },
    });
  };

  const currentColors = { ...template.colors, ...customization.colors };
  const currentTypography = { ...template.typography, ...customization.typography };
  const currentLayout = { ...template.layout, ...customization.layout };

  const sections = [
    { id: 'personal', label: 'Personal Info', defaultVisible: true },
    { id: 'skills', label: 'Skills', defaultVisible: true },
    { id: 'experience', label: 'Experience', defaultVisible: true },
    { id: 'projects', label: 'Projects', defaultVisible: true },
    { id: 'education', label: 'Education', defaultVisible: true },
    { id: 'social', label: 'Social Links', defaultVisible: true },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customize Theme
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="sections">
              <Layout className="h-4 w-4 mr-2" />
              Sections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) => updateColors(key, e.target.value)}
                      className="w-16 h-10 p-1 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) => updateColors(key, e.target.value)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={currentTypography.fontFamily} onValueChange={(value) => updateTypography('fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter, sans-serif">Inter (Sans Serif)</SelectItem>
                    <SelectItem value="Poppins, sans-serif">Poppins (Sans Serif)</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia (Serif)</SelectItem>
                    <SelectItem value="Merriweather, serif">Merriweather (Serif)</SelectItem>
                    <SelectItem value="JetBrains Mono, monospace">JetBrains Mono (Monospace)</SelectItem>
                    <SelectItem value="Roboto, sans-serif">Roboto (Sans Serif)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Heading Weight</Label>
                <Select value={currentTypography.headingWeight} onValueChange={(value) => updateTypography('headingWeight', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Body Weight</Label>
                <Select value={currentTypography.bodyWeight} onValueChange={(value) => updateTypography('bodyWeight', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Max Width</Label>
                <Select value={currentLayout.maxWidth} onValueChange={(value) => updateLayout('maxWidth', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000px">Narrow (1000px)</SelectItem>
                    <SelectItem value="1200px">Medium (1200px)</SelectItem>
                    <SelectItem value="1400px">Wide (1400px)</SelectItem>
                    <SelectItem value="100%">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Spacing</Label>
                <Select value={currentLayout.spacing} onValueChange={(value) => updateLayout('spacing', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1rem">Compact (1rem)</SelectItem>
                    <SelectItem value="1.5rem">Normal (1.5rem)</SelectItem>
                    <SelectItem value="2rem">Comfortable (2rem)</SelectItem>
                    <SelectItem value="3rem">Spacious (3rem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Select value={currentLayout.borderRadius} onValueChange={(value) => updateLayout('borderRadius', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None (0)</SelectItem>
                    <SelectItem value="0.25rem">Small (0.25rem)</SelectItem>
                    <SelectItem value="0.5rem">Medium (0.5rem)</SelectItem>
                    <SelectItem value="0.75rem">Large (0.75rem)</SelectItem>
                    <SelectItem value="1rem">Extra Large (1rem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Section Visibility</h4>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between">
                      <Label htmlFor={section.id}>{section.label}</Label>
                      <Switch
                        id={section.id}
                        checked={customization.sections?.visibility?.[section.id] ?? section.defaultVisible}
                        onCheckedChange={(checked) => updateSectionVisibility(section.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
