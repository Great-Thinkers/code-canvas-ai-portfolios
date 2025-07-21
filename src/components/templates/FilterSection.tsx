import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

export interface FilterOptions {
  role: string;
  style: string[];
  features: string[];
  searchTerm: string;
}

interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const roles = [
  { value: "all", label: "All Roles" },
  { value: "frontend", label: "Frontend Professional" },
  { value: "backend", label: "Backend Specialist" },
  { value: "fullstack", label: "Full-stack Professional" },
  { value: "designer", label: "UI/UX Designer" },
  { value: "mobile", label: "Mobile Specialist" },
  { value: "devops", label: "DevOps Engineer" },
];

const styles = [
  { id: "minimal", label: "Minimalist" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
  { id: "professional", label: "Professional" },
  { id: "dark", label: "Dark Mode" },
  { id: "colorful", label: "Colorful" },
];

const features = [
  { id: "projects", label: "Project Showcase" },
  { id: "blog", label: "Blog Integration" },
  { id: "animations", label: "Animations" },
  { id: "responsive", label: "Mobile Responsive" },
  { id: "seo", label: "SEO Optimized" },
  { id: "contact", label: "Contact Form" },
];

export default function FilterSection({
  filters,
  onFiltersChange,
  onClearFilters,
}: FilterSectionProps) {
  const handleRoleChange = (role: string) => {
    onFiltersChange({ ...filters, role });
  };

  const handleStyleToggle = (styleId: string) => {
    const newStyles = filters.style.includes(styleId)
      ? filters.style.filter((s) => s !== styleId)
      : [...filters.style, styleId];
    onFiltersChange({ ...filters, style: newStyles });
  };

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = filters.features.includes(featureId)
      ? filters.features.filter((f) => f !== featureId)
      : [...filters.features, featureId];
    onFiltersChange({ ...filters, features: newFeatures });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const hasActiveFilters =
    filters.role !== "all" ||
    filters.style.length > 0 ||
    filters.features.length > 0 ||
    filters.searchTerm !== "";

  return (
    <div className="bg-muted/30 border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filter Templates</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Professional Role</label>
          <Select value={filters.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Filters */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Design Style</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map((style) => (
              <div key={style.id} className="flex items-center space-x-2">
                <Checkbox
                  id={style.id}
                  checked={filters.style.includes(style.id)}
                  onCheckedChange={() => handleStyleToggle(style.id)}
                />
                <label htmlFor={style.id} className="text-sm cursor-pointer">
                  {style.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Filters */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Features</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={filters.features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <label htmlFor={feature.id} className="text-sm cursor-pointer">
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {filters.role !== "all" && (
                <Badge variant="secondary">
                  {roles.find((r) => r.value === filters.role)?.label}
                </Badge>
              )}
              {filters.style.map((styleId) => (
                <Badge key={styleId} variant="secondary">
                  {styles.find((s) => s.id === styleId)?.label}
                </Badge>
              ))}
              {filters.features.map((featureId) => (
                <Badge key={featureId} variant="secondary">
                  {features.find((f) => f.id === featureId)?.label}
                </Badge>
              ))}
              {filters.searchTerm && (
                <Badge variant="secondary">"{filters.searchTerm}"</Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
