-- Create auto sync settings table for managing sync preferences
CREATE TABLE public.auto_sync_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  frequency TEXT NOT NULL DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_github BOOLEAN NOT NULL DEFAULT true,
  sync_linkedin BOOLEAN NOT NULL DEFAULT true,
  sync_behance BOOLEAN NOT NULL DEFAULT false,
  sync_medium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create portfolio analytics table for tracking views and usage
CREATE TABLE public.portfolio_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'export', 'share', etc.
  visitor_ip TEXT,
  visitor_user_agent TEXT,
  referrer TEXT,
  country TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.auto_sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auto sync settings
CREATE POLICY "Users can manage their own sync settings" 
  ON public.auto_sync_settings 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for portfolio analytics
CREATE POLICY "Users can view their own portfolio analytics" 
  ON public.portfolio_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" 
  ON public.portfolio_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_auto_sync_settings_user_id ON public.auto_sync_settings(user_id);
CREATE INDEX idx_portfolio_analytics_portfolio_id ON public.portfolio_analytics(portfolio_id);
CREATE INDEX idx_portfolio_analytics_user_id ON public.portfolio_analytics(user_id);
CREATE INDEX idx_portfolio_analytics_created_at ON public.portfolio_analytics(created_at);

-- Add triggers for updated_at columns
CREATE TRIGGER update_auto_sync_settings_updated_at
  BEFORE UPDATE ON public.auto_sync_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();