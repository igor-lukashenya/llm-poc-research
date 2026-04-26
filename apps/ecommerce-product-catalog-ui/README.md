# E-commerce Product Catalog UI

A React-based e-commerce product catalog PoC featuring a Netflix-inspired dark theme, horizontal category carousels, a filterable product grid, and a responsive layout with a collapsible sidebar.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** — dev server & build
- **Material UI 7** — component library
- **React Router 7** — client-side routing

## Quick Start

```bash
# Install dependencies
make install

# Run dev server
make run
```

The app starts at [http://localhost:5173](http://localhost:5173).

## Available Commands

| Command         | Description              |
|-----------------|--------------------------|
| `make run`      | Run Vite dev server      |
| `make build`    | TypeScript check + build |
| `make install`  | Install npm dependencies |
| `make lint`     | Run ESLint               |
| `make clean`    | Clean build artifacts    |

## Features

- **Netflix-style dark theme** with light/dark mode toggle in sidebar
- **Featured product banner** — hero section highlighting the most popular product with sale/popularity badges
- **Horizontal category carousels** — swipeable on mobile, keyboard-navigable on desktop (Left/Right arrow keys)
- **Filterable product grid** — filter by category, brand, search; sort by price or rating
- **Favorites** — add/remove products, filter to show favorites only
- **Popular & Sale badges** — overlay badges on product cards with discount percentages
- **Responsive design** — mobile drawer navigation, touch-scrollable carousels, adaptive layout
- **Accessibility** — ARIA roles/labels on carousels, focus-visible outlines, lazy-loaded images

## Pages

- **Home** (`/`) — Featured product banner + Netflix-style horizontal carousels per category
- **Catalog** (`/catalog`) — Filterable & sortable product grid with favorites

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout.tsx           # Sidebar + Outlet layout
│   ├── Sidebar.tsx          # Responsive sidebar (fixed + mobile drawer)
│   ├── ProductCard.tsx      # Product card with badges & lazy loading
│   ├── CatalogToolbar.tsx   # Filter/sort toolbar
│   └── FeaturedBanner.tsx   # Hero banner for featured product
├── pages/                   # Route-level pages
│   ├── HomePage.tsx         # Carousels with keyboard navigation
│   └── CatalogPage.tsx     # Grid with filters and favorites
├── hooks/                   # Custom hooks
│   ├── useFavorites.ts      # Favorites state management
│   ├── useProductFilters.ts # Filter/sort logic with URL param sync
│   └── useThemeMode.tsx     # Dark/light theme context & provider
├── data/                    # Mock data & types
│   ├── types.ts             # Product type definition
│   └── products.ts          # 96 generated products with sale/popular flags
├── App.tsx                  # Theme provider + router setup
└── main.tsx                 # Entry point
```
