# Architecture

## Directory structure

```
revamp/
├── frontend/                        # Astro 5 SSG — deployed to CF Pages
│   ├── src/data/content/*.json      # Content snapshots — source of truth for build
│   ├── src/lib/directus.js          # Reads JSON files (no live SDK at build time)
│   └── src/pages/                   # 106 static pages
├── workers/forms/                   # CF Worker — contact/inquiry/newsletter → email
│   ├── index.js                     # Routes by body.source, sends 2 emails via Resend
│   └── wrangler.toml                # name: simply-enak-forms
├── scripts/
│   ├── sync-directus.mjs            # Pulls Directus → JSON snapshots
│   ├── translate-content.mjs        # Translates with Qwen CLI (--smart = changed only)
│   ├── translation-webhook-server.mjs  # Debouncing HTTP server for Directus Flow triggers
│   └── setup-directus-flows.mjs    # Creates nightly translation Flow in Directus (idempotent)
├── agent_docs/                      # Task-specific reference docs (read as needed)
└── LESSONS.md                       # Running log of gotchas and decisions
```

## Content pipeline

1. Edit content in Directus (`localhost:8055`)
2. `npm run sync` → writes JSON to `frontend/src/data/content/`
3. `npm run build` → Astro reads JSON, generates static HTML
4. Push to `main` → CF Pages auto-deploys

Translation runs nightly: Directus Flow (schedule `0 2 * * *`) → webhook server → `translate-content.mjs --smart`. Translations live in `*_translations` fields in JSON.

**Warning**: The translation agent also writes to `src/data/content/*.json`. Never rewrite these files wholesale — targeted edits only.

## Page structure

- `tours/[slug].astro` — 5 individual tour pages (FAQ schema + breadcrumb schema)
- `tours/locations/[slug].astro` — 5 location pages (Directus-backed via segment tags)
- `tours/dietary/[slug].astro` — 5 dietary pages
- `tours/specialty/[slug].astro` — 3 specialty pages
- `tours/travel-types/[slug].astro` — 2 travel-type pages
- `stories/[slug].astro` — vendor story pages (`vendor_id` → `getToursByVendor()`)

## Segment tag system

Tours have `segment_tags: string[]`. Segment page slug = the tag value. No ID linking needed.
New segment: create page in Directus → add tag to tours → sync → done.
All `getToursBy*()` functions in `frontend/src/lib/directus.js` use `toursByTag(slug)`.
