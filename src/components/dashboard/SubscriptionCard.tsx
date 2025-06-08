
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Zap, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubscriptionCard() {
  const { subscription, usage, loading, remainingPortfolios, canCreatePortfolio } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!subscription || !usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Unable to load subscription details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const plan = subscription.plan;
  const isPro = plan.name === "Pro";
  const portfolioProgress = plan.max_portfolios === -1 
    ? 100 
    : (usage.portfolios_count / plan.max_portfolios) * 100;

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "ai_content": return <Sparkles className="w-4 h-4" />;
      case "custom_domain": return <Globe className="w-4 h-4" />;
      case "auto_sync": return <Zap className="w-4 h-4" />;
      case "premium_templates": return <Crown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isPro && <Crown className="w-5 h-5 text-yellow-500" />}
              Current Plan: {plan.name}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <Badge variant={isPro ? "default" : "secondary"}>
            {isPro ? "Pro" : "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Portfolios Used</span>
            <span className="text-sm text-muted-foreground">
              {usage.portfolios_count}
              {plan.max_portfolios === -1 ? "" : ` / ${plan.max_portfolios}`}
            </span>
          </div>
          <Progress value={portfolioProgress} className="h-2" />
          {!canCreatePortfolio && (
            <p className="text-sm text-orange-600 mt-1">
              Portfolio limit reached. Upgrade to create more.
            </p>
          )}
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-medium mb-2">Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(plan.features).map(([feature, enabled]) => (
              enabled && (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  {getFeatureIcon(feature)}
                  <span className="capitalize">
                    {feature.replace(/_/g, " ")}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Upgrade Button */}
        {!isPro && (
          <div className="pt-2">
            <Link to="/pricing">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}

        {/* Manage Subscription */}
        {isPro && (
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
