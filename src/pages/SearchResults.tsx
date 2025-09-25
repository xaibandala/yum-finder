import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters from "@/components/SearchFilters";
import { searchRecipes } from "@/lib/mockData";
import type { Recipe } from "@/lib/mockData";
import { spoonacularSearchRecipes } from "@/lib/spoonacular";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/use-favorites";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Recipe[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handleToggleFavorite = (recipeId: string) => {
    const r = results.find(r => r.id === recipeId);
    if (!r) return;
    toggleFavorite({
      id: r.id,
      title: r.title,
      image: r.image,
      cookTime: r.cookTime,
      servings: r.servings,
      calories: r.calories,
      rating: r.rating,
      tags: r.tags,
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const query = searchParams.get("q") || "";
    setSearchTerm(query);

    const fetchResults = async () => {
      setLoading(true);
      try {
        const apiResults = await spoonacularSearchRecipes(query, filters);
        if (!controller.signal.aborted) {
          if (apiResults.length > 0) {
            setResults(apiResults);
          } else {
            // Fallback to local mock search when API key is missing or no results
            setResults(searchRecipes(query, filters));
          }
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults(searchRecipes(query, filters));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [searchParams, filters]);

  const resultCount = results.length;
  const currentQuery = searchParams.get("q") || "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for recipes, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 text-lg"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-2 h-8 hero-gradient text-white btn-spring"
            >
              Search
            </Button>
          </div>
        </form>

        {currentQuery && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Search Results for "{currentQuery}"
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Searching..." : `Found ${resultCount} recipe${resultCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SearchFilters 
          activeFilters={filters} 
          onFiltersChange={setFilters} 
        />
      </motion.div>

      {/* Results */}
      {loading ? (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div 
              key={index} 
              className="recipe-card animate-pulse"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-[4/3] bg-muted rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : results.length > 0 ? (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {results.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              image={recipe.image}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              calories={recipe.calories}
              rating={recipe.rating}
              tags={recipe.tags}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </motion.div>
      ) : currentQuery ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn't find any recipes matching "{currentQuery}". Try adjusting your search terms or filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setSearchParams({});
              setFilters({});
            }}
            className="btn-spring"
          >
            Clear Search
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start your search</h3>
          <p className="text-muted-foreground">
            Enter a recipe name, ingredient, or dietary preference to get started.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;