# Simply Enak — Programmatic Pages: Architecture & Routing
_Last updated: 2026-03-19_

## The core distinction

**Only 7 tours are real, bookable products.** All other "tour" pages in the database are SEO/informational guide pages. They should teach visitors about a topic (e.g. halal food culture, Chow Kit market) and then route them to real tours or a custom enquiry — **not pretend to be bookable themselves.**

---

## Real bookable tours

| Slug | Name | City | Type |
|------|------|------|------|
| `kl-street-food` | Kuala Lumpur Street Food | KL | Join-in |
| `flavours-of-malaysia` | Flavours of Malaysia | KL | Join-in |
| `secrets-of-kl-nightlife` | Secrets of KL – Nightlife | KL | Join-in (adults-only) |
| `eat-drink-george-town` | Eat Drink George Town | Penang | Join-in |
| `penang-street-food` | Penang Street Food | Penang | Join-in |
| _(pudu tour)_ | Pudu Market Tour | KL | Join-in (not yet published) |
| _(vegetarian)_ | Vegetarian Food Tour | KL/Penang | Private only |

---

## Page types and their Directus/Astro paths

| Page type | Directus collection | Astro route | Example URL |
|-----------|---------------------|-------------|-------------|
| Tour detail (real + programmatic) | `tours` | `tours/[slug].astro` | `/tours/kl-street-food/` |
| Dietary hub | `dietary-landing-pages` | `tours/dietary/[slug].astro` | `/tours/dietary/halal/` |
| Specialty hub | `specialty-landing-pages` | `tours/specialty/[slug].astro` | `/tours/specialty/street-food/` |
| Travel type hub | `travel-type-landing-pages` | `tours/travel-types/[slug].astro` | `/tours/travel-types/family/` |
| Location hub | `location-landing-pages` | `tours/locations/[slug].astro` | `/tours/locations/kuala-lumpur/` |
| Neighbourhood | `tours` (slug convention) | `tours/neighborhoods/[slug].astro` | `/tours/neighborhoods/chow-kit/` |
| City × segment | _(programmatic)_ | `tours/locations/[city]/[segment].astro` | `/tours/locations/ipoh/halal/` |

---

## Routing matrix — which real tour(s) to show on each informational page

### KL dietary pages

| Page slug | Primary tour | Secondary | Custom option |
|-----------|-------------|-----------|---------------|
| `halal-food-tour-around-kuala-lumpur` | KL Street Food | Flavours of Malaysia | — |
| `vegetarian-food-tour-around-kuala-lumpur` | Flavours of Malaysia | — | Yes (veg is private) |
| `vegan-food-tour-around-kuala-lumpur` | — | — | Yes (custom only) |
| `gluten-free-food-tour-around-kuala-lumpur` | Flavours of Malaysia | KL Street Food | Yes |
| `jain-food-tour-around-kuala-lumpur` | — | — | Yes (custom only) |

### Penang dietary pages

| Page slug | Primary tour | Secondary | Custom option |
|-----------|-------------|-----------|---------------|
| `halal-food-tour-around-penang` | Eat Drink George Town | Penang Street Food | — |
| `vegetarian-food-tour-around-penang` | Eat Drink George Town | — | Yes |
| `vegan-food-tour-around-penang` | — | — | Yes (custom only) |
| `gluten-free-food-tour-around-penang` | Eat Drink George Town | Penang Street Food | Yes |
| `jain-food-tour-around-penang` | — | — | Yes (custom only) |

### KL travel-type / specialty pages

| Page slug | Primary tour | Secondary | Custom |
|-----------|-------------|-----------|--------|
| `street-food-tour-around-kuala-lumpur` | KL Street Food | Flavours of Malaysia | — |
| `foodie-tour-around-kuala-lumpur` | KL Street Food | Flavours of Malaysia | — |
| `heritage-food-tour-around-kuala-lumpur` | KL Street Food | Flavours of Malaysia | — |
| `market-food-tour-around-kuala-lumpur` | KL Street Food | — | Yes |
| `night-food-tour-around-kuala-lumpur` | Secrets of KL | — | — |
| `family-food-tour-around-kuala-lumpur` | KL Street Food | Flavours of Malaysia | — |
| `couples-food-tour-around-kuala-lumpur` | KL Street Food | Secrets of KL | Yes |

### Penang travel-type / specialty pages

