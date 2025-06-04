
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GitHubCommit {
  id: string;
  repo_id: number;
  sha: string;
  message: string;
  author_name: string;
  author_email: string;
  author_date: string;
  additions: number;
  deletions: number;
  total_changes: number;
  files_changed: number;
}

interface GitHubContribution {
  id: string;
  date: string;
  contribution_count: number;
  contribution_level: number;
}

interface GitHubSyncSettings {
  id: string;
  auto_sync_enabled: boolean;
  sync_frequency_hours: number;
  last_auto_sync_at: string | null;
  sync_repositories: boolean;
  sync_commits: boolean;
  sync_contributions: boolean;
  max_commits_per_repo: number;
}

interface ProjectSuggestion {
  id: string;
  repo_id: number;
  suggested_name: string;
  suggested_description: string;
  suggested_technologies: string[];
  confidence_score: number;
  is_featured_candidate: boolean;
  auto_generated_description: string;
  project_category: string;
}

interface EnhancedRepository {
  id: string;
  repo_id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  is_fork: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_template: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  open_issues_count: number;
  default_branch: string;
  size_kb: number;
  last_commit_at: string;
  commit_count: number;
  contributor_count: number;
  primary_language_percentage: number;
}

export const useEnhancedGitHubData = () => {
  const { user } = useAuth();
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [syncSettings, setSyncSettings] = useState<GitHubSyncSettings | null>(null);
  const [projectSuggestions, setProjectSuggestions] = useState<ProjectSuggestion[]>([]);
  const [enhancedRepositories, setEnhancedRepositories] = useState<EnhancedRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEnhancedData();
    }
  }, [user]);

  const fetchEnhancedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get GitHub profile first
      const { data: githubProfile, error: profileError } = await supabase
        .from('github_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError || !githubProfile) {
        setLoading(false);
        return;
      }

      // Fetch commits
      const { data: commitsData, error: commitsError } = await supabase
        .from('github_commits')
        .select('*')
        .eq('github_profile_id', githubProfile.id)
        .order('author_date', { ascending: false })
        .limit(100);

      if (commitsError) {
        console.error('Error fetching commits:', commitsError);
      } else {
        setCommits(commitsData || []);
      }

      // Fetch contributions for the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const { data: contributionsData, error: contributionsError } = await supabase
        .from('github_contributions')
        .select('*')
        .eq('github_profile_id', githubProfile.id)
        .gte('date', oneYearAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (contributionsError) {
        console.error('Error fetching contributions:', contributionsError);
      } else {
        setContributions(contributionsData || []);
      }

      // Fetch sync settings
      const { data: syncData, error: syncError } = await supabase
        .from('github_sync_settings')
        .select('*')
        .eq('github_profile_id', githubProfile.id)
        .single();

      if (syncError && syncError.code !== 'PGRST116') {
        console.error('Error fetching sync settings:', syncError);
      } else {
        setSyncSettings(syncData);
      }

      // Fetch project suggestions
      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from('github_project_suggestions')
        .select('*')
        .eq('github_profile_id', githubProfile.id)
        .order('confidence_score', { ascending: false });

      if (suggestionsError) {
        console.error('Error fetching project suggestions:', suggestionsError);
      } else {
        setProjectSuggestions(suggestionsData || []);
      }

      // Fetch enhanced repositories
      const { data: reposData, error: reposError } = await supabase
        .from('github_repositories')
        .select('*')
        .eq('github_profile_id', githubProfile.id)
        .order('stargazers_count', { ascending: false });

      if (reposError) {
        console.error('Error fetching enhanced repositories:', reposError);
      } else {
        setEnhancedRepositories(reposData || []);
      }

    } catch (err) {
      console.error('Error fetching enhanced GitHub data:', err);
      setError('Failed to fetch enhanced GitHub data');
    } finally {
      setLoading(false);
    }
  };

  const updateSyncSettings = async (settings: Partial<GitHubSyncSettings>) => {
    if (!user || !syncSettings) return;

    try {
      const { data: githubProfile } = await supabase
        .from('github_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!githubProfile) return;

      const { error } = await supabase
        .from('github_sync_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('github_profile_id', githubProfile.id);

      if (error) {
        throw error;
      }

      // Refresh sync settings
      await fetchEnhancedData();
    } catch (error) {
      console.error('Error updating sync settings:', error);
      throw error;
    }
  };

  const getLanguageStats = () => {
    const languageCounts: Record<string, number> = {};
    enhancedRepositories.forEach(repo => {
      if (repo.language && !repo.is_fork) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([language, count]) => ({ language, count }));
  };

  const getCommitStats = () => {
    const totalCommits = commits.length;
    const totalAdditions = commits.reduce((sum, commit) => sum + (commit.additions || 0), 0);
    const totalDeletions = commits.reduce((sum, commit) => sum + (commit.deletions || 0), 0);
    const totalChanges = commits.reduce((sum, commit) => sum + (commit.total_changes || 0), 0);

    return {
      totalCommits,
      totalAdditions,
      totalDeletions,
      totalChanges,
      averageChangesPerCommit: totalCommits > 0 ? Math.round(totalChanges / totalCommits) : 0,
    };
  };

  const getContributionStreak = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort contributions by date (most recent first)
    const sortedContributions = [...contributions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 0; i < sortedContributions.length; i++) {
      const contribution = sortedContributions[i];
      
      if (contribution.contribution_count > 0) {
        tempStreak++;
        
        // If this is the most recent day with contributions, start current streak
        if (i === 0 || currentStreak === 0) {
          currentStreak = tempStreak;
        }
      } else {
        // Reset temp streak
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        
        // If we hit a day with no contributions, end current streak
        if (currentStreak > 0) {
          currentStreak = Math.max(currentStreak, tempStreak);
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  };

  return {
    commits,
    contributions,
    syncSettings,
    projectSuggestions,
    enhancedRepositories,
    loading,
    error,
    refetch: fetchEnhancedData,
    updateSyncSettings,
    getLanguageStats,
    getCommitStats,
    getContributionStreak,
  };
};
