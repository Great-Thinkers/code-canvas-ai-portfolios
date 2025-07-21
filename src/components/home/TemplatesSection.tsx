import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    name: "Modern Minimal",
    role: "Frontend Professional",
    description:
      "Clean and minimalist design focused on showcasing UI/UX work and frontend skills",
    image: "/placeholder.svg",
    isPremium: false,
  },
  {
    name: "Tech Stack",
    role: "Full Stack Professional",
    description:
      "Highlight your complete technology stack with visual indicators of proficiency",
    image: "/placeholder.svg",
    isPremium: false,
  },
  {
    name: "Code Focus",
    role: "Backend Specialist",
    description:
      "Emphasize your architecture designs and code quality with embedded snippets",
    image: "/placeholder.svg",
    isPremium: true,
  },
];

export default function TemplatesSection() {
  return (
    <div className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-semibold mb-4">
            Choose from professional templates
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our templates are designed to highlight your strengths as a
            developer, from frontend designs to backend architecture. Filter by
            role, style, and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <Card
              key={i}
              className="overflow-hidden border-border/60 bg-card/50"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-brand-500 text-white hover:bg-brand-600"
                    >
                      Premium
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Optimized for: {template.role}
                </p>
                <p className="text-sm">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/templates">
            <Button size="lg" variant="outline">
              View all templates & filters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
