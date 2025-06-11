
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalyticsData {
  portfolioViews: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  topPortfolios: Array<{
    id: string;
    name: string;
    views: number;
    uniqueVisitors: number;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
    uniqueVisitors: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

export function usePortfolioAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch portfolio analytics data
        const { data, error } = await supabase
          .from('portfolio_analytics')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (error) throw error;

        // Mock analytics data for now (in production, this would be real data)
        const mockAnalytics: AnalyticsData = {
          portfolioViews: {
            total: 1234,
            thisMonth: 456,
            thisWeek: 123,
            today: 45
          },
          topPortfolios: [
            { id: '1', name: 'Main Portfolio', views: 567, uniqueVisitors: 234 },
            { id: '2', name: 'Creative Works', views: 345, uniqueVisitors: 156 },
            { id: '3', name: 'Technical Projects', views: 234, uniqueVisitors: 98 }
          ],
          viewsOverTime: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 50) + 10,
            uniqueVisitors: Math.floor(Math.random() * 30) + 5
          })),
          deviceBreakdown: {
            desktop: 65,
            mobile: 30,
            tablet: 5
          },
          trafficSources: [
            { source: 'Direct', visitors: 145, percentage: 45 },
            { source: 'GitHub', visitors: 98, percentage: 30 },
            { source: 'LinkedIn', visitors: 65, percentage: 20 },
            { source: 'Other', visitors: 16, percentage: 5 }
          ]
        };

        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  return {
    analytics,
    loading
  };
}
