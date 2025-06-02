
import { useEffect, useState, useRef } from "react";
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
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";

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
  const [lastSavedStatus, setLastSavedStatus] = useState<string>("All changes saved");

  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 2500; // 2.5 seconds

  useEffect(() => {
    if (id && user) {
      fetchPortfolio();
    }
  }, [id, user]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (Object.keys(portfolioData).length === 0) { // Do not save if portfolioData is empty (e.g. after initial load error)
      return;
    }

    setLastSavedStatus("Unsaved changes");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(true); // Pass a flag to indicate auto-save
    }, DEBOUNCE_DELAY);

    // Clear timeout on component unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [portfolioData]);

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

  const handleSave = async (isAutoSave = false) => {
    if (!portfolio || Object.keys(portfolioData).length === 0) return;

    if (saveTimeoutRef.current) { // Clear any pending auto-save if manual save is triggered
      clearTimeout(saveTimeoutRef.current);
    }

    setSaving(true);
    setLastSavedStatus("Saving...");
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
        toast.error(isAutoSave ? "Auto-save failed" : "Failed to save portfolio");
        setLastSavedStatus("Error saving");
        return;
      }

      toast.success(isAutoSave ? "Changes automatically saved!" : "Portfolio saved successfully!");
      setLastSavedStatus("All changes saved");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during save");
      setLastSavedStatus("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (newData: any) => {
    // Check if newData is actually different from portfolioData to avoid unnecessary triggers
    // This is a shallow check. For deep equality, a more robust solution might be needed.
    let changed = false;
    for (const key in newData) {
      if (newData[key] !== portfolioData[key]) { // This comparison might be tricky for objects/arrays
        changed = true;
        break;
      }
    }
    // Also check if new keys are added
    if (Object.keys(newData).length !== Object.keys(portfolioData).filter(k => newData.hasOwnProperty(k)).length) {
        changed = true;
    }


    if (changed || Object.keys(portfolioData).length === 0 && Object.keys(newData).length > 0) {
       setPortfolioData(prevData => ({ ...prevData, ...newData }));
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
                // Consider disabling or changing text if inline preview is sufficient
                // disabled={true}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview in new tab
              </Button>
              <Button onClick={() => handleSave(false)} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {!saving && <Save className="h-4 w-4 mr-2" />}
                {lastSavedStatus === "Saving..." ? "Saving..." :
                 lastSavedStatus === "All changes saved" ? "All changes saved" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content: Editor and Preview */}
        <div className="flex gap-8">
          {/* Editor Column (60%) */}
          <div className="w-3/5 space-y-6">
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

          {/* Preview Column (40%) */}
          <div className="w-2/5 space-y-6">
            <Card className="sticky top-24"> {/* Sticky for scrolling */}
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100vh-12rem)] overflow-y-auto bg-muted/40 border rounded-md">
                {/* Ensure PortfolioRenderer is robust enough for partial data */}
                <PortfolioRenderer
                  templateId={portfolioData.template || portfolio.template_name}
                  portfolioData={portfolioData}
                  customization={portfolioData.customization || {}}
                />
              </CardContent>
            </Card>
          </div>
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
