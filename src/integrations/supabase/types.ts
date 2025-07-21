export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      behance_profiles: {
        Row: {
          access_token: string | null
          appreciations: number | null
          avatar_url: string | null
          behance_user_id: string
          biography: string | null
          city: string | null
          company: string | null
          country: string | null
          cover_image_url: string | null
          created_at: string
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          last_synced_at: string | null
          project_views: number | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string
          website: string | null
        }
        Insert: {
          access_token?: string | null
          appreciations?: number | null
          avatar_url?: string | null
          behance_user_id: string
          biography?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_synced_at?: string | null
          project_views?: number | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username: string
          website?: string | null
        }
        Update: {
          access_token?: string | null
          appreciations?: number | null
          avatar_url?: string | null
          behance_user_id?: string
          biography?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_synced_at?: string | null
          project_views?: number | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      behance_projects: {
        Row: {
          appreciations: number | null
          behance_profile_id: string
          comments: number | null
          covers: Json | null
          created_at: string
          created_on: string | null
          description: string | null
          fields: string[] | null
          id: string
          modified_on: string | null
          modules: Json | null
          name: string
          privacy: string | null
          project_id: number
          published_on: string | null
          stats: Json | null
          tags: string[] | null
          updated_at: string
          url: string
          views: number | null
        }
        Insert: {
          appreciations?: number | null
          behance_profile_id: string
          comments?: number | null
          covers?: Json | null
          created_at?: string
          created_on?: string | null
          description?: string | null
          fields?: string[] | null
          id?: string
          modified_on?: string | null
          modules?: Json | null
          name: string
          privacy?: string | null
          project_id: number
          published_on?: string | null
          stats?: Json | null
          tags?: string[] | null
          updated_at?: string
          url: string
          views?: number | null
        }
        Update: {
          appreciations?: number | null
          behance_profile_id?: string
          comments?: number | null
          covers?: Json | null
          created_at?: string
          created_on?: string | null
          description?: string | null
          fields?: string[] | null
          id?: string
          modified_on?: string | null
          modules?: Json | null
          name?: string
          privacy?: string | null
          project_id?: number
          published_on?: string | null
          stats?: Json | null
          tags?: string[] | null
          updated_at?: string
          url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "behance_projects_behance_profile_id_fkey"
            columns: ["behance_profile_id"]
            isOneToOne: false
            referencedRelation: "behance_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_profile_data: {
        Row: {
          achievements: string[] | null
          created_at: string
          data_type: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          media_urls: string[] | null
          metadata: Json | null
          organization: string | null
          profession: string
          skills: string[] | null
          start_date: string | null
          technologies: string[] | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string
          data_type: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          media_urls?: string[] | null
          metadata?: Json | null
          organization?: string | null
          profession: string
          skills?: string[] | null
          start_date?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          created_at?: string
          data_type?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          media_urls?: string[] | null
          metadata?: Json | null
          organization?: string | null
          profession?: string
          skills?: string[] | null
          start_date?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      github_commits: {
        Row: {
          additions: number | null
          author_date: string | null
          author_email: string | null
          author_name: string | null
          committer_date: string | null
          committer_email: string | null
          committer_name: string | null
          created_at: string
          deletions: number | null
          files_changed: number | null
          github_profile_id: string
          id: string
          message: string | null
          repo_id: number
          sha: string
          total_changes: number | null
          updated_at: string
        }
        Insert: {
          additions?: number | null
          author_date?: string | null
          author_email?: string | null
          author_name?: string | null
          committer_date?: string | null
          committer_email?: string | null
          committer_name?: string | null
          created_at?: string
          deletions?: number | null
          files_changed?: number | null
          github_profile_id: string
          id?: string
          message?: string | null
          repo_id: number
          sha: string
          total_changes?: number | null
          updated_at?: string
        }
        Update: {
          additions?: number | null
          author_date?: string | null
          author_email?: string | null
          author_name?: string | null
          committer_date?: string | null
          committer_email?: string | null
          committer_name?: string | null
          created_at?: string
          deletions?: number | null
          files_changed?: number | null
          github_profile_id?: string
          id?: string
          message?: string | null
          repo_id?: number
          sha?: string
          total_changes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_commits_github_profile_id_fkey"
            columns: ["github_profile_id"]
            isOneToOne: false
            referencedRelation: "github_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_contributions: {
        Row: {
          contribution_count: number
          contribution_level: number
          created_at: string
          date: string
          github_profile_id: string
          id: string
          updated_at: string
        }
        Insert: {
          contribution_count?: number
          contribution_level?: number
          created_at?: string
          date: string
          github_profile_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          contribution_count?: number
          contribution_level?: number
          created_at?: string
          date?: string
          github_profile_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_contributions_github_profile_id_fkey"
            columns: ["github_profile_id"]
            isOneToOne: false
            referencedRelation: "github_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_profiles: {
        Row: {
          access_token: string | null
          avatar_url: string | null
          bio: string | null
          blog: string | null
          company: string | null
          created_at: string
          display_name: string | null
          followers: number | null
          following: number | null
          github_user_id: string
          id: string
          last_synced_at: string | null
          location: string | null
          public_repos: number | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token?: string | null
          avatar_url?: string | null
          bio?: string | null
          blog?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          followers?: number | null
          following?: number | null
          github_user_id: string
          id?: string
          last_synced_at?: string | null
          location?: string | null
          public_repos?: number | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string | null
          avatar_url?: string | null
          bio?: string | null
          blog?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          followers?: number | null
          following?: number | null
          github_user_id?: string
          id?: string
          last_synced_at?: string | null
          location?: string | null
          public_repos?: number | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      github_project_suggestions: {
        Row: {
          auto_generated_description: string | null
          confidence_score: number | null
          created_at: string
          github_profile_id: string
          id: string
          is_featured_candidate: boolean | null
          project_category: string | null
          repo_id: number
          suggested_description: string | null
          suggested_name: string
          suggested_technologies: string[] | null
          updated_at: string
        }
        Insert: {
          auto_generated_description?: string | null
          confidence_score?: number | null
          created_at?: string
          github_profile_id: string
          id?: string
          is_featured_candidate?: boolean | null
          project_category?: string | null
          repo_id: number
          suggested_description?: string | null
          suggested_name: string
          suggested_technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          auto_generated_description?: string | null
          confidence_score?: number | null
          created_at?: string
          github_profile_id?: string
          id?: string
          is_featured_candidate?: boolean | null
          project_category?: string | null
          repo_id?: number
          suggested_description?: string | null
          suggested_name?: string
          suggested_technologies?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_project_suggestions_github_profile_id_fkey"
            columns: ["github_profile_id"]
            isOneToOne: false
            referencedRelation: "github_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_repositories: {
        Row: {
          commit_count: number | null
          contributor_count: number | null
          created_at: string
          created_at_github: string | null
          default_branch: string | null
          description: string | null
          forks_count: number | null
          full_name: string
          github_profile_id: string
          has_pages: boolean | null
          has_wiki: boolean | null
          html_url: string
          id: string
          is_archived: boolean | null
          is_fork: boolean | null
          is_private: boolean | null
          is_template: boolean | null
          language: string | null
          languages_data: Json | null
          last_commit_at: string | null
          name: string
          open_issues_count: number | null
          primary_language_percentage: number | null
          pushed_at_github: string | null
          repo_id: number
          size_kb: number | null
          stargazers_count: number | null
          topics: string[] | null
          updated_at: string
          updated_at_github: string | null
        }
        Insert: {
          commit_count?: number | null
          contributor_count?: number | null
          created_at?: string
          created_at_github?: string | null
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          full_name: string
          github_profile_id: string
          has_pages?: boolean | null
          has_wiki?: boolean | null
          html_url: string
          id?: string
          is_archived?: boolean | null
          is_fork?: boolean | null
          is_private?: boolean | null
          is_template?: boolean | null
          language?: string | null
          languages_data?: Json | null
          last_commit_at?: string | null
          name: string
          open_issues_count?: number | null
          primary_language_percentage?: number | null
          pushed_at_github?: string | null
          repo_id: number
          size_kb?: number | null
          stargazers_count?: number | null
          topics?: string[] | null
          updated_at?: string
          updated_at_github?: string | null
        }
        Update: {
          commit_count?: number | null
          contributor_count?: number | null
          created_at?: string
          created_at_github?: string | null
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          full_name?: string
          github_profile_id?: string
          has_pages?: boolean | null
          has_wiki?: boolean | null
          html_url?: string
          id?: string
          is_archived?: boolean | null
          is_fork?: boolean | null
          is_private?: boolean | null
          is_template?: boolean | null
          language?: string | null
          languages_data?: Json | null
          last_commit_at?: string | null
          name?: string
          open_issues_count?: number | null
          primary_language_percentage?: number | null
          pushed_at_github?: string | null
          repo_id?: number
          size_kb?: number | null
          stargazers_count?: number | null
          topics?: string[] | null
          updated_at?: string
          updated_at_github?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "github_repositories_github_profile_id_fkey"
            columns: ["github_profile_id"]
            isOneToOne: false
            referencedRelation: "github_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_sync_settings: {
        Row: {
          auto_sync_enabled: boolean
          created_at: string
          github_profile_id: string
          id: string
          last_auto_sync_at: string | null
          max_commits_per_repo: number
          sync_commits: boolean
          sync_contributions: boolean
          sync_frequency_hours: number
          sync_repositories: boolean
          updated_at: string
        }
        Insert: {
          auto_sync_enabled?: boolean
          created_at?: string
          github_profile_id: string
          id?: string
          last_auto_sync_at?: string | null
          max_commits_per_repo?: number
          sync_commits?: boolean
          sync_contributions?: boolean
          sync_frequency_hours?: number
          sync_repositories?: boolean
          updated_at?: string
        }
        Update: {
          auto_sync_enabled?: boolean
          created_at?: string
          github_profile_id?: string
          id?: string
          last_auto_sync_at?: string | null
          max_commits_per_repo?: number
          sync_commits?: boolean
          sync_contributions?: boolean
          sync_frequency_hours?: number
          sync_repositories?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_sync_settings_github_profile_id_fkey"
            columns: ["github_profile_id"]
            isOneToOne: true
            referencedRelation: "github_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_education: {
        Row: {
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution_name: string
          linkedin_profile_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_name: string
          linkedin_profile_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution_name?: string
          linkedin_profile_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_education_linkedin_profile_id_fkey"
            columns: ["linkedin_profile_id"]
            isOneToOne: false
            referencedRelation: "linkedin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_experiences: {
        Row: {
          company_logo_url: string | null
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          linkedin_profile_id: string
          location: string | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          linkedin_profile_id: string
          location?: string | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          linkedin_profile_id?: string
          location?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_experiences_linkedin_profile_id_fkey"
            columns: ["linkedin_profile_id"]
            isOneToOne: false
            referencedRelation: "linkedin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_profiles: {
        Row: {
          access_token: string | null
          connections_count: number | null
          created_at: string
          first_name: string | null
          headline: string | null
          id: string
          industry: string | null
          last_name: string | null
          last_synced_at: string | null
          linkedin_user_id: string
          location: string | null
          profile_picture_url: string | null
          refresh_token: string | null
          summary: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connections_count?: number | null
          created_at?: string
          first_name?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          last_synced_at?: string | null
          linkedin_user_id: string
          location?: string | null
          profile_picture_url?: string | null
          refresh_token?: string | null
          summary?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connections_count?: number | null
          created_at?: string
          first_name?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          last_synced_at?: string | null
          linkedin_user_id?: string
          location?: string | null
          profile_picture_url?: string | null
          refresh_token?: string | null
          summary?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medium_articles: {
        Row: {
          article_id: string
          canonical_url: string | null
          claps: number | null
          content_preview: string | null
          created_at: string
          id: string
          license: string | null
          license_url: string | null
          medium_profile_id: string
          published_at: string | null
          reading_time: number | null
          subtitle: string | null
          tags: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
          updated_at_medium: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          article_id: string
          canonical_url?: string | null
          claps?: number | null
          content_preview?: string | null
          created_at?: string
          id?: string
          license?: string | null
          license_url?: string | null
          medium_profile_id: string
          published_at?: string | null
          reading_time?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
          updated_at_medium?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          article_id?: string
          canonical_url?: string | null
          claps?: number | null
          content_preview?: string | null
          created_at?: string
          id?: string
          license?: string | null
          license_url?: string | null
          medium_profile_id?: string
          published_at?: string | null
          reading_time?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string
          updated_at_medium?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medium_articles_medium_profile_id_fkey"
            columns: ["medium_profile_id"]
            isOneToOne: false
            referencedRelation: "medium_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medium_profiles: {
        Row: {
          access_token: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          followers_count: number | null
          following_count: number | null
          id: string
          last_synced_at: string | null
          medium_user_id: string
          name: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_synced_at?: string | null
          medium_user_id: string
          name?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_synced_at?: string | null
          medium_user_id?: string
          name?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      portfolio_exports: {
        Row: {
          created_at: string
          download_url: string | null
          error_message: string | null
          export_type: string
          id: string
          portfolio_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          download_url?: string | null
          error_message?: string | null
          export_type: string
          id?: string
          portfolio_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          download_url?: string | null
          error_message?: string | null
          export_type?: string
          id?: string
          portfolio_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_exports_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          custom_domain: string | null
          export_status: string | null
          export_url: string | null
          id: string
          is_published: boolean
          last_exported_at: string | null
          name: string
          portfolio_data: Json
          preview_url: string | null
          template_id: number
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          export_status?: string | null
          export_url?: string | null
          id?: string
          is_published?: boolean
          last_exported_at?: string | null
          name: string
          portfolio_data?: Json
          preview_url?: string | null
          template_id: number
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          export_status?: string | null
          export_url?: string | null
          id?: string
          is_published?: boolean
          last_exported_at?: string | null
          name?: string
          portfolio_data?: Json
          preview_url?: string | null
          template_id?: number
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_portfolios: number | null
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_portfolios?: number | null
          name: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_portfolios?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          ai_generations_count: number | null
          created_at: string
          id: string
          monthly_reset_date: string | null
          portfolios_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generations_count?: number | null
          created_at?: string
          id?: string
          monthly_reset_date?: string | null
          portfolios_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generations_count?: number | null
          created_at?: string
          id?: string
          monthly_reset_date?: string | null
          portfolios_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
