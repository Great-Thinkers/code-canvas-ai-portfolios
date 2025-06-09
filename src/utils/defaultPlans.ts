
export const DEFAULT_PLANS = [
  {
    name: "Free",
    description: "Perfect for getting started with portfolio building",
    price_monthly: 0,
    price_yearly: 0,
    max_portfolios: 2,
    max_ai_generations: 5,
    features: {
      basic_templates: true,
      premium_templates: false,
      auto_sync: false,
      ai_content: true,
      custom_domain: false,
      priority_support: false,
    },
    is_active: true,
  },
  {
    name: "Pro",
    description: "For professionals who need advanced features",
    price_monthly: 1200, // $12.00 in cents
    price_yearly: 12000, // $120.00 in cents (2 months free)
    max_portfolios: -1, // Unlimited
    max_ai_generations: -1, // Unlimited
    features: {
      basic_templates: true,
      premium_templates: true,
      auto_sync: true,
      ai_content: true,
      custom_domain: true,
      priority_support: true,
    },
    is_active: true,
  },
];
