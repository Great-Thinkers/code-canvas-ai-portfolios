
import { TemplateTheme } from '@/types/templates';

export const availableTemplates: TemplateTheme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and professional design with plenty of white space',
    preview: '/templates/modern-minimal.png',
    category: 'minimal',
    isPremium: false,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1200px',
      spacing: '2rem',
      borderRadius: '0.5rem',
    },
    features: ['Responsive Design', 'Clean Typography', 'Mobile Optimized'],
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Vibrant colors and dynamic layouts for creative professionals',
    preview: '/templates/creative-bold.png',
    category: 'creative',
    isPremium: true,
    colors: {
      primary: '#7c3aed',
      secondary: '#e11d48',
      accent: '#f59e0b',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1400px',
      spacing: '3rem',
      borderRadius: '1rem',
    },
    features: ['Dark Theme', 'Animations', 'Creative Layouts', 'Premium Support'],
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional layout perfect for corporate environments',
    preview: '/templates/classic-professional.png',
    category: 'classic',
    isPremium: false,
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#059669',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
    },
    typography: {
      fontFamily: 'Georgia, serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1100px',
      spacing: '1.5rem',
      borderRadius: '0.25rem',
    },
    features: ['Professional Look', 'PDF Export Ready', 'ATS Friendly'],
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Perfect for developers and tech professionals',
    preview: '/templates/tech-modern.png',
    category: 'modern',
    isPremium: true,
    colors: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#0a0a0a',
      surface: '#1f1f1f',
      text: '#ffffff',
      textSecondary: '#9ca3af',
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      headingWeight: '600',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1300px',
      spacing: '2.5rem',
      borderRadius: '0.75rem',
    },
    features: ['Code Syntax Highlighting', 'GitHub Integration', 'Tech Stack Icons', 'Dark Mode'],
  },
  {
    id: 'elegant-simple',
    name: 'Elegant Simple',
    description: 'Sophisticated and minimalist design',
    preview: '/templates/elegant-simple.png',
    category: 'minimal',
    isPremium: false,
    colors: {
      primary: '#374151',
      secondary: '#9ca3af',
      accent: '#d97706',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    typography: {
      fontFamily: 'Merriweather, serif',
      headingWeight: '700',
      bodyWeight: '300',
    },
    layout: {
      maxWidth: '1000px',
      spacing: '2rem',
      borderRadius: '0.5rem',
    },
    features: ['Elegant Typography', 'Subtle Animations', 'Print Friendly'],
  },
];

export const getTemplateById = (id: string): TemplateTheme | undefined => {
  return availableTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: TemplateTheme['category']): TemplateTheme[] => {
  return availableTemplates.filter(template => template.category === category);
};

export const getFreeTemplates = (): TemplateTheme[] => {
  return availableTemplates.filter(template => !template.isPremium);
};

export const getPremiumTemplates = (): TemplateTheme[] => {
  return availableTemplates.filter(template => template.isPremium);
};
