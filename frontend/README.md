# AgriMate Hub — Frontend

> React single-page application for AgriMate Hub: a farmer-facing dashboard for crop recommendations, disease prediction, mandi prices, government schemes, and a produce marketplace.

## Project Overview

The frontend is the user-facing side of AgriMate Hub. Farmers need an interface that is simple, fast, and visually clear across agriculture, horticulture, and floriculture domains. This SPA delivers that experience: a landing page that routes into a category-aware dashboard, where each feature module presents agricultural intelligence through forms, charts, and cards. It is designed to consume the Django REST API (see `backend/`) while currently shipping with mock data for standalone development and demos.

## Solution

The frontend is a **Vite + React + TypeScript** application structured for clarity and reuse:

- **Routing & layout** — `App.tsx` sets up `react-router-dom` with a landing route (`/`) and a dashboard route (`/dashboard/:category`). A top-level `ProfileProvider` (React Context) holds the active farmer profile, and `TanStack Query` manages server-state.
- **Category theming** — The dashboard supports three domains (Agriculture, Horticulture, Floriculture), each with its own color theme and sidebar styling.
- **Feature modules** (in `src/components/features/`):
  - `CropRecommendation` — soil/nutrient inputs (N, P, K, temperature, humidity, pH, rainfall) rendered with sliders and progress rings; returns recommended crops.
  - `DiseasePrediction` — leaf-image upload flow for disease detection.
  - `GovernmentSchemes` — browseable schemes/subsidies.
  - `MandiPrice` — market price display with trend charts.
  - `MarketSelling` — produce listing/inquiry UI.
  - `Profile` — farmer profile management.
- **UI system** — A comprehensive **shadcn/ui** component library (built on Radix UI primitives) in `src/components/ui/` provides buttons, cards, dialogs, forms, charts, and more, styled with **Tailwind CSS**.
- **Mock data layer** — `src/data/mockData.ts` provides Indian states/districts and sample results so the UI runs without a backend; feature components import from it (e.g. `cropResults`), ready to be swapped for live API calls.

### Interaction with the backend
The SPA is intended to call the Django REST API at `http://localhost:8000` (endpoints like `/api/crops/recommendations/` and `/api/diseases/predictions/`). CORS on the backend already whitelists the frontend's dev origins. The `mockData` layer is the integration seam: replace mock imports with `fetch`/TanStack Query calls to the API.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** + `@vitejs/plugin-react-swc` (dev server & bundler)
- **Tailwind CSS 3** + `tailwindcss-animate`, `@tailwindcss/typography`
- **shadcn/ui** component kit built on **Radix UI** primitives (accordion, dialog, dropdown, select, tabs, toast, tooltip, etc.)
- **class-variance-authority**, **clsx**, **tailwind-merge** (variant/class utilities)
- **react-router-dom 7** (routing)
- **@tanstack/react-query 5** (data fetching/caching)
- **framer-motion** (animations), **recharts** (charts), **lucide-react** (icons)
- **react-hook-form** + **@hookform/resolvers** + **zod** (forms & schema validation)
- **cmdk** (command palette), **date-fns**, **react-day-picker**, **embla-carousel-react**, **sonner**, **vaul**, **input-otp`, **next-themes**
- **Vitest** + **@testing-library/react** + **jsdom** (testing), **ESLint** (linting)

## Setup and Installation

### Prerequisites
- Node.js 18+ (or use **Bun** — a `bun.lockb` is included)

### Steps
```bash
# 1. Move into the frontend directory
cd frontend

# 2. Install dependencies
npm install
# (or: bun install)

# 3. Start the development server
npm run dev
# (or: bun run dev)
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:8080` depending on configuration.

### Available scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure
```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx              # App bootstrap
│   ├── App.tsx               # Router + providers
│   ├── pages/                # Landing, Dashboard, NotFound
│   ├── components/
│   │   ├── features/         # Crop, Disease, Schemes, Mandi, Market, Profile
│   │   └── ui/               # shadcn/ui component library
│   ├── contexts/             # ProfileContext (farmer profile)
│   ├── data/                 # mockData.ts
│   ├── hooks/                # use-toast, use-mobile
│   └── lib/                  # utils (cn, etc.)
```

For backend integration details and API contracts, see [../backend/README.md](../backend/README.md).
