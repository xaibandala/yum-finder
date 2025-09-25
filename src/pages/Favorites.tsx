import { Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import { useFavorites } from "@/hooks/use-favorites";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const hasFavorites = favorites.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Your saved recipes for quick access</p>
      </div>

      {!hasFavorites ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring recipes and save your favorites by clicking the heart icon on any recipe card.
          </p>
          <Button asChild className="hero-gradient text-white btn-spring">
            <Link to="/search">
              <Search className="w-4 h-4 mr-2" />
              Discover Recipes
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((r) => (
            <RecipeCard
              key={r.id}
              id={r.id}
              title={r.title}
              image={r.image}
              cookTime={r.cookTime}
              servings={r.servings}
              calories={r.calories}
              rating={r.rating}
              tags={r.tags}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(r)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;