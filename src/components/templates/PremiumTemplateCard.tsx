import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Lock, Star, Zap, Check } from "lucide-react";

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

interface PremiumTemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onSelect: (template: Template) => void;
  isSubscribed?: boolean;
}

export default function PremiumTemplateCard({
  template,
  onPreview,
  onSelect,
  isSubscribed = false,
}: PremiumTemplateCardProps) {
  const handleSelect = () => {
    if (template.isPremium && !isSubscribed) {
      // Show upgrade modal or redirect to pricing
      console.log("Upgrade required for premium template");
      return;
    }
    onSelect(template);
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        template.isPremium
          ? "border-gradient-to-r from-yellow-200 to-orange-200"
          : ""
      }`}
    >
      {/* Premium Overlay */}
      {template.isPremium && !isSubscribed && (
        <div className="absolute inset-0 bg-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold mb-2">Premium Template</p>
            <Button size="sm" variant="secondary">
              Upgrade to Access
            </Button>
          </div>
        </div>
      )}

      <div className="aspect-video relative overflow-hidden">
        <img
          src={template.previewUrl}
          alt={template.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            template.isPremium && !isSubscribed ? "blur-sm" : ""
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {template.isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          {template.isPopular && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="secondary">{template.category}</Badge>
        </div>

        {/* Premium Features Tooltip */}
        {template.isPremium && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold">Premium Features</span>
              </div>
              <ul className="space-y-1">
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-400" />
                  Advanced animations
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-400" />
                  Premium support
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-400" />
                  Custom domain ready
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-semibold">{template.name}</h3>
          {template.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{template.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <span>For {template.role.replace("-", " ")}</span>
          <span>•</span>
          <span className="capitalize">{template.style.join(", ")}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onPreview(template)}
          >
            Preview
          </Button>
          <Button
            className={`flex-1 ${
              template.isPremium
                ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                : "bg-brand-500 hover:bg-brand-600"
            }`}
            onClick={handleSelect}
            disabled={template.isPremium && !isSubscribed}
          >
            {template.isPremium && !isSubscribed ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Upgrade
              </>
            ) : (
              "Select"
            )}
          </Button>
        </div>

        {template.isPremium && !isSubscribed && (
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Unlock premium templates with{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Pro subscription
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
