# Google Stitch Prompt — Simply Enak Landing Page Redesign

## How to use this

1. Open Google Stitch (labs.google/stitch) in **Experimental mode** (the toggle in the top-right corner)
2. Take a screenshot of the current homepage at `staging.simplyenak.com`
3. Upload the screenshot to Stitch
4. Paste the prompt below into the text field
5. In Experimental mode, you can circle/annotate the hero on the screenshot — circle it and label it "LOCKED — do not change"

---

## The Prompt

```
I'm redesigning the landing page for Simply Enak, a small Malaysian food tour operator founded in 2011. Two founders — Pauline (Malaysian) and Maarten (Dutch). They personally guide guests to hawker stalls, mamak restaurants, and family-run food spots in Kuala Lumpur and Penang. Max 9 guests per tour.

DESIGN SYSTEM TO PRESERVE:
- Colors: deep red #b52d38 (CTA buttons only), warm amber #ffa333 (accent, eyebrows, star ratings), near-black #1a1a1a and #0f0e0e (dark sections), cream #f9f6f2 (light sections)
- Fonts: Merriweather serif for all headings (editorial, dignified), PT Sans for body text
- Texture: subtle dot-grid overlays on dark sections (radial-gradient at 28px spacing)
- Buttons: uppercase, small border-radius, red (#b52d38) for primary actions
- Orange is the warmth signal — use it only for eyebrow labels, accents, and highlights, never for backgrounds

⚠️ SECTION LOCKED — DO NOT CHANGE:
The HERO SECTION is locked and must be reproduced exactly as shown in the screenshot. It contains:
- Full-bleed food photography background
- Dark gradient overlay (darker at top and very dark at bottom)
- Dot-grid texture overlay
- Circular "Est. 2011" badge with orange border
- Orange uppercase eyebrow: "FOOD TOURS · KL · PENANG · IPOH"
- Two-line H1 in Merriweather bold with an orange highlighted word strip (slightly rotated -0.7 degrees, black text on orange background)
- Merriweather italic subtitle in light gray
- Frosted glass proof bar: Google 4.9 ★★★★★ | TripAdvisor Travellers' Choice | 5,000+ Happy Guests
- Two CTA buttons: solid red "See Our Tours" + ghost border "How It Works"
- Animated scroll-cue chevron at bottom
Do not move, resize, recolor, or rewrite any element in the hero. This section is validated and final.

SECTIONS TO IMPROVE (everything below the hero):

1. MANIFESTO SECTION (dark split layout)
   Currently: text on left, placeholder portrait on right (will be replaced with real founder photo)
   Improve: Make the dark near-black background feel richer — subtle warm texture, a hint of grain or vignette. The split between text and photo should feel more intentional. The large ghost quotation mark (huge Merriweather " at low opacity) should remain. Consider a decorative element that connects the text and portrait visually without covering either.

2. THREE PILLARS (People · Food · Place)
   Currently: three equal text columns on dark background — feels sparse
   Improve: Give each pillar more visual weight. Could use a thin amber rule above each heading, or a very subtle background differentiation per column. On mobile, the three pillars should stack with clear breathing room between each.

3. VENDOR CARDS (Meet the People)
   Currently: standard portrait cards on cream background
   Improve: Make the people feel more present. Larger face crops, warmer card background. Consider a subtle border or corner accent in orange. The vendor name should feel like a person, not a product.

4. TOUR CARDS GRID
   Currently: responsive grid, 1→2→3 columns — looks good but tablet (768px–1023px) shows 2 stretched columns at awkward proportions
   Improve: Fix the tablet breakpoint — at md (768px) show 2 columns with correct gutters. Make the price and duration information visually distinct from the description — perhaps a colored or bordered stat strip below the image. Featured tours should have a clearly visible "Featured" badge.

5. TESTIMONIALS
   Currently: review cards that are hard to distinguish from body text at a glance
   Improve: Make the guest name and country more prominent. The review title should read like a headline (bolder, slightly larger). Quote marks should be visually decorative — large, low-opacity, background element. Avatar fallback should be a clean initial-based avatar (orange background, white initial) rather than a broken image.

6. FAQ ACCORDION
   Currently: functional but visually plain
   Improve: Slight visual polish — add a thin amber left border on the open/active question. Chevron should be the amber accent color.

7. BOTTOM CTA SECTION
   Currently: solid dark or red background
   Improve: The final CTA should feel warm and inviting, not hard-sell. Consider a dark-with-texture approach similar to the manifesto, with the WhatsApp button in green and the booking button in red. Trust signals (free cancellation, 24hr reply, max 9 people) should be immediately visible as icon + text pairs.

BRAND FEEL TO MAINTAIN:
The brand has alternating rhythm: dark sections (hero, manifesto, values) and light cream sections (tours, testimonials, stories). This rhythm creates breathing room. Keep this alternation.

The brand is NOT: luxury, corporate, polished tech startup, travel agency.
The brand IS: a knowledgeable friend, food-obsessed, culturally curious, human-scale.

Every improvement should make the page feel MORE like a personal invitation and LESS like a booking platform.

Output: a full responsive landing page HTML with the hero reproduced exactly and all sections below improved. Use CSS variables for all colors. Merriweather from Google Fonts. Mobile-first, test at 375px, 768px, 1280px.
```

---

## Tips for getting the best result from Stitch

- **Use Experimental mode** — it accepts screenshot input, which is the most reliable way to lock the hero
- **Annotate the screenshot** — circle the hero section and write "LOCKED" so Stitch can visually understand the constraint
- **One section at a time** — if the first output changes the hero, try running it again with just one section at a time. Prompt: "Redesign only the Testimonials section" with the rest locked
- **Paste DESIGN.md as context** — before the prompt, paste the contents of `DESIGN.md` as background context, then follow with this prompt
- **If it changes the hero anyway** — try leading the prompt with: "The HERO SECTION in this screenshot is production-ready and must not be modified in any way. Your task begins below the hero."
- **Standard mode** (without screenshots) — works on text description alone; the hero description above is detailed enough that Standard mode usually preserves it

---

## Quick single-section prompts

Use these if you want to iterate on one section at a time:

**Testimonials only:**
```
Redesign only the testimonials section of a Malaysian food tour website. Keep the cream #f9f6f2 background. Guest reviews with name, country, star rating, review title (bold), review body (normal weight). Large decorative low-opacity quotation marks as background element. If no avatar photo, show a circle with the guest's initial on an amber #ffa333 background. Font: Merriweather for review title, PT Sans for body.
```

**Tour cards only:**
```
Redesign a tour cards grid for a Malaysian food tour website. Cream #f9f6f2 background. Each card: full-width hero image top, tour name (Merriweather serif bold), location badge (dark), duration, price "from MYR 285" (prominent), one CTA button in #b52d38 red labeled "Join This Tour". 1 column mobile, 2 columns at 768px, 3 columns at 1024px. Featured card gets amber #ffa333 "Featured" badge top-right.
```

**Bottom CTA only:**
```
Design a final CTA section for a small Malaysian food tour company. Dark near-black #0f0e0e background with subtle dot-grid texture. Warm amber #ffa333 eyebrow text. Large Merriweather serif headline. Two buttons side by side: WhatsApp (green #25D366) and Book Now (#b52d38 red). Below buttons: three trust signals as icon + text: "Free cancellation", "Usually replies within 24hrs", "Max 9 guests per tour". Feels warm and personal, not corporate.
```
