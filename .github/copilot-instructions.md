# Expo Template - React Native & GraphQL API

**ALWAYS follow these instructions first and fallback to search or additional context gathering only when the information here is incomplete or found to be in error.**

This is a monorepo containing a React Native Expo app with GraphQL API backend. The project uses modern TypeScript, testing, and CI/CD practices.

## Working Effectively

### Initial Setup
- Install Node.js 20.9.0 (as specified in `.node-version` files)
- Install pnpm globally: `npm install -g pnpm@9.15.9`
- Install root dependencies: `pnpm install` (installs lefthook git hooks)
- Install mobile dependencies: `cd mobile && pnpm install` -- **TAKES 60+ SECONDS**. NEVER CANCEL.
- Install GraphQL dependencies: `cd graphql && pnpm install` -- **TAKES 20+ SECONDS**. NEVER CANCEL.

### Build and Validation Commands (Mobile)
**ALWAYS run these commands from the `mobile/` directory:**
- `pnpm typecheck` -- TypeScript type checking (4 seconds)
- `pnpm lint` -- Biome + ESLint code quality checks (7 seconds, may show 1 warning about mockServiceWorker.js - ignore it)
- `pnpm fmt` -- Auto-format code with Biome + ESLint
- `pnpm test` -- Run Jest tests (5 seconds). NEVER CANCEL.
- `pnpm test:watch` -- Run tests in watch mode

### Build and Validation Commands (GraphQL)
**ALWAYS run these commands from the `graphql/` directory:**

**CRITICAL LIMITATION:** Prisma binary downloads may fail due to network restrictions. If `pnpm db:generate` fails with "ENOTFOUND binaries.prisma.sh", this is expected in restricted environments.

- `pnpm typecheck` -- **WILL FAIL** without Prisma client generation
- `pnpm lint` -- Biome code quality checks (works fine - 13ms)
- `pnpm fmt` -- Auto-format code with Biome
- `pnpm test` -- **WILL FAIL** without database setup
- Database setup requires: `pnpm db:generate && pnpm db:migrate` -- **FAILS in network-restricted environments**

### Development Servers
**Mobile (from `mobile/` directory):**
- `pnpm start` -- Expo development server (works in CI mode, networking disabled)
- `pnpm web` -- Expo web development server
- `pnpm android` -- Android development server  
- `pnpm ios` -- iOS development server
- `pnpm storybook` -- Component documentation server on port 6006

**GraphQL (from `graphql/` directory):**
- `pnpm dev` -- **REQUIRES** Prisma setup, will fail without database

### Visual Regression Testing (VRT)
**CRITICAL TIMING:** VRT operations take significant time. ALWAYS set timeouts to 30+ minutes.

**From `mobile/` directory:**
- `pnpm storybook:build` -- **CURRENTLY FAILING** due to Storybook version compatibility issues. Do not use until fixed.
- `pnpm storybook:capture` -- **DEPENDS ON WORKING BUILD**. Takes 10+ minutes when working. NEVER CANCEL.
- `pnpm vrt` -- Full VRT execution. Takes 15+ minutes when working. NEVER CANCEL.
- `pnpm vrt:approve` -- Approve VRT changes and update expected images
- VRT reports: `./vrt/public/report/index.html`

### GraphQL Code Generation
**From `mobile/` directory:**
- `pnpm codegen` -- Generate TypeScript types and MSW mocks from GraphQL schema
- `pnpm expo:fix` -- Fix Expo dependency issues

## Validation Scenarios

### Complete Mobile Workflow Test
**ALWAYS run this sequence after making mobile changes:**
1. `cd mobile`
2. `pnpm typecheck` (expect: success in ~4s)
3. `pnpm lint` (expect: success in ~7s, 1 warning OK)
4. `pnpm test` (expect: 2 test suites pass in ~5s)
5. `pnpm fmt` (clean up any formatting)

### Manual Application Testing
**IMPORTANT:** Since VRT is currently broken, test manually:
1. Start Storybook: `cd mobile && pnpm storybook --ci`
2. Verify it starts on http://localhost:6006
3. Check that Features stories are loaded (Articles, Bookmarks, BookmarkAddEdit)
4. Test core functionality in each story

