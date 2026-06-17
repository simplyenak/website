# Simply Enak — Blog Writing Guide

## The goal

Our stories are the only content on the internet that nobody else can write. Not because we're clever — because we were there. Fourteen years of eating in the same places, knowing the same vendors by name, watching the same families hand stalls to their children. That's what goes in every post.

The test before publishing: would a food journalist who has never been to Malaysia find something in this post they couldn't find anywhere else? If yes, publish. If no, rewrite.

---

## Voice (from brand-voice.md, applied to long-form)

- Write as Maarten or Pauline — first person, named, with a point of view
- Every post should include at least one moment of being wrong, surprised, or corrected by a local
- Name the vendor. Name the dish. Name the street.
- Use "we" for shared experiences (tours), "I" for personal moments
- No introductions that could have been written by anyone ("Malaysia is famous for its street food...")
- No conclusion that summarises what you just said — end on an image or a moment

**Forbidden in blog posts** (same as site-wide): authentic, premium, luxury, discover, explore, immerse, journey, traditional (without story/date), unique, best, delicious (use flavour/texture/smell instead)

---

## Structure that works for SEO + readability

```
TL;DR (50–80 words) — answer the post's core question immediately
Introduction — a specific scene, not a general statement
H2: [core topic, answer-first]
  — 2–4 paragraphs, image here
H2: [secondary angle or contrast]
  — 2–4 paragraphs, image here
H2: [practical / what to do with this knowledge]
CTA — link to tour, not just "book now"
```

Aim for 800–1,200 words per post. Long enough to rank, short enough to read on a phone while hungry.

---

## Images — what we need and where they come from

### Per post
- **Hero image** — full-width, landscape, food or scene (not portrait). Upload to S3 bucket `se-website-images.s3.nl-ams.scw.cloud`, set URL in Directus → `hero_image` field.
- **2–3 inline images** — embed as `<img>` tags in the Directus content HTML field. Photos from tours, vendors, or specific dishes mentioned in the post.
- **Author photo** — set `author_photo` in Directus (one-time setup per author)

### File naming
All lowercase, hyphens, descriptive: `pak-din-satay-kampung-baru.jpg`, `teh-tarik-pour-mamak.jpg`

### Format and size
- WebP preferred, JPG acceptable
- Hero: max 800KB, min 1200px wide
- Inline: max 300KB, min 800px wide

### Where to get photos
1. Maarten/Pauline's own tour photos (phones/cameras) — strongest, most personal
2. Specific vendor photos (ask permission)
3. If no photo exists for a specific dish: shoot it on the next relevant tour

---

## Post-by-post assessment and what's needed

---

### 1. `understanding-mamak-culture`
**Current state:** Stub only (excerpt = content). No actual writing.

**What would make it unmissable:**
- Explain what "mamak" actually means — Tamil Muslim, not just "cheap Indian restaurant". The cultural position between Indian and Malay Malaysia.
- The 2am mamak visit — why Malaysians go after the clubs close, what they order, what they talk about
- Roti canai: the different folds mean different things (roti telur, roti bawang, roti pisang) — most tourists don't know you can order anything filled
- Teh tarik: the altitude of the pour is for aeration not performance — the higher the pour, the cooler and frothier the tea
- Football screening culture — mamaks are where Malaysia watches matches. Which mamaks show EPL?
- The unwritten rule: you can sit for four hours on one glass of teh tarik. Nobody will move you.

**Personal angle needed from Pauline/Maarten:**
- Which specific mamak do you go to when you want it done properly? Name it.
- A moment on tour when a guest misunderstood mamak culture — ordered something unexpected, or was surprised by the setting

**Images needed:**
- Teh tarik being pulled (action shot)
- Roti canai on the griddle
- A busy mamak at night (atmosphere)

**SEO target:** "mamak restaurant Malaysia", "what is mamak food", "mamak culture KL"

---

### 2. `satay-master-kampung-baru`
**Current state:** Stub only. Pak Din named, 40 years mentioned. Nothing else.

**What would make it unmissable:**
This is a vendor story — the strongest format Simply Enak has. It needs to read like a short portrait.

- Pak Din's full name and where exactly in Kampung Baru (which street, which market, what time he opens)
- The marinade: what's in it, what makes it different from the hotel satay tourists usually eat
- The charcoal: what wood, why it matters for flavour
- Cuts: does he use chicken, beef, mutton? What's his signature? Does he have the organ skewers (hati/perut) that disappear first?
- The ketupat and peanut sauce — does he make his own or buy?
- Has he trained anyone? Is there a family member who will continue?
- A moment during a tour with Pak Din — a guest reaction, a thing he said

