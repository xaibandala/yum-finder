import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Users, Star, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getRecipeById } from "@/lib/mockData";
import type { Recipe } from "@/lib/mockData";
import { spoonacularGetRecipeById } from "@/lib/spoonacular";
import { useFavorites } from "@/hooks/use-favorites";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { isFavorite: isFav, toggleFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const [servings, setServings] = useState(4);

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (!id) return;
      // Try API first
      const apiRecipe = await spoonacularGetRecipeById(id);
      if (mounted && apiRecipe) {
        setRecipe(apiRecipe);
        setServings(apiRecipe.servings || 1);
        return;
      }
      // Fallback to mock
      const fallback = getRecipeById(id);
      if (mounted && fallback) {
        setRecipe(fallback);
        setServings(fallback.servings);
      }
    };
    fetchDetail();
    return () => { mounted = false; };
  }, [id]);

  // keep local isFavorite in sync with storage
  useEffect(() => {
    if (recipe) setIsFavorite(isFav(recipe.id));
  }, [recipe, isFav]);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <Button asChild variant="outline">
            <Link to="/search">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!recipe) return;
    toggleFavorite({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      calories: recipe.calories,
      rating: recipe.rating,
      tags: recipe.tags,
    });
    setIsFavorite(prev => !prev);
  };

  const adjustIngredients = (amount: string, originalServings: number, newServings: number) => {
    const ratio = newServings / originalServings;
    const numbers = amount.match(/\d+(\.\d+)?/g);
    
    if (numbers) {
      return amount.replace(/\d+(\.\d+)?/g, (match) => {
        const adjusted = (parseFloat(match) * ratio).toFixed(1);
        return adjusted.endsWith('.0') ? adjusted.slice(0, -2) : adjusted;
      });
    }
    return amount;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-4 btn-spring">
          <Link to="/search">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 right-6">
          <Button
            size="lg"
            className={`w-14 h-14 rounded-full favorite-button ${isFavorite ? 'active' : ''} bg-white/90 backdrop-blur-sm`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-favorite' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Meta */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 rating-star fill-current" />
                  <span className="font-medium">{recipe.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{recipe.cookTime} min cook time</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChefHat className="w-5 h-5 text-muted-foreground" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Ingredients</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Servings:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => servings > 1 && setServings(servings - 1)}
                      disabled={servings <= 1}
                    >
                      -
                    </Button>
                    <span className="font-medium w-8 text-center">{servings}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setServings(servings + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-foreground">
                      {adjustIngredients(ingredient, recipe.servings, servings)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-foreground leading-relaxed pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Facts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span className="font-medium">{Math.round((recipe.calories * servings) / recipe.servings)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span className="font-medium">{Math.round((recipe.nutrition.protein * servings) / recipe.servings)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbohydrates</span>
                    <span className="font-medium">{Math.round((recipe.nutrition.carbs * servings) / recipe.servings)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span className="font-medium">{Math.round((recipe.nutrition.fat * servings) / recipe.servings)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiber</span>
                    <span className="font-medium">{Math.round((recipe.nutrition.fiber * servings) / recipe.servings)}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recipe Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Prep Time</span>
                    <span className="font-medium">{recipe.prepTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cook Time</span>
                    <span className="font-medium">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Time</span>
                    <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty</span>
                    <span className="font-medium">{recipe.difficulty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full hero-gradient text-white btn-spring" size="lg">
                Add to Meal Plan
              </Button>
              <Button variant="outline" className="w-full btn-spring" size="lg">
                Generate Shopping List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;