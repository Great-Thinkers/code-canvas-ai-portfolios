
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import TemplateSelectionFlow from "@/components/templates/TemplateSelectionFlow";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

// Sample templates data
const templates: Template[] = [
  {
    id: 1,
    name: "Modern Minimal",
    description: "Clean and professional design perfect for showcasing your work with minimal distractions.",
    category: "Professional",
    role: "full-stack-developer",
    style: ["minimal", "modern", "clean"],
    features: ["responsive", "dark-mode", "animations", "seo-optimized"],
    tags: ["professional", "clean", "modern"],
    previewUrl: "/placeholder.svg",
    isPremium: false,
  },
  {
    id: 2,
    name: "Tech Stack",
    description: "Highlight your technical skills and projects with this developer-focused template.",
    category: "Developer",
    role: "frontend-developer",
    style: ["technical", "modern", "colorful"],
    features: ["skill-showcase", "project-gallery", "github-integration", "responsive"],
    tags: ["developer", "technical", "skills"],
    previewUrl: "/placeholder.svg",
    isPremium: false,
  },
  {
    id: 3,
    name: "Creative Studio",
    description: "Bold and creative design for designers and creative professionals.",
    category: "Creative",
    role: "ui-ux-designer",
    style: ["creative", "bold", "artistic"],
    features: ["portfolio-gallery", "animations", "custom-layouts", "mobile-first"],
    tags: ["creative", "design", "portfolio"],
    previewUrl: "/placeholder.svg",
    isPremium: true,
  },
  {
    id: 4,
    name: "Business Pro",
    description: "Professional template for business professionals and consultants.",
    category: "Business",
    role: "business-analyst",
    style: ["professional", "corporate", "elegant"],
    features: ["contact-forms", "testimonials", "service-showcase", "analytics"],
    tags: ["business", "professional", "corporate"],
    previewUrl: "/placeholder.svg",
    isPremium: true,
  },
];

function CreatePortfolioContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const categories = ["All", "Professional", "Developer", "Creative", "Business"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsFlowOpen(true);
  };

  const handlePortfolioCreate = async (template: Template, userData: UserData) => {
    if (!user) {
      toast.error("You must be logged in to create a portfolio");
      return;
    }

    setIsCreating(true);
    
    try {
      const portfolioData = {
        template: template,
        userData: userData,
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          name: `${userData.name}'s Portfolio`,
          template_id: template.id,
          template_name: template.name,
          is_published: false,
          portfolio_data: portfolioData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating portfolio:", error);
        toast.error("Failed to create portfolio. Please try again.");
        return;
      }

      toast.success("Portfolio created successfully!");
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-display font-semibold">Create New Portfolio</h1>
            <p className="text-muted-foreground">Choose a template to get started</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.style.slice(0, 3).map((style) => (
                    <Badge key={style} variant="outline" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                  {template.style.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.style.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
      <Footer />

      {/* Template Selection Flow Modal */}
      <TemplateSelectionFlow
        template={selectedTemplate}
        isOpen={isFlowOpen}
        onClose={() => {
          setIsFlowOpen(false);
          setSelectedTemplate(null);
        }}
        onComplete={handlePortfolioCreate}
      />
    </div>
  );
}

export default function CreatePortfolio() {
  return (
    <ProtectedRoute>
      <CreatePortfolioContent />
    </ProtectedRoute>
  );
}
