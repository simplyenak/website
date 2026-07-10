# Simply Enak — Project Context

## Stack
- **Frontend**: Astro 6 + TailwindCSS 4, deployed to Cloudflare Pages
- **CMS**: Payload CMS 3 (PostgreSQL), at cms.system.simplyenak.com
- **Images**: S3 (Scaleway) → CDN (cdn.simplyenak.com)

## Critical Architecture — Cloudflare Worker intercepts everything

A zone-level Worker (`simplyenak-cdn-rewriter`) runs on `simplyenak.com/*` and catches ALL requests BEFORE they reach Pages. It:
1. Checks a static `REDIRECTS` map for 301 redirects
2. Fetches the page from the Pages origin (`website-40z.pages.dev`)
3. Rewrites HTML: replaces S3 URLs with CDN URLs, removes "in the media" sections
4. Uses `redirect: "manual"` so Pages `_redirects` pass through

**This means:**
- `_redirects` file and Pages Functions do NOT work on the custom domain (Worker catches requests first)
- ALL redirects must go in the Worker's `REDIRECTS` map at `site/workers/cdn-rewriter.js`
- The Worker is deployed via Cloudflare API (not through GitHub Actions)
- Add redirects to the `REDIRECTS` object in the Worker, then update via API

## Worker deployment API
```bash
# Upload new version (token needs Workers Scripts > Edit)
PUT /accounts/{account_id}/workers/scripts/simplyenak-cdn-rewriter
Content-Type: multipart/form-data
Parts: worker.js (the script), metadata (body_part: "worker.js")
```

## Key environment
- Site repo: `simplyenak/website`, main branch
- Frontend deploy: GitHub Actions (deploy-site.yml) → Cloudflare Pages
- CMS deploy: GitHub Actions (deploy-payload.yml) → Docker → Swarm
- Running CMS image: `simplyenak/website-backend:noloc2`
- CMS service: `simplyenakbackend_payload`

## Build path
- Payload Docker image: built from `revamp/backend/` in GitHub, pushed as `:noloc2`
- Site: built from `site/`, deployed to `website` project on Pages

## Known quirks
- `_redirects` on custom domain only works if no zone-level Worker intercepts the route
- Draft/status: use `_status` (Payload version status), not `status` (custom field)
- PM check in template: `startTime.includes('PM')` is case-sensitive; values are lowercase "pm"
- Tours snapshot at `site/src/data/content/tours.json` — synced from Payload, never edit directly

## Content operations
- Edit in Payload CMS admin, then sync via `npm run sync` in site/
- Content JSON files in `site/src/data/content/` are snapshots — edits get overwritten
- Safe to edit: templates, mappers, components, tours.js (hardcoded fallback)

## Brand: Passionate Friend
- Warm, personal, knowledgeable
- No: authentic, superlatives, em-dashes, "We're not X, we're Y"
- Sell presence, never absence
- Show with specifics (names, years, dishes)
