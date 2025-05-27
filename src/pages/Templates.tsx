import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplatePreview from '@/components/templates/TemplatePreview';
import TemplateSelectionFlow from '@/components/templates/TemplateSelectionFlow';
import AdvancedSearch, { AdvancedFilters } from '@/components/templates/AdvancedSearch';
import PremiumTemplateCard from '@/components/templates/PremiumTemplateCard';
import TemplateAnalytics from '@/components/templates/TemplateAnalytics';
import { BarChart3 } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  role: string;
  style: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  isPremium?: boolean;
  isPopular?: boolean;
  rating?: number;
}

interface UserData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  title: string;
  bio: string;
  skills: string[];
  projects: number;
}

export default function Templates() {
  // Enhanced template data with more variety and premium options
  const templates: Template[] = [
    {
      id: 1,
      name: 'Modern Minimal',
      description: 'A clean and minimalist design with focus on content and readability. Perfect for developers who want their work to speak for itself.',
      category: 'Portfolio',
      role: 'frontend',
      style: ['minimal', 'modern'],
      features: ['responsive', 'seo', 'projects'],
      tags: ['Minimalist', 'Professional'],
      previewUrl: '/placeholder.svg',
      isPopular: true,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Tech Stack Pro',
      description: 'Showcase your technical skills with animated code snippets and tech logos. Includes advanced project filtering and GitHub integration.',
      category: 'Developer',
      role: 'fullstack',
      style: ['modern', 'dark'],
      features: ['animations', 'projects', 'responsive', 'analytics'],
      tags: ['Technical', 'Interactive'],
      previewUrl: '/placeholder.svg',
      isPremium: true,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Creative Canvas',
      description: 'A colorful, artistic layout for designers and creative professionals. Express your creativity with bold visuals.',
      category: 'Design',
      role: 'designer',
      style: ['creative', 'colorful'],
      features: ['animations', 'projects', 'responsive'],
      tags: ['Creative', 'Visual'],
      previewUrl: '/placeholder.svg',
      rating: 4.6
    },
    {
      id: 4,
      name: 'Project Showcase Elite',
      description: 'Highlight your projects with detailed case studies and results. Features advanced project analytics and testimonial integration.',
      category: 'Portfolio',
      role: 'fullstack',
      style: ['professional', 'modern'],
      features: ['projects', 'seo', 'contact', 'testimonials', 'analytics'],
      tags: ['Projects', 'Case Studies'],
      previewUrl: '/placeholder.svg',
      isPremium: true,
      isPopular: true,
      rating: 4.9
    },
    {
      id: 5,
      name: 'Backend Engineer',
      description: 'Clean, code-focused design emphasizing system architecture and technical documentation.',
      category: 'Developer',
      role: 'backend',
      style: ['minimal', 'professional'],
      features: ['projects', 'blog', 'seo'],
      tags: ['Technical', 'Documentation'],
      previewUrl: '/placeholder.svg',
      rating: 4.5
    },
    {
      id: 6,
      name: 'Mobile First Pro',
      description: 'Premium responsive design optimized for mobile developers showcasing app development skills with app store integration.',
      category: 'Mobile',
      role: 'mobile',
      style: ['modern', 'responsive'],
      features: ['responsive', 'animations', 'projects', 'analytics'],
      tags: ['Mobile', 'Apps'],
      previewUrl: '/placeholder.svg',
      isPremium: true,
      rating: 4.7
    },
    {
      id: 7,
      name: 'DevOps Dashboard',
      description: 'Infrastructure-focused portfolio with monitoring dashboards and deployment showcases.',
      category: 'DevOps',
      role: 'devops',
      style: ['dark', 'professional'],
      features: ['projects', 'contact', 'responsive'],
      tags: ['Infrastructure', 'Monitoring'],
      previewUrl: '/placeholder.svg',
      rating: 4.4
    },
    {
      id: 8,
      name: 'Blog & Portfolio Pro',
      description: 'Premium combined portfolio and blog platform with advanced SEO, analytics, and content management features.',
      category: 'Portfolio',
      role: 'frontend',
      style: ['modern', 'professional'],
      features: ['blog', 'projects', 'seo', 'contact', 'analytics'],
      tags: ['Blog', 'Content'],
      previewUrl: '/placeholder.svg',
      isPremium: true,
      rating: 4.8
    },
    {
      id: 9,
      name: 'Data Science Hub',
      description: 'Specialized template for data scientists with interactive charts, research publications, and dataset showcases.',
      category: 'Developer',
      role: 'data',
      style: ['modern', 'professional'],
      features: ['projects', 'blog', 'seo', 'analytics'],
      tags: ['Data Science', 'Research'],
      previewUrl: '/placeholder.svg',
      isPremium: true,
      rating: 4.6
    },
    {
      id: 10,
      name: 'Startup Founder',
      description: 'Professional template for startup founders and entrepreneurs showcasing ventures, team, and achievements.',
      category: 'Business',
      role: 'fullstack',
      style: ['professional', 'modern'],
      features: ['projects', 'testimonials', 'contact', 'seo'],
      tags: ['Business', 'Leadership'],
      previewUrl: '/placeholder.svg',
      isPopular: true,
      rating: 4.7
    }
  ];

  const [filters, setFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    roles: [],
    styles: [],
    features: [],
    categories: [],
    isPremium: undefined,
    sortBy: 'popular'
  });

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectionFlowTemplate, setSelectionFlowTemplate] = useState<Template | null>(null);
  const [isSelectionFlowOpen, setIsSelectionFlowOpen] = useState(false);
  const [isSubscribed] = useState(false); // TODO: Get from auth context
  const [activeTab, setActiveTab] = useState('browse');
  const [recommendedTemplateIds, setRecommendedTemplateIds] = useState<number[]>([]);

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter((template) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          template.role.toLowerCase().includes(searchLower) ||
          template.category.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Role filter
      if (filters.roles.length > 0 && !filters.roles.includes(template.role)) {
        return false;
      }

      // Style filter
      if (filters.styles.length > 0 && !filters.styles.some(style => template.style.includes(style))) {
        return false;
      }

      // Features filter
      if (filters.features.length > 0 && !filters.features.some(feature => template.features.includes(feature))) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(template.category)) {
        return false;
      }

      // Premium filter
      if (filters.isPremium === true && !template.isPremium) {
        return false;
      }

      return true;
    });

    // Sort templates
    switch (filters.sortBy) {
      case 'popular':
        return filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return filtered;
    }
  }, [templates, filters]);

  const handleTemplateRecommendation = (templateIds: number[]) => {
    setRecommendedTemplateIds(templateIds);
    setActiveTab('browse');
    // Optionally scroll to templates section
    setTimeout(() => {
      document.getElementById('templates-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const displayTemplates = recommendedTemplateIds.length > 0 
    ? filteredAndSortedTemplates.filter(t => recommendedTemplateIds.includes(t.id))
    : filteredAndSortedTemplates;

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSelect = (template: Template) => {
    setSelectionFlowTemplate(template);
    setIsSelectionFlowOpen(true);
  };

  const handleSelectionComplete = (template: Template, userData: UserData) => {
    console.log('Creating portfolio with:', { template: template.name, userData });
    // TODO: Implement portfolio creation logic
    // This would typically involve:
    // 1. Saving the user data
    // 2. Creating a new portfolio instance
    // 3. Redirecting to the portfolio editor or dashboard
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/50">
          <div className="container py-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Portfolio Templates</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a variety of professional templates to showcase your skills, projects, and experience. 
              All templates are fully customizable to match your personal brand.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Templates</TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics & Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-8">
              {/* Search and Filters */}
              <AdvancedSearch
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={displayTemplates.length}
                totalCount={templates.length}
              />

              {/* Recommended Templates Banner */}
              {recommendedTemplateIds.length > 0 && (
                <div className="bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-900 dark:text-brand-100">
                        AI Recommended Templates
                      </h3>
                      <p className="text-sm text-brand-700 dark:text-brand-300">
                        Showing {displayTemplates.length} templates based on your preferences
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setRecommendedTemplateIds([])}
                    >
                      Clear Recommendations
                    </Button>
                  </div>
                </div>
              )}

              {/* Templates Grid */}
              <div id="templates-grid">
                {displayTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTemplates.map((template) => (
                      <PremiumTemplateCard
                        key={template.id}
                        template={template}
                        onPreview={handlePreview}
                        onSelect={handleSelect}
                        isSubscribed={isSubscribed}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or search terms to find the perfect template for your needs.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFilters({
                            searchTerm: '',
                            roles: [],
                            styles: [],
                            features: [],
                            categories: [],
                            isPremium: undefined,
                            sortBy: 'popular'
                          });
                          setRecommendedTemplateIds([]);
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <TemplateAnalytics 
                templates={templates}
                onTemplateRecommendation={handleTemplateRecommendation}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Template Preview Modal */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelect={handleSelect}
      />

      {/* Template Selection Flow */}
      <TemplateSelectionFlow
        template={selectionFlowTemplate}
        isOpen={isSelectionFlowOpen}
        onClose={() => setIsSelectionFlowOpen(false)}
        onComplete={handleSelectionComplete}
      />
    </div>
  );
}
