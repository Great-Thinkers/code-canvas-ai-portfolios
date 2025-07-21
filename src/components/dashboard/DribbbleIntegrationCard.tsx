import { useState, useEffect } from "react";
import { useDribbbleIntegration } from "@/hooks/useDribbbleIntegration";
import { useToast } from "@/components/ui/use-toast";
import IntegrationCard from "./IntegrationCard";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function DribbbleIntegrationCard() {
  const { toast } = useToast();
  const { connectDribbble, disconnectDribbble, isAuthorizing } =
    useDribbbleIntegration();
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const dribbbleUser = session?.user.identities?.some(
        (id) => id.provider === "dribbble"
      );
      setIsConnected(!!dribbbleUser);
      if (dribbbleUser) {
        setUser(session?.user);
      }
    };
    checkSession();
  }, []);

  const handleConnect = async () => {
    try {
      await connectDribbble();
      toast({
        title: "Connecting to Dribbble...",
        description: "Please follow the prompts to authorize your account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Dribbble Connection Failed",
        description: "Could not connect to Dribbble. Please try again.",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectDribbble();
      setIsConnected(false);
      setUser(null);
      toast({
        title: "Dribbble Disconnected",
        description: "Your Dribbble account has been unlinked.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Disconnection Failed",
        description: "Could not disconnect from Dribbble.",
      });
    }
  };

  return (
    <IntegrationCard
      name="Dribbble"
      icon={
        <svg
          fill="#ea4c89"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zM8.2 6.6C4.8 7.5 3 10.2 3 12.9c0 1.2.6 2.4 1.5 3.3.9 1 2.1 1.5 3.3 1.5 2.1 0 4.2-.9 5.1-2.4-.4.3-.9.6-1.5.6-1.8 0-3.3-1.5-3.3-3.3s1.5-3.3 3.3-3.3c.6 0 1.2.3 1.5.6.3-1.2-.3-2.4-1.2-3-1.2-.9-2.7-1.2-3.9-1.2zM15 9.3c-1.2 0-2.4.6-3 1.5.6.3 1.2.9 1.2 1.8 0 1.2-.9 2.1-2.1 2.1s-2.1-.9-2.1-2.1c0-.9.3-1.5.9-1.8-1.5-1.2-3.3-1.8-4.8-1.5C6.9 7.2 9 6 12.3 6c1.2 0 2.4.3 3.3.9.6-.3 1.2-.6 1.8-.6 1.2 0 2.1.9 2.1 2.1s-.9 2.1-2.1 2.1-2.1-.9-2.1-2.1z" />
        </svg>
      }
      description="Showcase your design portfolio by connecting your Dribbble account."
      isConnected={isConnected}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      loading={isAuthorizing}
      profileData={user ? { user_metadata: user.user_metadata } : null}
    />
  );
}
