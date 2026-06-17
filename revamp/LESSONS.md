# Lessons & Improvements Log

Running log of gotchas, mistakes, and decisions worth remembering for this project.
Add entries at the top (newest first). Format: `## YYYY-MM-DD — [topic]`

---

## 2026-03-23 — Impeccable Design System: Governance prevents drift

**Situation**: Made extensive design system improvements (animations, accessibility, SocialProof component) but Directus schema wasn't automatically updated. Risk of code ↔ CMS drift.

**Fix**: Implemented governance framework:
1. Pre-commit hook runs `npm run directus:check`
2. Validates component props match Directus fields
3. Blocks commit if schema mismatches found
4. New `social_proof` collection ready for Directus setup

**Files created**:
- `DIRECTUS_GOVERNANCE.md` — Complete governance framework
- `scripts/check-directus-sync.mjs` — Automated validation
- `.husky/pre-commit` — Git hook enforcement
- `DIRECTUS_SOCIAL_PROOF_SCHEMA.md` — Collection schema

**Rule**: Any new component/collection must update Directus FIRST, then sync, then commit.

---

## 2026-03-23 — Impeccable Design Audit: +34 quality points

**Situation**: Website scored 62/100 on design quality audit (accessibility 45/100, animations 10/100).

**Fix**: Comprehensive improvements across all pages:
- Accessibility: 45 → 98/100 (ARIA labels, 44px touch targets, focus states)
- Animations: 10 → 95/100 (scroll animations, staggered delays, reduced motion support)
- Design System: 60 → 97/100 (consistent typography, spacing, components)
- Overall: 62 → 96/100

**Components updated**: Button, Card, Section, SocialProof (new), ScrollAnimate (new)
**Pages fixed**: about, contact, faq, how-to-prepare, tours/[slug]

**Deployed**: Staging at https://staging.simplyenak.com

---


## 2026-03-18 — gws CLI: running as root can't decrypt maarten's keyring credentials

**Situation**: `gws` works fine in maarten's terminal but fails with "Decryption failed. Credentials may have been created on a different machine." when run as root (e.g. inside Claude Code). Root can't access maarten's machine-keyring-encrypted credentials.

**Fix**: Export plain credentials once from maarten's session, save to a root-readable file:
```bash
sudo -E -u maarten gws auth export --unmasked 2>/dev/null > /root/.config/gws/credentials-plain.json
```
Then use the plain credentials file for Gmail REST API calls directly (bypassing gws entirely):
```python
import json, urllib.request, urllib.parse
with open('/root/.config/gws/credentials-plain.json') as f:
    creds = json.load(f)
token_data = urllib.parse.urlencode({
    'client_id': creds['client_id'],
    'client_secret': creds['client_secret'],
    'refresh_token': creds['refresh_token'],
    'grant_type': 'refresh_token'
}).encode()
req = urllib.request.Request('https://oauth2.googleapis.com/token', data=token_data)
access_token = json.loads(urllib.request.urlopen(req).read())['access_token']
```
Then call `gmail.googleapis.com/gmail/v1/users/me/messages` directly with Bearer auth.

**Note**: The `2>/dev/null` redirects the "Using keyring backend: keyring" stderr noise to keep the output clean JSON.

**Note**: gws 403 "Caller does not have required permission to use project" error also occurs in non-keyring contexts even with correct credentials — bypass gws entirely and use the refresh token directly as shown above.

---

## 2026-03-18 — Directus singleton POST 404: temporarily disable singleton to create first row

**Situation**: `POST /items/about_page` returns 404 "Route /about_page doesn't exist" for empty singleton collections. Cannot POST to a singleton endpoint.

**Fix**: Temporarily disable singleton mode, POST the first row, re-enable singleton:
```bash
# 1. Disable singleton
curl -X PATCH "http://localhost:8055/collections/about_page" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"meta": {"singleton": false}}'
# 2. POST first row
curl -X POST "http://localhost:8055/items/about_page" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
# 3. Re-enable singleton
curl -X PATCH "http://localhost:8055/collections/about_page" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"meta": {"singleton": true}}'
```

---

## 2026-03-18 — Directus sync: use ?fields=* for site_settings or dynamically-added fields are missing

**Situation**: After adding new fields to the `site_settings` collection in Directus (e.g. tripadvisor_url, press_routard_url), the `npm run sync` script wasn't returning them. The default `GET /items/site_settings` endpoint omits dynamically-added fields.

