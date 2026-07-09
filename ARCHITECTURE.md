# LogCiv Architecture

## Overview
LogCiv is a single-page React application built with Vite. It focuses on real estate workflows for `proprietaire`, `agent`, and `agence` roles.

## Tech Stack
- React 18
- TypeScript
- Vite
- Wouter for routing
- Zustand for local state
- TanStack React Query for server data
- Tailwind CSS 4 for styling
- Radix UI based component primitives

## High-Level Structure
- `src/main.tsx`: application bootstrap
- `src/App.tsx`: router and global providers
- `src/pages/`: route-level screens
- `src/components/`: shared UI and dashboard modules
- `src/context/AuthContext.tsx`: auth context bridge
- `src/lib/store.ts`: local app state and mock data
- `src/services/api.ts`: API client and auth helpers

## Routing
The app uses Wouter routes for:
- `/` home
- `/apropos`
- `/tarifs`
- `/inscription`
- `/connexion`
- `/dashboard/proprietaire`
- `/dashboard/locataire`
- `/dashboard/agent`
- `/dashboard/agence`

## Authentication Flow
1. The login page submits credentials to `authAPI.login()`.
2. Tokens are stored in `localStorage` when returned.
3. The app fetches the current user through `usersAPI.me()`.
4. The user is mapped into local auth state through Zustand.
5. The dashboard redirects based on the user role.

## Data Layer
`src/services/api.ts` handles:
- request building
- bearer token attachment
- token extraction and storage
- user/profile normalization

`src/lib/store.ts` holds:
- current user
- properties
- reservations
- messages
- notifications
- agents
- favorites
- pricing/subscription helpers

## Mock Data
The store includes a `seedMockData()` function with sample owners, agents, agencies, properties, reservations, and messages. It is useful for demo content and local testing.

## UI Composition
- `Navbar` and `Footer` are shared shell components.
- `DashboardLayout` wraps authenticated dashboard screens.
- Dashboard tabs are split by feature area:
  - overview
  - profile
  - properties
  - reservations
  - messages
  - notifications
  - settings
  - agents
  - calendar
  - favorites

## Important Behaviors
- Role-based dashboard routing is enforced in `src/pages/Dashboard.tsx`.
- Owner-only actions are guarded in the dashboard modules.
- Registration supports owner, agent, and agency profiles.
- The app is designed to work with an external Django API, but also contains local state and mock data for demo scenarios.

## Notes
- There is no backend implementation in this repository.
- The frontend expects an API at `http://127.0.0.1:8000/api` unless `VITE_API_URL` is set.
