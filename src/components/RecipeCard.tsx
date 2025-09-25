import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  servings: number;
  calories: number;
  rating: number;
  tags: string[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const RecipeCard = ({
  id,
  title,
  image,
  cookTime,
  servings,
  calories,
  rating,
  tags,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  return (
    <motion.div 
      className="recipe-card group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/recipe/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
          <motion.img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white/90 backdrop-blur-sm favorite-button ${
              isFavorite ? "active" : ""
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 rating-star fill-current" />
            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{cookTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{servings} servings</span>
              </div>
            </div>
            <div className="text-primary font-medium">
              {calories} cal
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;