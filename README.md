### Daftra Pokédex — Technical Assessment

A small, production-style React app that explores the PokéAPI with two list experiences (pagination and infinite scroll) and a detail view. The focus is on solid data fetching with React Query, clear error handling, accessible UI, and maintainable TypeScript.

**🔗 Live Demo:** [https://daftra-pokedex.vercel.app/](https://daftra-pokedex.vercel.app/)

---

### What’s inside

- **React 19 + TypeScript** for a modern DX
- **React Router v7** for routing (`/`, `/load-more`, `/pokemon/:id`)
- **@tanstack/react-query v5** for data fetching, caching, and Suspense
- **react-error-boundary** for error isolation with a friendly fallback and retry
- **Tailwind CSS** for styling (via PostCSS)
- **Jest + Testing Library** for unit and component tests

---

### Getting started

Prerequisites:

- Node 18+ (LTS recommended)

Install and run:

```bash
npm install
npm start
```

- Dev server: `http://localhost:3000`
- Tests (watch): `npm test`
- Production build: `npm run build`

No environment variables are required. The app fetches from the public PokéAPI.

---

### App structure at a glance

- `src/pages/PaginationView` — paginated list using `useSuspenseQuery`
- `src/pages/LoadMoreView` — infinite scroll (load more) using `useQuery`
- `src/pages/PokemonDetail` — details by id using `useSuspenseQuery`
- `src/hooks` — query hooks with stable query keys and cache policy
- `src/services/pokemon.service.ts` — network calls and light helpers
- `src/components/` — presentational components (PokemonCard, PokemonGrid, PaginationControls, etc.)
- `src/utils/` — utility functions for formatting and data mapping
- `src/App.tsx` — router, `QueryClientProvider`, Suspense, and error boundary

Key routes:

- `/` — paginated list
- `/load-more` — infinite scroll
- `/pokemon/:id` — Pokémon detail

---

### Data fetching, caching, and Suspense (React Query v5)

- **Provider**: The app wraps everything with `QueryClientProvider` and configures reasonable defaults (`refetchOnWindowFocus: false`, `retry: 1`).
- **Suspense-first**: Lists (`PaginationView`) and details use `useSuspenseQuery` to keep data fetching logic simple and colocated. `App.tsx` provides a `Suspense` fallback that renders a skeleton grid.
- **Cache policy**:
  - Query keys are descriptive and parameterized, e.g. `['pokemon', 'list', limit, offset]` and `['pokemon', 'detail', id]`.
  - `staleTime: 5 minutes` — results are treated as fresh for a while to reduce refetching when navigating.
  - `gcTime: 10 minutes` — cache entries live long enough to support quick back-and-forth navigation.
- **Load More view**: Demonstrates classic `useQuery` plus local state accumulation to model infinite scroll without a third-party infinite list component. It shares the same fetcher and cache policy.

Why this matters: predictable query keys + sensible freshness windows = snappy UX with minimal network chatter. Suspense keeps loading UI clean and centralized.

---

### Error boundaries and resiliency

- The app uses `react-error-boundary` to wrap the routed content. If any query or render path throws, users see a clear error message and a **Try Again** button.
- The error fallback resets via `resetErrorBoundary`, which fits React Query’s error model well. Combined with `Suspense`, this gives a clean separation of concerns: fetch logic in hooks, loading/error UI in one place.

---

### Testing: what’s covered and how it runs

Goals: verify critical user flows and enforce contract with the PokéAPI layer.

What’s covered:

- **Service layer** (`src/services/pokemon.service.test.ts`)
  - Happy paths for list and detail fetches
  - Error paths for `ok: false` and network failures
  - `extractPokemonId` edge cases
- **Card component** (`src/components/PokemonCard/PokemonCard.test.tsx`)
  - Renders name, formatted id, image alt, and link href
  - Gracefully handles missing sprite
- **Detail page** (`src/pages/PokemonDetail/PokemonDetail.test.tsx`)
  - Loading, success, and error states
  - Height/weight formatting, types rendering
  - Official artwork fallback logic
  - Back navigation link presence

How the tests are set up:

- Tests use **Testing Library** for DOM-level assertions and realistic rendering.
- React Query is provided via a per-test `QueryClientProvider` with `retry: false` to make failures deterministic.
- Network is mocked at the service level; we assert that `fetch` is called with the right URLs and that UI reacts to the mocked outcomes.

Commands:

```bash
npm test           # interactive watch mode
```

You can add coverage with CRA’s default Jest config via:

```bash
CI=true npm test -- --coverage --watchAll=false
```

---

### Architecture: Container/Presentational Pattern

The codebase follows the **Container/Presentational Component Pattern** to separate concerns and improve maintainability:

**Why this pattern?**

- **Separation of concerns**: Data management logic lives separately from UI rendering
- **Reusability**: Presentational components can be reused across different containers
- **Testability**: Pure presentational components are easier to test and debug
- **Maintainability**: Changes to data logic don't affect UI, and vice versa

**Structure:**

**Container Components** (Pages):

- `PaginationView`, `LoadMoreView` — handle data fetching, state management, and business logic
- Manage hooks (`usePokemonList`, `useQuery`), local state, and event handlers
- Pass data and callbacks down to presentational components

**Presentational Components** (`src/components/`):

- `PokemonGrid` — receives pokemon array, renders grid layout
- `PaginationControls` — receives page state and handlers, displays pagination UI
- `PageHeader` — displays header with navigation tabs
- `PokemonCard` — receives formatted pokemon data, renders card UI
- `SkeletonCard` — pure loading skeleton UI
- `LoadMoreButton` — receives loading state and handlers, displays button
- All are **pure components** that only receive props and render UI

**Utility Functions** (`src/utils/`):

- `pokemonFormatters.ts` — formatting helpers (`formatPokemonId`, `capitalizeName`, `extractPokemonId`, sprite URL builders)
- `pokemonMappers.ts` — data transformation (`mapPokemonListToCardData` converts API responses to component-ready data)
- Extracted from components to be reusable and easily testable

**Benefits observed:**

- Page components reduced from ~170 lines to ~60 lines
- UI components are now portable and reusable
- Formatting logic is centralized and DRY
- Testing surface is cleaner (test logic separately from UI)

---

### Pokemon Sprites and Image CDN

**Image Source:** This project uses the official Pokémon Company CDN for Pokemon artwork:
```
https://assets.pokemon.com/assets/cms2/img/pokedex/full/{id}.png
```

**Why not GitHub raw sprites?**
The PokeAPI GitHub repository (`raw.githubusercontent.com`) hosts sprites but is subject to rate limiting (HTTP 429 errors) when accessed frequently. This causes broken images during development and testing.

**CDN Details:**
- **Source**: The Pokémon Company's official website (pokemon.com)
- **URL Pattern**: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/{paddedId}.png`
- **ID Format**: 3-digit zero-padded (001, 025, 150, etc.)
- **Coverage**: All Pokemon in the National Pokedex
- **Quality**: High-quality official artwork
- **Reliability**: No rate limiting, maintained by The Pokémon Company

**Note:** This CDN URL pattern is not officially documented in PokeAPI, but is publicly accessible and used by pokemon.com's Pokedex pages. It's a well-known resource in the Pokemon developer community.

**Alternative Options:**
1. Fetch full Pokemon data from PokeAPI (includes sprite URLs in response)
2. Use smaller GitHub sprites (less frequently rate-limited)
3. Self-host sprites by downloading once from the PokeAPI sprites repository

**Implementation:** See `src/utils/pokemonFormatters.ts` → `getPokemonSpriteUrl()`

---

### Pages and components reference

This section documents how each page, component, and util fits into the architecture and what responsibility it owns.

Pages (containers):

- `src/pages/PaginationView/index.tsx`

  - State: `currentPage` → derives `offset` for the query
  - Data: `usePokemonList(limit, offset)` (Suspense) → `data.results`
  - Mapping: `mapPokemonListToCardData(results)` → `PokemonCardData[]`
  - UI: `<PageHeader currentView="pagination" />`, `<PokemonGrid pokemonList={...} />`, `<PaginationControls ... />`
  - PaginationControls receives `currentPage`, `totalPages`, `totalCount`, `hasNext`, `hasPrevious`, and handlers

- `src/pages/LoadMoreView/index.tsx`

  - State: `offset`, `allPokemon[]`; accumulates results as you load more
  - Data: `useQuery(['pokemon','load-more', offset], () => fetchPokemonList(limit, offset))`
  - Loading UX: initial skeleton via `<SkeletonCard />` grid; incremental skeletons while fetching
  - UI: `<PageHeader currentView="load-more" />`, `<PokemonGrid pokemonList={...} />`, `<LoadMoreButton ... />`
  - Error: friendly retry UI using `refetch()` from React Query

- `src/pages/PokemonDetail/PokemonDetail.tsx`
  - Data: `usePokemonDetail(id)` (Suspense)
  - Presentation: formats id/name, computes type-based gradient, shows stats, abilities, base experience
  - Assets: picks official artwork if available otherwise falls back to `front_default`
  - Icons: uses `LuWeight`, `CiRuler` for weight/height rows
  - Navigation: back link to `/`

Presentational components:

- `src/components/PageHeader` — header with title, subtitle, and view tabs; highlights active tab via `currentView`
- `src/components/PokemonGrid` — receives `PokemonCardData[]`, renders a 2/4-column responsive grid of `PokemonCard`
- `src/components/PaginationControls` — numbered pagination with ellipsis; exposes prev/next and displays `Page X of Y (N Pokémon found)`
- `src/components/PokemonCard` — navigable card to `/pokemon/:id`, shows sprite, capitalized name, and zero-padded id
- `src/components/SkeletonCard` — lightweight loading skeleton used by list pages
- `src/components/LoadMoreButton` — encapsulates load-more CTA; disables during fetch; shows “end of Pokédex” notice

Utilities:

- `src/utils/pokemonFormatters.ts`

  - `formatPokemonId(id)` — `#NNN`
  - `capitalizeName(name)` — `Pikachu`
  - `extractPokemonId(url)` — parses id from PokéAPI URL
  - `getPokemonSpriteUrl(id)` — builds official artwork URL
  - `getDefaultSpriteUrl()` — fallback sprite URL

- `src/utils/pokemonMappers.ts`
  - `mapPokemonListToCardData(results)` — transforms `PokemonListItem[]` → `PokemonCardData[]`

Hooks and services:

- `src/hooks/usePokemonList.ts` — `useSuspenseQuery` for list with `['pokemon','list', limit, offset]`, `staleTime=5m`, `gcTime=10m`
- `src/hooks/usePokemonDetail.ts` — `useSuspenseQuery` for detail with `['pokemon','detail', id]`, same cache policy
- `src/services/pokemon.service.ts` — `fetchPokemonList`, `fetchPokemonById`, and a robust `extractPokemonId` (regex-based) used by tests

Notes on divergence from “typical” structures:

- Pages act as thin containers; most UI lives in `src/components` with barrel `index.tsx` exports for clean imports.
- Formatting and mapping logic moved to `src/utils` to keep components pure and testable.
- `PokemonDetail` keeps a few small formatters inline for readability; these could be unified in `utils/` if we generalize them further.

---

### Notable implementation details

- **TypeScript-first**: Types for list items and detail payloads live in `src/types/pokemon.types.ts`.
- **Icons**: A small `src/react-icons.d.ts` shim declares icon types for used icon subpaths.
- **Styling**: Tailwind 3 with PostCSS (`tailwind.config.js`, `postcss.config.js`). Class names favor readability and predictable responsive behavior.
- **Routing**: React Router v7 with simple `Routes`/`Route` setup.
- **Barrel exports**: `index.ts` files provide cleaner imports (e.g., `import PokemonCard from 'components/PokemonCard'` instead of `components/PokemonCard/PokemonCard`).

---

### Rebuilding this with Next.js and React Server Components

If I were to build this again on Next.js (App Router) to leverage RSC and streaming:

High-level approach:

- **App Router** structure:
  - `app/` with route segments: `app/page.tsx` (pagination), `app/load-more/page.tsx`, `app/pokemon/[id]/page.tsx`
  - `app/(ui)/components/*` for shared UI; keep most components **Server Components** by default
  - `app/loading.tsx`, `app/error.tsx` for route-level Suspense and error boundaries
- **Data fetching**:
  - Fetch lists and details directly in **Server Components** with `fetch` (benefits: no client bundle cost for the data layer, automatic request deduping, easy caching with `next` revalidation options)
  - Use `revalidate` (e.g. 300s) where appropriate; for truly static parts, consider `generateStaticParams` for popular Pokémon IDs
- **Client components**:
  - Keep interactive pieces (e.g. load-more button, pagination controls) as **Client Components** with `"use client"`
  - If we still want React Query for client-side reactivity (mutations, optimistic UI), wrap client islands with `HydrationBoundary` and `dehydrate` server-side
- **Streaming UX**:
  - Use RSC + route-level `loading.tsx` for instant skeletons and progressive rendering
- **Error handling**:
  - Use route `error.tsx` for isolated failures; pair with client-side `react-error-boundary` where needed

Example shape for the detail page:

- `app/pokemon/[id]/page.tsx` (Server Component): fetch Pokémon data and render the bulk of the UI
- Small interactive subtrees (if needed) as client components
- If React Query is desired on the client, use server-side `dehydrate` + `HydrationBoundary` to keep a single source of truth and reuse the cache

This split gives you the best of both worlds: server-side data/rendering for performance and SEO, with client islands for interactivity.

---

### Decisions and trade-offs

- **Suspense-first React Query** keeps components tidy and pairs well with a global loading skeleton. For granular loading inside subtrees, we could wrap smaller Suspense boundaries.
- **Stale time and GC time** are tuned for a smooth navigation loop. In higher-traffic apps, we’d revisit these based on analytics and real-world usage.
- **Infinite scroll** is modeled manually to keep the example clear; in production I’d consider virtualization for large lists.

---

### Scripts

```bash
npm start    # start dev server
npm test     # run tests (watch)
npm run build# production build
```

---

### Author’s note

I aimed to build this like I would a feature slice in a real product: small surface area, good defaults, clear boundaries, and tests that pull their weight. If you’d like me to extend this (prefetching adjacent pages, virtualization, or a Next.js RSC version), I can take it there quickly.
