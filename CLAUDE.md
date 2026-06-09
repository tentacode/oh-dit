# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OhDit is a web accessibility audit tool supporting RGAA 4.1, RAAM, RAWEB, and RAPDF standards. It is a monorepo with three sub-projects:

- **`api/`** — Symfony 7.4 / PHP 8.4 REST API (runs in Docker on port 1338)
- **`app/`** — Next.js 16 / React 19 frontend (runs locally on port 1339)
- **`www/`** — Astro 6 marketing/landing site (runs locally on port 1337)

## Development Setup

Docker manages only the API, database (PostgreSQL 17), and Redis. The frontends run locally.

```bash
make install      # Copy .env.dist → .env and build Docker containers
make up           # Start Docker containers (api, database, redis)
make www.serve    # Start Astro www site on port 1337
make app.serve    # Start Next.js app on port 1339
```

Reset/seed the database:
```bash
make reset        # Drop, recreate, migrate, load fixtures, and import all accessibility standards
make reset env=test
```

## Common Commands

### API (Symfony — run inside Docker)
```bash
make api.phpunit              # Run all PHPUnit tests
make api.phpunit filter=MyTest  # Run a single test by name/filter
make api.phpstan              # Static analysis
docker compose exec api bin/ecs --fix       # Code style (EasyCodingStandard)
docker compose exec api bin/rector process src  # Rector refactoring
```

### App (Next.js — run locally)
```bash
cd app && npm run lint         # ESLint
cd app && npm run typescript   # TypeScript check (no emit)
cd app && npm run storybook    # Component development
cd app && npx vitest --run     # Storybook/Vitest tests
```

### WWW (Astro — run locally)
```bash
cd www && npm run lint         # ESLint + Prettier
```

### Run everything (lint + tests + types)
```bash
make tests   # Runs www lint, app lint, ECS, Rector, PHPStan, PHPUnit, app TypeScript in sequence
```

## Architecture

### API (`api/src/`)

Feature-based architecture following CQS (Command/Query Separation):

```
Features/
  Authentication/   # JWT auth (lexik/jwt), User entity, registration
  Project/          # Audit projects
  Compliance/       # Criteria compliance tracking
  Issue/            # Audit issues
  RuleSet/          # RGAA/RAAM/RAWEB/RAPDF criteria (imported via console commands)
  Screen/           # Audit screens
  Comment/          # Markdown comments
  Team/             # Multi-user teams
  SecuredLinkReport/
  Newsletter/
Infrastructure/     # Base controllers, Symfony infrastructure
ThirdParty/         # Brevo (email), Sentry integrations
```

Each feature contains `Controller/`, `Command/` (mutations), `Query/` (reads), `Entity/`, `Repository/`, `Fixture/`. Controllers are single-action classes using `__invoke`. The base `ApiController` provides `getSerializedJsonResponse()`.

The API is stateless, JWT-authenticated. `NEXT_PUBLIC_API_HOST` in the app points to `http://localhost:1338`.

Accessibility standards are imported via console commands (`rgaa:import`, `raam:import`, `raweb:import`, `rapdf:import`) — do not edit that data manually.

### App (`app/src/`)

Feature-based Next.js App Router structure:

```
app/              # Next.js routes (App Router)
features/
  authentication/ # JWT token management, login/register mutations, auth middleware
  audit/          # Audit workflows
  compliance/     # Criteria compliance UI
  issue/          # Issue management
  project/        # Project CRUD
  rule_set/       # Browsing accessibility standards
  ...
lib/
  react-query/
    apiClient.ts  # Central fetch wrapper (adds Bearer token, handles 401 redirect)
    queryClient.ts
components/       # Shared UI components
design-system/    # Base design tokens/components
```

All API calls go through `apiClient<T>(endpoint, options?, anonymous?)` in `app/src/lib/react-query/apiClient.ts`. It reads `NEXT_PUBLIC_API_HOST`, attaches the JWT from `getAuthToken()`, and throws `ApiError` on non-2xx responses. A 401 redirects to `/session-expired`.

Data fetching uses TanStack Query. Mutations are in `features/*/mutations/use*.ts`, queries in `features/*/queries/use*.ts`.

Internationalization uses `next-intl`. The app is primarily in French.

### WWW (`www/src/`)

Simple Astro marketing site with Tailwind CSS. No backend integration.

## Git Conventions

Use gitmoji for commit messages (e.g., `:sparkles:` for new features, `:bug:` for fixes, `:lock:` for security). No direct commits to `main`.
