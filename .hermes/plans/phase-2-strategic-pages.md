# Phase 2: Build Strategic Tour Pages

**Preface:** Phase 1 (running autonomously) builds colony pages that generate authority and steer it toward strategic tours. Phase 2 builds the actual tour pages those colonies point to — the money pages.

---

## Workstream A — Multi-Day Package Pages (Pillar 2)

**Why:** The primary revenue driver. Colony pages currently point to `/tours/private-tours/` as a generic target. Multi-day packages don't exist yet as dedicated pages.

### Pages to Build

| Page | Content | Target Keywords |
|------|---------|----------------|
| **KL + Penang Combo (3-day)** | "Ultimate Malaysia Food Experience" — 3 days, 2 cities, 20+ stalls, private guiding | `malaysia multi-day food tour`, `KL Penang food tour package`, `multi-day food tour Malaysia` |
| **KL Deep Dive (4-day)** | Extended Kuala Lumpur — markets, nightlife, cooking class, day trip | `Kuala Lumpur food tour package`, `multi-day food tour KL` |
| **Penang Deep Dive (4-day)** | Extended Penang — George Town, Balik Pulau, night markets, street art | `Penang multi-day food tour`, `Penang food tour package` |

**Location:** `site/src/pages/tours/packages/` as Astro pages
**Style:** Landing page with tiered pricing, day-by-day breakdown, testimonial carousel, clear CTA
**CTA target:** Enquiry form → leads to custom quote

### Dependencies
- Need to decide pricing structure for multi-day vs single-day
- Need images for each day's highlight
- Content from existing tour descriptions can be reused and expanded

---

## Workstream B — Upgrade Private / Tailored Landing Pages (Pillar 2)

**Why:** These pages exist at 197-261 lines but were built as templates. They need conversion-focused content.

### Pages

| Page | Current | Needs |
|------|---------|-------|
| `/tours/private-tours/` | 261 lines, basic template | Social proof, pricing tiers, sample itineraries, CTA refinement |
| `/tours/tailored-tours/` | 249 lines, basic template | Custom process explainer, client stories, sustainability angle |

**What to add:**
- Trust signals (media logos, tripadvisor score, review count)
- 3-tier pricing (Essential / Premium / Elite) or similar framing
- Sample day-by-day for a private tour
- FAQ section addressing common concerns (group size, dietary, kids)
- CTA: "Plan Your Private Tour" → enquiry form

---

## Workstream C — Upgrade Corporate Landing Page (Pillar 3)

**Why:** Corporate is the third pillar. The page exists at 197 lines.

### Page
| Page | Current | Needs |
|------|---------|-------|
| `/tours/corporate-groups/` | 197 lines | B2B case studies, team sizes, sample itineraries, ROI framing |

**What to add:**
- Case studies: "We hosted 30 people from [company] for a 4-day team retreat"
- Capabilities: max group sizes, dietary handling, event types (teambuilding, client entertainment, incentive)
- Sample half-day, full-day, and multi-day corporate itineraries
- Testimonial from a corporate client
- CTA: "Request a Corporate Proposal"

---

## Workstream D — CTE Astro Migration + Content Upgrade

**Why:** CTE is the B2B agency arm. Currently running raw HTML with zero images and a non-functional contact page. The Astro version (cte-site/) is built but not deployed.

### Two Sub-Workstreams

#### D1: Deploy the Astro Site
The Astro project exists at `cte-site/` with:
- Astro 6 + TailwindCSS 4 + astro-icon + astro-seo
- `src/pages/` with index, about, contact, destinations, itineraries, partner-with-us, trade-kit, what-we-do
- `dist/` already built
- `astro.config.ts` configured for `culinarytravelexperts.com`
- package.json has all deps

**To deploy:**
1. Verify `npm run build` passes
2. Configure Cloudflare Pages project `culinary-travel-experts` to build from `cte-site/`
3. Or manually upload `dist/` contents

**Cleanup after deploy:**
- Remove `cte-pages/` (raw HTML version, superseded)
- Update or remove Worker at `workers/cte-insights.js` — the `/insights/` page should be a proper Astro page, not a Worker

#### D2: Content & Design Upgrades

| Fix | Priority | What |
|-----|----------|------|
| Add images | 🔴 Critical | 0 images across all pages. Food shots, market scenes, guide photos essential for a food tourism site |
| Fix contact page | 🔴 Critical | Contact URL in nav goes nowhere. Astro version has `contact.astro` — just needs confirming it works |
| Merge Insights | 🟡 Medium | `/insights/` served by Worker. Move content into Astro as proper page(s) |
| SEO meta | 🟡 Medium | Add meta titles, descriptions, OG tags to all pages (astro-seo already in deps) |
| Analytics | 🟢 Low | Add GA4 consent mode (same pattern as simplyenak.com) |
| Trade kit | 🟢 Low | Update trade-kit page with current pricing/offerings |

---

## Workstream E — Connect Colony Authority to New Pages

**Why:** After building the strategic tour pages, the existing colony scripts already point toward them. But we need to verify the targets actually match.

### Actions
1. Update `STRATEGIC_TOURS` in `scripts/striking-to-colony.py` to include new multi-day package URLs
2. Update `STRATEGIC_TOURS` in `scripts/paa-content-factory.py` to match
3. Update `.hermes/plans/tour-strategy.md` with new page URLs
4. Build the 3 new colony chains from the proposals file (Penang Food Tours, KL Food Tours, Malaysia Food Tours hub)

---

## Phase 2 Build Order

```
Week 1           Week 2           Week 3           Week 4
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Multi-day│     │ Private/│     │ CTE     │     │ Connect │
│ packages │────▶│ tailored│────▶│ Astro   │────▶│ colonies│
│ (build)  │     │ upgrade │     │ deploy  │     │ + verify│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                    │                                    
                    ▼                                    
              ┌─────────┐                               
              │ Corpor- │                               
              │ ate     │                               
              │ upgrade │                               
              └─────────┘                               
                    │                                    
                    ▼                                    
              ┌─────────┐                               
              │ CTE     │                               
              │ content │                               
              │ upgrade │                               
              └─────────┘                               
```

**Parallel work possible:**
- Multi-day packages + CTE Astro deploy can start simultaneously (independent)
- Private/tailored/corporate upgrades depend on understanding the current templates
- Colony chains can run in background during any week

---

## Summary of Deliverables

| # | Deliverable | Effort | Priority | Status |
|---|-------------|--------|----------|--------|
| A | 3 multi-day package landing pages | Medium | 🔴 High | ✅ Built |
| B1 | Upgrade private-tours page | Low | 🟡 Medium | ✅ Built (507 lines) |
| B2 | Upgrade tailored-tours page | Low | 🟡 Medium | ✅ Built (408 lines) |
| C | Upgrade corporate-groups page | Low | 🟡 Medium | ✅ Built (492 lines) |
| D1 | Deploy CTE Astro site | Low | 🔴 High | ✅ Deployed to Cloudflare Pages |
| D2 | CTE images + contact fix | Medium | 🔴 High | ✅ Contact fixed, images already using CDN |
| D3 | CTE insights migration | Medium | 🟢 Low | ⏳ Worker still active, needs Astro page |
| E | Connect colony scripts to new pages | Low | 🟡 Medium | ⏳ Next step |

Want me to start building? I can launch the multi-day packages and CTE deploy workstreams in parallel.
