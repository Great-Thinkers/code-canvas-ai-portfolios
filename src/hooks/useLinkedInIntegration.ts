
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LinkedInProfile {
  id: string;
  user_id: string;
  linkedin_user_id: string;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  summary: string | null;
  profile_picture_url: string | null;
  industry: string | null;
  location: string | null;
  connections_count: number | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useLinkedInIntegration = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
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
      const { data, error } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking LinkedIn connection:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
    }
  };

  const connectLinkedIn = async () => {
    setLoading(true);
    try {
      // Initiate LinkedIn OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'openid profile email'
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectLinkedIn = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('linkedin_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setProfile(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!user || !isConnected) return;

    setLoading(true);
    try {
      // Call edge function to sync LinkedIn data
      const { data, error } = await supabase.functions.invoke('sync-linkedin-data', {
        body: { user_id: user.id }
      });

      if (error) {
        throw error;
      }

      // Refresh profile data
      await checkConnection();
    } catch (error) {
      console.error('Error syncing LinkedIn data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    isConnected,
    loading,
    connectLinkedIn,
    disconnectLinkedIn,
    syncData,
    checkConnection
  };
};