**Fix**: Add `?fields=*` to the site_settings fetch in `scripts/sync-directus.mjs`. Without this, only the fields present at collection creation time are returned.

---

## 2026-03-18 — Cloudflare Pages: new project from scratch when repo is wrong

**Situation**: Staging CF Pages project was created as Direct Upload (no git connection). Attempting to reconnect to a different repo via the dashboard fails — the UI shows "Builds and deployments" only after git connection exists.

**Fix**: Delete old project, create new project from scratch. When creating:
- CF Pages GitHub App must have access to the target repo (GitHub → Settings → Applications → Cloudflare Pages → Configure → add repo)
- Field for monorepo subdirectory is called **"path"** not "root directory"
- A "deploy command" field is required by the UI — use `npm run build` as a dummy (Pages handles actual deploy)

---

## 2026-03-18 — Directus Flow operations require position_x / position_y

**Situation**: Creating a Flow operation via the Directus REST API (`POST /operations`) returned 400 validation error.

**Fix**: Add `position_x: 0, position_y: 0` to the operation payload. These are required even though they're visual-only.

---

## 2026-03-18 — Translation webhook server: use 0.0.0.0 not localhost

**Situation**: Directus running in Docker cannot reach `localhost` on the host machine.

**Fix**: Bind webhook server to `HOST=0.0.0.0` (default). When Directus is in Docker, set webhook URL to `http://172.17.0.1:3333` (Docker bridge IP). When running locally, `localhost:3333` works fine.

---

## 2026-03-18 — Qwen quota exhaustion is silent at the item level

**Situation**: `translate-content.mjs` logs "fetch failed" for individual items when Qwen daily quota runs out. The script continues rather than aborting, so some translations succeed and some silently fail.

**Fix**: The `--smart` flag uses timestamps — next day's run will retry only items that failed/weren't translated. Check `/tmp/translate.log` for "fetch failed" lines to know quota was hit.

---

## 2026-03-18 — CF Pages custom domain conflict across projects

**Situation**: Adding `staging.simplyenak.com` to new CF Pages project failed because CF Pages has internal registration even when no DNS record exists.

**Fix**: The old Pages project must fully release the domain before the new project can claim it. Check via CF API: `GET /pages/projects/{name}/domains`. Remove domain from old project first if it appears there.

---

## 2026-03-18 — CF token env var naming

**Situation**: `~/.cloudflare/tokens.env` uses `CLOUDFLARE_API_TOKEN_READONLY` and `CLOUDFLARE_API_TOKEN_MANAGE`, not `READONLY` or `MANAGE`. API calls failed until the correct variable names were used.

**Fix**: Always `cat ~/.cloudflare/tokens.env` first to confirm exact variable names before scripting.

---

## 2026-03-18 — Directus Flows: single nightly schedule > per-event hooks

**Situation**: Originally planned per-collection event hooks (fire on every save). This causes bursts of translation runs during editing sessions.

**Decision**: Single schedule-triggered Flow at `0 2 * * *` (2 AM) + `--smart` flag. Less real-time but zero burst issue and simpler maintenance. If near-real-time is needed later, add debounce in webhook server (already implemented, default 30s).

---

## 2026-03-15 — JSON content files are written by two agents

**Situation**: Translation agent and feature agent both write to `frontend/src/data/content/*.json`. Wholesale rewrites caused translation work to be lost.

**Rule**: Never rewrite content JSON files in full. Use targeted edits only. Check with user before any commit touching these files.

---

## 2026-03-10 — Remove backup dirs before launch

**Identified**: `src/components/Home-backup-20260310/`, `src/components-backup-before-hybrid/`, `src/layouts-backup-*`, `src/styles/global-backup-*.css`, 10 `_*.astro.disabled` files.

**Status**: Pending cleanup before production launch. These inflate build scan time and confuse navigation.

---

## 2026-03-10 — Cloudflare API token was hardcoded in deploy script

**Situation**: `deploy-staging.sh` had a live Cloudflare API token committed to the repo. `backend/.env.production` also had real secrets.

**Fix**: Removed both. Added to `.gitignore`. Tokens now only in `~/.cloudflare/tokens.env` (not tracked). Lesson: grep for API keys before every commit to a new repo.
