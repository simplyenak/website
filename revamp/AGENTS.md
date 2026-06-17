# Simply Enak Website Revamp

## Architecture

- **Frontend**: Astro 6 (static output) + React 19 + Vue 3 + TailwindCSS 4 on Cloudflare Pages
- **Backend**: Payload CMS 3 on Next.js 16 + PostgreSQL, deployed on Dokploy via Docker
- **Live Site**: `website/` — do NOT touch (uses Strapi)
- **Revamp**: `frontend/` + `backend/` — this is what we work on
- **Content source**: Static JSON in `frontend/src/data/content/` (36 files). Not fetched from CMS at build time — pages import these JSON files directly.
- **i18n**: 10 locales (en, ms, zh, de, es, fr, nl, ru, ja, pt), en is default without prefix. Translations live in `frontend/src/i18n/translations/` (99 per-page-per-locale JSON files).

## Build & Test

```bash
# Frontend (npm)
cd frontend
npm run dev              # Dev server (port 4321)
npm run build            # Production build (needs PUBLIC_PAYLOAD_URL env)
npm run test:run         # Vitest (tests in tests/**/*.test.{js,mjs} — must be .js/.mjs, not .ts)
npm run test:e2e         # Playwright
npx vitest run path/to/test.test.js  # Single test file

# Backend (pnpm — required by engines field, not npm)
cd backend
pnpm run dev             # Payload dev server (port 3000, uses --webpack flag)
pnpm run build           # Build admin panel
pnpm run lint            # ESLint
pnpm run test:int        # Vitest
pnpm run test:e2e        # Playwright
```

## Payload CMS Workflow

After any backend schema change, run these in order:
```bash
cd backend && pnpm run generate:types   # Regenerate payload-types.ts
cd backend && npx tsc --noEmit          # Validate TypeScript
cd backend && pnpm run generate:importmap  # After adding/renaming admin components
```

For Payload security patterns and gotchas, see `backend/AGENTS.md` — the "Common Gotchas" section at line ~1160 is the highest-signal part.

## Content Sync & Translation Pipeline

Content flows from Payload CMS → local JSON snapshots → translations:

```bash
cd frontend
npm run sync                      # Pull content from Payload API → frontend/src/data/content/
npm run sync:dry                  # Preview what would sync
npm run validate:translations     # Check for missing translations
npm run validate:translations:strict  # Fail on any missing
```

Sync requires `PAYLOAD_URL` (defaults to `http://localhost:1337` — note: this is a leftover Strapi port; set it to `http://localhost:3000` for local Payload) and optionally `PAYLOAD_TOKEN` for authenticated collections.

Translation uses AI (Qwen CLI):
```bash
npm run translate                 # Skip existing, create missing
npm run translate:smart           # Re-translate if source is newer
npm run translate:force           # Re-translate everything
npm run translate -- --lang pt    # Single language
npm run translate -- --collection tours  # Single content collection
```

Manual pre-commit check: `cd frontend && npm run precommit:check` (sync → validate translations → tests).
Note: the git hook in `.husky/pre-commit` is stale (references Directus/`directus:check` which no longer exists).

## React 19 Gotcha

Astro config aliases `react-dom/server` → `react-dom/server.edge` in production builds only. Without this, `MessageChannel` from `node:worker_threads` needs polyfilling. If you hit a `MessageChannel` error during `npm run build`, check `frontend/astro.config.mjs`.

## Deployment

- **Frontend**: Cloudflare Pages via GitHub Actions on push to `staging` or `main`
  - `main` → project `website` (production: `https://simplyenak.com`)
  - `staging` → project `staging` (staging URL)
  - Workflow sets `PUBLIC_PAYLOAD_URL` based on branch
- **Backend**: Docker image pushed to Docker Hub on `staging` pushes only, deployed via Dokploy

## Rules

- NEVER create files unless absolutely necessary; prefer editing existing ones
- NEVER save files to project root
- NEVER touch `website/` or `archive/`
- Brand voice: `docs/brand/BRAND_GUIDE.md` (auto-loaded via `opencode.json` instructions)
  - No em-dashes in copy, no "We're not X, we're Y" patterns
  - Alt text required on all images
