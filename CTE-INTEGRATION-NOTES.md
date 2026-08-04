# CTE Integration with Payload CMS - Implementation Notes

## What Was Done

### 1. Payload CMS Collections Added
- **CtePosts** (`/api/cte-posts`): Blog posts for CTE with:
  - title, slug, excerpt, content, content_markdown
  - featuredImage (upload to CTE CDN)
  - publishedDate, meta_title, meta_description
  - workflowStatus for content approval
  - Author relationship to existing Users

- **CtePages** (`/api/cte-pages`): Static pages for CTE with:
  - title, slug, content, content_markdown
  - featuredImage
  - meta_title, meta_description
  - workflowStatus

### 2. S3 Storage Configuration
- CTE media uploaded via the shared `media` collection (same S3 bucket `se-website-images`)
- Prefix: `payload-media/` → CDN: `https://cdn.simplyenak.com/payload-media/{filename}`
- **Note:** the `featuredImage` field on cte_posts/cte_pages stores files through the
  `media` collection. A per-collection `cte-media` prefix is NOT possible for upload
  *fields* — s3Storage plugin collection entries only apply to upload collections.
  (Registering cte_posts/cte_pages in s3Storage/ seoPlugin configs broke the API:
  it generated upload-style columns + a `cte_posts_locales` join table that never
  existed. Both were removed — see payload.config.ts notes.)

### 3. CTE Site Updates
- **Blog listing** (`src/pages/blog.astro`): Lists posts from `src/data/content/cte-posts.json`
  (synced from Payload via `scripts/sync-cte-content.mjs`), with hardcoded fallback
- **Blog post page** (`src/pages/blog/[...slug].astro`): Renders Payload posts from the
  same JSON (markdown body via `marked`); static `.astro` pages shadow the 3 original slugs
- **Static pages** (`src/pages/blog/{slug}.astro`): Full articles for the original 3 posts;
  new posts render via the dynamic route
- **Sync script** (`scripts/sync-cte-content.mjs`): Fetches `/api/cte_posts` + `/api/cte_pages`
  (underscore slugs — hyphenated 404s) with `depth=1`, writes `src/data/content/*.json`
- **Auto-sync**: Hermes cron `04319b101ded` runs `cte/scripts/auto-sync-cte.sh` every 60m —
  syncs, commits `cte/src/data/content/`, pushes → `deploy-cte.yml` deploys

### 4. Cloudflare Worker
- **File**: `cte/workers/cdn-rewriter.js`
- **Purpose**: 
  - Serve images from `cdn.culinarytravelexperts.com`
  - Rewrite S3 URLs to CDN URLs in HTML
  - Add caching headers for performance
- **Deploy script**: `cte/scripts/deploy-worker.sh`

## Next Steps (Manual Actions Required)

### 1. Deploy Payload Backend
Rebuild and redeploy the Payload Docker image to create new collections:
```bash
# In revamp/backend directory
npm run build
# Then push new image to Docker Hub
```

### 2. Create Cloudflare DNS Record
Add DNS record for CDN subdomain:
- **Type**: CNAME or ALIAS
- **Name**: `cdn`
- **Target**: `se-website-images.s3.nl-ams.scw.cloud` (Scaleway bucket)
- **Proxy**: Orange (enabled)

### 3. Deploy Worker
Run the deploy script after Cloudflare credentials are set:
```bash
# Add your Cloudflare token to ~/.cloudflare/tokens.env
source ~/.cloudflare/tokens.env
./cte/scripts/deploy-worker.sh
```

### 4. Add Content to Payload
Create initial CTE blog posts via Payload admin:
- Go to `https://cms.system.simplyenak.com/admin/collections/cte-posts`
- Create posts with proper workflow status (draft → published)
- Upload images to CTE media library

### 5. Update CTE Site Config
Add environment variable for Payload token:
- In Dokploy/Cloudflare Pages: `PAYLOAD_TOKEN`
- This allows the blog to fetch live content

### 6. Set Up GSC for CTE
- Verify domain at https://search.google.com/search-console
- Submit sitemap: `https://culinarytravelexperts.com/sitemap-0.xml`
- Add to ranking history tracking

## Architecture

```
Payload CMS ──API──▶ CTE Site (fetches at build time)
                      │
                      ├── Static build (sync script)
                      └── SSR (API calls)
                      
Scaleway S3 (se-website-images)
├── payload-media/ → cdn.simplyenak.com
└── cte-media/     → cdn.culinarytravelexperts.com
```

## Migration Path

1. Create CTE posts in Payload CMS (new system)
2. Run sync script to generate static JSON
3. Deploy updated CTE site
4. Old static posts still work as fallback
5. Gradually migrate all content to Payload
6. Remove old static markdown files

## Files Modified/Created

| File | Change |
|------|--------|
| `revamp/backend/src/collections/CtePosts.ts` | New collection |
| `revamp/backend/src/collections/CtePages.ts` | New collection |
| `revamp/backend/src/payload.config.ts` | Added collections, S3 config |
| `cte/workers/cdn-rewriter.js` | New Worker for CDN |
| `cte/scripts/sync-cte-content.mjs` | Content sync script |
| `cte/src/pages/blog.astro` | Updated to fetch from API |
| `cte/src/pages/blog/[...slug].astro` | New dynamic blog post page |
| `cte/src/components/blog/CteBlogList.astro` | Blog listing component |
| `cte/scripts/deploy-worker.sh` | Worker deployment script |
