# Simply Enak Website - AI Coding Assistant Instructions

## Project Overview

This is a full-stack food tour website with a **Strapi 5** backend (Node.js/TypeScript) and **Astro** frontend with React/Vue components. The backend serves as a headless CMS for content management, while the frontend is a server-rendered site deployed on Cloudflare.

## Architecture & Key Patterns

### Backend (Strapi CMS)

- **Location**: `backend/` - Strapi 5 TypeScript application
- **Database**: PostgreSQL with connection pooling config in `config/database.ts`
- **File Storage**: AWS S3 provider configured (see `storage-config.env`)
- **Content Structure**: Component-based with single types (home-page) and collections (tours, stories)
- **API Endpoints**: Auto-generated REST API at `/api/*` with population queries

### Frontend (Astro + React/Vue)

- **Location**: `frontend/` - Multi-framework Astro app with TailwindCSS 4
- **Architecture**: Server-side rendering with Cloudflare adapter
- **API Integration**: Custom `fetchApi()` utility in `lib/strapi.ts` handles Strapi data fetching
- **Component Strategy**: Mixed React (client-side interactivity) and Vue (simple components)
- **Styling**: TailwindCSS 4 with Vite plugin integration

## Critical Developer Workflows

### Development Setup

```bash
# Backend
cd backend && npm run develop  # Starts on port 1337 with hot reload

# Frontend
cd frontend && npm run dev     # Starts on port 4321
```

### Environment Variables

- **Backend**: Uses `APP_KEYS`, `DATABASE_*` vars, AWS S3 config
- **Frontend**: `VITE_FORM_ENDPOINT` (n8n webhook), `VITE_TURNSTILE_SITE_KEY`, YouTube API keys

### Deployment

- **Main branch**: Triggers CI/CD that builds Docker image `simplyenak/website-backend:latest`
- **Docker branch**: Special workflow for backend Docker builds with main branch merge
- **Frontend**: Deploys to Cloudflare via Astro adapter

## Project-Specific Conventions

### Strapi Content Types

- Use **component-based schemas** extensively (see `home-page/schema.json`)
- Single types for pages, collections for dynamic content
- Always include SEO components and draft/publish workflow
- Content structure: `attributes.componentName.fieldName`

### Frontend Data Fetching

```typescript
// Standard pattern for Strapi API calls
const data = await fetchApi<HomePage>({
  endpoint: "home-page",
  query: { populate: "*" }, // Always populate relations
});
```

### Component Organization

- **Astro components**: `.astro` files for layouts and static content
- **React components**: `.tsx` for forms, interactive elements, block renderers
- **Vue components**: `.vue` for simple presentational components
- **Global components**: SEO, Button, Icon in `/components`

### Type Definitions

- **Strapi types**: Defined in `frontend/src/types/index.ts` with BlocksContent
- **Interface pattern**: Media, Button, NavItem as reusable interfaces
- **API responses**: Follow Strapi v4/v5 structure with `attributes` wrapping

## Integration Points

### External Services

- **n8n**: Contact form submissions via webhook (`VITE_FORM_ENDPOINT`)
- **YouTube API**: Channel integration for video content
- **Cloudflare Turnstile**: Bot protection on forms
- **AWS S3**: Media storage for production uploads

### Cross-Component Communication

- **Strapi → Frontend**: REST API with population queries
- **Components**: Props-down pattern with TypeScript interfaces
- **Styling**: TailwindCSS classes with design system consistency

## Key Files for Understanding

- `backend/config/database.ts` - Database configuration with environment switching
- `frontend/src/lib/strapi.ts` - API client implementation
- `frontend/src/types/index.ts` - Complete type definitions
- `backend/src/api/*/content-types/*/schema.json` - Content models
- `frontend/astro.config.mjs` - Build configuration and integrations

## Development Notes

- Always use `populate: '*'` for Strapi queries to get related data
- Frontend environment variables must be prefixed with `VITE_` or `PUBLIC_`
- Docker builds use multi-stage approach with native module rebuilding
- TailwindCSS 4 requires Vite plugin configuration in Astro config
