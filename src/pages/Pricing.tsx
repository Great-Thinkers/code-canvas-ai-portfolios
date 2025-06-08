
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_portfolios: number;
  features: Record<string, boolean>;
}

export default function Pricing() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const getFeatureList = (features: Record<string, boolean>) => {
    const featureMap: Record<string, string> = {
      basic_templates: "Basic Templates",
      premium_templates: "Premium Templates",
      auto_sync: "Auto GitHub/LinkedIn Sync",
      ai_content: "AI Content Generation",
      custom_domain: "Custom Domain",
      priority_support: "Priority Support"
    };

    return Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => featureMap[key] || key);
  };

  const getCurrentPlanId = () => {
    return subscription?.plan_id;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/50">
          <div className="container py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Start building your professional portfolio today. Upgrade anytime
              as your needs grow.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="container py-16">
          {loading ? (
            <div className="text-center">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => {
                const isPro = plan.name === "Pro";
                const isCurrentPlan = getCurrentPlanId() === plan.id;
                const features = getFeatureList(plan.features);

                return (
                  <Card key={plan.id} className={`relative ${isPro ? "border-primary shadow-lg" : ""}`}>
                    {isPro && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Crown className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        {isPro && <Crown className="w-5 h-5 text-yellow-500" />}
                        {plan.name}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">
                          {formatPrice(plan.price_monthly)}
                        </span>
                        {plan.price_monthly > 0 && (
                          <span className="text-muted-foreground">/month</span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          {plan.max_portfolios === -1 
                            ? "Unlimited portfolios" 
                            : `${plan.max_portfolios} portfolios`
                          }
                        </div>
                        
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center text-sm">
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        {isCurrentPlan ? (
                          <Button disabled className="w-full">
                            Current Plan
                          </Button>
                        ) : user ? (
                          <Button 
                            className="w-full" 
                            variant={isPro ? "default" : "outline"}
                          >
                            {isPro ? "Upgrade to Pro" : "Downgrade to Free"}
                          </Button>
                        ) : (
                          <Link to="/signup">
                            <Button className="w-full" variant={isPro ? "default" : "outline"}>
                              Get Started
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-semibold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">
                What happens to my portfolios if I downgrade?
              </h3>
              <p className="text-muted-foreground">
                Your existing portfolios remain active, but you won't be able to create new ones beyond the free plan limit. Premium features will be disabled.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
                No questions asked.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I use my own domain?</h3>
              <p className="text-muted-foreground">
                Custom domains are available for Pro plans. You
                can connect your domain through our deployment settings.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