**Critical question for Pauline:** Is Pak Din a real vendor you actually visit on tours? If yes, this is gold. If he's invented, we need to either replace with a real vendor or reframe as fiction clearly.

**Images needed:**
- Pak Din himself (with permission)
- Satay on the grill (flames, charcoal)
- Close-up of the skewer
- The Kampung Baru setting/street

**SEO target:** "Kampung Baru satay KL", "best satay Kuala Lumpur" (award context only)

---

### 3. `why-we-dont-do-tourist-food`
**Current state:** Stub only.

**What would make it unmissable:**
This is a brand positioning piece with real teeth. Strong SEO target ("tourist food Malaysia").

- Open with a specific example: a tourist restaurant vs where the staff of that hotel eat after their shift. Name both.
- The visual signs that a restaurant is aimed at tourists: laminated menus with photos, air conditioning blasting into the street, Western breakfast options, prices in USD alongside RM
- What tourists miss by eating in tourist areas: the morning wet market hawker breakfast that finishes by 9am, the lunch places that feed office workers and don't bother with dinner
- A tour moment: a guest who said "this looks too basic, are you sure it's clean?" and what they said an hour later
- The stall with no English sign that serves the best version of a dish in KL — name it

**Personal angle needed:**
- Maarten's own first experience of eating where locals eat vs tourist versions — was there a specific moment of realising the gap?
- A guest who pushed back on a place (looked dirty/basic/wrong) and then loved it

**Images needed:**
- A very plain-looking stall that serves something exceptional (shows the contrast)
- A tourist restaurant signage (generic) vs a local hawker (real)

**SEO target:** "tourist food Malaysia", "where to eat like a local KL", "avoiding tourist traps Malaysia"

---

### 4. `heritage-behind-malaysian-food`
**Current state:** Stub. Uses "discover" in excerpt (brand voice violation — fix on rewrite).

**What would make it unmissable:**
This is a history piece — needs specific dates and named dishes, not generic cultural overview.

- The Baba-Nyonya / Peranakan story: 15th century Chinese traders who settled in Melaka, married locally, created a cuisine that belongs entirely to the Straits. Dishes like laksa, otak-otak, kuih pie tee
- Indian influence: Tamil labourers on British rubber plantations brought banana leaf rice, roti canai, curry; Indian Muslim traders (Mamak) brought their own version
- The British colonial impact: they brought each ethnic group to different industries, which kept them separate and distinct — that's why Malaysian Chinese food is still so distinctly Chinese, not assimilated
- Why Malaysian food is not Indonesian food, not Thai food — specific border examples
- A dish that perfectly shows the fusion (e.g. nasi lemak: Malay dish with Chinese sambal ikan bilis and Indian-influenced curry additions)

**Personal angle:** What dish do you point to on tours as the perfect example of this history? What story do you tell about it?

**Images needed:**
- A heritage shophouse (Chinatown or Georgetown)
- A dish that shows the fusion (nasi lemak, or Nyonya kuih)
- Old photograph if available (colonial era hawker market)

**SEO target:** "history of Malaysian food", "Malaysian food culture", "why Malaysian food is unique" (use specific fact, not the word "unique")

---

### 5. `street-food-soul-malaysia`
**Current state:** Stub. Uses "discover" in excerpt (brand voice violation).

**What would make it unmissable:**
The title promises soul — the content needs to deliver emotion, not a list of hawker types.

- Open with a specific hawker scene: the chee cheong fun uncle at 6:30am who knows every regular's order before they sit down
- Why hawker culture exists: no family kitchen big enough in early KL shophouses, so cooking happened communally in the street
- The difference between hawker centre (organised, indoor or covered) and pasar malam (night market, rotating, neighbourhood)
- Why things taste different at a hawker stall than at a restaurant that "does" hawker food
- The declining generation: younger Malaysians not taking over parents' stalls. Name a specific stall on your tours where you've watched this play out.
- What happens to Malaysian food culture when the stalls close — the answer is uncomfortable and worth saying

**Personal angle:** A stall on one of your tours that you're genuinely worried about. The vendor who has no successor. A moment that made you think about what gets lost.

**Images needed:**
- A hawker stall in full operation (morning rush)
- The vendor behind the stall (portrait, with permission)
- The food itself — something simple but visually beautiful (char kway teow flame, roti canai on the griddle)

**SEO target:** "Malaysian street food culture", "hawker food Malaysia", "hawker centres KL"

---

### 6. `family-recipes-generations`
**Current state:** Almost empty stub (46 chars). No direction.

