
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Github, Linkedin, Zap, Download, Globe, Users, Crown, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "GitHub Integration",
    description: "Automatically sync repositories, commits, pull requests, issues, and programming languages from your GitHub profile.",
    icon: Github,
    category: "Integration",
    premium: false
  },
  {
    title: "LinkedIn Sync",
    description: "Pull professional experience, education, certifications, and skills directly from your LinkedIn profile.",
    icon: Linkedin,
    category: "Integration",
    premium: false
  },
  {
    title: "AI Content Generation",
    description: "Automatically generate compelling project descriptions, professional summaries, and career highlights using advanced AI.",
    icon: Zap,
    category: "AI Features",
    premium: true
  },
  {
    title: "Auto-Updating Portfolios",
    description: "Your portfolio automatically refreshes when you push new code or update your professional profiles.",
    icon: CheckCircle,
    category: "Automation",
    premium: false
  },
  {
    title: "Premium Templates",
    description: "Access exclusive, professionally designed templates that adapt to your developer role and experience level.",
    icon: Crown,
    category: "Design",
    premium: true
  },
  {
    title: "Download & Export",
    description: "Export your portfolio as a complete web project (HTML/CSS/JS) or static site for self-hosting.",
    icon: Download,
    category: "Export",
    premium: false
  },
  {
    title: "Domain Deployment",
    description: "One-click deployment to GitHub Pages, Vercel, Netlify, and other popular hosting platforms.",
    icon: Globe,
    category: "Deployment",
    premium: true
  },
  {
    title: "Role-Based Customization",
    description: "Templates automatically adapt based on your role: frontend, backend, full-stack, data scientist, DevOps, and more.",
    icon: Users,
    category: "Customization",
    premium: false
  },
  {
    title: "Analytics & Insights",
    description: "Track portfolio views, engagement metrics, and get insights on how to improve your professional presence.",
    icon: BarChart3,
    category: "Analytics",
    premium: true
  }
];

const categories = ["All", "Integration", "AI Features", "Automation", "Design", "Export", "Deployment", "Customization", "Analytics"];

export default function Features() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="container py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Everything you need to build an
              <span className="gradient-text"> outstanding portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From automatic data syncing to AI-powered content generation, CodeCanvas provides all the tools 
              developers need to create professional portfolios that stand out.
            </p>
          </div>

          {/* Feature Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="px-4 py-2 text-sm">
                {category}
              </Badge>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative border border-border/60 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                      {feature.premium && (
                        <Badge className="text-xs bg-gradient-to-r from-brand-600 to-brand-400 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Tiers Overview */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-display font-semibold mb-8">
              Choose your plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Free Tier</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Up to 2 portfolios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      GitHub & LinkedIn sync
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Basic templates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Auto-updating portfolios
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-brand-600 to-brand-400 text-white">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro Tier</CardTitle>
                  <CardDescription>For serious developers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unlimited portfolios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Premium templates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI content generation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Domain deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Analytics & insights
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
