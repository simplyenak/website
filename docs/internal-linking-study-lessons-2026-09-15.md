# Internal Linking Study Lessons — Nex Gen AI video

Source: "You're Adding Internal Links Wrong (a $50,000 Test Proves It)" — Nex Gen AI YouTube, 11 Sept 2026 (transcript reviewed 2026-09-15).
Secondary source, tool-affiliate channel (Arvow) — treat claims as leads, not gospel. Three underlying claims: a ~$50k internal-link test by Digital Media Lab across 15 sites, a Google patent on predicting link choice, and Dan Petrovic's 2012 single-link test. None independently re-verified; the actionable core is standard white-hat practice regardless.

## Lessons and evidence quality

### 1. Link dilution is not a real constraint (moderate confidence)
- $50k test: adding 20+ internal links to pages caused **no ranking drop**; also fewer pages went "missing" in Google.
- Petrovic 2012: a page with 4,225 outgoing links moved a target site #79 → #3 with one link.

**Implication:** our "85% decay principle" describes per-HOP depth decay, not a per-page link budget. Ration hops (money pages ≤2 clicks from backlinked hubs), never ration links.

### 2. Earlier links in a page's link order may carry more weight (low-moderate confidence)
- "Earlier" ≠ first paragraph. Order among the page's links mattered, not physical top-of-page placement.
- Don't force links into the first sentence; the highest-value link should come earliest among the links you do have.

### 3. Google may predict which links users will choose (plausible, patent-based)
- Patent describes guessing link choice from anchor words, position on page, topic, and past clicks. Links a reader can see and would plausibly click count more than hidden/footer-stuffed ones ("doors" metaphor: easy-to-spot door that leads where you want to go).

### 4. Link clicks correlated with better rankings (correlation only)
- More clicks on a link appeared alongside better rankings for the target. Explicitly NOT proven causal. Use GA4 link clicks as a rewrite signal: re-anchor or re-place links nobody clicks.

### 5. The checklist (fully aligned with our content mandate)
1. **Match the topic** — connect pages that answer related questions; judge by what each page is about, not its category name.
2. **Put it where it helps** — place the link where the reader needs the next answer, not forced into the first sentence.
3. **Check the path** — link works; destination delivers what the anchor text promises.
4. **Learn from readers** — watch which links get used; test clearer anchor words or a better spot.
5. **Ranking changes are clues, not proof.**

## Where this landed in our processes

- [DONE] `skills/seo/seo-daily-workflow-by-site-stage` — Stage 2 internal-linking tactic extended with placement rules.
- [DONE] `skills/seo-crawl-depth-analysis` — 85% decay section now distinguishes hop decay from link count.
- [DONE] `skills/content-judge-loop` — tier-1 check 4 min-links fixed to 2 (matches eval gate); judge advisory guidance for useful next-step links.
- [DONE] `skills/simplyenak/site-optimization` — link-audit section: how to apply recommendations (placement, order, anchor promise, GA4 click check).
- [DONE] `scripts/link-audit.py` — generated reports now carry the placement rules header.

## Explicitly NOT adopted
- Arvow tooling / auto-embedded AI internal links. Our links are editorially placed; the content mandate (survive the next Google update, reproducibility test) rules out bulk auto-linking.
- "4,000 links is fine" as license for link farms. No-penalty ≠ value; every link still needs a useful job (checklist item 1).
