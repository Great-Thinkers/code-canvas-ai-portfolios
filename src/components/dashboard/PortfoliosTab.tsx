
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Plus } from "lucide-react";
import { toast } from "sonner";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  template_id: number;
  updated_at: string;
  is_published: boolean;
  portfolio_data: any;
  created_at: string;
}

export default function PortfoliosTab() {
  const { user } = useAuth();
  const { canCreatePortfolio, remainingPortfolios, subscription, refreshSubscription } = useSubscription();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolios:", error);
        toast.error("Failed to load portfolios");
        return;
      }

      setPortfolios(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    // Refresh subscription to update usage counts
    await refreshSubscription();
  };

  if (loading) {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Subscription Status Alert */}
      {!canCreatePortfolio && (
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            You've reached your portfolio limit ({subscription?.plan.max_portfolios} portfolios). 
            <Link to="/pricing" className="font-medium text-primary hover:underline ml-1">
              Upgrade to Pro
            </Link> for unlimited portfolios and premium features.
          </AlertDescription>
        </Alert>
      )}

      {/* Create Portfolio Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Your Portfolios</h3>
          {subscription && (
            <p className="text-sm text-muted-foreground">
              {portfolios.length} of {subscription.plan.max_portfolios === -1 ? "unlimited" : subscription.plan.max_portfolios} portfolios used
            </p>
          )}
        </div>
        
        {canCreatePortfolio ? (
          <Link to="/dashboard/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Portfolio
            </Button>
          </Link>
        ) : (
          <Link to="/pricing">
            <Button>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Create More
            </Button>
          </Link>
        )}
      </div>

      {/* Portfolios Grid */}
      {portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onDelete={handleDeletePortfolio}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first portfolio to get started
          </p>
          {canCreatePortfolio ? (
            <Link to="/dashboard/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Portfolio
              </Button>
            </Link>
          ) : (
            <Link to="/pricing">
              <Button>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
