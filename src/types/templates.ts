
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

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;
    profilePicture?: string;
    socialLinks?: { platform: string; url: string }[];
  };
  projects?: {
    title: string;
    description: string;
    technologies?: string[];
    link?: string;
    image?: string;
  }[];
  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: string[];
  articles?: {
    title: string;
    summary: string;
    link: string;
    publicationDate: string;
  }[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}
