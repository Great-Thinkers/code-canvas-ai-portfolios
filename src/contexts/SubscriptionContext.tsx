
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_portfolios: number;
  features: Record<string, boolean>;
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  plan: SubscriptionPlan;
}

interface UserUsage {
  portfolios_count: number;
  ai_generations_count: number;
}

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  usage: UserUsage | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  canCreatePortfolio: boolean;
  canUseAI: boolean;
  remainingPortfolios: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface types
      const transformedPlans: SubscriptionPlan[] = (data || []).map(plan => ({
        ...plan,
        features: plan.features as Record<string, boolean>
      }));
      
      setPlans(transformedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    }
  };

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        // Transform the nested plan data
        const transformedSubscription: UserSubscription = {
          ...data,
          plan: {
            ...data.plan,
            features: data.plan.features as Record<string, boolean>
          }
        };
        setSubscription(transformedSubscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const fetchUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await Promise.all([fetchSubscription(), fetchUsage()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setSubscription(null);
      setUsage(null);
      setLoading(false);
    }
  }, [user]);

  const canCreatePortfolio = React.useMemo(() => {
    if (!subscription || !usage) return false;
    const maxPortfolios = subscription.plan.max_portfolios;
    return maxPortfolios === -1 || usage.portfolios_count < maxPortfolios;
  }, [subscription, usage]);

  const canUseAI = React.useMemo(() => {
    if (!subscription) return false;
    return subscription.plan.features.ai_content === true;
  }, [subscription]);

  const remainingPortfolios = React.useMemo(() => {
    if (!subscription || !usage) return 0;
    const maxPortfolios = subscription.plan.max_portfolios;
    if (maxPortfolios === -1) return Infinity;
    return Math.max(0, maxPortfolios - usage.portfolios_count);
  }, [subscription, usage]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        usage,
        plans,
        loading,
        refreshSubscription,
        canCreatePortfolio,
        canUseAI,
        remainingPortfolios,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
