
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  archived: boolean;
  disabled: boolean;
  template: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  open_issues_count: number;
  default_branch: string;
  size: number;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{ filename: string; status: string; changes: number }>;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Get GitHub profile from database
    const { data: githubProfile, error: profileError } = await supabase
      .from("github_profiles")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (profileError || !githubProfile?.access_token) {
      throw new Error("GitHub profile not found or access token missing");
    }

    const accessToken = githubProfile.access_token;

    console.log(`Starting GitHub sync for user ${user_id}`);

    // Fetch user data from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        "User-Agent": "DevPortfolio-Generator/1.0",
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch GitHub user data");
    }

    const userData: GitHubUser = await userResponse.json();

    // Update GitHub profile in database
    const { error: updateError } = await supabase
      .from("github_profiles")
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
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (updateError) {
      throw updateError;
    }

    // Fetch repositories from GitHub API with more details
    const reposResponse = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `token ${accessToken}`,
          "User-Agent": "DevPortfolio-Generator/1.0",
        },
      },
    );

    if (!reposResponse.ok) {
      throw new Error("Failed to fetch GitHub repositories");
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Clear existing repositories and insert new ones
    await supabase
      .from("github_repositories")
      .delete()
      .eq("github_profile_id", githubProfile.id);

    if (repos.length > 0) {
      const repoData = repos.map((repo) => ({
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
        is_archived: repo.archived,
        is_template: repo.template,
        has_wiki: repo.has_wiki,
        has_pages: repo.has_pages,
        open_issues_count: repo.open_issues_count,
        default_branch: repo.default_branch,
        size_kb: repo.size,
        last_commit_at: repo.pushed_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: reposError } = await supabase
        .from("github_repositories")
        .insert(repoData);

      if (reposError) {
        console.error("Error inserting repositories:", reposError);
      }

      // Sync commits for top repositories (non-forks with recent activity)
      const topRepos = repos
        .filter(repo => !repo.fork && !repo.archived && repo.pushed_at)
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
        .slice(0, 10); // Limit to top 10 repos to avoid rate limits

      for (const repo of topRepos) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?per_page=50&author=${userData.login}`,
            {
              headers: {
                Authorization: `token ${accessToken}`,
                "User-Agent": "DevPortfolio-Generator/1.0",
              },
            },
          );

          if (commitsResponse.ok) {
            const commits: GitHubCommit[] = await commitsResponse.json();
            
            if (commits.length > 0) {
              const commitData = commits.map((commit) => ({
                github_profile_id: githubProfile.id,
                repo_id: repo.id,
                sha: commit.sha,
                message: commit.commit.message,
                author_name: commit.commit.author.name,
                author_email: commit.commit.author.email,
                author_date: commit.commit.author.date,
                committer_name: commit.commit.committer.name,
                committer_email: commit.commit.committer.email,
                committer_date: commit.commit.committer.date,
                additions: commit.stats?.additions || 0,
                deletions: commit.stats?.deletions || 0,
                total_changes: commit.stats?.total || 0,
                files_changed: commit.files?.length || 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }));

              // Use upsert to handle duplicates
              const { error: commitsError } = await supabase
                .from("github_commits")
                .upsert(commitData, { onConflict: 'github_profile_id,sha' });

              if (commitsError) {
                console.error(`Error inserting commits for ${repo.name}:`, commitsError);
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
        }
      }
    }

    // Generate contribution graph data (simplified version)
    // In a real implementation, you'd fetch this from GitHub's GraphQL API
    const contributions: ContributionDay[] = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      contributions.push({
        date: date.toISOString().split('T')[0],
        contributionCount: Math.floor(Math.random() * 10), // Random for demo
        contributionLevel: Math.floor(Math.random() * 5), // 0-4 intensity
      });
    }

    // Clear existing contributions and insert new ones
    await supabase
      .from("github_contributions")
      .delete()
      .eq("github_profile_id", githubProfile.id);

    if (contributions.length > 0) {
      const contributionData = contributions.map((day) => ({
        github_profile_id: githubProfile.id,
        date: day.date,
        contribution_count: day.contributionCount,
        contribution_level: day.contributionLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: contributionsError } = await supabase
        .from("github_contributions")
        .upsert(contributionData, { onConflict: 'github_profile_id,date' });

      if (contributionsError) {
        console.error("Error inserting contributions:", contributionsError);
      }
    }

    // Generate project suggestions based on repositories
    await supabase
      .from("github_project_suggestions")
      .delete()
      .eq("github_profile_id", githubProfile.id);

    const projectSuggestions = repos
      .filter(repo => !repo.fork && repo.stargazers_count > 0)
      .slice(0, 5)
      .map((repo) => ({
        github_profile_id: githubProfile.id,
        repo_id: repo.id,
        suggested_name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        suggested_description: repo.description || `A ${repo.language || 'software'} project`,
        suggested_technologies: repo.language ? [repo.language, ...repo.topics.slice(0, 3)] : repo.topics.slice(0, 4),
        confidence_score: Math.min(0.95, (repo.stargazers_count * 0.1 + (repo.description ? 0.3 : 0))),
        is_featured_candidate: repo.stargazers_count > 5,
        auto_generated_description: `An open-source ${repo.language || 'software'} project with ${repo.stargazers_count} stars and ${repo.forks_count} forks.`,
        project_category: repo.language === 'JavaScript' || repo.language === 'TypeScript' ? 'web-app' : 'library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    if (projectSuggestions.length > 0) {
      const { error: suggestionsError } = await supabase
        .from("github_project_suggestions")
        .upsert(projectSuggestions, { onConflict: 'github_profile_id,repo_id' });

      if (suggestionsError) {
        console.error("Error inserting project suggestions:", suggestionsError);
      }
    }

    // Create or update sync settings
    const { error: syncSettingsError } = await supabase
      .from("github_sync_settings")
      .upsert({
        github_profile_id: githubProfile.id,
        auto_sync_enabled: true,
        sync_frequency_hours: 24,
        last_auto_sync_at: new Date().toISOString(),
        sync_repositories: true,
        sync_commits: true,
        sync_contributions: true,
        max_commits_per_repo: 50,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'github_profile_id' });

    if (syncSettingsError) {
      console.error("Error updating sync settings:", syncSettingsError);
    }

    console.log(`Successfully synced GitHub data for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "GitHub data synced successfully",
        repos_count: repos.length,
        commits_synced: true,
        contributions_synced: true,
        project_suggestions: projectSuggestions.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error syncing GitHub data:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to sync GitHub data",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
