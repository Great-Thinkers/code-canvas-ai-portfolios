
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Github, Linkedin, Clock, Crown } from 'lucide-react';
import { useAutoSync } from '@/hooks/useAutoSync';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function AutoSyncSettings() {
  const { settings, loading, syncing, updateSettings, triggerManualSync } = useAutoSync();
  const { subscription } = useSubscription();

  const hasAutoSyncAccess = subscription?.plan.features?.auto_sync === true;
  const isPaidPlan = subscription?.plan.name !== 'Free';

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!hasAutoSyncAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Auto-Sync
            <Crown className="h-4 w-4 text-amber-500" />
          </CardTitle>
          <CardDescription>
            Automatically sync your GitHub and LinkedIn data to keep your portfolio up-to-date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              Auto-sync is a premium feature that automatically updates your portfolio with the latest data from your connected accounts.
            </div>
            <Link to="/pricing">
              <Button className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Auto-Sync Settings
        </CardTitle>
        <CardDescription>
          Configure automatic synchronization of your external data sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Enable Auto-Sync</div>
            <div className="text-sm text-muted-foreground">
              Automatically sync data from connected accounts
            </div>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Sync Frequency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sync Frequency</label>
              <Select
                value={settings.frequency}
                onValueChange={(frequency: 'hourly' | 'daily' | 'weekly') => 
                  updateSettings({ frequency })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Sources */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Data Sources</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span className="text-sm">GitHub</span>
                </div>
                <Switch
                  checked={settings.syncGitHub}
                  onCheckedChange={(syncGitHub) => updateSettings({ syncGitHub })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <span className="text-sm">LinkedIn</span>
                </div>
                <Switch
                  checked={settings.syncLinkedIn}
                  onCheckedChange={(syncLinkedIn) => updateSettings({ syncLinkedIn })}
                />
              </div>
            </div>
          </>
        )}

        {/* Last Sync Info */}
        {settings.lastSync && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Last sync: {formatDistanceToNow(new Date(settings.lastSync), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Manual Sync Button */}
        <Button
          onClick={triggerManualSync}
          disabled={syncing || (!settings.syncGitHub && !settings.syncLinkedIn)}
          className="w-full gap-2"
        >
          {syncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
