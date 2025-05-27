
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  private: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Get GitHub profile from database
    const { data: githubProfile, error: profileError } = await supabase
      .from('github_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (profileError || !githubProfile?.access_token) {
      throw new Error('GitHub profile not found or access token missing');
    }

    const accessToken = githubProfile.access_token;

    // Fetch user data from GitHub API
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'DevPortfolio-Generator/1.0'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch GitHub user data');
    }

    const userData: GitHubUser = await userResponse.json();

    // Update GitHub profile in database
    const { error: updateError } = await supabase
      .from('github_profiles')
      .update({
        github_user_id: userData.id.toString(),
        username: userData.login,
        display_name: userData.name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        company: userData.company,
        location: userData.location,
        blog: userData.blog,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id);

    if (updateError) {
      throw updateError;
    }

    // Fetch repositories from GitHub API
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'DevPortfolio-Generator/1.0'
      }
    });

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch GitHub repositories');
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Clear existing repositories and insert new ones
    await supabase
      .from('github_repositories')
      .delete()
      .eq('github_profile_id', githubProfile.id);

    if (repos.length > 0) {
      const repoData = repos.map(repo => ({
        github_profile_id: githubProfile.id,
        repo_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics,
        created_at_github: repo.created_at,
        updated_at_github: repo.updated_at,
        pushed_at_github: repo.pushed_at,
        is_fork: repo.fork,
        is_private: repo.private,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: reposError } = await supabase
        .from('github_repositories')
        .insert(repoData);

      if (reposError) {
        console.error('Error inserting repositories:', reposError);
      }
    }

    console.log(`Successfully synced GitHub data for user ${user_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'GitHub data synced successfully',
        repos_count: repos.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error syncing GitHub data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to sync GitHub data' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
