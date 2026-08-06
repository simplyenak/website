# Experience Collection Pipeline

Infrastructure to collect first-hand experience from guides and enrich content.

## What's Built

### 1. Payload CMS Collection
- **File**: `revamp/backend/src/collections/ExperienceNotes.ts`
- **Purpose**: Store structured experience notes (dishes, vendors, sensory details, prices)
- **Fields**: title, location, noteType, dishes, vendors, sensoryDetails, surprises, recommendations, bestTime, priceRange, rawNote, submittedBy

### 2. Frontend Form
- **File**: `site/src/pages/experience-submit.astro`
- **URL**: `/experience-submit`
- **Purpose**: Simple form for guides to submit experience notes
- **API**: Posts to `/api/experience-note` → Payload CMS

### 3. API Integration
- **File**: `site/src/integrations/api.ts`
- **Purpose**: Handle form submissions, create Payload documents

### 4. Migration Script
- **File**: `scripts/create-experience-notes-migration.sh`
- **Purpose**: Create database table for experience_notes collection

### 5. Enrichment Scripts
- `scripts/enrich-content-from-experience.py` — Analyze gaps between notes and content
- `scripts/weekly-experience-check.py` — Weekly check for new notes and content gaps

### 6. CI/CD
- **File**: `.github/workflows/experience-enrichment-check.yml`
- **Purpose**: Weekly check, notifies on gaps

## Deployment Steps

### Backend (Payload CMS)
```bash
# 1. Create migration
bash scripts/create-experience-notes-migration.sh

# 2. Apply migration
cd revamp/backend
npx payload migrate

# 3. Rebuild and redeploy backend
# (via Dokploy or your deployment method)
```

### Frontend (Astro)
```bash
# The form is auto-deployed with the site
# URL: https://simplyenak.com/experience-submit
```

### GitHub Secrets (if needed)
- `PAYLOAD_URL` — Already available in workflow via environment
- `PAYLOAD_TOKEN` — Add to repo secrets if not already set

## Usage

### For Guides
1. Visit `/experience-submit` after a tour
2. Fill in: location, dishes with prices, vendor names, sensory details
3. Submit → saved to Payload as draft

### For Content Team
1. Review new notes in Payload admin
2. Run `python3 scripts/enrich-content-from-experience.py --json`
3. Use suggestions to update blog posts/stories
4. Mark notes as "used" after enrichment

### Automated
- Weekly cron runs enrichment check
- Reports gaps (missing prices, vendors, sensory details)
- Can integrate with Discord/Slack for notifications

## Next Steps

1. **Deploy backend migration** — `bash scripts/create-experience-notes-migration.sh`
2. **Test form** — Visit `/experience-submit` locally or on staging
3. **Add notification** — Connect to Discord/Slack webhook in workflow
4. **Train guides** — Show them the form, explain why specific details matter

## Files Changed
- `revamp/backend/src/collections/ExperienceNotes.ts` (new)
- `revamp/backend/src/payload.config.ts` (updated)
- `site/src/pages/experience-submit.astro` (new)
- `site/src/integrations/api.ts` (new)
- `scripts/create-experience-notes-migration.sh` (new)
- `scripts/enrich-content-from-experience.py` (new)
- `scripts/weekly-experience-check.py` (new)
- `.github/workflows/experience-enrichment-check.yml` (new)
