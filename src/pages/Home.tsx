import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChefHat, Clock, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import RecipeCard from "@/components/RecipeCard";
import { mockRecipes } from "@/lib/mockData";
import heroImage from "@/assets/hero-kitchen.jpg";
import { motion } from "framer-motion";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredRecipes, setFeaturedRecipes] = useState(mockRecipes.slice(0, 3));
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleToggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const popularSearches = ["Pasta", "Chicken", "Vegetarian", "Quick meals", "Desserts"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Your Next
            <span className="block hero-gradient bg-clip-text text-transparent">
              Favorite Recipe
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Search through thousands of delicious recipes, save your favorites, and plan your meals with ease.
          </motion.p>

          {/* Hero Search */}
          <motion.form 
            onSubmit={handleSearch} 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for recipes, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg bg-white/95 backdrop-blur-sm border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 h-10 hero-gradient text-white btn-spring"
              >
                Search
              </Button>
            </div>
          </motion.form>

          {/* Popular Searches */}
          <motion.div 
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-white/70 text-sm">Popular searches:</span>
            {popularSearches.map((search) => (
              <Button
                key={search}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => {
                  setSearchTerm(search);
                  navigate(`/search?q=${encodeURIComponent(search)}`);
                }}
              >
                {search}
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-muted/30"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">Find recipes by ingredients, dietary preferences, or cooking time.</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChefHat className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Expert Recipes</h3>
              <p className="text-muted-foreground">Curated recipes from professional chefs and home cooks.</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div 
                className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Meal Planning</h3>
              <p className="text-muted-foreground">Plan your weekly meals and generate shopping lists automatically.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Recipes */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Recipes</h2>
              <p className="text-muted-foreground">Handpicked recipes that are trending this week</p>
            </div>
            <Button variant="outline" asChild className="btn-spring">
              <Link to="/search">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredRecipes.map((recipe) => (
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
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 hero-gradient"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Start Cooking?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of home cooks discovering new recipes every day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="btn-spring text-primary hover:text-primary"
            >
              <Link to="/search">Explore Recipes</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;