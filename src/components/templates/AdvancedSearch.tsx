import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";

export interface AdvancedFilters {
  searchTerm: string;
  roles: string[];
  styles: string[];
  features: string[];
  categories: string[];
  isPremium?: boolean;
  sortBy: "popular" | "newest" | "name" | "category";
}

interface AdvancedSearchProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  resultCount: number;
  totalCount: number;
}

const filterOptions = {
  roles: [
    { id: "frontend", label: "Frontend Developer" },
    { id: "backend", label: "Backend Engineer" },
    { id: "fullstack", label: "Full-stack Developer" },
    { id: "designer", label: "UI/UX Designer" },
    { id: "mobile", label: "Mobile Developer" },
    { id: "devops", label: "DevOps Engineer" },
    { id: "data", label: "Data Scientist" },
  ],
  styles: [
    { id: "minimal", label: "Minimalist" },
    { id: "modern", label: "Modern" },
    { id: "creative", label: "Creative" },
    { id: "professional", label: "Professional" },
    { id: "dark", label: "Dark Mode" },
    { id: "colorful", label: "Colorful" },
    { id: "gradient", label: "Gradient" },
  ],
  features: [
    { id: "projects", label: "Project Showcase" },
    { id: "blog", label: "Blog Integration" },
    { id: "animations", label: "Animations" },
    { id: "responsive", label: "Mobile Responsive" },
    { id: "seo", label: "SEO Optimized" },
    { id: "contact", label: "Contact Form" },
    { id: "testimonials", label: "Testimonials" },
    { id: "analytics", label: "Analytics" },
  ],
  categories: [
    { id: "Portfolio", label: "Portfolio" },
    { id: "Developer", label: "Developer" },
    { id: "Design", label: "Design" },
    { id: "Mobile", label: "Mobile" },
    { id: "DevOps", label: "DevOps" },
    { id: "Business", label: "Business" },
  ],
  sortOptions: [
    { id: "popular", label: "Most Popular" },
    { id: "newest", label: "Newest First" },
    { id: "name", label: "Name A-Z" },
    { id: "category", label: "Category" },
  ],
};

export default function AdvancedSearch({
  filters,
  onFiltersChange,
  resultCount,
  totalCount,
}: AdvancedSearchProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleFilterToggle = (
    filterType: keyof Pick<
      AdvancedFilters,
      "roles" | "styles" | "features" | "categories"
    >,
    value: string,
  ) => {
    const currentValues = filters[filterType];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({ ...filters, [filterType]: newValues });
  };

  const handlePremiumToggle = () => {
    const newValue = filters.isPremium === true ? undefined : true;
    onFiltersChange({ ...filters, isPremium: newValue });
  };

  const handleSortChange = (sortBy: AdvancedFilters["sortBy"]) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: "",
      roles: [],
      styles: [],
      features: [],
      categories: [],
      isPremium: undefined,
      sortBy: "popular",
    });
  };

  const hasActiveFilters =
    filters.searchTerm !== "" ||
    filters.roles.length > 0 ||
    filters.styles.length > 0 ||
    filters.features.length > 0 ||
    filters.categories.length > 0 ||
    filters.isPremium !== undefined ||
    filters.sortBy !== "popular";

  const activeFilterCount =
    (filters.searchTerm ? 1 : 0) +
    filters.roles.length +
    filters.styles.length +
    filters.features.length +
    filters.categories.length +
    (filters.isPremium !== undefined ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates by name, description, or tags..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Advanced Filters</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.sortOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={
                        filters.sortBy === option.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleSortChange(option.id as AdvancedFilters["sortBy"])
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Premium Filter */}
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="premium"
                    checked={filters.isPremium === true}
                    onCheckedChange={handlePremiumToggle}
                  />
                  <label
                    htmlFor="premium"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Premium Templates Only
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Categories
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() =>
                          handleFilterToggle("categories", category.id)
                        }
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Developer Roles
                </label>
                <div className="space-y-2">
                  {filterOptions.roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={filters.roles.includes(role.id)}
                        onCheckedChange={() =>
                          handleFilterToggle("roles", role.id)
                        }
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {role.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Design Styles
                </label>
                <div className="space-y-2">
                  {filterOptions.styles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style.id}`}
                        checked={filters.styles.includes(style.id)}
                        onCheckedChange={() =>
                          handleFilterToggle("styles", style.id)
                        }
                      />
                      <label
                        htmlFor={`style-${style.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {style.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Features
                </label>
                <div className="space-y-2">
                  {filterOptions.features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={filters.features.includes(feature.id)}
                        onCheckedChange={() =>
                          handleFilterToggle("features", feature.id)
                        }
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchTerm}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}

          {filters.isPremium && (
            <Badge variant="secondary" className="gap-1">
              Premium Only
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={handlePremiumToggle}
              />
            </Badge>
          )}

          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {filterOptions.categories.find((c) => c.id === category)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("categories", category)}
              />
            </Badge>
          ))}

          {filters.roles.map((role) => (
            <Badge key={role} variant="secondary" className="gap-1">
              {filterOptions.roles.find((r) => r.id === role)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("roles", role)}
              />
            </Badge>
          ))}

          {filters.styles.map((style) => (
            <Badge key={style} variant="secondary" className="gap-1">
              {filterOptions.styles.find((s) => s.id === style)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("styles", style)}
              />
            </Badge>
          ))}

          {filters.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="gap-1">
              {filterOptions.features.find((f) => f.id === feature)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("features", feature)}
              />
            </Badge>
          ))}

          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Showing {resultCount} of {totalCount} templates
          {hasActiveFilters && " (filtered)"}
        </span>
        {hasActiveFilters && (
          <span>
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
            applied
          </span>
        )}
      </div>
    </div>
  );
}
