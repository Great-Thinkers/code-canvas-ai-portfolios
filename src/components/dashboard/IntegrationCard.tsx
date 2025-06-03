import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

type IntegrationCardProps = {
  name: string;
  icon: React.ReactNode;
  description: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSyncData?: () => Promise<void>;
  loading?: boolean;
  lastSynced?: string | null;
  profileData?: any;
};

export default function IntegrationCard({
  name,
  icon,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  onSyncData,
  loading = false,
  lastSynced,
  profileData,
}: IntegrationCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProfileInfo = () => {
    if (name === "GitHub" && profileData) {
      return {
        username: profileData.username,
        repos: profileData.public_repos,
        followers: profileData.followers,
      };
    }
    if (name === "LinkedIn" && profileData) {
      return {
        name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
        headline: profileData.headline,
        connections: profileData.connections_count,
      };
    }
    return null;
  };

  const profileInfo = getProfileInfo();

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">{icon}</div>
            <CardTitle>{name}</CardTitle>
          </div>
          {isConnected && (
            <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected && profileInfo ? (
          <div className="text-sm space-y-2">
            <p className="font-medium">Account connected</p>
            {name === "GitHub" && (
              <div className="text-muted-foreground space-y-1">
                <p>@{profileInfo.username}</p>
                <div className="flex gap-4 text-xs">
                  <span>{profileInfo.repos} repos</span>
                  <span>{profileInfo.followers} followers</span>
                </div>
              </div>
            )}
            {name === "LinkedIn" && (
              <div className="text-muted-foreground space-y-1">
                <p>{profileInfo.name}</p>
                {profileInfo.headline && (
                  <p className="text-xs">{profileInfo.headline}</p>
                )}
                {profileInfo.connections && (
                  <p className="text-xs">
                    {profileInfo.connections} connections
                  </p>
                )}
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              Last synced: {formatDate(lastSynced)}
            </p>
          </div>
        ) : isConnected ? (
          <div className="text-sm">
            <p className="font-medium">Account connected</p>
            <p className="text-muted-foreground">
              Last synced: {formatDate(lastSynced)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your {name} account to automatically sync your profile data.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {isConnected ? (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDisconnect}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disconnect
            </Button>
            {profileInfo && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSyncData}
                disabled={loading}
                title="Sync data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </>
        ) : (
          <Button className="w-full" onClick={onConnect} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect {name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
