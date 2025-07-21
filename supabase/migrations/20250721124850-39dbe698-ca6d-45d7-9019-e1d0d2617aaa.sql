-- Create Behance profiles table for designer portfolios
CREATE TABLE public.behance_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  behance_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  city TEXT,
  country TEXT,
  company TEXT,
  website TEXT,
  biography TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  project_views INTEGER DEFAULT 0,
  appreciations INTEGER DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create Behance projects table
CREATE TABLE public.behance_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  behance_profile_id UUID NOT NULL REFERENCES public.behance_profiles(id) ON DELETE CASCADE,
  project_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  published_on TIMESTAMP WITH TIME ZONE,
  created_on TIMESTAMP WITH TIME ZONE,
  modified_on TIMESTAMP WITH TIME ZONE,
  url TEXT NOT NULL,
  privacy TEXT DEFAULT 'public',
  views INTEGER DEFAULT 0,
  appreciations INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  tags TEXT[],
  fields TEXT[],
  covers JSONB,
  modules JSONB,
  stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Medium profiles table for writers
CREATE TABLE public.medium_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medium_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create Medium articles table
CREATE TABLE public.medium_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medium_profile_id UUID NOT NULL REFERENCES public.medium_profiles(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content_preview TEXT,
  url TEXT NOT NULL,
  canonical_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at_medium TIMESTAMP WITH TIME ZONE,
  claps INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  tags TEXT[],
  topics TEXT[],
  license TEXT,
  license_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom profile data table for manual input
CREATE TABLE public.custom_profile_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profession TEXT NOT NULL,
  data_type TEXT NOT NULL, -- 'experience', 'project', 'skill', 'education', 'certification', 'award'
  title TEXT NOT NULL,
  organization TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location TEXT,
  url TEXT,
  skills TEXT[],
  technologies TEXT[],
  achievements TEXT[],
  media_urls TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.behance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behance_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medium_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medium_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_profile_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Behance profiles
CREATE POLICY "Users can manage their own Behance profile" 
  ON public.behance_profiles 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for Behance projects
CREATE POLICY "Users can manage their own Behance projects" 
  ON public.behance_projects 
  FOR ALL 
  USING (
    behance_profile_id IN (
      SELECT id FROM public.behance_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for Medium profiles
CREATE POLICY "Users can manage their own Medium profile" 
  ON public.medium_profiles 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for Medium articles
CREATE POLICY "Users can manage their own Medium articles" 
  ON public.medium_articles 
  FOR ALL 
  USING (
    medium_profile_id IN (
      SELECT id FROM public.medium_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for custom profile data
CREATE POLICY "Users can manage their own custom profile data" 
  ON public.custom_profile_data 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_behance_profiles_user_id ON public.behance_profiles(user_id);
CREATE INDEX idx_behance_projects_profile_id ON public.behance_projects(behance_profile_id);
CREATE INDEX idx_medium_profiles_user_id ON public.medium_profiles(user_id);
CREATE INDEX idx_medium_articles_profile_id ON public.medium_articles(medium_profile_id);
CREATE INDEX idx_custom_profile_data_user_id ON public.custom_profile_data(user_id);
CREATE INDEX idx_custom_profile_data_profession ON public.custom_profile_data(profession);
CREATE INDEX idx_custom_profile_data_type ON public.custom_profile_data(data_type);

-- Add triggers for updated_at columns
CREATE TRIGGER update_behance_profiles_updated_at
  BEFORE UPDATE ON public.behance_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_behance_projects_updated_at
  BEFORE UPDATE ON public.behance_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medium_profiles_updated_at
  BEFORE UPDATE ON public.medium_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medium_articles_updated_at
  BEFORE UPDATE ON public.medium_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_profile_data_updated_at
  BEFORE UPDATE ON public.custom_profile_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();