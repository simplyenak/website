# GBP + Homepage Teardown Audit (video-4 checklist applied to Simply Enak)

Video method: pull apart the map-pack winner vs losers — reviews vs review responses, category choice, title tag, H1, homepage structure, photos, social proof placement, specifics vs platitudes. Applied to Simply Enak 2026-09-08. All checks below are from live fetch of simplyenak.com plus the Aug 8 GBP setup record.

## Website (verified live)

| Check | Status | Detail |
|---|---|---|
| Title tag: primary category + city | PASS | `Food Tours Kuala Lumpur, Penang & Ipoh — Simply Enak` |
| H1: category + cities | PASS | `Malaysian Food Tours in KL, Ipoh & Penang As Only Locals Know It` |
| Meta description present | PASS | present + og:description (an earlier "missing" reading was my regex error, attribute order) |
| Specifics over platitudes | PASS | `5,000+ guests since 2011`, named stalls, real track record page |
| Social proof high on page | PASS | 6 real reviews + Review schema built on homepage; booking CTA above them |
| No autoplay / animated hero | PASS | none |
| Favicon | PASS | present |
| Site size | PASS | ~100 pages/locale, 9 locales; service + neighborhood pages exist per category (structure matches GBP model) |
| Em-dash in title tag | FLAG | brand rule bans em-dashes; title tag uses one. Cosmetic + brand consistency, SEO-neutral. Maarten's call. |

Website needs nothing urgent from this video. The law-firm sins (title "Home", platitude H1, buried testimonials) are all things we already do right.

## GBP (from Aug 8 setup record; live data not machine-verifiable today)

| Check | Status | Detail |
|---|---|---|
| Primary category | SET, VERIFY | `Sightseeing tour agency` since Aug 8. Video rule: most specific category wins. Verify in dashboard whether a more specific category exists (e.g. Tour operator / food-specific); do not change without checking what ranks in our pack. |
| Photos | PENDING, BAR RAISED | Setup planned 10-15. Video benchmark for competitive packs: 30-40 real photos (guides, guests eating, stalls, neighborhoods) + regular photo posts. We have the image library (~/SimplyEnak-Images/). |
| Review responses | POLICY | Respond to every review, especially negative. Cannot verify current Google response state without GBP access (Maps scrape blocked). Manual 5-min check in dashboard. |
| Review generation | PENDING | Short link in post-tour WhatsApp flow (from Aug 8 plan). NEW ammo: Google now allows custom display names on reviews (verified 2026-09-08) — guests who don't want their name public can review under a nickname. Lowers friction; mention it when asking. |
| Q&A seeding | PENDING | 8-10 questions with owner answers (from Aug 8 plan). |
| Post cadence | PENDING | 2 posts/week per posts-calendar.md. |
| 24-hour listing | N/A | Deliberately not copying: tours are a daytime product; listing 24h with voicemail = unanswered calls, which the video itself says hurts. |
| Penang/Melaka separate GBP | PENDING | from Aug 8 plan |

## What the video gets wrong or oversells

- "Change title tag, move 5-10 positions in a week" — overconfident. Title relevance matters when it's badly wrong ("Home"); the magnitude is market-dependent marketing talk.
- Review count as minor factor — half-true. Count, recency, response rate, and keyword-in-review all matter; a 114-review firm ranking #4 proves other factors dominate, not that reviews don't matter.
- GBP live data (photos, responses) couldn't be scraped via Maps this session; dashboard check is 10 minutes of manual work.

## Actions

1. Maarten, dashboard (10 min): confirm category options, count photos, check review-response coverage. Photo target: 30-40 from ~/SimplyEnak-Images/.
2. Add Google review short link + "nickname is fine" line to post-tour WhatsApp flow.
3. Optional: em-dash swap in title tag for brand consistency.
