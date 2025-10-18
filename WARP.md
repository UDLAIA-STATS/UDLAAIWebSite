# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `yarn dev` - Start development server on localhost:4321
- `yarn build` - Build for production (includes type checking)
- `yarn preview` - Preview production build locally
- `yarn check` - Run Astro and TypeScript type checking

### Testing
- `yarn test` - Run tests in watch mode (Vitest)
- `yarn test run` - Run tests once 
- `yarn coverage` - Generate test coverage report

### Troubleshooting
- `yarn astro sync` - Regenerate Astro types
- `yarn astro info` - Show system and dependency information

## Architecture Overview

This is a sports team management and analytics system built with Astro, using a hybrid approach with React and Solid.js components.

### Tech Stack
- **Framework**: Astro v5.14.5 with SSR (server output mode)
- **UI Libraries**: React v19.2.0 and Solid.js v1.9.9 (hybrid approach)
- **Styling**: Tailwind CSS v4.1.14
- **Testing**: Vitest v3.1.4 with testing-library for both React and Solid
- **Deployment**: Netlify with SSR adapter
- **Package Manager**: Yarn (required - Node.js 18+ required)

### Key Architectural Patterns

#### Actions System
The app uses Astro's Actions API for server-side operations:
- Authentication actions in `src/actions/auth/`
- Player management actions in `src/actions/players/`
- Central export from `src/actions/index.ts` as `server` object

#### Role-Based Access
- Authentication via cookies (`user` and `token`)
- Roles defined in `src/consts/roles.ts`: `superuser` and `profesor`
- Route protection through private/public route mapping in `src/consts/routes.ts`

#### Path Aliases (tsconfig.json)
- `@components/*` → `./src/components/*`
- `@consts/*` → `./src/consts/*`
- `@interfaces/*` → `./src/interfaces/*`
- `@layouts/*` → `./src/layouts/*`
- `@actions/*` → `./src/actions/*`
- `@styles/*` → `./src/styles/*`

### Component Organization

#### Hybrid UI Framework Usage
- **React**: Used for complex interactive components requiring state management
- **Solid.js**: Used for lightweight reactive components (better performance)
- **Astro**: Used for static components and page layouts

#### Component Structure
```
src/components/
├── buttons/ - Reusable button components
├── cards/ - Various card layouts (stats, team, video)
├── tables/ - Data display components
├── shared/ - Global components (Navbar, Footer)
└── landing_page/ - Home page specific components
```

### Page Routing Structure
- Dynamic routes: `[team].astro`, `[name].astro`
- Nested structure: `/equipo/jugadores/` for player management
- Protected routes handled at page level (no middleware.ts file)

### Environment & External Services
- Uses `AUTH_URL` environment variable for authentication API
- Designed to integrate with external player statistics and analysis services

## Development Guidelines

### Testing Setup
- Tests in `tests/` directory with pattern `*.test.{ts,tsx,astro}`
- Coverage excludes config files, assets, and constants
- Uses jsdom environment for DOM testing

### Build Configuration
- Vite integration with Tailwind CSS plugin
- Netlify deployment with SSR mode
- Type checking occurs before build (astro check)

### File Upload Handling
Player registration includes file uploads (photos) - use proper FormData handling in actions.

### Authentication Flow
1. Login action validates credentials against external auth API
2. Sets user data and token cookies (1 hour expiry)
3. Routes check cookies for access control
4. "Remember me" functionality extends cookie lifetime to 30 days

## Common Issues

### Dependencies
If encountering dependency issues, run complete cleanup:
```powershell
# Windows
Remove-Item -Recurse -Force node_modules, yarn.lock
yarn install
```

### Port Conflicts
Default dev server runs on port 4321. If occupied:
```sh
yarn dev --port 3000
```

### Memory Issues
For "JavaScript heap out of memory" errors:
```sh
node --max-old-space-size=4096 ./node_modules/.bin/astro dev
```