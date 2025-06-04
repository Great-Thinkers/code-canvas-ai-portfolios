
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnhancedGitHubData } from "@/hooks/useEnhancedGitHubData";
import { useGitHubIntegration } from "@/hooks/useGitHubIntegration";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GitCommit, TrendingUp, Settings, Star, Code, Calendar } from "lucide-react";

export default function EnhancedGitHubIntegration() {
  const { toast } = useToast();
  const { syncData, loading: syncLoading } = useGitHubIntegration();
  const {
    commits,
    contributions,
    syncSettings,
    projectSuggestions,
    enhancedRepositories,
    loading,
    updateSyncSettings,
    getLanguageStats,
    getCommitStats,
    getContributionStreak,
  } = useEnhancedGitHubData();

  const [updatingSettings, setUpdatingSettings] = useState(false);

  const handleSyncSettingsChange = async (field: string, value: boolean | number) => {
    if (!syncSettings) return;

    setUpdatingSettings(true);
    try {
      await updateSyncSettings({ [field]: value });
      toast({
        title: "Settings updated",
        description: "Your sync preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your sync settings.",
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleFullSync = async () => {
    try {
      await syncData();
      toast({
        title: "Sync started",
        description: "Your GitHub data is being updated with enhanced features.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "There was an error syncing your GitHub data.",
      });
    }
  };

  const commitStats = getCommitStats();
  const languageStats = getLanguageStats();
  const { currentStreak, longestStreak } = getContributionStreak();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced GitHub Integration</h2>
          <p className="text-muted-foreground">
            Advanced GitHub analytics, commit tracking, and project suggestions
          </p>
        </div>
        <Button onClick={handleFullSync} disabled={syncLoading}>
          {syncLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Full Sync
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
          <TabsTrigger value="contributions">Activity</TabsTrigger>
          <TabsTrigger value="projects">Project Suggestions</TabsTrigger>
          <TabsTrigger value="settings">Sync Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                <GitCommit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{commitStats.totalCommits}</div>
                <p className="text-xs text-muted-foreground">
                  {commitStats.averageChangesPerCommit} avg changes/commit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contribution Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <p className="text-xs text-muted-foreground">
                  Longest: {longestStreak} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Repositories</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enhancedRepositories.length}</div>
                <p className="text-xs text-muted-foreground">
                  {enhancedRepositories.filter(r => !r.is_fork).length} original
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enhancedRepositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all repositories
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Languages</CardTitle>
                <CardDescription>Most used programming languages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {languageStats.slice(0, 5).map(({ language, count }) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="text-sm">{language}</span>
                      <Badge variant="secondary">{count} repos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Changes</CardTitle>
                <CardDescription>Lines added and removed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Lines Added</span>
                    <Badge className="bg-green-100 text-green-700">{commitStats.totalAdditions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Lines Removed</span>
                    <Badge className="bg-red-100 text-red-700">{commitStats.totalDeletions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Changes</span>
                    <Badge variant="outline">{commitStats.totalChanges}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>Your latest commit activity across all repositories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commits.slice(0, 10).map((commit) => (
                  <div key={commit.id} className="border-l-2 border-muted pl-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {commit.message.split('\n')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {commit.author_name} • {new Date(commit.author_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {commit.additions > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            +{commit.additions}
                          </Badge>
                        )}
                        {commit.deletions > 0 && (
                          <Badge variant="outline" className="text-red-600">
                            -{commit.deletions}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Activity</CardTitle>
              <CardDescription>Your GitHub activity over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 max-w-4xl">
                {contributions.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${
                      day.contribution_level === 0 ? 'bg-muted' :
                      day.contribution_level === 1 ? 'bg-green-200' :
                      day.contribution_level === 2 ? 'bg-green-300' :
                      day.contribution_level === 3 ? 'bg-green-400' :
                      'bg-green-500'
                    }`}
                    title={`${day.date}: ${day.contribution_count} contributions`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-green-200" />
                  <div className="w-3 h-3 rounded-sm bg-green-300" />
                  <div className="w-3 h-3 rounded-sm bg-green-400" />
                  <div className="w-3 h-3 rounded-sm bg-green-500" />
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Project Suggestions</CardTitle>
              <CardDescription>
                Smart suggestions for your portfolio based on your repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {projectSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{suggestion.suggested_name}</h3>
                      <div className="flex gap-2">
                        {suggestion.is_featured_candidate && (
                          <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                        )}
                        <Badge variant="outline">
                          {Math.round(suggestion.confidence_score * 100)}% match
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.auto_generated_description}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {suggestion.suggested_technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure how your GitHub data is synchronized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {syncSettings ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-sync"
                      checked={syncSettings.auto_sync_enabled}
                      onCheckedChange={(checked) => 
                        handleSyncSettingsChange('auto_sync_enabled', checked)
                      }
                      disabled={updatingSettings}
                    />
                    <Label htmlFor="auto-sync">Enable automatic syncing</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Sync Components</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-repos"
                          checked={syncSettings.sync_repositories}
                          onCheckedChange={(checked) => 
                            handleSyncSettingsChange('sync_repositories', checked)
                          }
                          disabled={updatingSettings}
                        />
                        <Label htmlFor="sync-repos">Repositories</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-commits"
                          checked={syncSettings.sync_commits}
                          onCheckedChange={(checked) => 
                            handleSyncSettingsChange('sync_commits', checked)
                          }
                          disabled={updatingSettings}
                        />
                        <Label htmlFor="sync-commits">Commit History</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-contributions"
                          checked={syncSettings.sync_contributions}
                          onCheckedChange={(checked) => 
                            handleSyncSettingsChange('sync_contributions', checked)
                          }
                          disabled={updatingSettings}
                        />
                        <Label htmlFor="sync-contributions">Contribution Graph</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Last Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      {syncSettings.last_auto_sync_at 
                        ? new Date(syncSettings.last_auto_sync_at).toLocaleString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No sync settings found. Run a full sync to initialize.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
