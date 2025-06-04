
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: error.message,
          });
          navigate("/login");
          return;
        }

        if (data.session) {
          // Check if this was a GitHub or LinkedIn OAuth flow
          const provider = data.session.user.app_metadata?.provider;
          
          if (provider === "github") {
            toast({
              title: "GitHub Connected Successfully!",
              description: "Your GitHub account has been linked. Syncing your data...",
            });
            
            // Trigger GitHub data sync
            try {
              await supabase.functions.invoke("sync-github-data", {
                body: { user_id: data.session.user.id },
              });
              
              toast({
                title: "GitHub Data Synced",
                description: "Your repositories and profile data have been imported.",
              });
            } catch (syncError) {
              console.error("GitHub sync error:", syncError);
              toast({
                variant: "destructive",
                title: "Sync Warning",
                description: "GitHub connected but data sync failed. You can retry from the dashboard.",
              });
            }
          } else if (provider === "linkedin_oidc") {
            toast({
              title: "LinkedIn Connected Successfully!",
              description: "Your LinkedIn account has been linked.",
            });
          }

          // Redirect to dashboard with integrations tab active
          navigate("/dashboard?tab=integrations");
        } else {
          // No session found, redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try connecting your account again.",
        });
        navigate("/dashboard");
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Processing Integration...</h2>
        <p className="text-muted-foreground">
          Please wait while we complete your account connection.
        </p>
      </div>
    </div>
  );
}
