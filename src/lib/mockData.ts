// Mock data for development - will be replaced with API calls
import pastaImage from "@/assets/pasta-carbonara.jpg";
import saladImage from "@/assets/caesar-salad.jpg";
import cookiesImage from "@/assets/chocolate-cookies.jpg";

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  calories: number;
  rating: number;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  mealType: string[];
  diet: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Pasta Carbonara",
    image: pastaImage,
    cookTime: 20,
    prepTime: 10,
    servings: 4,
    calories: 520,
    rating: 4.8,
    tags: ["Italian", "Pasta", "Easy", "Quick"],
    difficulty: "Easy",
    mealType: ["Dinner", "Lunch"],
    diet: ["Vegetarian"],
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "Black pepper",
      "Salt",
      "2 cloves garlic",
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
      "While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy.",
      "In a bowl, whisk together eggs, grated cheese, and plenty of black pepper.",
      "Drain pasta, reserving 1 cup of pasta water.",
      "Add hot pasta to the skillet with pancetta and toss.",
      "Remove from heat and quickly stir in egg mixture, adding pasta water as needed.",
      "Serve immediately with extra cheese and black pepper.",
    ],
    nutrition: {
      protein: 24,
      carbs: 68,
      fat: 18,
      fiber: 3,
    },
  },
  {
    id: "2",
    title: "Fresh Caesar Salad",
    image: saladImage,
    cookTime: 15,
    prepTime: 15,
    servings: 2,
    calories: 280,
    rating: 4.6,
    tags: ["Salad", "Healthy", "Vegetarian", "Quick"],
    difficulty: "Easy",
    mealType: ["Lunch", "Dinner"],
    diet: ["Vegetarian", "Gluten Free"],
    ingredients: [
      "1 large romaine lettuce head",
      "1/2 cup grated Parmesan cheese",
      "1 cup croutons",
      "2 cloves garlic",
      "2 anchovy fillets",
      "1 egg yolk",
      "1 tablespoon Dijon mustard",
      "2 tablespoons lemon juice",
      "1/4 cup olive oil",
      "Salt and pepper",
    ],
    instructions: [
      "Wash and dry romaine lettuce, then chop into bite-sized pieces.",
      "For dressing, mash garlic and anchovies in a large bowl.",
      "Whisk in egg yolk, Dijon mustard, and lemon juice.",
      "Slowly drizzle in olive oil while whisking to emulsify.",
      "Season with salt and pepper to taste.",
      "Add lettuce to bowl and toss with dressing.",
      "Top with Parmesan cheese and croutons before serving.",
    ],
    nutrition: {
      protein: 12,
      carbs: 15,
      fat: 22,
      fiber: 4,
    },
  },
  {
    id: "3",
    title: "Chocolate Chip Cookies",
    image: cookiesImage,
    cookTime: 12,
    prepTime: 15,
    servings: 24,
    calories: 180,
    rating: 4.9,
    tags: ["Dessert", "Cookies", "Sweet", "Baking"],
    difficulty: "Easy",
    mealType: ["Snack", "Dessert"],
    diet: ["Vegetarian"],
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a bowl, whisk together flour, baking soda, and salt.",
      "In a large bowl, cream together butter and both sugars until fluffy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Gradually mix in flour mixture until just combined.",
      "Fold in chocolate chips.",
      "Drop rounded tablespoons of dough onto ungreased baking sheets.",
      "Bake for 9-11 minutes or until golden brown.",
      "Cool on baking sheet for 2 minutes before transferring to wire rack.",
    ],
    nutrition: {
      protein: 3,
      carbs: 24,
      fat: 9,
      fiber: 1,
    },
  },
  // Add more mock recipes for variety
  {
    id: "4",
    title: "Mediterranean Quinoa Bowl",
    image: saladImage, // Reusing image for now
    cookTime: 25,
    prepTime: 10,
    servings: 2,
    calories: 420,
    rating: 4.7,
    tags: ["Healthy", "Mediterranean", "Vegan", "Protein"],
    difficulty: "Easy",
    mealType: ["Lunch", "Dinner"],
    diet: ["Vegan", "Gluten Free"],
    ingredients: [
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, diced",
      "1/2 cup kalamata olives",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "2 tbsp fresh herbs",
      "Salt and pepper",
    ],
    instructions: [
      "Rinse quinoa and cook in vegetable broth until tender, about 15 minutes.",
      "Let quinoa cool to room temperature.",
      "Combine cucumber, tomatoes, red onion, and olives in a large bowl.",
      "Whisk together olive oil, lemon juice, herbs, salt, and pepper.",
      "Add cooled quinoa to vegetables and toss with dressing.",
      "Let stand for 10 minutes before serving to allow flavors to meld.",
    ],
    nutrition: {
      protein: 14,
      carbs: 58,
      fat: 16,
      fiber: 6,
    },
  },
];

export const searchRecipes = (query: string, filters: Record<string, string[]> = {}): Recipe[] => {
  let results = mockRecipes;

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(
      recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  Object.entries(filters).forEach(([category, values]) => {
    if (values && values.length > 0) {
      results = results.filter(recipe => {
        switch (category) {
          case "mealType":
            return values.some(value => recipe.mealType.includes(value));
          case "diet":
            return values.some(value => recipe.diet.includes(value));
          case "difficulty":
            return values.includes(recipe.difficulty);
          case "cookTime":
            return values.some(value => {
              const cookTime = recipe.cookTime;
              switch (value) {
                case "Under 15 min":
                  return cookTime < 15;
                case "15-30 min":
                  return cookTime >= 15 && cookTime <= 30;
                case "30-60 min":
                  return cookTime > 30 && cookTime <= 60;
                case "Over 1 hour":
                  return cookTime > 60;
                default:
                  return true;
              }
            });
          default:
            return true;
        }
      });
    }
  });

  return results;
};

export const getRecipeById = (id: string): Recipe | undefined => {
  return mockRecipes.find(recipe => recipe.id === id);
};