import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  Linkedin, 
  Palette, 
  FileText, 
  User, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Users,
  Eye,
  Heart
} from 'lucide-react';
import { useGitHubIntegration } from '@/hooks/useGitHubIntegration';
import { useLinkedInIntegration } from '@/hooks/useLinkedInIntegration';
import { useBehanceIntegration } from '@/hooks/useBehanceIntegration';
import { useMediumIntegration } from '@/hooks/useMediumIntegration';
import { useCustomProfileData } from '@/hooks/useCustomProfileData';

const IntegrationSummaryCard: React.FC<{
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  stats?: { label: string; value: string | number }[];
  description: string;
}> = ({ name, icon, isConnected, stats, description }) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{name}</CardTitle>
        </div>
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Connected" : "Not Connected"}
        </Badge>
      </div>
      <CardDescription className="text-sm">{description}</CardDescription>
    </CardHeader>
    {isConnected && stats && (
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    )}
  </Card>
);

export const IntegrationOverview: React.FC = () => {
  const { isConnected: githubConnected, profile: githubProfile } = useGitHubIntegration();
  const { isConnected: linkedinConnected, profile: linkedinProfile } = useLinkedInIntegration();
  const { isConnected: behanceConnected, profile: behanceProfile, projects } = useBehanceIntegration();
  const { isConnected: mediumConnected, profile: mediumProfile, articles } = useMediumIntegration();
  const { data: customData } = useCustomProfileData();

  const connectedCount = [githubConnected, linkedinConnected, behanceConnected, mediumConnected].filter(Boolean).length;
  const totalSources = 4;
  const completionPercentage = Math.round((connectedCount / totalSources) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Integration Overview
          </CardTitle>
          <CardDescription>
            Your portfolio data integration status across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{connectedCount}</div>
              <div className="text-sm text-muted-foreground">Connected Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Integration Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{customData.length}</div>
              <div className="text-sm text-muted-foreground">Custom Data Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(githubProfile?.public_repos || 0) + projects.length + articles.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Projects/Content</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationSummaryCard
              name="GitHub"
              icon={<Github className="h-4 w-4 text-gray-800" />}
              isConnected={githubConnected}
              description="Code repositories and contributions"
              stats={githubConnected ? [
                { label: "Repositories", value: githubProfile?.public_repos || 0 },
                { label: "Followers", value: githubProfile?.followers || 0 }
              ] : undefined}
            />

            <IntegrationSummaryCard
              name="LinkedIn"
              icon={<Linkedin className="h-4 w-4 text-blue-600" />}
              isConnected={linkedinConnected}
              description="Professional experience and network"
              stats={linkedinConnected ? [
                { label: "Connections", value: linkedinProfile?.connections_count || 0 },
                { label: "Industry", value: linkedinProfile?.industry || "N/A" }
              ] : undefined}
            />

            <IntegrationSummaryCard
              name="Behance"
              icon={<Palette className="h-4 w-4 text-blue-600" />}
              isConnected={behanceConnected}
              description="Creative projects and portfolios"
              stats={behanceConnected ? [
                { label: "Projects", value: projects.length },
                { label: "Appreciations", value: behanceProfile?.appreciations || 0 }
              ] : undefined}
            />

            <IntegrationSummaryCard
              name="Medium"
              icon={<FileText className="h-4 w-4 text-green-600" />}
              isConnected={mediumConnected}
              description="Articles and writing portfolio"
              stats={mediumConnected ? [
                { label: "Articles", value: articles.length },
                { label: "Total Claps", value: articles.reduce((sum, article) => sum + article.claps, 0) }
              ] : undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your integrations and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Sync All Platforms</div>
                <div className="text-xs text-muted-foreground">Update data from all connected sources</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <User className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Add Custom Data</div>
                <div className="text-xs text-muted-foreground">Manually add professional information</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <ExternalLink className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">View Portfolio</div>
                <div className="text-xs text-muted-foreground">Preview your generated portfolio</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {connectedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your connected platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {githubConnected && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Github className="h-4 w-4 text-gray-800" />
                  <div className="flex-1">
                    <div className="font-medium">GitHub Profile Updated</div>
                    <div className="text-sm text-muted-foreground">
                      Synced {githubProfile?.public_repos} repositories and contributions
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {githubProfile?.last_synced_at ? new Date(githubProfile.last_synced_at).toLocaleDateString() : 'Recent'}
                  </Badge>
                </div>
              )}

              {behanceConnected && projects.length > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Palette className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Behance Projects Imported</div>
                    <div className="text-sm text-muted-foreground">
                      Added {projects.length} creative projects to your portfolio
                    </div>
                  </div>
                  <Badge variant="secondary">Recent</Badge>
                </div>
              )}

              {mediumConnected && articles.length > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Medium Articles Imported</div>
                    <div className="text-sm text-muted-foreground">
                      Added {articles.length} articles to your writing portfolio
                    </div>
                  </div>
                  <Badge variant="secondary">Recent</Badge>
                </div>
              )}

              {customData.length > 0 && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <User className="h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">Custom Data Added</div>
                    <div className="text-sm text-muted-foreground">
                      {customData.length} custom professional items added
                    </div>
                  </div>
                  <Badge variant="secondary">Recent</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {connectedCount < totalSources && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
            <CardDescription>
              Complete your portfolio by connecting more platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!githubConnected && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-gray-800" />
                    <div>
                      <div className="font-medium">Connect GitHub</div>
                      <div className="text-sm text-muted-foreground">Showcase your coding projects and contributions</div>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              )}

              {!behanceConnected && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Connect Behance</div>
                      <div className="text-sm text-muted-foreground">Display your creative and design work</div>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              )}

              {!mediumConnected && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Connect Medium</div>
                      <div className="text-sm text-muted-foreground">Include your articles and thought leadership</div>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};