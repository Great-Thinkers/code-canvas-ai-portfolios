import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AccountTab() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setUserProfile(data);
    }
  };

  return (
    <div className="mt-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and subscription details.
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Subscription Plan</h3>
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-muted-foreground">
                    2/2 portfolios used
                  </p>
                </div>
                <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
                  Upgrade
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <p className="font-medium">
                {userProfile?.full_name || user?.email}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {user?.email}
              </p>
              <div className="flex gap-2 text-sm">
                <button className="text-brand-500 hover:text-brand-600 font-medium">
                  Change email
                </button>
                <span className="text-muted-foreground">•</span>
                <button className="text-brand-500 hover:text-brand-600 font-medium">
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
