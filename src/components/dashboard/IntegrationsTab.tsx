import IntegrationCard from "@/components/dashboard/IntegrationCard";
import EnhancedGitHubIntegration from "@/components/dashboard/EnhancedGitHubIntegration";
import EnhancedLinkedInIntegration from "@/components/dashboard/EnhancedLinkedInIntegration";
import { BehanceIntegrationCard } from "./BehanceIntegrationCard";
import { MediumIntegrationCard } from "./MediumIntegrationCard";
import { DribbbleIntegrationCard } from "./DribbbleIntegrationCard";
import { CustomProfileDataCard } from "./CustomProfileDataCard";
import { useToast } from "@/components/ui/use-toast";
import { useGitHubIntegration } from "@/hooks/useGitHubIntegration";
import { useLinkedInIntegration } from "@/hooks/useLinkedInIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function IntegrationsTab() {
  const { toast } = useToast();

  const {
    isConnected: githubConnected,
    profile: githubProfile,
    connectGitHub,
    disconnectGitHub,
    syncData: syncGitHub,
    loading: githubLoading,
  } = useGitHubIntegration();

  const {
    isConnected: linkedinConnected,
    profile: linkedinProfile,
    connectLinkedIn,
    disconnectLinkedIn,
    syncData: syncLinkedIn,
    loading: linkedinLoading,
  } = useLinkedInIntegration();

  const handleConnectGithub = async () => {
    try {
      await connectGitHub();
      toast({
        title: "GitHub OAuth initiated",
        description:
          "You'll be redirected to GitHub to authorize the connection.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "GitHub connection failed",
        description: "There was an error initiating the GitHub OAuth flow.",
      });
    }
  };

  const handleSyncLinkedIn = async () => {
    try {
      await syncLinkedIn();
      toast({
        title: "LinkedIn Sync Initiated",
        description:
          "Timestamp updated. Note: Full LinkedIn data sync requires special API permissions not yet enabled for this application.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "LinkedIn sync failed",
        description: "There was an error attempting to sync with LinkedIn.",
      });
    }
  };

  const handleSyncGitHub = async () => {
    try {
      await syncGitHub();
      toast({
        title: "GitHub data sync started",
        description: "Your GitHub data is being updated in the background.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "GitHub sync failed",
        description: "There was an error syncing your GitHub data.",
      });
    }
  };

  const handleDisconnectGithub = async () => {
    try {
      await disconnectGitHub();
      toast({
        title: "GitHub disconnected",
        description: "Your GitHub account has been unlinked.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Disconnection failed",
        description: "There was an error disconnecting your GitHub account.",
      });
    }
  };

  const handleConnectLinkedin = async () => {
    try {
      await connectLinkedIn();
      toast({
        title: "LinkedIn Demo Profile Created",
        description:
          "A demo LinkedIn profile has been created for testing purposes.",
      });
    } catch (error) {
      const e = error as Error;
      if (e.message?.includes("LinkedIn OAuth is not fully configured")) {
        toast({
          variant: "destructive",
          title: "LinkedIn OAuth Setup Required",
          description: e.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "LinkedIn connection failed",
          description: "There was an error creating the LinkedIn connection.",
        });
      }
    }
  };

  const handleDisconnectLinkedin = async () => {
    try {
      await disconnectLinkedIn();
      toast({
        title: "LinkedIn disconnected",
        description: "Your LinkedIn account has been unlinked.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Disconnection failed",
        description: "There was an error disconnecting your LinkedIn account.",
      });
    }
  };

  return (
    <div className="mt-6">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>LinkedIn Integration Notice:</strong> LinkedIn OAuth requires
          special configuration in Supabase. The LinkedIn integration currently
          uses demo data for testing. To enable full LinkedIn OAuth, please
          configure the LinkedIn provider in your Supabase Auth settings.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          {githubConnected && (
            <TabsTrigger value="github-advanced">GitHub Analytics</TabsTrigger>
          )}
          {linkedinConnected && (
            <TabsTrigger value="linkedin-advanced">
              LinkedIn Insights
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="connections">
          <div className="space-y-8">
            {/* Main Integrations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Platform Integrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IntegrationCard
                  name="GitHub"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-full"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  }
                  description="Sync your repositories, contributions, and coding languages with enhanced analytics."
                  isConnected={githubConnected}
                  onConnect={handleConnectGithub}
                  onDisconnect={handleDisconnectGithub}
                  onSyncData={handleSyncGitHub}
                  loading={githubLoading}
                  lastSynced={githubProfile?.last_synced_at}
                  profileData={githubProfile}
                />

                <IntegrationCard
                  name="LinkedIn"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-full"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  }
                  description="Import your professional experience, education, and skills with advanced career insights. (Demo Mode)"
                  isConnected={linkedinConnected}
                  onConnect={handleConnectLinkedin}
                  onDisconnect={handleDisconnectLinkedin}
                  onSyncData={handleSyncLinkedIn}
                  loading={linkedinLoading}
                  lastSynced={linkedinProfile?.last_synced_at}
                  profileData={linkedinProfile}
                />
              </div>
            </div>

            {/* Creative Platform Integrations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Creative & Writing Platforms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BehanceIntegrationCard />
                <MediumIntegrationCard />
                <DribbbleIntegrationCard />
              </div>
            </div>

            {/* Custom Data */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Custom Professional Data
              </h3>
              <CustomProfileDataCard />
            </div>
          </div>
        </TabsContent>

        {githubConnected && (
          <TabsContent value="github-advanced">
            <EnhancedGitHubIntegration />
          </TabsContent>
        )}

        {linkedinConnected && (
          <TabsContent value="linkedin-advanced">
            <EnhancedLinkedInIntegration />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
