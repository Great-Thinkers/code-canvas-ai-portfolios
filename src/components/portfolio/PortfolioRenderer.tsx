
import { ReactNode } from 'react';
import { useTemplateStyles } from '@/hooks/useTemplateStyles';
import { TemplateCustomization } from '@/types/templates';
import ModernMinimalTemplate from './templates/ModernMinimalTemplate';
import CreativeBoldTemplate from './templates/CreativeBoldTemplate';
import ClassicProfessionalTemplate from './templates/ClassicProfessionalTemplate';
import TechModernTemplate from './templates/TechModernTemplate';
import ElegantSimpleTemplate from './templates/ElegantSimpleTemplate';
import FuturisticGradientTemplate from './templates/FuturisticGradientTemplate';
import NeonCyberpunkTemplate from './templates/NeonCyberpunkTemplate';
import MinimalistModernTemplate from './templates/MinimalistModernTemplate';

interface PortfolioRendererProps {
  templateId: string;
  customization?: TemplateCustomization;
  portfolioData: any;
  className?: string;
}

const templateComponents = {
  'modern-minimal': ModernMinimalTemplate,
  'creative-bold': CreativeBoldTemplate,
  'classic-professional': ClassicProfessionalTemplate,
  'tech-modern': TechModernTemplate,
  'elegant-simple': ElegantSimpleTemplate,
  'futuristic-gradient': FuturisticGradientTemplate,
  'neon-cyberpunk': NeonCyberpunkTemplate,
  'minimalist-modern': MinimalistModernTemplate,
};

export default function PortfolioRenderer({
  templateId,
  customization,
  portfolioData,
  className,
}: PortfolioRendererProps) {
  const templateStyles = useTemplateStyles(templateId, customization);
  
  if (!templateStyles) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Template not found
      </div>
    );
  }

  const TemplateComponent = templateComponents[templateId as keyof typeof templateComponents];
  
  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Template component not implemented
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={templateStyles.cssVariables as React.CSSProperties}
    >
      <TemplateComponent
        portfolioData={portfolioData}
        template={templateStyles.template}
        customization={customization}
      >
        <div />
      </TemplateComponent>
    </div>
  );
}
