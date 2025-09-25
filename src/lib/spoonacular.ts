// Spoonacular API client utilities
// Requires: VITE_SPOONACULAR_API_KEY in environment

import type { Recipe } from "@/lib/mockData";

const API_BASE = "https://api.spoonacular.com";

const getApiKey = (): string | undefined => {
  const key = import.meta.env.VITE_SPOONACULAR_API_KEY as string | undefined;
  return key && String(key).trim().length > 0 ? key : undefined;
};

const buildUrl = (path: string, params: Record<string, string | number | boolean | undefined> = {}) => {
  const url = new URL(path, API_BASE);
  const apiKey = getApiKey();
  if (apiKey) url.searchParams.set("apiKey", apiKey);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
};

// Map spoonacular search result item to our Recipe type (partial for list views)
const mapSearchItemToRecipe = (item: any): Recipe => {
  const calories = (() => {
    try {
      // If nutrition is provided, take Calories nutrient
      const nutrients = item?.nutrition?.nutrients ?? [];
      const cal = nutrients.find((n: any) => n.name === "Calories")?.amount;
      return cal ? Math.round(cal) : 0;
    } catch {
      return 0;
    }
  })();

  return {
    id: String(item.id),
    title: item.title ?? "Untitled Recipe",
    image: item.image ?? "",
    cookTime: item.readyInMinutes ?? 0,
    prepTime: item.preparationMinutes ?? 0,
    servings: item.servings ?? 0,
    calories,
    rating: typeof item.spoonacularScore === "number" ? Number((item.spoonacularScore / 20).toFixed(1)) : 4.5, // map 0-100 to ~0-5 fallback
    tags: Array.from(new Set([...(item.dishTypes || []), ...(item.diets || [])])).slice(0, 6),
    difficulty: "Easy",
    mealType: item.dishTypes || [],
    diet: item.diets || [],
    ingredients: [],
    instructions: [],
    nutrition: {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
  };
};

// Map spoonacular detailed recipe info to our Recipe type
const mapDetailToRecipe = (data: any): Recipe => {
  const ingredients = (data.extendedIngredients || []).map((ing: any) =>
    `${ing.amount ?? ""} ${ing.unit ?? ""} ${ing.originalName ?? ing.name ?? ""}`.trim()
  );

  // Extract nutrition if present
  let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
  try {
    const nutrients = data.nutrition?.nutrients || [];
    const find = (name: string) => nutrients.find((n: any) => n.name?.toLowerCase() === name.toLowerCase());
    calories = Math.round(find("Calories")?.amount || 0);
    protein = Math.round(find("Protein")?.amount || 0);
    carbs = Math.round(find("Carbohydrates")?.amount || 0);
    fat = Math.round(find("Fat")?.amount || 0);
    fiber = Math.round(find("Fiber")?.amount || 0);
  } catch {}

  const instructions: string[] = [];
  if (Array.isArray(data.analyzedInstructions) && data.analyzedInstructions.length > 0) {
    data.analyzedInstructions[0].steps?.forEach((s: any) => {
      if (s?.step) instructions.push(s.step);
    });
  } else if (typeof data.instructions === "string") {
    // Fallback split by dot
    data.instructions.split(/\.(\s+|$)/).forEach((part: string) => {
      const trimmed = part.trim();
      if (trimmed.length > 0) instructions.push(trimmed);
    });
  }

  return {
    id: String(data.id),
    title: data.title ?? "Untitled Recipe",
    image: data.image ?? "",
    cookTime: data.readyInMinutes ?? 0,
    prepTime: data.preparationMinutes ?? 0,
    servings: data.servings ?? 0,
    calories,
    rating: typeof data.spoonacularScore === "number" ? Number((data.spoonacularScore / 20).toFixed(1)) : 4.6,
    tags: Array.from(new Set([...(data.dishTypes || []), ...(data.diets || [])])).slice(0, 8),
    difficulty: "Easy",
    mealType: data.dishTypes || [],
    diet: data.diets || [],
    ingredients,
    instructions,
    nutrition: {
      protein,
      carbs,
      fat,
      fiber,
    },
  };
};

export type SearchFilters = Record<string, string[]>;

const mapAppFiltersToApiParams = (filters: SearchFilters, query: string) => {
  const params: Record<string, string | number | boolean | undefined> = {
    query,
    number: 21,
    addRecipeInformation: true,
    addRecipeNutrition: true,
  };

  if (filters?.diet?.length) {
    params.diet = filters.diet.join(",");
  }
  if (filters?.mealType?.length) {
    // Spoonacular uses "type" for meal/dish type
    params.type = filters.mealType[0]; // API accepts single type; pick the first selected
  }
  if (filters?.cookTime?.length) {
    const hasUnder15 = filters.cookTime.includes("Under 15 min");
    const has15to30 = filters.cookTime.includes("15-30 min");
    const has30to60 = filters.cookTime.includes("30-60 min");
    const hasOver1h = filters.cookTime.includes("Over 1 hour");

    // Use the most restrictive maxReadyTime when possible
    if (hasUnder15) params.maxReadyTime = 15;
    else if (has15to30) params.maxReadyTime = 30;
    else if (has30to60) params.maxReadyTime = 60;
    else if (hasOver1h) params.maxReadyTime = 120; // arbitrary cap
  }

  return params;
};

export async function spoonacularSearchRecipes(query: string, filters: SearchFilters = {}): Promise<Recipe[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    // No API key configured; return empty and allow caller to fallback
    return [];
  }

  const url = buildUrl("/recipes/complexSearch", mapAppFiltersToApiParams(filters, query));
  const res = await fetch(url);
  if (!res.ok) {
    // If rate limited or error, surface as empty to keep app responsive
    return [];
  }
  const data = await res.json();
  const results: any[] = data?.results || [];
  return results.map(mapSearchItemToRecipe);
}

export async function spoonacularGetRecipeById(id: string): Promise<Recipe | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = buildUrl(`/recipes/${id}/information`, {
    includeNutrition: true,
  });
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return mapDetailToRecipe(data);
}
