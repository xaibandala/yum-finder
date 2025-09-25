import { useCallback, useEffect, useMemo, useState } from "react";

export type FavoriteRecipe = {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  servings: number;
  calories: number;
  rating: number;
  tags: string[];
};

const STORAGE_KEY = "favorites";

function safeParse(json: string | null): FavoriteRecipe[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) return data as FavoriteRecipe[];
    return [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParse(localStorage.getItem(STORAGE_KEY));
  });

  // keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore quota errors
    }
  }, [favorites]);

  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback((id: string) => ids.has(id), [ids]);

  const addFavorite = useCallback((recipe: FavoriteRecipe) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === recipe.id)) return prev;
      // push to front
      return [recipe, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFavorite = useCallback((recipe: FavoriteRecipe) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === recipe.id);
      if (exists) return prev.filter((f) => f.id !== recipe.id);
      return [recipe, ...prev];
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites };
}
