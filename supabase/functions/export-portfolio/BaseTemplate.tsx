import React, { ReactNode } from "https://esm.sh/react@18.2.0";

// Assuming TemplateTheme and TemplateCustomization are just type definitions
// and not needed for the rendering logic if all styles are via CSS variables
// or direct styling. For simplicity, they are removed here but might be needed
// if they contain actual values used by the template.
// import { TemplateTheme, TemplateCustomization } from '@/types/templates';

export interface BaseTemplateProps {
  portfolioData: any;
  // template: TemplateTheme; // Simplified: template object might not be needed if styles are from CSS vars
  // customization?: TemplateCustomization; // Simplified: customization passed directly if needed for visibility
  children: ReactNode;
  // Added customization directly for visibility, as ModernMinimalTemplate needs it.
  customization?: { sections?: { visibility?: { [key: string]: boolean } } };
}

export default function BaseTemplate({
  // portfolioData, // Not directly used by BaseTemplate structure, but passed to children
  // template,
  // customization, // Handled by ModernMinimalTemplate itself for section visibility
  children,
}: BaseTemplateProps) {
  // sectionVisibility and isVisible logic is directly used by ModernMinimalTemplate,
  // so it's better to keep it there or pass customization down.
  // For this SSR version, ModernMinimalTemplate will handle its own visibility logic.

  return (
    <div
      className="min-h-screen" // Tailwind class
      style={{
        // These will be applied if CSS variables are defined in the final HTML
        backgroundColor: "var(--template-background)",
        color: "var(--template-text)",
        fontFamily: "var(--template-font-family)",
        fontWeight: "var(--template-body-weight)",
      }}
    >
      <div
        className="mx-auto px-4 py-8" // Tailwind classes
        style={{
          maxWidth: "var(--template-max-width)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
