import { ReactNode, useEffect } from "react";
import { useTemplateStyles } from "@/hooks/useTemplateStyles";
import { TemplateCustomization, PortfolioData } from "@/types/templates";
import ModernMinimalTemplate from "./templates/ModernMinimalTemplate";
import CreativeBoldTemplate from "./templates/CreativeBoldTemplate";
import ClassicProfessionalTemplate from "./templates/ClassicProfessionalTemplate";
import TechModernTemplate from "./templates/TechModernTemplate";
import ElegantSimpleTemplate from "./templates/ElegantSimpleTemplate";
import FuturisticGradientTemplate from "./templates/FuturisticGradientTemplate";
import NeonCyberpunkTemplate from "./templates/NeonCyberpunkTemplate";
import MinimalistModernTemplate from "./templates/MinimalistModernTemplate";
import { LiteraryFolioTemplate } from "./templates/LiteraryFolioTemplate";
import { MarketingProTemplate } from "./templates/MarketingProTemplate";
import { DesignerShowcaseTemplate } from "./templates/DesignerShowcaseTemplate";

interface PortfolioRendererProps {
  templateId: string;
  customization?: TemplateCustomization;
  portfolioData: PortfolioData;
  className?: string;
}

const templateComponents = {
  "modern-minimal": ModernMinimalTemplate,
  "creative-bold": CreativeBoldTemplate,
  "classic-professional": ClassicProfessionalTemplate,
  "tech-modern": TechModernTemplate,
  "elegant-simple": ElegantSimpleTemplate,
  "futuristic-gradient": FuturisticGradientTemplate,
  "neon-cyberpunk": NeonCyberpunkTemplate,
  "minimalist-modern": MinimalistModernTemplate,
  "literary-folio": LiteraryFolioTemplate,
  "marketing-pro": MarketingProTemplate,
  "designer-showcase": DesignerShowcaseTemplate,
};

export default function PortfolioRenderer({
  templateId,
  customization,
  portfolioData,
  className,
}: PortfolioRendererProps) {
  const templateStyles = useTemplateStyles(templateId, customization);

  useEffect(() => {
    if (portfolioData?.seo) {
      document.title = portfolioData.seo.title;
      const descriptionMeta = document.querySelector(
        'meta[name="description"]'
      );
      if (descriptionMeta) {
        descriptionMeta.setAttribute("content", portfolioData.seo.description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = portfolioData.seo.description;
        document.head.appendChild(meta);
      }
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute(
          "content",
          portfolioData.seo.keywords.join(", ")
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = portfolioData.seo.keywords.join(", ");
        document.head.appendChild(meta);
      }
    }
  }, [portfolioData]);

  if (!templateStyles) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Template not found
      </div>
    );
  }

  const TemplateComponent =
    templateComponents[templateId as keyof typeof templateComponents];

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
