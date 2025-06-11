
export const PREMIUM_TEMPLATE_IDS = [
  'tech-modern',
  'futuristic-gradient', 
  'neon-cyberpunk'
];

export const TEMPLATE_TIER_MAP = {
  'modern-minimal': 'free',
  'creative-bold': 'free',
  'classic-professional': 'free',
  'elegant-simple': 'free',
  'minimalist-modern': 'free',
  'tech-modern': 'premium',
  'futuristic-gradient': 'premium',
  'neon-cyberpunk': 'premium'
} as const;

export function isTemplatePremiuTemplate(templateId: string): boolean {
  return PREMIUM_TEMPLATE_IDS.includes(templateId);
}

export function getTemplateTier(templateId: string): 'free' | 'premium' {
  return TEMPLATE_TIER_MAP[templateId as keyof typeof TEMPLATE_TIER_MAP] || 'free';
}
