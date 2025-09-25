import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

const filterOptions = {
  mealType: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
  diet: ["Vegetarian", "Vegan", "Gluten Free", "Keto", "Paleo", "Low Carb"],
  cookTime: ["Under 15 min", "15-30 min", "30-60 min", "Over 1 hour"],
  difficulty: ["Easy", "Medium", "Hard"],
};

const SearchFilters = ({ activeFilters, onFiltersChange }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterToggle = (category: string, value: string) => {
    const currentFilters = activeFilters[category] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];

    onFiltersChange({
      ...activeFilters,
      [category]: newFilters,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const clearFilter = (category: string, value: string) => {
    const currentFilters = activeFilters[category] || [];
    const newFilters = currentFilters.filter(f => f !== value);
    
    onFiltersChange({
      ...activeFilters,
      [category]: newFilters.length > 0 ? newFilters : undefined,
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, filters) => count + (filters?.length || 0), 0);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Filter Button and Active Filters */}
      <div className="flex items-center justify-between">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="btn-spring">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Recipes</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {Object.entries(filterOptions).map(([category, options]) => (
                <div key={category}>
                  <Label className="text-sm font-medium capitalize mb-3 block">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${category}-${option}`}
                          checked={activeFilters[category]?.includes(option) || false}
                          onCheckedChange={() => handleFilterToggle(category, option)}
                        />
                        <Label
                          htmlFor={`${category}-${option}`}
                          className="text-sm cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full btn-spring"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([category, filters]) =>
            filters?.map((filter) => (
              <Badge
                key={`${category}-${filter}`}
                variant="secondary"
                className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
              >
                {filter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 hover:bg-transparent"
                  onClick={() => clearFilter(category, filter)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;