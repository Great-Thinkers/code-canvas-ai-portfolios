
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GitHubData {
  name: string;
  email: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  public_repos: number;
  followers: number;
  avatar_url: string;
  login: string;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  html_url: string;
  topics: string[];
}

export const useGitHubData = () => {
  const { user } = useAuth();
  const [gitHubData, setGitHubData] = useState<GitHubData | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchGitHubData();
    }
  }, [user]);

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user has GitHub profile in our database
      const { data: githubProfile, error: profileError } = await supabase
        .from('github_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (githubProfile) {
        // User has GitHub profile, fetch their data
        setGitHubData({
          name: githubProfile.display_name || githubProfile.username,
          email: user?.email || '',
          bio: githubProfile.bio || '',
          location: githubProfile.location || '',
          company: githubProfile.company || '',
          blog: githubProfile.blog || '',
          public_repos: githubProfile.public_repos || 0,
          followers: githubProfile.followers || 0,
          avatar_url: githubProfile.avatar_url || '',
          login: githubProfile.username,
        });

        // Fetch repositories
        const { data: repos, error: reposError } = await supabase
          .from('github_repositories')
          .select('*')
          .eq('github_profile_id', githubProfile.id)
          .order('stargazers_count', { ascending: false })
          .limit(20);

        if (reposError) {
          console.error('Error fetching repositories:', reposError);
        } else {
          const repoData = repos?.map(repo => ({
            name: repo.name,
            description: repo.description || '',
            language: repo.language || '',
            stargazers_count: repo.stargazers_count || 0,
            html_url: repo.html_url,
            topics: repo.topics || [],
          })) || [];
          
          setRepositories(repoData);

          // Extract unique languages
          const uniqueLanguages = [...new Set(
            repoData
              .map(repo => repo.language)
              .filter(lang => lang && lang.trim() !== '')
          )];
          setLanguages(uniqueLanguages);
        }
      }
    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      setError('Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  return {
    gitHubData,
    repositories,
    languages,
    loading,
    error,
    refetch: fetchGitHubData,
  };
};
