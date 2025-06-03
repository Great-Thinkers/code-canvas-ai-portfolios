
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Edit, 
  Download, 
  Share, 
  MoreVertical, 
  Trash2, 
  Copy 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PortfolioExportDialog from "@/components/portfolio/PortfolioExportDialog";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void;
}

export default function PortfolioCard({ portfolio, onDelete }: PortfolioCardProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", portfolio.id);

      if (error) {
        console.error("Error deleting portfolio:", error);
        toast.error("Failed to delete portfolio");
        return;
      }

      toast.success("Portfolio deleted successfully");
      onDelete(portfolio.id);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      // Fetch the original portfolio data
      const { data: originalData, error: fetchError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolio.id)
        .single();

      if (fetchError) {
        throw new Error("Failed to fetch portfolio data");
      }

      // Create a duplicate
      const { error: createError } = await supabase
        .from("portfolios")
        .insert({
          name: `${originalData.name} (Copy)`,
          template_name: originalData.template_name,
          portfolio_data: originalData.portfolio_data,
          is_published: false,
        });

      if (createError) {
        throw new Error("Failed to create duplicate");
      }

      toast.success("Portfolio duplicated successfully");
      // You might want to refresh the portfolio list here
      window.location.reload();
    } catch (error) {
      console.error("Duplicate error:", error);
      toast.error("Failed to duplicate portfolio");
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{portfolio.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{portfolio.template_name}</Badge>
                {portfolio.is_published && (
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(portfolio.updated_at).toLocaleDateString()}
          </p>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/dashboard/preview/${portfolio.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to={`/dashboard/edit/${portfolio.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <PortfolioExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        portfolioId={portfolio.id}
        portfolioName={portfolio.name}
      />
    </>
  );
}
