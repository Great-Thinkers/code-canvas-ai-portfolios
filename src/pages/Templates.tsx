
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Templates() {
  // Sample template data
  const templates = [
    {
      id: 1,
      name: 'Modern Minimal',
      description: 'A clean and minimalist design with focus on content and readability.',
      category: 'Portfolio',
      tags: ['Minimalist', 'Professional'],
      previewUrl: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Tech Stack',
      description: 'Showcase your technical skills with animated code snippets and tech logos.',
      category: 'Developer',
      tags: ['Technical', 'Interactive'],
      previewUrl: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Creative Canvas',
      description: 'A colorful, artistic layout for designers and creative professionals.',
      category: 'Design',
      tags: ['Creative', 'Visual'],
      previewUrl: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Project Showcase',
      description: 'Highlight your projects with detailed case studies and results.',
      category: 'Portfolio',
      tags: ['Projects', 'Case Studies'],
      previewUrl: '/placeholder.svg'
    }
  ];

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

        {/* Templates Grid */}
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group border rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-md">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={template.previewUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{template.category}</Badge>
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
                    <Button variant="outline" className="flex-1">Preview</Button>
                    <Button className="flex-1">Select</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

