# CRUSH.AI Configuration - Simply Enak Website Optimization

## 🏗️ Project Architecture

**Frontend**: Astro 5 + React/Vue + TailwindCSS 4 on Cloudflare Pages
**Backend**: Strapi 5 + PostgreSQL + AWS S3 (headless CMS)
**Integration**: Custom fetchApi utility for Strapi data fetching

## 🚀 Development Commands

### Frontend (cd frontend/)
```bash
# Start development server (port 4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# TypeScript checks
npx tsc --noEmit

# Astro CLI commands
npx astro check
```

### Backend (cd backend/)
```bash
# Start development server (port 1337)
npm run develop

# Build for production
npm run build

# Start production server
npm run start

# Strapi console
npm run console

# Deploy to Strapi Cloud
npm run deploy
```

## 🎯 Code Style Guidelines

### Component Organization
- **Astro components** (`.astro`): Page layouts, static content
- **React components** (`.tsx`): Forms, interactive elements, block renderers  
- **Vue components** (`.vue`): Simple presentational components

### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.astro`, `Button.astro`)
- **Functions/Variables**: camelCase (e.g., `fetchApi`, `tourData`)
- **Files**: kebab-case for utilities, PascalCase for components

### TypeScript Patterns
- Use strict types from `src/types/index.ts`
- Strapi API responses: `attributes` wrapping structure
- Always populate relations: `populate: "*"` in queries
- Import paths: Use `@/*` alias for src imports

### Styling Guidelines
- Use TailwindCSS classes with design system consistency
- Responsive design: mobile-first approach
- Semantic HTML elements over divs
- Alt text required for all images
- CSS modules or scoped styles when needed

### Strapi Content Types
- Component-based schemas extensively
- Single types for pages, collections for dynamic content
- Include SEO components and draft/publish workflow
- Content structure: `attributes.componentName.fieldName`

## 🔍 Testing

No formal test framework configured. Use manual testing:
```bash
# Frontend testing
npm run dev && npm run preview

# Backend API testing
npm run develop && check /api endpoints
```

## 📦 External Integrations

- **n8n**: Contact forms via `VITE_FORM_ENDPOINT` webhook
- **YouTube API**: Video content integration  
- **Cloudflare Turnstile**: Bot protection
- **AWS S3**: Media storage (production)
- **Google Analytics**: Property ID 262711985

## 🗂️ Key Configuration Files

- `frontend/astro.config.mjs` - Build config, Cloudflare adapter
- `frontend/src/lib/strapi.ts` - API client implementation
- `frontend/src/types/index.ts` - TypeScript definitions
- `backend/config/database.ts` - Database configuration
- `backend/src/api/*/schema.json` - Content models