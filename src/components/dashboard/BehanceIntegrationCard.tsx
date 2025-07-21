import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Palette, ExternalLink, RefreshCw, Users, Eye, Heart, Calendar } from 'lucide-react';
import { useBehanceIntegration } from '@/hooks/useBehanceIntegration';

interface BehanceIntegrationCardProps {
  onConnect?: () => void;
}

export const BehanceIntegrationCard: React.FC<BehanceIntegrationCardProps> = ({ onConnect }) => {
  const { profile, projects, isConnected, loading, connectBehance, disconnectBehance, syncData } = useBehanceIntegration();
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) {
      toast.error('Please enter your Behance username');
      return;
    }

    setIsConnecting(true);
    try {
      await connectBehance(username);
      setUsername('');
      onConnect?.();
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <CardTitle>Behance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <CardTitle>Behance</CardTitle>
          </div>
          <CardDescription>
            Connect your Behance account to showcase your creative projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your Behance username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            />
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Behance'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">What we'll import:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your creative projects and portfolios</li>
              <li>Project descriptions and images</li>
              <li>Appreciation counts and views</li>
              <li>Skills and creative fields</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="flex items-center gap-2">
                Behance
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </CardTitle>
              <CardDescription>@{profile?.username}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={syncData}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Sync
            </Button>
            <Button variant="outline" size="sm" onClick={disconnectBehance}>
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
              <Users className="h-4 w-4" />
              {profile?.followers_count.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
              <Eye className="h-4 w-4" />
              {profile?.project_views.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Project Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
              <Heart className="h-4 w-4" />
              {profile?.appreciations.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Appreciations</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Projects</p>
          </div>
        </div>

        <Separator />

        {/* Recent Projects */}
        <div>
          <h4 className="font-medium mb-3">Recent Projects</h4>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium">{project.name}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {project.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {project.appreciations}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
          
          {projects.length > 3 && (
            <p className="text-sm text-muted-foreground mt-2">
              And {projects.length - 3} more projects...
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Last synced: {profile?.last_synced_at ? new Date(profile.last_synced_at).toLocaleDateString() : 'Never'}
        </div>
      </CardContent>
    </Card>
  );
};