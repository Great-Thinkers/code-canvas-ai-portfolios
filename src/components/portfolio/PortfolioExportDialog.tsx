
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Github, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Portfolio {
  id: string;
  name: string;
  template_name: string;
  portfolio_data: any;
}

interface PortfolioExportDialogProps {
  portfolio: Portfolio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportComplete: () => void;
}

const exportOptions = [
  {
    id: "zip",
    title: "Download as ZIP",
    description: "Download your portfolio as a static HTML/CSS/JS bundle",
    icon: Download,
    premium: false,
  },
  {
    id: "github-pages",
    title: "Deploy to GitHub Pages",
    description: "Automatically deploy to GitHub Pages with custom domain support",
    icon: Github,
    premium: true,
  },
  {
    id: "netlify",
    title: "Deploy to Netlify",
    description: "One-click deployment to Netlify with continuous deployment",
    icon: Globe,
    premium: true,
  },
];

export default function PortfolioExportDialog({
  portfolio,
  open,
  onOpenChange,
  onExportComplete,
}: PortfolioExportDialogProps) {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState("zip");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      // Create export record
      const { data: exportRecord, error: insertError } = await supabase
        .from("portfolio_exports")
        .insert({
          portfolio_id: portfolio.id,
          user_id: user.id,
          export_type: selectedOption,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating export record:", insertError);
        toast.error("Failed to start export process");
        return;
      }

      // Call the export edge function
      const { data, error } = await supabase.functions.invoke("export-portfolio", {
        body: {
          exportId: exportRecord.id,
          portfolioId: portfolio.id,
          exportType: selectedOption,
        },
      });

      if (error) {
        console.error("Error calling export function:", error);
        toast.error("Failed to export portfolio");
        return;
      }

      toast.success("Export started! You'll be notified when it's ready.");
      onExportComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Portfolio</DialogTitle>
          <DialogDescription>
            Choose how you'd like to export "{portfolio.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-4"
          >
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                    selectedOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  } ${option.premium ? "opacity-60" : ""}`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    disabled={option.premium}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={option.id}
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {option.title}
                      {option.premium && (
                        <Badge className="bg-brand-500 text-white hover:bg-brand-600">
                          Premium
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {exportOptions.find((opt) => opt.id === selectedOption)?.premium && (
                <p>Premium features require an upgraded plan.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={
                  isExporting ||
                  exportOptions.find((opt) => opt.id === selectedOption)?.premium
                }
              >
                {isExporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isExporting ? "Exporting..." : "Export Portfolio"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
