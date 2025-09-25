## YumFinder Planner

Modern React + Vite app for discovering recipes, saving favorites, and planning meals.

### Tech Stack

- React 18 + TypeScript
- Vite 5
- shadcn/ui + TailwindCSS
- Framer Motion
- React Router

### Getting Started

1. Install dependencies

```
npm install
```

2. Configure environment variables

```
cp .env.example .env
# Edit .env and add your Spoonacular API key
# Get one at: https://spoonacular.com/food-api
VITE_SPOONACULAR_API_KEY=your_key_here
```

3. Run the dev server

```
npm run dev
```

### Spoonacular Integration

This project integrates the Spoonacular API for live recipe search and recipe details.

- Library: `src/lib/spoonacular.ts`
- Search page: `src/pages/SearchResults.tsx`
- Recipe detail page: `src/pages/RecipeDetail.tsx`

Behavior:

- If `VITE_SPOONACULAR_API_KEY` is set, search and detail pages will use Spoonacular.
- If the key is missing or the API returns no results/rate limit errors, the app gracefully falls back to local mock data defined in `src/lib/mockData.ts`.

### Available Scripts

- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### Notes

- Do not commit real API keys. Use `.env` locally and `.env.example` for reference.
- Images for mock recipes are stored under `src/assets/`.
