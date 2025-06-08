
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useStripe } from "@/hooks/useStripe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ExternalLink, Loader2 } from "lucide-react";

export default function SubscriptionCard() {
  const { subscription, usage, loading } = useSubscription();
  const { openCustomerPortal, loading: stripeLoading } = useStripe();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPaidPlan = subscription?.plan.name !== "Free";
  const usagePercentage = subscription && usage 
    ? (usage.portfolios_count / (subscription.plan.max_portfolios === -1 ? 100 : subscription.plan.max_portfolios)) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription</span>
          {isPaidPlan && <Crown className="w-5 h-5 text-yellow-500" />}
        </CardTitle>
        <CardDescription>Your current plan and usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Current Plan</span>
          <Badge variant={isPaidPlan ? "default" : "secondary"}>
            {subscription?.plan.name || "Free"}
          </Badge>
        </div>

        {subscription && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Portfolios Used</span>
                <span>
                  {usage?.portfolios_count || 0}
                  {subscription.plan.max_portfolios === -1 
                    ? " / Unlimited" 
                    : ` / ${subscription.plan.max_portfolios}`
                  }
                </span>
              </div>
              {subscription.plan.max_portfolios !== -1 && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {subscription.current_period_end && (
              <div className="flex justify-between text-sm">
                <span>Next Billing</span>
                <span>
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}

            {subscription.cancel_at_period_end && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Your subscription will cancel at the end of the current period.
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 pt-4">
          <Button asChild variant="outline" className="flex-1">
            <a href="/pricing">
              Change Plan
            </a>
          </Button>
          {isPaidPlan && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={openCustomerPortal}
              disabled={stripeLoading}
            >
              {stripeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Manage
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