### GraphQL Project Limitations
**DO NOT attempt these in network-restricted environments:**
- `pnpm db:generate` -- Will fail with ENOTFOUND binaries.prisma.sh
- `pnpm db:migrate` -- Requires Prisma client
- `pnpm test` -- Requires database setup
- `pnpm dev` -- Requires working Prisma setup

**What DOES work in GraphQL project:**
- `pnpm lint` -- Code quality checks
- `pnpm fmt` -- Code formatting  
- File editing and review
- Architecture analysis

## Critical Timing Information

### NEVER CANCEL Operations
- **Mobile dependency install:** `pnpm install` takes 60+ seconds
- **GraphQL dependency install:** `pnpm install` takes 20+ seconds  
- **VRT operations:** Any `pnpm vrt*` or `pnpm storybook:capture` commands take 10-30 minutes
- **Always set timeouts to 30+ minutes for VRT commands**

### Fast Operations (< 10 seconds)
- `pnpm typecheck` -- 4 seconds
- `pnpm lint` -- 7 seconds  
- `pnpm test` -- 5 seconds
- `pnpm fmt` -- 3 seconds

## Project Architecture

### Mobile (`mobile/`)
- **Framework:** Expo + React Native with Expo Router (file-based routing)
- **UI:** React Native Paper components
- **GraphQL:** Apollo Client + SWR for data fetching
- **Testing:** Jest + React Native Testing Library
- **VRT:** Storybook + Storycap + reg-cli
- **Code Quality:** Biome + ESLint + TypeScript
- **Path Aliases:** `@/*` maps to `src/*`

### GraphQL (`graphql/`)  
- **Framework:** Pylon + Hono (serverless GraphQL API)
- **Database:** Prisma + SQLite
- **Architecture:** Clean Architecture (Application/Domain/Infrastructure layers)
- **Testing:** Vitest + MSW for mocking
- **Code Quality:** Biome + TypeScript

### Directory Structure
```
mobile/
  src/
    features/           # Feature-based components
      Articles/         # Article listing feature  
      Bookmarks/        # Bookmark CRUD feature
      BookmarkAddEdit/  # Bookmark form feature
    libs/              # Shared utilities
      gql/             # Generated GraphQL types
      test/            # Test utilities
  app/                 # Expo Router pages
  vrt/                 # Visual regression test results
    
graphql/
  src/
    application/       # Use cases and business logic
    infrastructure/    # Prisma, external APIs
    generated/         # Auto-generated code
  prisma/             # Database schema and migrations
```

## Common Pitfalls and Solutions

### Storybook Issues
- **Problem:** Build fails with "@storybook/preview-api/shim.mjs" error
- **Solution:** Version compatibility issue between Storybook packages. Avoid `pnpm storybook:build` until resolved.
- **Workaround:** Use `pnpm storybook --ci` for development only

### Prisma in Restricted Environments  
- **Problem:** "ENOTFOUND binaries.prisma.sh" when running `pnpm db:generate`
- **Solution:** Accept that GraphQL development is limited without database access
- **Workaround:** Focus on mobile development and code review for GraphQL changes

### Lefthook Git Hooks
- Automatically installed after `pnpm install` in root
- Runs tests and formatting on commit/push
- Pre-commit: Format changed files in both projects
- Pre-push: Run tests on changed files only

### ESLint Warnings
- `mockServiceWorker.js` warning is expected and can be ignored
- Storybook build artifacts cause linting errors - remove `storybook-static/` directory

## CI/CD Integration
- Tests run automatically on PR and main branch pushes
- Separate workflows for mobile and GraphQL projects
- VRT workflow requires manual approval when changes are intentional
- All linting, type checking, and testing must pass for CI success

**Always run local validation before pushing:**
```bash
# Mobile validation  
cd mobile && pnpm typecheck && pnpm lint && pnpm test

# GraphQL validation (where possible)
cd graphql && pnpm lint
```