| Page slug | Primary tour | Secondary | Custom |
|-----------|-------------|-----------|--------|
| `street-food-tour-around-penang` | Penang Street Food | Eat Drink George Town | — |
| `foodie-tour-around-penang` | Eat Drink George Town | Penang Street Food | — |
| `heritage-food-tour-around-penang` | Eat Drink George Town | — | — |
| `market-food-tour-around-penang` | Penang Street Food | — | Yes |
| `night-food-tour-around-penang` | — | — | Yes (custom only) |
| `family-food-tour-around-penang` | Eat Drink George Town | Penang Street Food | — |
| `couples-food-tour-around-penang` | Eat Drink George Town | — | Yes |

### KL neighbourhood pages

| Page slug | Primary tour | Secondary | Custom |
|-----------|-------------|-----------|--------|
| `food-tour-around-brickfields-little-india` | KL Street Food | Flavours of Malaysia | Yes |
| `food-tour-around-chinatown-petaling-street` | KL Street Food | Flavours of Malaysia | — |
| `food-tour-around-chow-kit-market` | KL Street Food | — | Yes |
| `food-tour-around-kampung-baru-malay-village` | KL Street Food | Flavours of Malaysia | — |

### Penang neighbourhood pages

| Page slug | Primary tour | Secondary | Custom |
|-----------|-------------|-----------|--------|
| `food-tour-around-chowrasta-market-penang` | Penang Street Food | — | Yes |
| `food-tour-around-georgetown-heritage` | Eat Drink George Town | — | — |
| `food-tour-around-gurney-drive` | Eat Drink George Town | Penang Street Food | Yes |
| `food-tour-around-little-india-lebuh-queen` | Eat Drink George Town | Penang Street Food | — |

---

## City pages — all 5 cities

Location pages exist (or should exist) for all 5 cities. KL and Penang have real tours; the other three are custom-only.

| City | Directus slug | Real tours available | CTA |
|------|---------------|---------------------|-----|
| Kuala Lumpur | `kuala-lumpur` | KL Street Food, Flavours of Malaysia, Secrets of KL | Show real tours + custom |
| Penang | `penang` | Eat Drink George Town, Penang Street Food | Show real tours + custom |
| Ipoh | `ipoh` | None yet | Custom enquiry only |
| Melaka | `melaka` | None yet | Custom enquiry only |
| Klang | `klang` | None yet | Custom enquiry only |

**Ipoh, Melaka, Klang Directus entries need to be created** and a standard "We run custom tours here — tell us what you're looking for" page structure applied.

---

## City × topic combinations (future or `/locations/[city]/[segment]` route)

These don't exist as separate pages yet but are SEO targets worth building incrementally. Pattern: `/tours/locations/ipoh/halal/` or `/tours/locations/melaka/heritage/`.

All city × topic combos for Ipoh, Melaka, Klang → **custom enquiry only** (no real tour to point to).

For KL and Penang, city × topic pages would duplicate the single-topic pages above — evaluate whether separate URLs are worth it or if the existing `/tours/dietary/halal/` hub is sufficient.

---

## CTA component conventions (when implementing)

**Pattern A — has a real tour:**
- Card/button: primary CTA → tour detail page
- Secondary link: "Or enquire for a private tour" → contact/custom form

**Pattern B — custom only:**
- Single CTA: "Plan your [Ipoh/Melaka/Klang] tour" → contact form with city pre-filled (use `?city=ipoh` query param if form supports it)
- No fake "Book Now" button

**Pattern C — dietary, no tour matches exactly (vegan, Jain):**
- Explain why we can accommodate (dietary briefing in advance, private tour format)
- CTA: "Let's plan your [vegan/Jain] tour" → custom enquiry

---

## What's been built vs what needs building

### Currently in `[slug].astro` (all 37 published tours use same template)
- Template renders as a standard tour detail page — **needs a branch for informational pages**
- Real tours: show booking widget, pricing, availability
- Informational pages: show guide content + routing CTAs (no booking widget)

### Needs building
- [ ] Differentiate `[slug].astro` template: real tour vs informational (flag in Directus, e.g. `is_bookable: true/false`)
- [ ] Ipoh, Melaka, Klang location pages in Directus (collection: `location-landing-pages`)
- [ ] Content for each informational page (see `agent_docs/project-plan.md` Phase 3D)
- [ ] CTA routing logic in the template using the matrix above

---

## Quick reference: which real tour covers which KL neighbourhoods

- **KL Street Food**: Chow Kit market, Chinatown/Petaling Street, Brickfields, Kampung Baru
- **Flavours of Malaysia**: broader multi-neighbourhood loop across KL
- **Secrets of KL**: Bukit Bintang nightlife, street art area — adults only

## Quick reference: which real tour covers which Penang neighbourhoods

- **Eat Drink George Town**: Georgetown heritage core, Little India (Lebuh Queen), Gurney Drive area
- **Penang Street Food**: Chowrasta market, hawker centres across Penang island
