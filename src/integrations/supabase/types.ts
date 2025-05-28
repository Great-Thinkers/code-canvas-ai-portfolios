export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      github_repositories: {
        Row: {
          created_at: string
          created_at_github: string | null
          description: string | null
          forks_count: number | null
          full_name: string
          github_profile_id: string
          html_url: string
          id: string
          is_fork: boolean | null
          is_private: boolean | null
          language: string | null
          languages_data: Json | null
          name: string
          pushed_at_github: string | null
          repo_id: number
          stargazers_count: number | null
          topics: string[] | null
          updated_at: string
          updated_at_github: string | null
        }
        Insert: {
          created_at?: string
          created_at_github?: string | null
          description?: string | null
          forks_count?: number | null
          full_name: string
          github_profile_id: string
          html_url: string
          id?: string
          is_fork?: boolean | null
          is_private?: boolean | null
          language?: string | null
          languages_data?: Json | null
          name: string
          pushed_at_github?: string | null
          repo_id: number
          stargazers_count?: number | null
          topics?: string[] | null
          updated_at?: string
          updated_at_github?: string | null
        }
        Update: {
          created_at?: string
          created_at_github?: string | null
          description?: string | null
          forks_count?: number | null
          full_name?: string
          github_profile_id?: string
          html_url?: string
          id?: string
          is_fork?: boolean | null
          is_private?: boolean | null
          language?: string | null
          languages_data?: Json | null
          name?: string
          pushed_at_github?: string | null
          repo_id?: number
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
      portfolios: {
        Row: {
          created_at: string
          custom_domain: string | null
          id: string
          is_published: boolean
          name: string
          portfolio_data: Json
          template_id: number
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          id?: string
          is_published?: boolean
          name: string
          portfolio_data?: Json
          template_id: number
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          id?: string
          is_published?: boolean
          name?: string
          portfolio_data?: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
