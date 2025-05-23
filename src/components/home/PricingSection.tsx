
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingSection() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-display font-semibold mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get started for free and upgrade when you need more power.
          No hidden fees or complicated tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card className="flex flex-col border border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$0</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {["2 portfolio projects", "GitHub integration", "Basic templates", "Manual updates", "Export as HTML/CSS"].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-brand-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/signup" className="w-full">
              <Button variant="outline" className="w-full">
                Get started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Tier */}
        <Card className="flex flex-col relative border-brand-500/50 shadow-md shadow-brand-500/10 bg-card/70">
          <div className="absolute -top-5 inset-x-0 flex justify-center">
            <span className="bg-brand-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              MOST POPULAR
            </span>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For serious developers</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$12</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Unlimited portfolio projects",
                "GitHub & LinkedIn integration",
                "Premium templates",
                "Auto-updating profiles",
                "AI-generated descriptions",
                "Export options (HTML, React)",
                "Deploy to GitHub Pages",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-brand-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/signup" className="w-full">
              <Button className="w-full">
                Get started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Enterprise Tier */}
        <Card className="flex flex-col border border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For teams and businesses</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$29</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {[
                "Everything in Pro",
                "Team management",
                "Custom domain deployment",
                "Priority support",
                "Advanced analytics",
                "White-labeling options",
                "Custom template design",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-brand-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/signup" className="w-full">
              <Button variant="outline" className="w-full">
                Contact sales
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
