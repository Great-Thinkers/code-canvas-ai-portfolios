
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AutoSyncSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  lastSync: string | null;
  syncGitHub: boolean;
  syncLinkedIn: boolean;
}

export function useAutoSync() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AutoSyncSettings>({
    enabled: false,
    frequency: 'daily',
    lastSync: null,
    syncGitHub: false,
    syncLinkedIn: false
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('auto_sync_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          enabled: data.enabled,
          frequency: data.frequency as 'hourly' | 'daily' | 'weekly',
          lastSync: data.last_sync_at,
          syncGitHub: data.sync_github,
          syncLinkedIn: data.sync_linkedin
        });
      }
    } catch (error) {
      console.error('Error fetching auto-sync settings:', error);
      toast.error('Failed to load auto-sync settings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = async (newSettings: Partial<AutoSyncSettings>) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('auto_sync_settings')
        .upsert({
          user_id: user.id,
          enabled: newSettings.enabled ?? settings.enabled,
          frequency: newSettings.frequency ?? settings.frequency,
          sync_github: newSettings.syncGitHub ?? settings.syncGitHub,
          sync_linkedin: newSettings.syncLinkedIn ?? settings.syncLinkedIn,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('Auto-sync settings updated');
    } catch (error) {
      console.error('Error updating auto-sync settings:', error);
      toast.error('Failed to update auto-sync settings');
    } finally {
      setLoading(false);
    }
  };

  const triggerManualSync = async () => {
    if (!user) return;

    try {
      setSyncing(true);
      
      const syncPromises = [];
      
      if (settings.syncGitHub) {
        syncPromises.push(
          supabase.functions.invoke('sync-github-data', {
            body: { userId: user.id }
          })
        );
      }
      
      if (settings.syncLinkedIn) {
        syncPromises.push(
          supabase.functions.invoke('sync-linkedin-data', {
            body: { userId: user.id }
          })
        );
      }

      if (syncPromises.length === 0) {
        toast.error('No sync sources enabled');
        return;
      }

      await Promise.all(syncPromises);
      
      // Update last sync time
      await supabase
        .from('auto_sync_settings')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', user.id);

      setSettings(prev => ({ ...prev, lastSync: new Date().toISOString() }));
      toast.success('Manual sync completed');
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast.error('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    syncing,
    updateSettings,
    triggerManualSync,
    refetch: fetchSettings
  };
}
