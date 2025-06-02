
import { useMemo } from 'react';
import { TemplateTheme, TemplateCustomization } from '@/types/templates';
import { getTemplateById } from '@/data/templates';

export function useTemplateStyles(
  templateId: string,
  customization?: TemplateCustomization
) {
  return useMemo(() => {
    const baseTemplate = getTemplateById(templateId);
    if (!baseTemplate) return null;

    // Merge base template with customizations
    const colors = { ...baseTemplate.colors, ...customization?.colors };
    const typography = { ...baseTemplate.typography, ...customization?.typography };
    const layout = { ...baseTemplate.layout, ...customization?.layout };

    // Generate CSS custom properties
    const cssVariables = {
      '--template-primary': colors.primary,
      '--template-secondary': colors.secondary,
      '--template-accent': colors.accent,
      '--template-background': colors.background,
      '--template-surface': colors.surface,
      '--template-text': colors.text,
      '--template-text-secondary': colors.textSecondary,
      '--template-font-family': typography.fontFamily,
      '--template-heading-weight': typography.headingWeight,
      '--template-body-weight': typography.bodyWeight,
      '--template-max-width': layout.maxWidth,
      '--template-spacing': layout.spacing,
      '--template-border-radius': layout.borderRadius,
    };

    return {
      template: baseTemplate,
      colors,
      typography,
      layout,
      cssVariables,
    };
  }, [templateId, customization]);
}
