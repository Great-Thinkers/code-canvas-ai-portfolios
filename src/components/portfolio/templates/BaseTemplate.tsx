import { ReactNode } from "react";
import {
  TemplateTheme,
  TemplateCustomization,
  PortfolioData,
} from "@/types/templates";

interface BaseTemplateProps {
  portfolioData: PortfolioData;
  template: TemplateTheme;
  customization?: TemplateCustomization;
  children: ReactNode;
}

export default function BaseTemplate({
  portfolioData,
  template,
  customization,
  children,
}: BaseTemplateProps) {
  const sectionVisibility = customization?.sections?.visibility || {};

  const isVisible = (sectionId: string) => {
    return sectionVisibility[sectionId] !== false;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--template-background)",
        color: "var(--template-text)",
        fontFamily: "var(--template-font-family)",
        fontWeight: "var(--template-body-weight)",
      }}
    >
      <div
        className="mx-auto px-4 py-8"
        style={{
          maxWidth: "var(--template-max-width)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { type BaseTemplateProps };
