
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, LineChart, PieChart, TrendingUp, Eye, Users, Monitor, Smartphone, Tablet } from 'lucide-react';
import { usePortfolioAnalytics } from '@/hooks/usePortfolioAnalytics';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const { analytics, loading } = usePortfolioAnalytics();

  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const deviceData = [
    { name: 'Desktop', value: analytics.deviceBreakdown.desktop, icon: Monitor },
    { name: 'Mobile', value: analytics.deviceBreakdown.mobile, icon: Smartphone },
    { name: 'Tablet', value: analytics.deviceBreakdown.tablet, icon: Tablet }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.portfolioViews.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.portfolioViews.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.portfolioViews.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.portfolioViews.today} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Portfolio</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.topPortfolios[0]?.views || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.topPortfolios[0]?.name || 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.topPortfolios.reduce((sum, p) => sum + p.uniqueVisitors, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All portfolios combined
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Over Time Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Daily portfolio views for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={analytics.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueVisitors" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Unique Visitors"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>How visitors access your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceData.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{device.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{device.value}%</span>
                  </div>
                  <Progress value={device.value} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Portfolios */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Portfolios</CardTitle>
            <CardDescription>Your most viewed portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPortfolios.map((portfolio, index) => (
                <div key={portfolio.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{portfolio.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {portfolio.uniqueVisitors} unique visitors
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{portfolio.views}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{source.visitors}</div>
                      <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
