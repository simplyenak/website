# Mentions Audit — Follow-ups (2026-08-05)

First-pass audit of how "Simply Enak" is described across the web, done 2026-08-05
(DuckDuckGo exact-phrase search, 10 results). Source context: Mike King podcast lessons
(`docs/mike-king-podcast-lessons-2026-08-05.md`, Part 2.1 + action item 4).

Goal: citation accuracy + entity consistency — Google and AI systems build the brand
entity from what is SAID about us across the web. Fix what we control, monitor the rest.

---

## Priority 1 — Entity collisions (monitor, do not touch)

Two unrelated businesses named "Simply Enak" exist. They fragment the entity Google/AI
builds for our brand. We take no action against them (blue ocean, ethical) — we
disambiguate on our side.

- [ ] **Restaurant in Kangar Jaya, Perlis (Malaysia!)** — "Simply Enak" Indo-Asian dining.
      facebook.com/profile.php?id=61590478362553
      Same country as us = highest confusion risk for Google Knowledge Graph / local pack.
- [ ] **Indonesian site** — simplyenakindo.com ("Indonesian recipes" blog/restaurant).
      Outside Malaysia; lower risk, still a name collision in AI training data.

Mitigation on our side (both items):
- [ ] Pair "Simply Enak" with "Food Tours / Food Experiences" + "KL & Penang" in every
      listing, meta, GBP, and directory we control.
- [ ] Check Google Knowledge Panel: does it show OUR business (tours, since 2011) and not
      the restaurant? Log current state, re-check monthly.

## Priority 2 — Stale / off-brand third-party citations (we can request updates)

- [x] **wonderfulmalaysia.com** — attractions/simply-enak-food-experiences.htm
      Verified still live 2026-08-15: "off the beaten track" tour name appears 3x
      (typo "aweseom" no longer present — was already fixed or removed).
      Corrected copy drafted below (P2 drafts section). Action: submit via their form.
- [x] **goKL.my** — simply-enak-food-experiences/
      Verified still live 2026-08-15: "authentic" appears 2x (banned word).
      Corrected copy drafted below. Action: submit via their form.

## Priority 3 — Our own listings to check/fix

- [ ] **TripAdvisor** (Attraction_Review-g298570-d2414763) — description snippet shows
      "We're not..." phrasing; brand voice says sell presence, never absence.
      Check the full description in the TA business dashboard; rewrite if needed.
      (2026-08-15: public page is bot-blocked; needs dashboard access. Suggested
      rewrite in P3 section below.)
- [ ] **Facebook tagline drift** — "The Truly Malaysian Food Experience" vs current
      positioning ("Malaysian food tours in KL and Penang, since 2011").
      Decide if the tagline should be updated to match; keep whatever we choose
      consistent across FB/IG/GBP.
- [ ] **Instagram bio** — currently consistent ("Since 2011, Food & Travel Experiences");
      no action unless the FB tagline change cascades.

## Priority 4 — Deeper audit (extend coverage)

- [ ] Repeat the exact-phrase search on Bing, Google News, and blogs (DuckDuckGo only
      so far). Look for: wrong descriptions, old tour names, wrong location, mixed brand.
- [x] Add a monthly "citation accuracy" check to the SEO cadence (the 3-bucket
      measurement framework, Part 6 of the lessons doc, bucket 2).
      DONE 2026-08-15: cron "Mentions & Citation Accuracy Audit" (monthly, 1st 09:30).

---

## P2 drafts — corrected copy for third-party webforms (2026-08-15)

Both sites have contact/update forms. Message template below; paste into their form,
fill in their required fields. Keep the tour link current: https://simplyenak.com/tours/flavours-of-malaysia

### wonderfulmalaysia.com

> Hi, thanks for featuring Simply Enak Food Experiences.
> Small correction request for this page: the tour you mention as "off the beaten
> track" was renamed. It is now called **Flavours of Malaysia** (a walk through KL's
> markets and heritage food spots, led by local guides who grew up eating here).
> Would you mind updating the name and link to https://simplyenak.com/tours/flavours-of-malaysia ?
> Current description line we suggest: "Small-group Malaysian food tours in Kuala Lumpur
> and Penang since 2011. Walk through neighbourhood markets and family-run stalls with
> local guides, tasting the dishes locals actually eat."
> Happy to answer anything else. Thank you!

### goKL.my

> Hi, thanks for listing Simply Enak – Food Experiences in your directory.
> We noticed the description uses wording we have moved away from. Could you update it
> with this text (it reflects how we describe ourselves now):
> "Small-group Malaysian food tours in Kuala Lumpur and Penang, led by local guides who
> grew up eating here. Since 2011 we have walked guests through neighbourhood markets and
> family-run stalls — market culture, street food, and the stories behind each dish.
> Small groups (max 9), no tourist restaurants."
> URL to link: https://simplyenak.com (tours: https://simplyenak.com/tours)
> Thank you very much!

## P3 draft — TripAdvisor description rewrite (needs TA dashboard login)

Replace the "We're not..." opening with a presence-led version. Suggested:

> Small-group Malaysian food tours in Kuala Lumpur and Penang, led by local guides
> who grew up eating here. Since 2011, we have walked with guests through neighbourhood
> markets and family-run stalls, sharing the stories behind every dish. Small groups
> (max 9 guests), no tourist restaurants, and plenty of time for questions.

## P3 note — Facebook tagline

Current: "The Truly Malaysian Food Experience"
Suggested (match site + IG + GBP): "Malaysian food tours in KL and Penang, since 2011"
Decision: Maarten's call; keep consistent across FB/IG/GBP once chosen.

---

## Context — findings considered CONSISTENT (no action)

- simplyenak.com (own), /ms/ (own), culinarytravelexperts.com/about/simply-enak
  ("15+ years" — since 2011 = correct for 2026)
- TripAdvisor "Since 2011" description (except the "We're not..." phrasing above)
- Instagram profile
