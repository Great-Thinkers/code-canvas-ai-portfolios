
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Download, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PortfolioExportDialog from "@/components/portfolio/PortfolioExportDialog";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  is_published: boolean;
  preview_url: string | null;
  export_status: string | null;
  export_url: string | null;
  last_exported_at: string | null;
  portfolio_data: any;
}

function PortfolioPreviewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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

  const handlePublishToggle = async () => {
    if (!portfolio) return;

    try {
      const { error } = await supabase
        .from("portfolios")
        .update({ is_published: !portfolio.is_published })
        .eq("id", portfolio.id);

      if (error) {
        console.error("Error updating portfolio:", error);
        toast.error("Failed to update portfolio status");
        return;
      }

      setPortfolio({ ...portfolio, is_published: !portfolio.is_published });
      toast.success(
        portfolio.is_published 
          ? "Portfolio unpublished successfully" 
          : "Portfolio published successfully"
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleShare = () => {
    if (portfolio?.preview_url) {
      navigator.clipboard.writeText(portfolio.preview_url);
      toast.success("Preview URL copied to clipboard!");
    } else {
      toast.error("No preview URL available");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
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
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          {/* Header */}
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
                <h1 className="text-2xl font-bold">{portfolio.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{portfolio.template_name}</Badge>
                  <Badge variant={portfolio.is_published ? "default" : "secondary"}>
                    {portfolio.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={!portfolio.preview_url}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handlePublishToggle}>
                {portfolio.is_published ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/edit/${portfolio.id}`)}
              >
                Edit Portfolio
              </Button>
            </div>
          </div>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Portfolio Preview
                {portfolio.preview_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(portfolio.preview_url!, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg border overflow-hidden">
                {portfolio.preview_url ? (
                  <iframe
                    src={portfolio.preview_url}
                    className="w-full h-full"
                    title={`Preview of ${portfolio.name}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <h3 className="font-medium mb-2">Preview not available</h3>
                      <p className="text-sm">
                        Generate a preview by publishing your portfolio
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Status */}
          {portfolio.export_status && (
            <Card>
              <CardHeader>
                <CardTitle>Export Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge
                      variant={
                        portfolio.export_status === "completed"
                          ? "default"
                          : portfolio.export_status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {portfolio.export_status}
                    </Badge>
                    {portfolio.last_exported_at && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Last exported: {new Date(portfolio.last_exported_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {portfolio.export_url && portfolio.export_status === "completed" && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(portfolio.export_url!, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      <PortfolioExportDialog
        portfolio={portfolio}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExportComplete={fetchPortfolio}
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
