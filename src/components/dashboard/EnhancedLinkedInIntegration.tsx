
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLinkedInIntegration } from "@/hooks/useLinkedInIntegration";
import { useLinkedInData } from "@/hooks/useLinkedInData";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Briefcase, GraduationCap, Users, TrendingUp, Calendar } from "lucide-react";

export default function EnhancedLinkedInIntegration() {
  const { toast } = useToast();
  const { syncData, loading: syncLoading } = useLinkedInIntegration();
  const { linkedInData, experiences, loading } = useLinkedInData();

  const handleFullSync = async () => {
    try {
      await syncData();
      toast({
        title: "LinkedIn sync started",
        description: "Your LinkedIn data is being updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "There was an error syncing your LinkedIn data.",
      });
    }
  };

  const getExperienceStats = () => {
    const totalYearsExperience = experiences.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return total + years;
    }, 0);

    const currentRoles = experiences.filter(exp => exp.isCurrent).length;
    const companies = [...new Set(experiences.map(exp => exp.companyName))].length;

    return {
      totalYears: Math.round(totalYearsExperience * 10) / 10,
      currentRoles,
      companies,
    };
  };

  const stats = getExperienceStats();

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
          <h2 className="text-2xl font-bold">Enhanced LinkedIn Integration</h2>
          <p className="text-muted-foreground">
            Professional profile analysis, experience tracking, and career insights
          </p>
        </div>
        <Button onClick={handleFullSync} disabled={syncLoading}>
          {syncLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sync LinkedIn
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="insights">Career Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalYears}y</div>
                <p className="text-xs text-muted-foreground">
                  Total experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Roles</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentRoles}</div>
                <p className="text-xs text-muted-foreground">
                  Active positions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.companies}</div>
                <p className="text-xs text-muted-foreground">
                  Organizations worked at
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{experiences.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total roles held
                </p>
              </CardContent>
            </Card>
          </div>

          {linkedInData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>Your LinkedIn profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {linkedInData.profilePictureUrl && (
                      <img
                        src={linkedInData.profilePictureUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">
                        {linkedInData.firstName} {linkedInData.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {linkedInData.headline}
                      </p>
                    </div>
                  </div>
                  
                  {linkedInData.location && (
                    <div className="text-sm">
                      <span className="font-medium">Location: </span>
                      {linkedInData.location}
                    </div>
                  )}
                  
                  {linkedInData.industry && (
                    <div className="text-sm">
                      <span className="font-medium">Industry: </span>
                      {linkedInData.industry}
                    </div>
                  )}
                  
                  {linkedInData.summary && (
                    <div className="text-sm">
                      <span className="font-medium">Summary: </span>
                      <p className="mt-1 text-muted-foreground">
                        {linkedInData.summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Experience</CardTitle>
                  <CardDescription>Your latest professional roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experiences.slice(0, 3).map((exp, index) => (
                      <div key={index} className="border-l-2 border-muted pl-4">
                        <div className="space-y-1">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {exp.description.length > 100 
                                ? `${exp.description.substring(0, 100)}...`
                                : exp.description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Experience</CardTitle>
              <CardDescription>Complete work history and career progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-muted pl-6 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{exp.title}</h3>
                          {exp.isCurrent && (
                            <Badge className="bg-green-100 text-green-700">Current</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium">{exp.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-3">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Career Timeline</CardTitle>
                <CardDescription>Your professional journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiences
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((exp, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{exp.title}</p>
                          <p className="text-xs text-muted-foreground">{exp.companyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(exp.startDate).getFullYear()}
                            {exp.isCurrent ? ' - Present' : ` - ${new Date(exp.endDate).getFullYear()}`}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Diversity</CardTitle>
                <CardDescription>Organizations you've worked with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...new Set(experiences.map(exp => exp.companyName))].map((company, index) => {
                    const companyExperiences = experiences.filter(exp => exp.companyName === company);
                    const totalRoles = companyExperiences.length;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{company}</span>
                        <Badge variant="secondary">
                          {totalRoles} role{totalRoles > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Sync Settings</CardTitle>
              <CardDescription>Configure how your LinkedIn data is synchronized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  LinkedIn API access is currently limited. Full sync settings will be available 
                  when LinkedIn approves broader API access for this application.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  For now, you can manually sync your data using the sync button above.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
