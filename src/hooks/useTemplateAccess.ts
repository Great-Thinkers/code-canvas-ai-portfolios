
import { useMemo } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export interface TemplateAccessInfo {
  canAccess: boolean;
  reason?: string;
  upgradeRequired: boolean;
}

export function useTemplateAccess() {
  const { subscription, loading } = useSubscription();

  const checkTemplateAccess = useMemo(() => {
    return (templateId: string, isPremium: boolean = false): TemplateAccessInfo => {
      if (loading) {
        return { canAccess: false, reason: 'Loading...', upgradeRequired: false };
      }

      if (!subscription) {
        return { 
          canAccess: !isPremium, 
          reason: isPremium ? 'Premium template requires subscription' : undefined,
          upgradeRequired: isPremium 
        };
      }

      const isPaidPlan = subscription.plan.name !== 'Free';
      const hasPremiumAccess = subscription.plan.features?.premium_templates === true;

      if (isPremium && !hasPremiumAccess) {
        return {
          canAccess: false,
          reason: 'Premium template requires Pro subscription',
          upgradeRequired: true
        };
      }

      return { canAccess: true, upgradeRequired: false };
    };
  }, [subscription, loading]);

  const hasPremiuAccess = useMemo(() => {
    return subscription?.plan.features?.premium_templates === true;
  }, [subscription]);

  return {
    checkTemplateAccess,
    hasPremiuAccess,
    loading
  };
}
