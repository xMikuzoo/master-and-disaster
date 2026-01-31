# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

League of Legends summoner statistics viewer built with React 19, TypeScript, Vite, and TailwindCSS. Integrates with the Riot API to display player profiles, rankings, and match history.

## Commands

```bash
npm run dev      # Start development server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- React 19 + React Router 7 + TanStack Query
- TypeScript (strict mode)
- TailwindCSS + shadcn/ui (Radix/Base UI components)
- Vite with API proxy for Riot endpoints

### Key Directories
- `src/api/riotgames/` - Riot API integration (account, summoner, league, match endpoints)
- `src/api/ddragon-cdn/` - League of Legends asset CDN helpers
- `src/components/ui/` - shadcn/ui component library
- `src/components/` - Feature components (summoner-profile, matches, header)
- `src/pages/` - Route page components
- `src/providers/` - React context providers (Theme, Query)
- `src/layouts/` - Layout wrappers

### Data Flow
1. HomePage queries account data via `getAccountByRiotId`
2. SummonerProfile fetches summoner details, league entries, and match list
3. Matches component displays individual match data
4. TanStack Query handles caching and state management

### API Proxy (vite.config.ts)
Routes `/api/riot/*` requests to Riot API endpoints (europe, eun1 regions) and DDragon CDN.

## Code Style

- Tabs (4 spaces), no semicolons, trailing commas
- Path alias: `@/*` → `./src/*`
- Prettier with tailwindcss plugin
- Use `cn()` from `@/lib/utils` for Tailwind class merging

## Environment Variables

```
VITE_RIOT_API_KEY     # Riot API key
VITE_DDRAGON_CDN_VERSION  # DDragon CDN version (e.g., 16.1.1)
```
