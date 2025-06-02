
export interface TemplateTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
  };
  layout: {
    maxWidth: string;
    spacing: string;
    borderRadius: string;
  };
  features: string[];
}

export interface TemplateCustomization {
  templateId: string;
  colors?: Partial<TemplateTheme['colors']>;
  typography?: Partial<TemplateTheme['typography']>;
  layout?: Partial<TemplateTheme['layout']>;
  sections?: {
    order: string[];
    visibility: Record<string, boolean>;
  };
}
