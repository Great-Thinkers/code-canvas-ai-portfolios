
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LinkedInData {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  profilePictureUrl: string;
}

interface Experience {
  title: string;
  companyName: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
}

export const useLinkedInData = () => {
  const { user } = useAuth();
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLinkedInData();
    }
  }, [user]);

  const fetchLinkedInData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user has LinkedIn profile in our database
      const { data: linkedinProfile, error: profileError } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (linkedinProfile) {
        setLinkedInData({
          firstName: linkedinProfile.first_name || '',
          lastName: linkedinProfile.last_name || '',
          headline: linkedinProfile.headline || '',
          summary: linkedinProfile.summary || '',
          location: linkedinProfile.location || '',
          industry: linkedinProfile.industry || '',
          profilePictureUrl: linkedinProfile.profile_picture_url || '',
        });

        // Fetch experiences
        const { data: exps, error: expsError } = await supabase
          .from('linkedin_experiences')
          .select('*')
          .eq('linkedin_profile_id', linkedinProfile.id)
          .order('start_date', { ascending: false });

        if (expsError) {
          console.error('Error fetching experiences:', expsError);
        } else {
          const experienceData = exps?.map(exp => ({
            title: exp.title,
            companyName: exp.company_name,
            description: exp.description || '',
            startDate: exp.start_date || '',
            endDate: exp.end_date || '',
            isCurrent: exp.is_current || false,
            location: exp.location || '',
          })) || [];
          
          setExperiences(experienceData);
        }
      }
    } catch (err) {
      console.error('Error fetching LinkedIn data:', err);
      setError('Failed to fetch LinkedIn data');
    } finally {
      setLoading(false);
    }
  };

  return {
    linkedInData,
    experiences,
    loading,
    error,
    refetch: fetchLinkedInData,
  };
};
