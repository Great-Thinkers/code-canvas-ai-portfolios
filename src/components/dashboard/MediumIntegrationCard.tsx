import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { FileText, ExternalLink, RefreshCw, Users, Heart, Calendar, Clock } from 'lucide-react';
import { useMediumIntegration } from '@/hooks/useMediumIntegration';

interface MediumIntegrationCardProps {
  onConnect?: () => void;
}

export const MediumIntegrationCard: React.FC<MediumIntegrationCardProps> = ({ onConnect }) => {
  const { profile, articles, isConnected, loading, connectMedium, disconnectMedium, syncData } = useMediumIntegration();
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) {
      toast.error('Please enter your Medium username');
      return;
    }

    setIsConnecting(true);
    try {
      await connectMedium(username);
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
            <FileText className="h-5 w-5 text-green-600" />
            <CardTitle>Medium</CardTitle>
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
            <FileText className="h-5 w-5 text-green-600" />
            <CardTitle>Medium</CardTitle>
          </div>
          <CardDescription>
            Connect your Medium account to showcase your writing and articles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your Medium username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            />
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Medium'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">What we'll import:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your published articles and stories</li>
              <li>Article titles, subtitles, and previews</li>
              <li>Clap counts and reading times</li>
              <li>Tags and publication topics</li>
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
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle className="flex items-center gap-2">
                Medium
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
            <Button variant="outline" size="sm" onClick={disconnectMedium}>
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
              <Users className="h-4 w-4" />
              {profile?.followers_count.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
              <Heart className="h-4 w-4" />
              {articles.reduce((sum, article) => sum + article.claps, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Claps</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{articles.length}</div>
            <p className="text-sm text-muted-foreground">Articles</p>
          </div>
        </div>

        <Separator />

        {/* Recent Articles */}
        <div>
          <h4 className="font-medium mb-3">Recent Articles</h4>
          <div className="space-y-3">
            {articles.slice(0, 3).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium line-clamp-1">{article.title}</h5>
                  {article.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {article.claps}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time} min read
                    </span>
                    {article.published_at && (
                      <span>
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
          
          {articles.length > 3 && (
            <p className="text-sm text-muted-foreground mt-2">
              And {articles.length - 3} more articles...
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