**Options — pick one before writing:**
A. Make it a specific vendor story (like Pak Din): a family that has been making the same dish for 3 or 4 generations, named, with the recipe change (or not)
B. Make it about a specific dish with a documented lineage (e.g. the Peranakan kuih at Moh Teng Pauh in Penang — who is behind it, how old the recipe is)
C. Make it Pauline's personal story — a dish from her family, how it connects to Malaysian food culture

Option C would be the strongest and most distinct post on the site if Pauline is willing to write or contribute it. Nothing ranks better than a personal story nobody else has.

**Personal angle required:** This post cannot be written without a real family/vendor story. Who is it about?

**Images needed:** Depends entirely on which direction is chosen. If vendor story: the vendor, the dish, the setting. If Pauline's story: her family photos would be extraordinary if available.

---

### 7. `11-foods-hari-raya`
**Current state:** Stub. Seasonal content — Hari Raya timing is key.

**What would make it unmissable:**
- The 11 dishes, in order of importance/centrality to the celebration: rendang, ketupat, lemang, dodol, kuih raya (biskut cornflakes, kuih tart, pineapple tarts), lontong, serunding, nasi minyak, satay, ayam percik
- For each: what it is in plain English, why it exists (the story or origin), when exactly it's eaten, and one sensory detail — not "delicious", but "the fat in the rendang has had 4 hours to render down so the sauce coats the meat like lacquer"
- The practical guide: when Hari Raya actually starts (depends on moon), how long the open-house period lasts (can be a month), what "open house" means for visitors
- Can tourists actually attend an open house? Yes — and Simply Enak can facilitate this on specific dates

**Personal angle:** Pauline's Hari Raya experience — her family's version of rendang vs the standard recipe. What dish does she make herself? What does she always eat first?

**Images needed:**
- Hari Raya spread (the full table)
- Each dish individually (can be stock photos for now, replace with own when possible)
- Kuih raya tins (the classic image)

**SEO target:** "Hari Raya food Malaysia", "what to eat Hari Raya", "Malaysian Eid food"

---

## Outstanding personal details needed before writing

The following can only come from Pauline and Maarten — no amount of research will substitute:

| Item | Needed for |
|------|-----------|
| Which mamak do you actually go to? Name + area | Post 1 |
| Is Pak Din real? If yes: full name, location, opening hours, what he grills | Post 2 |
| Maarten's first "tourist food vs local food" realisation — the specific moment | Post 3 |
| Which dish do you point to on tours as the best example of fusion history? | Post 4 |
| A stall on your tours you're genuinely worried about losing | Post 5 |
| Family recipe story — whose family, which dish, what makes it theirs | Post 6 |
| Pauline's Hari Raya personal details — her family's rendang, what she eats first | Post 7 |
| Vegetarian traps: lard in CKT? Belacan always in sambal? Roti canai safe? | Veg guide |
| Temple near KLCC: name/denomination, what food, what experience feels like | Veg guide |
| Vendor names for 5 signature tours (even 2–3 per tour) | Tour pages |
| Night markets: which neighbourhoods, which nights of the week | Tour pages |

---

## Launch priority for stories

Stories are indexed and visible at `/stories/`. Having 7 stub pages with 40–150 chars of "content" is an active SEO liability (thin content penalty risk).

**Before go-live, choose one:**

**Option A (recommended):** Write 3 posts properly, noindex the other 4 until ready
- Write: `why-we-dont-do-tourist-food`, `understanding-mamak-culture`, `satay-master-kampung-baru`
- Noindex: the other 4 (add `noindex` field to Directus and filter in stories listing page)
- Covers: brand positioning + vendor story + culture explainer — the three types you need

**Option B:** Noindex all 7, launch without stories, write properly over the first month post-launch
- Cleanest option if Pauline and Maarten don't have time before launch
- Stories listing page still shows, but links to "coming soon" cards

**Option C:** Write all 7 before launch
- Only if Pauline can sit down for 2–3 hours to answer the personal questions above
- Each post: ~1 hour of writing once the inputs are there

---

## Images — full status

| Story | Hero Image Status | Inline Images |
|-------|------------------|---------------|
| mamak-culture | S3 URL set, file not confirmed | None |
| satay-master | S3 URL set, file not confirmed | None |
| tourist-food | S3 URL set, file not confirmed | None |
| food-heritage | S3 URL set, file not confirmed | None |
| street-food-soul | S3 URL set, file not confirmed | None |
| family-recipes | S3 URL set, file not confirmed | None |
| hari-raya | S3 URL set, file not confirmed | None |

**Action required:** Verify whether any of these files actually exist on S3. If not, upload photos before launch or all story pages will show broken hero images.

```bash
# Check if files exist (run from terminal with AWS/Scaleway credentials):
curl -I https://se-website-images.s3.nl-ams.scw.cloud/mamak-culture-hero.jpg
```
