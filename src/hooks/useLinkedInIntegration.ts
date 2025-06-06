
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
        .from("linkedin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking LinkedIn connection:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking LinkedIn connection:", error);
    }
  };

  const connectLinkedIn = async () => {
    setLoading(true);
    try {
      // Check if LinkedIn provider is enabled first
      const { data: providers, error: providerError } = await supabase.auth.getOAuthProviders();
      
      if (providerError) {
        console.error("Error checking OAuth providers:", providerError);
        throw new Error("Unable to check available authentication providers");
      }

      // For now, we'll simulate the LinkedIn connection since the provider might not be enabled
      // This allows the demo to work while the OAuth setup is being configured
      console.log("LinkedIn OAuth would be initiated here");
      console.log("Available providers:", providers);
      
      // Instead of real OAuth, we'll create a demo profile for testing
      const demoProfile = {
        user_id: user?.id,
        linkedin_user_id: "demo_user_123",
        first_name: "Demo",
        last_name: "User",
        headline: "Software Developer at Demo Company",
        summary: "Experienced developer with expertise in web technologies",
        profile_picture_url: null,
        industry: "Information Technology",
        location: "San Francisco, CA",
        connections_count: 500,
        last_synced_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("linkedin_profiles")
        .upsert(demoProfile)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setIsConnected(true);
      
      throw new Error("LinkedIn OAuth is not fully configured. Please enable the LinkedIn provider in your Supabase Auth settings. For demo purposes, a sample profile has been created.");
      
    } catch (error) {
      console.error("Error connecting to LinkedIn:", error);
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
        .from("linkedin_profiles")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setProfile(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting LinkedIn:", error);
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
      const { data, error } = await supabase.functions.invoke(
        "sync-linkedin-data",
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
      console.error("Error syncing LinkedIn data:", error);
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
    checkConnection,
  };
};
