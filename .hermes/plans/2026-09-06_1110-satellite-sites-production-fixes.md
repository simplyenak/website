# Satellite Sites Production Fixes — 2026-09-06

Fix all verified GUI/UX/content/production issues on whattoeatinmalaysia.com (WTM),
whatcanieatinmy.com (WCIEIM), whenisdurianseason.com (Durian). Then build, verify,
commit, deploy.

All findings below were verified against source/build/CDN (not just vision critique).

## Phase 1 — WTM imagery (mechanical, highest impact)
- [ ] Create `whattoeatinmalaysia/public/images/covers/`: penang.jpg, kl.jpg,
      melaka.jpg copied from `public/images/states/`; halal.svg, vegetarian.svg,
      collection.svg as branded type-only covers (warm palette, no fake photos).
- [ ] `src/pages/packages.astro:18-68`: replace six `cdn.simplyenak.com/wtm/*.jpg`
      (all 404 today) with local `/images/covers/*`.
- [ ] `src/data/images.ts`: re-key `stateImages` to actual state ids
      (perlis, kedah, penang, perak, selangor, kuala-lumpur, putrajaya,
      negeri-sembilan, melaka, johor, pahang, terengganu, kelantan, sabah, labuan,
      sarawak -> `/images/states/<id>.jpg`); drop bogus keys (`kl`,
      `sekolah-tun-abdul-rahman`); `_default` -> null placeholder acceptable.
- [ ] `src/pages/guides/index.astro:40`: kill the 2-letter badge
      (`slice(0,2)` gives PE for both Perlis and Perak). All states now have
      photos; fallback becomes full state name.

## Phase 2 — WTM packages page (conversion)
- [ ] Trust block under grid (factual only): secure checkout via ThriveCart,
      instant unlock on the payment success page, login link reusability.
- [ ] Full Collection card: visual elevation (accent border + small "Best value"
      outline badge), price row grouped (strike + save + final baseline-aligned).
- [ ] Per-card price moved above CTA, heavier weight; blurbs clamped so card
      heights normalize and CTAs align.

## Phase 3 — WTM interaction/a11y
- [ ] Star ratings: amber fill + 44px hit targets (transparent padding trick).
- [ ] Checklist checkbox: 44px tap target.
- [ ] `login.astro`: input and button equal height.
- [ ] FAQ question headers to weight 600.
- [ ] Homepage paid section: eyebrow label so upsell reads intentional, not
      ambush; shrink "Best Value" banner weight.

## Phase 4 — WTM copy (brand voice: no em-dashes, no superlatives)
- [ ] Title tag: drop 🐴 and "Must Try" (`index.astro`).
- [ ] Replace 8 em-dashes in homepage copy.
- [ ] `guides/[slug].astro:19`: meta "dishes you must try" -> neutral phrasing.

## Phase 5 — WCIEIM
- [ ] Hero: scrim/overlay so headline + subhead hit AA contrast; subhead (36
      dishes / 8 restrictions value line) promoted to readable near-white.
- [ ] Unify diet icon set (same stroke weight, inline SVG).
- [ ] Style or remove default "Share this tool?" buttons.
- [ ] `src/data/dishes.ts:507`: "Roti Nasik (Bread & Egg)" -> real dish name
      (Roti Telur), then `npm run push:dishes` to keep Payload in sync.
- [ ] Verify section counts are computed from data, not hardcoded.

## Phase 6 — Durian
- [ ] `public/robots.txt` (allow + sitemap ref), `src/pages/sitemap.xml.ts`,
      `src/pages/404.astro` (today robots/sitemap serve homepage HTML, no 404).
- [ ] `liveStatusScript`: render build-time initial status per region so
      no-JS/slow users never see "checking..."; JS upgrades to live date.

## Phase 7 — Build, verify, commit, deploy
- [ ] Build all three; re-screenshot changed pages (desktop + mobile); compare.
- [ ] Verify deployed `wtm-access` WTM_SITE_URL points at custom domain
      (SSH simplyenak; magic links built from it, main.py:236).
- [ ] Commits per site. Deploy: WTM with PUBLIC_WTM_MODE=full (wrangler pages),
      WCIEIM + Durian (wrangler pages). Live-verify robots/sitemap/404, covers
      200, routes 200, checkout links.
- [ ] Durian GSC: verify + submit sitemap if API creds available; else manual TODO.

## Phase 8 — Housekeeping
- [ ] Archive one-off tc-*.mjs ThriveCart debug scripts in wtm-access/tools/archive/.

## Out of scope (flagged, needs Maarten)
- WTM guide dish counts (Penang 6 dishes) — content expansion via Payload,
  personal review required.
- Cross-site shared design tokens — design decision, separate pass.
- Reframing guide page copy around stall-level intel (content review).
