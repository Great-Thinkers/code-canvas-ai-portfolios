import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDribbbleIntegration = () => {
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectDribbble = async () => {
        setIsAuthorizing(true);
        setError(null);
        try {
            const { data, error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'dribbble',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                throw new Error(authError.message);
            }

            return data;
        } catch (err: any) {
            setError(err.message);
            console.error('Dribbble connection error:', err);
        } finally {
            setIsAuthorizing(false);
        }
    };

    const disconnectDribbble = async () => {
        // In a real app, this would involve revoking the token via Dribbble's API
        // and removing the provider token from Supabase Auth.
        // For this example, we'll just sign out the user.
        await supabase.auth.signOut();
        // Also, you'd want to clear any Dribbble-related data from your DB.
    };

    const fetchDribbbleShots = async (accessToken: string) => {
        try {
            const response = await fetch('https://api.dribbble.com/v2/user/shots', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Dribbble shots');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            console.error('Dribbble data fetching error:', err);
            return null;
        }
    };

    return {
        connectDribbble,
        disconnectDribbble,
        fetchDribbbleShots,
        isAuthorizing,
        error,
    };
}; 