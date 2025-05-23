
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type IntegrationCardProps = {
  name: string;
  icon: React.ReactNode;
  description: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export default function IntegrationCard({
  name,
  icon,
  description,
  isConnected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
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
        {isConnected ? (
          <div className="text-sm">
            <p className="font-medium">Account connected</p>
            <p className="text-muted-foreground">Last synced: Today at 12:34 PM</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your {name} account to automatically sync your profile data.
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" className="w-full" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button className="w-full" onClick={onConnect}>
            Connect {name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
