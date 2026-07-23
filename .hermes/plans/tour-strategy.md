# Simply Enak — Tour Strategy Reference
**Purpose:** Tells every script and agent which tours to steer colony authority toward.
**Rule:** Colony pages are tactical (build freely). The tours they link to are strategic (must align with pillars below).

---

## Three Strategic Pillars

### Pillar 1: Join-in Tours (Fix → Deprioritize)
These are the standard single-day small-group tours. Fix their accessibility/promotion, then maintain — they are NOT the primary authority target going forward.

| Tour | Price | Location | Status |
|------|-------|----------|--------|
| Kuala Lumpur Street Food | RM285 | KL | Active |
| Penang Street Food | RM289 | Penang | Active |
| Flavours of Malaysia | RM289 | KL | Active |
| Inside Pudu | RM289 | KL | Active |
| Secrets of KL Nightlife | RM359 | KL | Active |
| Georgetown Night Food & Durian | RM289 | Penang | Active |
| KL Vegetarian Food Tour | RM450 | KL | Active |

### Pillar 2: High-Value Multi-Day Group Experiences & Packages ⭐
**These are the primary authority target.** Redirect colony link equity toward these. Multi-day group bookings and curated packages. If recommending a tour in any script, prefer these.

- **Multi-day KL + Penang package** — The flagship high-value product
- **Private multi-day itineraries** — Bespoke 2-5 day food + culture experiences
- **Group packages (6+ pax)** — Corporate retreats, family reunions, friend groups
- **Not yet in tours JSON** — These are private/tailored offerings, built on request

**Link target:** `/tours/private-tours/` or `/tours/tailored-tours/` with anchor text about multi-day experiences or private group bookings.

### Pillar 3: Corporate Experiences
B2B corporate teambuilding, client entertainment, incentive trips.

**Link target:** `/tours/corporate-groups/`

### Bonus: Custom Tours with Sustainability & Social Impact
Tours with a sustainability or social-justice angle. Built for feeling and impact, not just revenue. Examples: women-led vendor visits, community-based tourism, zero-waste food experiences.

**Link target:** `/tours/tailored-tours/` or mention custom/sustainable experiences.

---

## Link Priority Rules

When any script (colony bridge, PAA factory, BoFU pipeline) needs to recommend a tour:

1. **Pillar 2 first** — Multi-day packages, private group experiences
2. **Pillar 3 second** — Corporate experiences  
3. **Pillar 1 third** — Join-in tours (only if specifically relevant to the colony topic)
4. **Bonus pillar fourth** — Custom/sustainable tours (for impact-driven colony content)

---

## Current State of Strategic Pages

| Page | Exists? | Content Ready? | Notes |
|------|---------|---------------|-------|
| `/tours/private-tours/` | ✅ 261 lines | Needs review | Basic template exists |
| `/tours/tailored-tours/` | ✅ 249 lines | Needs review | Basic template exists |
| `/tours/corporate-groups/` | ✅ 197 lines | Needs review | Basic template exists |
| Multi-day packages (KL+Penang combo) | ❌ | ❌ | **Needs to be built** |
| Agency website | ❌ | ❌ | Separate site for B2B market |

## Phase 2 — Build Strategic Pages (Next Phase)

The colony scripts now point authority toward these pages. The next phase of work is to make those pages convert:

1. **Multi-day package pages** — "Ultimate KL + Penang Food Experience" (3-5 day itineraries). These are the primary money pages. Content should upsell private guiding, accommodation add-ons, and curated experiences.
2. **Upgrade private/tailored landing pages** — Add social proof, package pricing tiers, and clear CTAs.
3. **Upgrade corporate landing page** — Add B2B case studies, team sizes, sample itineraries.
4. **Agency website** — The separate site targeting the agency/wholesale market. Corporate pillar.


---

## How Scripts Use This

### Colony bridge (`striking-to-colony.py` and `colony-auto-inject.py`)
- Colony pages link to each other in their chain
- The FINAL page in each colony chain should link toward a Pillar 2 or Pillar 3 tour
- Example: durian colony chain → eating-durians links to → how-to-pick-durian links to → `/tours/private-tours/` ("experience Malaysian durian on a private food tour")

### BoFU pipeline (`find-bofu-opportunities.py` and `bofu-landing-factory.py`)
- All suggested landing pages should promote Pillar 2 tours by default
- If a keyword is specifically about join-in tours (e.g., "KL street food tour"), Pillar 1 is acceptable
- Corporate keywords → Pillar 3
- Sustainability keywords → Bonus pillar

### PAA factory (`paa-content-factory.py`)
- Answers should end with a nudge toward Pillar 2 where relevant
- Generic food questions → can reference Pillar 1 (join-in) as entry point, then steer toward private multi-day
