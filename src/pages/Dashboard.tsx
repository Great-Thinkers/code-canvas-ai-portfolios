
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PortfolioCard from '@/components/dashboard/PortfolioCard';
import IntegrationCard from '@/components/dashboard/IntegrationCard';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Sample data - in a real app this would come from your backend
const samplePortfolios = [
  {
    id: '1',
    name: 'My Professional Portfolio',
    template: 'Modern Minimal',
    lastUpdated: '2 days ago',
    isPublished: true,
    previewUrl: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Side Project Showcase',
    template: 'Tech Stack',
    lastUpdated: '1 week ago',
    isPublished: false,
    previewUrl: '/placeholder.svg',
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [githubConnected, setGithubConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  const handleConnectGithub = () => {
    // This would trigger the OAuth flow in a real app
    setGithubConnected(true);
    toast({
      title: "GitHub connected",
      description: "Your GitHub account has been successfully linked.",
    });
  };

  const handleDisconnectGithub = () => {
    setGithubConnected(false);
    toast({
      title: "GitHub disconnected",
      description: "Your GitHub account has been unlinked.",
    });
  };

  const handleConnectLinkedin = () => {
    // This would trigger the OAuth flow in a real app
    setLinkedinConnected(true);
    toast({
      title: "LinkedIn connected",
      description: "Your LinkedIn account has been successfully linked.",
    });
  };

  const handleDisconnectLinkedin = () => {
    setLinkedinConnected(false);
    toast({
      title: "LinkedIn disconnected",
      description: "Your LinkedIn account has been unlinked.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <DashboardHeader />
        
        <Tabs defaultValue="portfolios" className="mt-6">
          <TabsList>
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolios" className="mt-6">
            {samplePortfolios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {samplePortfolios.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} {...portfolio} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first portfolio to get started
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IntegrationCard 
                name="GitHub"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                }
                description="Sync your repositories, contributions, and coding languages."
                isConnected={githubConnected}
                onConnect={handleConnectGithub}
                onDisconnect={handleDisconnectGithub}
              />
              
              <IntegrationCard 
                name="LinkedIn"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                }
                description="Import your professional experience, education, and skills."
                isConnected={linkedinConnected}
                onConnect={handleConnectLinkedin}
                onDisconnect={handleDisconnectLinkedin}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-muted-foreground mb-8">
                Manage your account preferences and subscription details.
              </p>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Subscription Plan</h3>
                  <div className="p-4 rounded-lg border border-border bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Free Plan</p>
                        <p className="text-sm text-muted-foreground">2/2 portfolios used</p>
                      </div>
                      <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Information</h3>
                  <div className="p-4 rounded-lg border border-border bg-muted/50">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground mb-2">john.doe@example.com</p>
                    <div className="flex gap-2 text-sm">
                      <button className="text-brand-500 hover:text-brand-600 font-medium">
                        Change email
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button className="text-brand-500 hover:text-brand-600 font-medium">
                        Change password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
