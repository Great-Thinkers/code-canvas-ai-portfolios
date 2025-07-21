import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BehanceProfile {
  id: string;
  user_id: string;
  behance_user_id: string;
  username: string;
  display_name: string | null;
  city: string | null;
  country: string | null;
  company: string | null;
  website: string | null;
  biography: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  followers_count: number;
  following_count: number;
  project_views: number;
  appreciations: number;
  last_synced_at: string;
}

export interface BehanceProject {
  id: string;
  behance_profile_id: string;
  project_id: number;
  name: string;
  description: string | null;
  published_on: string | null;
  url: string;
  views: number;
  appreciations: number;
  comments: number;
  tags: string[];
  fields: string[];
  covers: any;
  modules: any;
}

export const useBehanceIntegration = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BehanceProfile | null>(null);
  const [projects, setProjects] = useState<BehanceProject[]>([]);
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
        .from('behance_profiles')
        .select(`
          *,
          behance_projects (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Behance profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setProjects(data.behance_projects || []);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectBehance = async (username: string) => {
    if (!user) {
      toast.error('You must be logged in to connect Behance');
      return;
    }

    try {
      setLoading(true);

      // Create a demo Behance profile for the user
      const demoProfile = {
        user_id: user.id,
        behance_user_id: `behance_${user.id}`,
        username: username,
        display_name: username,
        city: 'San Francisco',
        country: 'United States',
        company: 'Creative Studio',
        biography: 'Passionate designer creating beautiful visual experiences',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        followers_count: 1250,
        following_count: 420,
        project_views: 15000,
        appreciations: 3400,
      };

      const { data: profileData, error: profileError } = await supabase
        .from('behance_profiles')
        .insert(demoProfile)
        .select()
        .single();

      if (profileError) {
        console.error('Error creating Behance profile:', profileError);
        toast.error('Failed to connect Behance account');
        return;
      }

      // Create some demo projects
      const demoProjects = [
        {
          behance_profile_id: profileData.id,
          project_id: 123456789,
          name: 'Brand Identity Design',
          description: 'Complete brand identity design for a tech startup',
          url: 'https://behance.net/gallery/123456789/brand-identity-design',
          views: 2500,
          appreciations: 150,
          comments: 25,
          tags: ['branding', 'logo', 'identity'],
          fields: ['Graphic Design', 'Branding'],
          covers: { original: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop' },
          modules: []
        },
        {
          behance_profile_id: profileData.id,
          project_id: 987654321,
          name: 'Mobile App UI Design',
          description: 'Modern and clean mobile app interface design',
          url: 'https://behance.net/gallery/987654321/mobile-app-ui-design',
          views: 1800,
          appreciations: 95,
          comments: 12,
          tags: ['ui', 'mobile', 'app'],
          fields: ['UI/UX', 'Mobile Design'],
          covers: { original: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop' },
          modules: []
        }
      ];

      const { error: projectsError } = await supabase
        .from('behance_projects')
        .insert(demoProjects);

      if (projectsError) {
        console.error('Error creating demo projects:', projectsError);
      }

      await checkConnection();
      toast.success('Behance account connected successfully!');
    } catch (error) {
      console.error('Unexpected error connecting Behance:', error);
      toast.error('Failed to connect Behance account');
    } finally {
      setLoading(false);
    }
  };

  const disconnectBehance = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('behance_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error disconnecting Behance:', error);
        toast.error('Failed to disconnect Behance account');
        return;
      }

      setProfile(null);
      setProjects([]);
      setIsConnected(false);
      toast.success('Behance account disconnected');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to disconnect Behance account');
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    // In a real implementation, this would call a Supabase edge function
    // to fetch fresh data from Behance API
    toast.info('Behance sync feature coming soon!');
  };

  return {
    profile,
    projects,
    isConnected,
    loading,
    connectBehance,
    disconnectBehance,
    syncData,
    checkConnection,
  };
};