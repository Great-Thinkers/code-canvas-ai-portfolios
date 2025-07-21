import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="container flex flex-col items-center text-center py-12 md:py-24">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-brand-50 text-brand-700 mb-6">
          <span className="mr-1">✨</span> Generate your professional portfolio
          in minutes
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-semibold gradient-text">
          Showcase your work with AI-powered portfolios
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          CodeCanvas syncs with your favorite platforms to auto-generate
          beautiful, professional portfolios that evolve as you grow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/signup">
            <Button size="lg" className="font-medium">
              Get started for free
            </Button>
          </Link>
          <Link to="/templates">
            <Button size="lg" variant="outline" className="font-medium">
              Explore templates
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground pt-2">
          No credit card required. Free tier includes 2 portfolio projects.
        </p>
      </div>

      {/* Demo Preview */}
      <div className="mt-16 w-full max-w-5xl">
        <div className="relative rounded-xl border border-border/80 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-brand-100/20" />
          <img
            src="/placeholder.svg"
            alt="CodeCanvas Dashboard Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg">
              <p className="text-white font-medium">
                Dashboard preview coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
