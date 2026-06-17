# Payload Staging Migration — Source of Truth Investigation Report
**Date:** 2026-05-04
**Investigator:** Evey (Hermes Agent)
**Status:** COMPLETE — Action required from Maarten

---

## 1. THE THREE SOURCES (None Align)

| Source | Location | Freshness | Payload-Compatible |
|--------|----------|-----------|-------------------|
| **Frontend JSONs** | `frontend/src/data/content/*.json` | MOST RECENT | NO |
| **Payload-import JSONs** | `backend/scripts/payload-import/*.json` | OLDER | NO |
| **Payload DB (staging)** | `development-payload-qah34c` | Partial data | YES (authoritative schema) |

### Schema Drift Example — Location Landing Pages

| Frontend JSON uses | Payload-import JSON uses | Payload DB actually has |
|---|---|---|
| `intro_title` | `intro_title` | `intro_heading` |
| `food_highlights` | (not present) | `highlights` |
| `signature_dishes` | (not present) | `safe_dishes` |
| `travel_tips_heading` | (not present) | `tips_heading` |
| `travel_tips` | (not present) | `travel_tips` |
| (not present) | `best_time_to_visit` | (not present) |
| (not present) | `getting_around` | (not present) |
| (not present) | `what_to_pack` | (not present) |

**Conclusion:** Zero source is directly importable into Payload without field mapping.

---

## 2. UNCOMMITTED CHANGES ANALYSIS

### Backend (`revamp/backend/`)
- 6 migration files deleted (67KB)
- `migrations/index.ts` changed to `export default []`
- 9 new helper scripts added (import, cleanup, test)
- **No source code changes** to collections, config, or plugins
- **Verdict:** Safe to keep new scripts. Migration deletion is DANGEROUS for fresh installs but irrelevant for existing staging DB.

### Frontend (`revamp/frontend/`)
- **5 content JSONs filled with real content** (+507 lines):
  - `dietary-landing-pages.json`
  - `location-landing-pages.json`
  - `specialty-landing-pages.json`
  - `travel-type-landing-pages.json`
  - `how-it-works-page.json`
- Astro components modified (`SegmentPage.astro`, tour pages, thank-you pages)
- 20+ new SVG icons
- Package files updated
- **Verdict:** MUST be committed. This is real work that would be lost.

---

## 3. DOKPLOY CONFIG — CRITICAL BUG

**The compose file does NOT match what's running.**

- File: `/etc/dokploy/compose/development-payload-qah34c/code/docker-compose.yml`
- Says: `image: node:22-alpine` with dev bootstrap script
- Actually running: `simplyenak/website-backend:staging` with `node server.js`
- **Risk:** Any Dokploy redeploy will destroy staging and replace it with a dev bootstrap

**S3 env vars:** Present on running container but ABSENT from Dokploy `.env` file. Redeploy = broken S3.

**Fix required:** Update compose file to use custom image + add S3 vars to `.env`.

---

## 4. MEDIA / S3 STATUS

- CDN images (cdn.simplyenak.com) return HTTP 200 — they exist
- S3 bucket `se-website-images` is configured and active
- **Staging DB has 0 media records**
- Payload Media collection is empty
- **Need:** Populate Media collection with references to existing S3 images

---

## 5. OLD DIRECTORIES TO ARCHIVE

| Directory | Status |
|-----------|--------|
| `website-optimization/payload-cms/` | Superseded by revamp/backend — 12 stale docker-compose files |
| `website-optimization/payload-local/` | Superseded by revamp/backend — old Payload 3.81.0 setup |
| `revamp/backend/scripts/payload-import/` | Stale format, doesn't match current schema |
| `revamp/backend/scripts/test-*.mjs` | One-off test scripts |

---

## 6. ANSWERS TO YOUR 4 QUESTIONS

| # | Question | Answer |
|---|----------|--------|
| 1 | Include uncommitted changes in build? | **YES for frontend** — commit the 507 lines of real content first. Backend changes are just helper scripts; they don't affect the image. |
| 2 | Which JSON is source of truth? | **`frontend/src/data/content/`** has the most complete, recent content. But it needs field-name transformation before Payload import. Neither JSON directory is directly importable. |
| 3 | Do tours reference images in S3? | **YES** — cdn.simplyenak.com URLs are valid (HTTP 200). But Payload Media collection is empty. Need to create media records. |
| 4 | Dokploy deploy workflow? | **BROKEN** — compose file is stale, S3 env vars not persisted. Needs manual fix via Dokploy UI or sudo on server. |

---

## 7. RECOMMENDED ACTION PLAN

### Phase A — Infrastructure Fix (Do First)
1. Commit frontend content changes: `git add frontend/src/data/content/ frontend/src/components/ frontend/src/assets/icons/ frontend/package*.json && git commit -m "feat: add segment page content and icons"`
2. Fix Dokploy compose file (requires sudo or UI access)
3. Persist S3 env vars in Dokploy `.env`

### Phase B — Build Transformation Script
4. Create a field-mapping script that transforms `frontend/src/data/content/*.json` into Payload-compatible format
5. Handle media references — create Media collection entries pointing to existing S3 images

### Phase C — Execute Migration
6. Run transformation + import against staging DB
7. Verify content in Payload admin UI

### Phase D — Cleanup
8. Archive `payload-cms/` and `payload-local/` directories
9. Remove stale `payload-import/` files after successful migration
10. Archive one-off test scripts

---

*Report saved to: /home/maarten/website-optimization/revamp/PAYLOAD-MIGRATION-REPORT-2026-05-04.md*
