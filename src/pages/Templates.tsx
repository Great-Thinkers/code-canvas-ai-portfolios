import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilterSection, { FilterOptions } from '@/components/templates/FilterSection';
import TemplatePreview from '@/components/templates/TemplatePreview';

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
}

export default function Templates() {
  // Enhanced template data with filtering attributes
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
      previewUrl: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Tech Stack',
      description: 'Showcase your technical skills with animated code snippets and tech logos. Ideal for highlighting your programming expertise.',
      category: 'Developer',
      role: 'fullstack',
      style: ['modern', 'dark'],
      features: ['animations', 'projects', 'responsive'],
      tags: ['Technical', 'Interactive'],
      previewUrl: '/placeholder.svg'
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
      previewUrl: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Project Showcase',
      description: 'Highlight your projects with detailed case studies and results. Perfect for demonstrating your problem-solving skills.',
      category: 'Portfolio',
      role: 'fullstack',
      style: ['professional', 'modern'],
      features: ['projects', 'seo', 'contact'],
      tags: ['Projects', 'Case Studies'],
      previewUrl: '/placeholder.svg'
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
      isPremium: true
    },
    {
      id: 6,
      name: 'Mobile First',
      description: 'Responsive design optimized for mobile developers showcasing app development skills.',
      category: 'Mobile',
      role: 'mobile',
      style: ['modern', 'responsive'],
      features: ['responsive', 'animations', 'projects'],
      tags: ['Mobile', 'Apps'],
      previewUrl: '/placeholder.svg',
      isPremium: true
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
      previewUrl: '/placeholder.svg'
    },
    {
      id: 8,
      name: 'Blog & Portfolio',
      description: 'Combined portfolio and blog platform for developers who love to share knowledge.',
      category: 'Portfolio',
      role: 'frontend',
      style: ['modern', 'professional'],
      features: ['blog', 'projects', 'seo', 'contact'],
      tags: ['Blog', 'Content'],
      previewUrl: '/placeholder.svg',
      isPremium: true
    }
  ];

  const [filters, setFilters] = useState<FilterOptions>({
    role: 'all',
    style: [],
    features: [],
    searchTerm: ''
  });

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter templates based on current filters
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Role filter
      if (filters.role !== 'all' && template.role !== filters.role) {
        return false;
      }

      // Style filter (any of the selected styles)
      if (filters.style.length > 0 && !filters.style.some(style => template.style.includes(style))) {
        return false;
      }

      // Features filter (any of the selected features)
      if (filters.features.length > 0 && !filters.features.some(feature => template.features.includes(feature))) {
        return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [templates, filters]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      role: 'all',
      style: [],
      features: [],
      searchTerm: ''
    });
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSelect = (template: Template) => {
    console.log('Selected template:', template.name);
    // TODO: Implement template selection logic
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
              Choose from a variety of professional templates to showcase your skills, projects, and experience. All templates are fully customizable to match your personal brand.
            </p>
          </div>
        </div>

        {/* Filters and Templates */}
        <div className="container py-12">
          <FilterSection
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredTemplates.length} of {templates.length} templates
            </p>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="group border rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-md">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={template.previewUrl} 
                      alt={template.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      {template.isPremium && (
                        <Badge className="bg-brand-500 text-white hover:bg-brand-600">Premium</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handlePreview(template)}
                      >
                        Preview
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handleSelect(template)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No templates match your current filters.</p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
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
    </div>
  );
}
