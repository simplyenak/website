# Simply Enak — Project Context

## 🔐 Credential Policy (MANDATORY — user mandate 2026-08-05)

**NEVER hardcode passwords, API keys, tokens, or secrets in scripts, configs, or code.**

- Credentials live in exactly two places:
  1. **PyRunner secret store** (pyrunner.system.simplyenak.com) — for PyRunner-hosted webhook scripts
  2. **`site/.env`** (gitignored, local only) — for scripts that run on this machine
- Scripts MUST read credentials from env vars (`os.environ.get(...)` / `process.env...`) with an EMPTY default — never a real value. An empty default fails loudly instead of silently using a stale known password.
- Use `import payload_env` (scripts/payload_env.py) to load `site/.env` into the environment for Python scripts that log into Payload.
- Never commit `.env` files; never echo credentials in script output.
- If a credential must be rotated: rotate it in the CMS/app first, update `site/.env` (and PyRunner secrets), then verify old fails / new works. Check for hardcoded copies: `grep -rn "<old-value>" --include="*.py" --include="*.js" --include="*.mjs" --include="*.sh" --include="*.ts" .`

## Stack
- **Frontend**: Astro 6 + TailwindCSS 4, deployed to Cloudflare Pages
- **CMS**: Payload CMS 3 (PostgreSQL), at cms.system.simplyenak.com
- **Images**: S3 (Scaleway) → CDN (cdn.simplyenak.com)

## Critical Architecture — Cloudflare Worker & redirects

A zone-level Worker (`simplyenak-cdn-rewriter`) runs on `simplyenak.com/*` and catches ALL requests before Pages. It:

1. Checks a static `REDIRECTS` map for 301 redirects (single source of truth)
2. Skips non-HTML requests early (no Worker overhead for images/JS/CSS)
3. Fetches the page from the Pages origin (`website-40z.pages.dev`)
4. Rewrites HTML: replaces S3 URLs with CDN URLs
5. Uses `redirect: "manual"` so Pages `_redirects` pass through when applicable

**This means:**
- `_redirects` file and Pages Functions do NOT work on the custom domain (Worker catches first)
- ALL redirects must go in the Worker's `REDIRECTS` map — source at `site/workers/cdn-rewriter.js`
- Updates are deployed via Cloudflare API, NOT through GitHub Actions

## Worker deployment
```bash
# Upload via API (token needs Workers Scripts > Edit)
PUT /accounts/{account_id}/workers/scripts/simplyenak-cdn-rewriter
Content-Type: multipart/form-data
Parts: worker.js + metadata
```

## Key environment
- Site repo: `simplyenak/website`, main branch
- Frontend deploy: GitHub Actions (deploy-site.yml) → Cloudflare Pages
- CMS deploy: GitHub Actions (deploy-payload.yml) → Docker → Swarm
- Running CMS image: `simplyenak/website-backend:noloc2`
- CMS service: `simplyenakbackend_payload`

## Build paths
- Payload Docker image: built from `revamp/backend/` in GitHub, pushed as `simplyenak/website-backend:noloc2`
- Hermes Docker image: built from `hermes-dokploy/` via GitHub Actions — never build on server directly
- Site: built from `site/`, deployed to `website` project on Cloudflare Pages

## Known quirks
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
