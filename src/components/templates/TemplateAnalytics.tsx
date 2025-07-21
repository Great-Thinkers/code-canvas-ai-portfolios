import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Star,
  Users,
  Eye,
  Download,
  Heart,
  Award,
  BarChart3,
  Filter,
} from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  role: string;
  style: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  isPremium?: boolean;
  isPopular?: boolean;
  rating?: number;
}

interface TemplateAnalyticsProps {
  templates: Template[];
  onTemplateRecommendation: (templateIds: number[]) => void;
}

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  avgRating: number;
  popularityTrend: number;
  userFeedback: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categoryPerformance: {
    category: string;
    score: number;
    growth: number;
  }[];
  topPerformers: {
    templateId: number;
    name: string;
    score: number;
    change: number;
  }[];
}

// Mock analytics data - in real app this would come from API
const generateAnalyticsData = (templates: Template[]): AnalyticsData => {
  return {
    totalViews: 45231,
    totalDownloads: 12847,
    avgRating: 4.6,
    popularityTrend: 15.3,
    userFeedback: {
      positive: 78,
      neutral: 18,
      negative: 4,
    },
    categoryPerformance: [
      { category: "Portfolio", score: 92, growth: 12 },
      { category: "Developer", score: 88, growth: 8 },
      { category: "Design", score: 85, growth: 15 },
      { category: "Business", score: 79, growth: 5 },
      { category: "Mobile", score: 76, growth: 20 },
      { category: "DevOps", score: 72, growth: 3 },
    ],
    topPerformers: templates
      .filter((t) => t.rating && t.rating > 4.5)
      .map((t) => ({
        templateId: t.id,
        name: t.name,
        score: (t.rating || 0) * 20,
        change: Math.floor(Math.random() * 20) - 5,
      }))
      .slice(0, 5),
  };
};

const getRecommendedTemplates = (
  templates: Template[],
  userRole?: string
): Template[] => {
  // Simple recommendation algorithm based on popularity and rating
  return templates
    .filter((t) => !userRole || t.role === userRole)
    .sort((a, b) => {
      const scoreA =
        (a.rating || 0) + (a.isPopular ? 0.5 : 0) + (a.isPremium ? 0.2 : 0);
      const scoreB =
        (b.rating || 0) + (b.isPopular ? 0.5 : 0) + (b.isPremium ? 0.2 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 6);
};

export default function TemplateAnalytics({
  templates,
  onTemplateRecommendation,
}: TemplateAnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [userRole, setUserRole] = useState<string>("");

  const analyticsData = generateAnalyticsData(templates);
  const recommendedTemplates = getRecommendedTemplates(
    templates,
    userRole || undefined
  );

  const handleViewRecommendations = () => {
    onTemplateRecommendation(recommendedTemplates.map((t) => t.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">
            Template Analytics
          </h2>
          <p className="text-muted-foreground">
            Insights and trends across our template library
          </p>
        </div>
        <Button
          onClick={handleViewRecommendations}
          className="bg-brand-500 hover:bg-brand-600"
        >
          <Award className="h-4 w-4 mr-2" />
          View Recommendations
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {analyticsData.totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="text-2xl font-bold">
                      {analyticsData.totalDownloads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">
                      {analyticsData.avgRating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-2xl font-bold">
                      +{analyticsData.popularityTrend}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                User Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    Positive
                  </span>
                  <span className="text-sm font-bold">
                    {analyticsData.userFeedback.positive}%
                  </span>
                </div>
                <Progress
                  value={analyticsData.userFeedback.positive}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-600">
                    Neutral
                  </span>
                  <span className="text-sm font-bold">
                    {analyticsData.userFeedback.neutral}%
                  </span>
                </div>
                <Progress
                  value={analyticsData.userFeedback.neutral}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-600">
                    Negative
                  </span>
                  <span className="text-sm font-bold">
                    {analyticsData.userFeedback.negative}%
                  </span>
                </div>
                <Progress
                  value={analyticsData.userFeedback.negative}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categoryPerformance.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            category.growth > 10
                              ? "default"
                              : category.growth > 0
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {category.growth > 0 ? "+" : ""}
                          {category.growth}%
                        </Badge>
                        <span className="text-sm font-bold">
                          {category.score}/100
                        </span>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performing Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPerformers.map((template, index) => (
                  <div
                    key={template.templateId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          template.change > 0
                            ? "default"
                            : template.change < 0
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {template.change > 0 ? "+" : ""}
                        {template.change}
                      </Badge>
                      <span className="text-sm font-bold">
                        {template.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold text-green-600">+23%</p>
                    <p className="text-sm text-muted-foreground">
                      Portfolio templates
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-blue-600">+15%</p>
                    <p className="text-sm text-muted-foreground">
                      Mobile templates
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold text-purple-600">+8%</p>
                    <p className="text-sm text-muted-foreground">
                      Premium adoption
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Key Insights</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Portfolio templates are seeing increased demand among
                      junior developers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Mobile-first designs are becoming more popular across all
                      user types
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Premium features like advanced animations drive higher
                      engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Dark mode templates have 40% higher satisfaction ratings
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">All Roles</option>
                    <option value="frontend">Frontend Professional</option>
                    <option value="backend">Backend Specialist</option>
                    <option value="fullstack">Full-stack Professional</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="mobile">Mobile Specialist</option>
                    <option value="devops">DevOps Engineer</option>
                  </select>
                  <Button variant="outline" onClick={handleViewRecommendations}>
                    <Filter className="h-4 w-4 mr-2" />
                    Update Recommendations
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{template.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{template.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {template.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
