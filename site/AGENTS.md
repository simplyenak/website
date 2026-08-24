# Simply Enak Site — Agent Instructions

## Project Overview

Simply Enak's website, built with **Astro v6** and **Tailwind CSS v4**. Generates a fully static site optimized for performance, SEO, and accessibility.

**Stack:** Astro v6 | Tailwind CSS v4 | TypeScript 5 | MDX | Sharp

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.12.0

## Build behavior — `npm run build` re-syncs from Payload (IMPORTANT)

`npm run build` has a **prebuild hook** that runs BEFORE the Astro build
(package.json `prebuild`):

```
node scripts/sync-payload.mjs && python3 scripts/generate-okf-bundle.py \
  && python3 scripts/fix-story-yaml.py && npm run generate:herald || true
```

Consequences:
- The build **re-syncs all content snapshots from Payload at build time**.
  Payload is therefore always the source the deployed site builds from, even
  if the committed `src/data/content/*.json` snapshots differ. To see what
  will actually ship, run `npm run sync` first and check the diff.
- The CI deploy workflow (`deploy-site.yml`) has an explicit sync step that
  only runs for non-push triggers (`if: github.event_name != 'push'`). On
  push — the normal path — the prebuild hook is what syncs. Either way, the
  build rebuilds snapshots from live Payload, so editing content JSON
  snapshots locally does NOT change the deployed site unless Payload is
  updated too.
- Prebuild sync requires Payload auth env vars (PAYLOAD_URL/PAYLOAD_TOKEN, or
  PAYLOAD_EMAIL/PAYLOAD_PASSWORD, or PAYLOAD_ADMIN_API_KEY). Missing/wrong
  credentials make the sync silently fall back to public reads or empty
  collections — check `site/src/data/content/` after a build if content
  appears missing.

## Architecture

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Headline, WidgetWrapper, ItemGrid
    widgets/       # Page sections: Hero, Features, Pricing, Header, Footer
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro v6 location)
  data/post/           # Blog posts (.md, .mdx)
  data/content/        # JSON snapshots synced from Payload CMS
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing (index, about, tours, stories, contact...)
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';  // Virtual module from vendor integration
```

### Site Configuration

Site config lives in `src/config.yaml`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Content Sync

Content flows from Payload CMS → JSON snapshots:

```bash
npm run sync               # Pull content from Payload → src/data/content/
npm run sync:dry           # Preview without writing
```

Collections: tours, stories, faqs, testimonials, media_coverage, dietary_options, locations, landing_pages, etc.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains (for providers Unpic can't detect, processed by Sharp): `cdn.pixabay.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier)
3. Visual check in browser: homepage, blog, mobile menu

## Skills
- **j-space**: MANDATORY for audits, consistency checks, or multi-step tasks across site/ and cte/. Load before starting.
- **Trigger keywords**: audit, verify, check consistency, multi-step, long-running, complex, debug across files → always load J-Space first.
