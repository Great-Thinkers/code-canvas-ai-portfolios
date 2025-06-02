
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PortfolioEditorSections from "@/components/portfolio/PortfolioEditorSections";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  is_published: boolean;
  portfolio_data: any;
}

function PortfolioEditorContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>({});

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
      setPortfolioData(data.portfolio_data || {});
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!portfolio) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("portfolios")
        .update({ 
          portfolio_data: portfolioData,
          updated_at: new Date().toISOString()
        })
        .eq("id", portfolio.id);

      if (error) {
        console.error("Error saving portfolio:", error);
        toast.error("Failed to save portfolio");
        return;
      }

      toast.success("Portfolio saved successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (newData: any) => {
    setPortfolioData({ ...portfolioData, ...newData });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
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
                <h1 className="text-2xl font-bold">Edit {portfolio.name}</h1>
                <p className="text-muted-foreground">
                  Customize your portfolio content and design
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/preview/${portfolio.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Editor Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Content</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioEditorSections
                portfolioData={portfolioData}
                onChange={handleDataChange}
                templateName={portfolio.template_name}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PortfolioEditor() {
  return (
    <ProtectedRoute>
      <PortfolioEditorContent />
    </ProtectedRoute>
  );
}
