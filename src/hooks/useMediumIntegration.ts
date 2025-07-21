import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MediumProfile {
  id: string;
  user_id: string;
  medium_user_id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  last_synced_at: string;
}

export interface MediumArticle {
  id: string;
  medium_profile_id: string;
  article_id: string;
  title: string;
  subtitle: string | null;
  content_preview: string | null;
  url: string;
  canonical_url: string | null;
  published_at: string | null;
  claps: number;
  reading_time: number;
  word_count: number;
  tags: string[];
  topics: string[];
}

export const useMediumIntegration = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MediumProfile | null>(null);
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medium_profiles')
        .select(`
          *,
          medium_articles (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Medium profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setArticles(data.medium_articles || []);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectMedium = async (username: string) => {
    if (!user) {
      toast.error('You must be logged in to connect Medium');
      return;
    }

    try {
      setLoading(true);

      // Create a demo Medium profile for the user
      const demoProfile = {
        user_id: user.id,
        medium_user_id: `medium_${user.id}`,
        username: username,
        name: username,
        bio: 'Passionate writer sharing insights about technology and life',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        followers_count: 850,
        following_count: 320,
      };

      const { data: profileData, error: profileError } = await supabase
        .from('medium_profiles')
        .insert(demoProfile)
        .select()
        .single();

      if (profileError) {
        console.error('Error creating Medium profile:', profileError);
        toast.error('Failed to connect Medium account');
        return;
      }

      // Create some demo articles
      const demoArticles = [
        {
          medium_profile_id: profileData.id,
          article_id: 'article-1',
          title: 'The Future of Web Development',
          subtitle: 'Exploring emerging trends and technologies',
          content_preview: 'As we move forward in the digital age, web development continues to evolve at a rapid pace...',
          url: 'https://medium.com/@username/future-of-web-development',
          published_at: new Date('2024-01-15').toISOString(),
          claps: 145,
          reading_time: 8,
          word_count: 1200,
          tags: ['web development', 'technology', 'future'],
          topics: ['Programming', 'Technology']
        },
        {
          medium_profile_id: profileData.id,
          article_id: 'article-2',
          title: 'Building Better User Interfaces',
          subtitle: 'A guide to modern UI/UX design principles',
          content_preview: 'Creating exceptional user interfaces requires understanding both design principles and user psychology...',
          url: 'https://medium.com/@username/building-better-user-interfaces',
          published_at: new Date('2023-12-10').toISOString(),
          claps: 89,
          reading_time: 6,
          word_count: 950,
          tags: ['ui design', 'ux', 'design'],
          topics: ['Design', 'User Experience']
        }
      ];

      const { error: articlesError } = await supabase
        .from('medium_articles')
        .insert(demoArticles);

      if (articlesError) {
        console.error('Error creating demo articles:', articlesError);
      }

      await checkConnection();
      toast.success('Medium account connected successfully!');
    } catch (error) {
      console.error('Unexpected error connecting Medium:', error);
      toast.error('Failed to connect Medium account');
    } finally {
      setLoading(false);
    }
  };

  const disconnectMedium = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('medium_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error disconnecting Medium:', error);
        toast.error('Failed to disconnect Medium account');
        return;
      }

      setProfile(null);
      setArticles([]);
      setIsConnected(false);
      toast.success('Medium account disconnected');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to disconnect Medium account');
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    // In a real implementation, this would call a Supabase edge function
    // to fetch fresh data from Medium API
    toast.info('Medium sync feature coming soon!');
  };

  return {
    profile,
    articles,
    isConnected,
    loading,
    connectMedium,
    disconnectMedium,
    syncData,
    checkConnection,
  };
};