
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Share, Download } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import PortfolioExportDialog from "@/components/portfolio/PortfolioExportDialog";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  is_published: boolean;
  portfolio_data: any;
}

function PortfolioPreviewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchPortfolio();
    }
  }, [id, user]);

  const fetchPortfolio = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching portfolio:", error);
        toast.error("Failed to load portfolio");
        navigate("/dashboard");
        return;
      }

      setPortfolio(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <div className="container py-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Portfolio not found</h1>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Preview Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{portfolio.name} - Preview</h1>
                <p className="text-sm text-muted-foreground">
                  Template: {portfolio.template_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/edit/${portfolio.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" disabled>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <main className="flex-1">
        <PortfolioRenderer
          templateId={portfolio.template_name}
          customization={portfolio.portfolio_data?.customization}
          portfolioData={portfolio.portfolio_data}
        />
      </main>

      {/* Export Dialog */}
      <PortfolioExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        portfolioId={portfolio.id}
        portfolioName={portfolio.name}
      />
    </div>
  );
}

export default function PortfolioPreview() {
  return (
    <ProtectedRoute>
      <PortfolioPreviewContent />
    </ProtectedRoute>
  );
}
