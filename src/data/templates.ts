
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
    id: 'futuristic-gradient',
    name: 'Futuristic Gradient',
    description: 'Cyberpunk-inspired design with vibrant gradients and modern aesthetics',
    preview: '/templates/futuristic-gradient.png',
    category: 'creative',
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
      fontFamily: 'Inter, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1400px',
      spacing: '3rem',
      borderRadius: '1rem',
    },
    features: ['Gradient Backgrounds', 'Animated Elements', 'Modern UI', 'Premium Support'],
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Terminal-inspired design with green neon accents and retro-futuristic feel',
    preview: '/templates/neon-cyberpunk.png',
    category: 'creative',
    isPremium: true,
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00aa00',
      background: '#000000',
      surface: '#0a0a0a',
      text: '#00ff00',
      textSecondary: '#00cc00',
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1300px',
      spacing: '2.5rem',
      borderRadius: '0rem',
    },
    features: ['Terminal Style', 'Neon Effects', 'Monospace Typography', 'Grid Backgrounds'],
  },
  {
    id: 'minimalist-modern',
    name: 'Minimalist Modern',
    description: 'Ultra-clean design focusing on typography and whitespace',
    preview: '/templates/minimalist-modern.png',
    category: 'minimal',
    isPremium: false,
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333',
      background: '#ffffff',
      surface: '#f9f9f9',
      text: '#000000',
      textSecondary: '#666666',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingWeight: '300',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1200px',
      spacing: '3rem',
      borderRadius: '0rem',
    },
    features: ['Ultra Minimal', 'Typography Focus', 'Clean Lines', 'Elegant Spacing'],
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
  {
    id: 'literary-folio',
    name: 'Literary Folio',
    description: 'A clean, text-focused design for writers and authors.',
    preview: '/templates/literary-folio.png',
    category: 'creative',
    isPremium: false,
    colors: {
      primary: '#4a5568',
      secondary: '#718096',
      accent: '#a0aec0',
      background: '#f7fafc',
      surface: '#ffffff',
      text: '#2d3748',
      textSecondary: '#718096',
    },
    typography: {
      fontFamily: 'Lora, serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '900px',
      spacing: '2rem',
      borderRadius: '0.25rem',
    },
    features: ['Publication Showcase', 'Author Bio', 'Clean Reading Experience'],
  },
  {
    id: 'marketing-pro',
    name: 'Marketing Pro',
    description: 'A template designed to highlight marketing campaigns and analytics.',
    preview: '/templates/marketing-pro.png',
    category: 'modern',
    isPremium: true,
    colors: {
      primary: '#1d4ed8',
      secondary: '#db2777',
      accent: '#f97316',
      background: '#f3f4f6',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1280px',
      spacing: '2.5rem',
      borderRadius: '0.75rem',
    },
    features: ['Campaign Showcase', 'Analytics Integration', 'Lead Generation Forms'],
  },
  {
    id: 'designer-showcase',
    name: 'Designer Showcase',
    description: 'A visually-driven template perfect for designers to showcase their work.',
    preview: '/templates/designer-showcase.png',
    category: 'creative',
    isPremium: true,
    colors: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#eab308',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      headingWeight: '800',
      bodyWeight: '400',
    },
    layout: {
      maxWidth: '1600px',
      spacing: '4rem',
      borderRadius: '1rem',
    },
    features: ['Full-width Header', 'Project Grid', 'Modern Aesthetics'],
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
