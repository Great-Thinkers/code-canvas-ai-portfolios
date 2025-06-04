
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface GitHubProfile {
  id: string;
  user_id: string;
  github_user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number | null;
  followers: number | null;
  following: number | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useGitHubIntegration = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
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
        .from("github_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking GitHub connection:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
    }
  };

  const connectGitHub = async () => {
    setLoading(true);
    try {
      // Initiate GitHub OAuth flow with proper redirect
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "user:email read:user repo",
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectGitHub = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("github_profiles")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setProfile(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!user || !isConnected) return;

    setLoading(true);
    try {
      // Call edge function to sync GitHub data
      const { data, error } = await supabase.functions.invoke(
        "sync-github-data",
        {
          body: { user_id: user.id },
        },
      );

      if (error) {
        throw error;
      }

      // Refresh profile data
      await checkConnection();
    } catch (error) {
      console.error("Error syncing GitHub data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    isConnected,
    loading,
    connectGitHub,
    disconnectGitHub,
    syncData,
    checkConnection,
  };
};
