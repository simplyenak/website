# Mike King (iPullRank) — All Lessons for Simply Enak & CTE

Source: Podcast episode 1,127 with Mike King (iPullRank), Aug 2026.
Topic: Google API leak aftermath, mentions vs links, AI search (GEO), query fanouts, the 499 fix, Common Crawl, relevance engineering.
Date distilled: 2026-08-05.

This document captures EVERY lesson from the episode and maps each one to a concrete action for simplyenak.com (B2C) and culinarytravelexperts.com (B2B). Quick actions are flagged [WEEK], [MONTH], [STRATEGIC].

---

## Part 1 — How Google actually works (the leak view)

### 1.1 The index is stratified into buckets, not one database
Google splits the index into four buckets: high (memory), medium (SSD), low (slowest storage, most of the web), and fresh docs. Pages in higher buckets pass MORE link equity; a page on page 52 of results passes almost none.

- **The proxy for your bucket**: does the page rank and get traffic? That's it. Domain Authority / Domain Rating are "entertainment metrics" — Google has its own site-authority concept and the third-party scores don't matter to it.
- **The sliding link-equity scale is real**: "every page can pass the same value" was always false. Your bucket caps the value you can pass.

**What this means for us:**
- [STRATEGIC] External link targets must be chosen by TRAFFIC and RANKINGS, not DA. A site that ranks and gets traffic passes real equity; a high-DA but dead site passes almost nothing. Add a "does this site get traffic / rank for its own keywords" filter to any link-building target list (e.g. the press-release strategy and linkable-stunt targets).
- [VALIDATED] Our colony strategy (internal links from our own ranking pages to strategic tour pages) is exactly right: our pages in the high bucket (Penang Street Food at 1.5, KL Street Food at 2.1, Tours at 1.8) pass far more equity than pages we own that don't rank. Keep prioritizing links from pages that already rank.

### 1.2 Vector embeddings are everywhere
Google embeds pages, passages, sections of sites, whole sites, authors, and entities in multi-dimensional space. Relevance = physical distance between the query embedding and the content embedding. The link graph matters LESS than the embedding graph.

**What this means for us:**
- [VALIDATED] Semantic coverage beats exact-match keyword targeting. A page about "Kuala Lumpur street food" must sit close to the query "what to eat in KL" in embedding space — which means covering the related vocabulary, dishes, neighborhoods, and questions, not just repeating the keyword. Our comprehensive colony guides and the judge-loop's semantic variation checks already push this way.
- [MONTH] When writing new content, include the words and concepts a searcher would use even if they never appear in a keyword tool: dish names, street names, dietary terms, sensory descriptors, time references ("lunch", "night market"). This is what pulls the embedding closer. The attribute-matching gate in `eval/content-eval-runner.py` already enforces part of this; extend it to neighborhood and dish vocabularies.

### 1.3 Twiddlers / boosts
Post-scoring adjustments ("if it has feature X, boost/demote ±50") exist; Panda started as one before being folded into core. Not directly actionable, but explains why a page can rank "against the math" — don't chase the algorithm, chase the underlying signals.

---

## Part 2 — Mentions matter more than links

### 2.1 The core insight
Google builds its understanding of your entity from what is SAID about you across the web. Mentions across many independent pages create consistency and context. Heavy mentioning can overpower the link graph because it's seen in so many places. The link graph still works (links from topic-relevant sites can teach Google a new association), but mention volume is often the stronger signal.

- Mentions don't need to be on high-DA sites. A mention on a page Google trusts about your topic carries entity context.
- The entity needs CONSISTENCY: what is said about you must be coherent (same name, same description, same positioning). Mixed messaging fragments the entity.

**What this means for us:**
- [VALIDATED] Entity-seo skill: brand consistency across platforms (same "Simply Enak" name, same description, same logo) is not vanity — it's the raw material Google uses to build our entity. Keep NAP and description consistent across GBP, Instagram, Facebook, TripAdvisor, and press.
- [IN PROGRESS] The press-release strategy (`.hermes/plans/press-release-strategy.md`) is our mentions engine. Push it: every press mention adds a context data point about us.
- [WEEK] Audit existing mentions: search for "Simply Enak" across the web (Google, Bing, TripAdvisor, blogs, food guides). Fix anything that describes us inconsistently or wrongly. Citation accuracy is a named measurement input (see Part 6).
- [STRATEGIC] Build a linkable asset that earns mentions, not just links: e.g. a "Malaysian street food price index 2026" or a durian-season data report. Journalists write about data; the mentions come with the coverage. This is the "make friends or make news" principle: everything else is manipulation of the web.

### 2.2 How to earn mentions (tactics from the episode)
- **Make friends or make news.** Paid links, guest-post spam, comment spam = "low-vibration work", dead.
- **Sponsor events.** Cheap, gets press mentions, event newsletter + social mentions, referral traffic. For us: food festivals, Ramadan bazaars coverage, Penang International Food Festival adjacent events, university/corporate events for CTE.
- **Linkable assets / viral stunts.** The thing people share and journalists write about.
- **For a one-man brand**: consistently make something interesting that resonates. The content itself is the mention magnet.

---

## Part 3 — AI search is not just SEO

### 3.1 The landscape
ChatGPT does not just use Bing: it uses Google, Exa, SerpAPI, and more, and you can see the sources in its responses. Claude uses Brave exclusively (its query fanouts are near non-deterministic). Gemini has its own pipeline. So "optimize for Bing" is a tactical dead end; the strategic response is **surface area**: more content across more of the subject matter, across your whole ecosystem (website, YouTube, LinkedIn, Reddit, earned media), so it performs everywhere.

**What this means for us:**
- [MONTH] Stop thinking "Google strategy vs Bing strategy vs AI strategy". One strategy: comprehensive content, distributed across platforms, consistent entity. Our multi-search-engine reporting (GSC + Bing) already moves this way; extend the mental model to AI platforms.
- [DONE — verified 2026-08-05] **Add llms.txt to both sites.** Claude/Brave uses it heavily. Already live: simplyenak.com/llms.txt (7.9KB, tours + prices + dietary info) and culinarytravelexperts.com/llms.txt (498B). agents.txt + agents.json also live (agent-discovery-layer work). Maintenance item: keep llms.txt in sync when tours/prices change.

### 3.2 Query fanouts are the new keyword
AI systems break a prompt into a series of sub-queries (the fanout), pull documents for each, compare passages side by side, and feed the winners to the language model. There is an agentic pipeline with a "critic" at each stage: which queries to run, which documents to fetch, which passages to keep. You have no visibility into those judgments.

- Fanouts change slightly between runs but not dramatically. Don't chase them.
- **Optimize for the fanout, not the prompt**: make sure your content answers the sub-questions, because the system searches for those, not your exact prompt.
- **Comprehensiveness wins**: the more sub-queries you cover, the more chances your content survives the pipeline. This is "ultimate guides" logic, now with a mechanical reason.
- Audience-driven research: the fanouts are reactive to what audiences ask. Research from your audience's questions (GSC query data is a gift here — we already do this).

**How to see a fanout yourself (devtools trick):**
1. Open ChatGPT in a browser, right-click → Inspect, go to the Network tab.
2. Ask a question ("What time does the Empire State Building open?").
3. Find the `conversation` requests in the Network tab (the data streams).
4. Look for `search` entries: they show the terms, the source, and the type of source (search engine used, tools used).
5. Note it's probabilistic: may differ every run. Tools like Profound run prompts multiple times a day and average the fanout over time.

**Tools mentioned:** Qoria (open-source query-fanout research tool, first of its kind, from Mike King), Profound (commercial AI-search visibility monitoring). iPullRank also open-sourced a pipeline-replication method (blog post) that shows at which RAG stage your content falls out versus competitors.

**What this means for us:**
- [MONTH] Add a query-fanout research pass for our 5 strategic queries (e.g. "kuala lumpur food tour", "penang street food tour", "vegetarian food tour kuala lumpur", "best food in malaysia", "malaysia food tour"): run each in ChatGPT + Perplexity + Claude, record the fanout sub-queries, and check our coverage of each sub-query. Gap = content brief. Can be scripted into the existing research pipeline (see `scripts/geo_audit.py` in the seo-agent skill for the AI-readiness baseline).
- [VALIDATED] Our colony and ultimate-guide strategy IS fanout coverage. E.g. the durian colony covers "durian season in malaysia", "how to pick durian", "durian season malaysia" — each a likely fanout branch of "when is durian season". Extend the same pattern to KL and Penang colonies.
- [MONTH] Set a baseline of AI visibility now: how often does Simply Enak appear (named, with URL) in ChatGPT/Perplexity answers for our top 10 queries? Then re-measure monthly. This becomes our AI-search KPI.

### 3.3 AI traffic is a branding channel, not a performance channel
AI platforms drive traffic that is a rounding error for most sites, but it converts better. C-suite buyers treat it as visibility, not direct sales. Don't expect (or promise) direct bookings from AI search; expect share-of-voice and recommendation presence.

**What this means for us:**
- [STRATEGIC] In CTE B2B proposals and our own planning, frame AI-search work as visibility/branding with a conversion bonus, not as a bookings channel. Set expectations accordingly.

---

## Part 4 — The 499 fix (the single biggest actionable lesson)

### 4.1 What a 499 is
499 is not a standard HTTP code. It was invented by nginx and adopted by most CDNs: it means **the client gave up because the request took too long**. In practice: your site is too slow for the requester.

- ChatGPT does NOT use an index — it **requests pages in real time** during the query fanout. A slow page = 499 = that content never enters the pipeline.
- Mike King found a client with tons of 499s in the log files. Fixing one thing (caching at the edge so there's no timeout) improved AI visibility **~300% in 3 months**.
- User-facing speed is not bot speed: SPAs feel fast to humans (progressive render) but bots don't render the page at all. The metric that matters for AI is **time to first byte (TTFB)**.
- He says: fix page speed, look at log files for 499s, and you'll see improvements "in 30 days or less".

**What this means for us — [WEEK] do this now:**
1. Check whether 499s exist on simplyenak.com:
   - Cloudflare dashboard → Analytics → HTTP requests → filter status code 499 (or HTTP 3xx/4xx/5xx breakdown by status).
   - Or via Cloudflare GraphQL/Logpull API: zone-level `httpRequests1dGroups` filtered by `status = 499`. (Logpull must be enabled on the zone.)
2. Measure TTFB per key page:
   ```bash
   curl -o /dev/null -s -w 'ttfb: %{time_starttransfer}s | total: %{time_total}s\n' https://simplyenak.com/
   curl -o /dev/null -s -w 'ttfb: %{time_starttransfer}s\n' https://simplyenak.com/tours/
   ```
   Run a few times; watch the CDN-cached vs uncached difference (Cloudflare `cf-cache-status` header tells you).
3. Fix the slow path:
   - Our site is static Astro on Cloudflare Pages, so HTML is cacheable. Ensure the Worker sets cacheable headers on HTML (e.g. `s-maxage`) or uses the Cache API for HTML responses, so edge timeouts disappear. The Worker already short-circuits static assets; extend the same thinking to HTML.
   - Verify no uncached dynamic path (Payload live lookups at request time) creates slow responses for bots. The `?lang=` and locale variants must also be cached or fast.
4. Re-check after deploy: 499 count should drop to ~0 and TTFB should be well under 1s (target: sub-500ms from edge).

**Verification results (2026-08-05):**
- Historical 499 counts are NOT retrievable with current API tokens: zone-level HTTP analytics nodes are absent from the READONLY token's GraphQL schema, the classic Zone Analytics API requires user-owned credentials (we have account-owned tokens), Logpull is 403 (not enabled), and the MANAGE token is denied on account-level `httpRequests1dGroups`.
- The Worker (deployed, byte-identical to repo) already sets `cache-control: public, s-maxage=300, max-age=0, must-revalidate` on all HTML for requests with `Accept: text/html`. BUT Cloudflare does NOT actually serve these from edge cache: no `cf-cache-status` header on repeat requests. The s-maxage is aspirational — every HTML request still goes Worker → Pages origin.
- Measured TTFB (KUL/SIN edge, 2026-08-05): homepage 0.23-1.09s, /tours/ 0.13-0.62s, /stories/eating-durians/ 0.32-1.43s, /ms/ 0.18-0.97s (one transient >3s timeout), /zh/ 0.45-4.28s (one transient 4.3s). Cold origin responses are slow and variable — exactly the failure mode that produces 499s.
- **Real fix — PARTIAL (2026-08-05)**: the Worker now sends `cf: {cacheEverything: true, cacheTtl: 300}` on origin subrequests + s-maxage=300 on HTML. **Verified via a throwaway diagnostic worker: this is a NO-OP on the free zone** (subrequest cf-cache-status stays "none" forever; the free plan does not edge-cache HTML by any Worker-side mechanism — Cache API throws 1101, cf options are silently ignored). Site health is good regardless (18/18 OK, TTFB stable 0.19-0.33s), but the spikes are only reduced by origin stability, not caching.
- **The actual fix needs 30 seconds in the dashboard** (no API token has Zone Settings Edit): Cloudflare → Caching → Cache Rules → Create: expression `(http.host eq "simplyenak.com" or http.host eq "www.simplyenak.com") and not starts_with(http.request.uri.path, "/api/")`, action Cache Everything with Edge TTL 5 min (or a "Cache Everything" Page Rule, free plan allows 3). After that, HTML is served from edge, 499 risk disappears, and the Worker's s-maxage drives the TTL. The cf.cacheTtl options are kept as harmless best-effort (they engage automatically once a Cache Rule/upgrade exists).
- **Ops lessons**: (1) manual Worker deploys get CLOBBERED by the next CI run (deploy-site.yml deploys the Worker from the repo) — commit + push first, CI is the only permanent deploy path. (2) Worker deploys propagate over ~1-2 minutes; verify AFTER propagation or you'll see stale-instance 500s and misdiagnose.
- Lesson learned while testing: plain `curl` sends `Accept: */*`, which hits the Worker's non-HTML fast path (line 157) — always test with `-H "Accept: text/html"` to simulate real bots.

This is the closest thing to a guaranteed win in the whole episode. It's also a differentiator: most local competitors don't know 499s exist.

---

## Part 5 — Training data (Common Crawl)

### 5.1 Getting into the training data
Common Crawl is one of the biggest sources used to train AI models. Strategy: assess your presence in Common Crawl (how many pages, how often crawled); if thin, create more **crawl paths from pages that are already in Common Crawl** — e.g. link drops on Wikipedia, links from pages known to be in the crawl.

**What this means for us — [WEEK]:**
1. Check our presence:
   ```bash
   # Get the latest crawl index id
   curl -s https://index.commoncrawl.org/collinfo.json | jq -r '.[0].id'
   # Then query it for our domains
   curl -s "https://index.commoncrawl.org/CC-MAIN-<ID>-index?url=simplyenak.com&output=json" | head
   curl -s "https://index.commoncrawl.org/CC-MAIN-<ID>-index?url=culinarytravelexperts.com&output=json" | head
   ```
   Count how many of our pages appear. Compare to a ranking competitor.
2. If thin: get a Wikipedia link (an article or citation on a relevant page like "Malaysian cuisine", "Durian", "Kuala Lumpur", "Penang") — Wikipedia pages are crawl-path gold. Also prioritize links from sites known to be in Common Crawl (most big travel publishers are).
3. [STRATEGIC] Add Common Crawl presence to the quarterly SEO review checklist.

**We will NOT do:** the "millions of AI mentions" spam services, microsites, or cloaking. Mike King himself flags these as the old black-hat tactics coming back (white-on-white text "works again" because AI platforms don't render, but that's manipulation and against our blue-ocean, ethical position). See the ethics section.

---

## Part 6 — Measurement framework (the C-suite lesson)

### 6.1 Three buckets, all must be measured
1. **Performance measurement** (what it always was): referral traffic, what it does on-site (conversions, bookings, engagement).
2. **Brand visibility / channel measurement**: visibility in search + AI answers, **citation rate**, **citation accuracy** (big one — are mentions correct and consistent?).
3. **Input metrics** (what you can actually affect): bot activity, rankings for synthetic queries, passage relevance scores, entity salience, NLP metrics. Adjust these, watch the cascade into bucket 1.

**What this means for us:**
- [MONTH] Extend the weekly report (GSC + Bing) with an AI-visibility bucket: citation rate (mentions per week), citation accuracy (audit found wrong descriptions), synthetic-query rankings (does our content rank in the fanout sub-queries we identified in Part 3.2), and bot activity from Cloudflare analytics.
- [MONTH] Track input metrics on a monthly cadence and correlate with GSC/AI visibility after the fact: the assumption-validator infrastructure already exists for this pattern. Example assumption: "fixing 499s improves AI visibility 30-90 days later".
- The bucket framing also belongs in CTE trade-kit / proposal language: show B2B clients we measure performance, brand visibility, and inputs, not just rankings.

---

## Part 7 — Content strategy for AI search

### 7.1 Where the citations come from
The most cited sources in AI answers: **Reddit and YouTube** (then LinkedIn posts). If you're not active there, the systems pull from whoever is. Also: **each synthetic query has a content-format expectation** (some queries expect a video; if there's no video, the system takes whatever exists — if you're the one with the video, they use YOURS). Find the format expectation by analyzing what the system pulls for your queries.

**What this means for us:**
- [MONTH] **YouTube**: we already have `scripts/generate-video.py` (Gemini-native video). Extend: ensure the key tour queries ("KL street food tour", "Penang food tour", "durian") have an embedded YouTube video on the matching page, with transcripts. YouTube is both a Gemini input and a ChatGPT citation source. One video per strategic tour page minimum.
- [MONTH] **Reddit**: see Part 8.
- [MONTH] **LinkedIn**: already the CTE thought-leadership channel (daily LinkedIn cron). Keep it; LinkedIn posts show up in AI answers.
- [MONTH] For each strategic query, note the format the AI systems pull (article? video? forum thread?) and close the gap.

### 7.2 How to use AI for content (mistakes to avoid)
- **Biggest mistake**: "just ask the system to write it". No data, no depth, wrong facts.
- **The right way** (which our pipeline already follows, good):
  - Human-in-the-loop: prepare the outline and sources yourself; don't generate a piece from a single prompt.
  - Map content to a content model: individual prompts per component (intro, sections, FAQ, schema), not one mega-prompt.
  - Build a custom index of your own content for RAG (retrieval-augmented generation) so the model pulls from your real material; if not your content, curated best-in-class content (white papers, PDFs).
  - Subject-matter experts write outlines and review (Pauline's role on food facts).
- Our content pipeline (builder-judge loop, brand voice gate, tier-1 checks) is the human-in-the-loop layer. Keep the SME review step mandatory.

### 7.3 How Google judges AI content (the counterintuitive part)
- Google CANNOT reliably detect AI content. That's why it pushes watermarking: detection is false-positive/negative-prone.
- Instead it uses human response signals: site quality score (temporary, based on similar-looking sites), then real engagement (time on site, bounce rate). **Generative AI content typically has low time-on-site and high bounce — but if the UX is good, that problem disappears.** Scaled AI content is not inherently abuse.
- The rules are the old rules done well: structure, jump links (Google drops you straight at the answer), answer above the fold, no fluff, predict the next question (satisfy the full intent), clear layout.

**What this means for us:**
- [VALIDATED] The content-value principle in the site-optimization skill (every auto-generated page must be independently valuable, three-tier quality check) is exactly right and now has a mechanical justification: engagement signals are the AI-detection substitute. Thin content that bounces hurts us twice (rankings + AI trust).
- [VALIDATED] Answer-first structure, jump links, next-question prediction: our tier-1 checks (keyword in first 40 words, no history intros) and judge-loop already encode this. Extend to "answer above the fold" and "predict next question" as explicit checks for new content.

---

## Part 8 — Reddit without astroturfing

Reddit is a top AI citation source but is getting harder: subreddit moderators are aggressive about promotional content and astroturfing is heavily punished.

**Mike's play (white-hat):**
1. Start YOUR OWN subreddit.
2. Populate it with your content first; drive the messages there.
3. Be very responsive to whatever shows up.
4. Go to other subreddits discussing you; give a short answer and link back to your own subreddit thread (the conversation you control).
5. Why it matters for AI: the LLMs will look for your perspective; if your controlled, complete perspective exists, that's what gets pulled. If it doesn't exist, the only content about you is whatever third parties wrote.
6. Grow it with AMAs (get guests), share in newsletter and socials.

**What this means for us — [MONTH]:**
- Start r/SimplyEnak: populate with our best story content (durian guides, street food guides), respond fast, run a first AMA (a vendor we've worked with 14 years is a great AMA guest).
- Participate honestly in r/Malaysia, r/malaysianfood, r/KualaLumpur, r/Penang: real answers, link back to our own subreddit for the full perspective. No astroturfing, no fake engagement. Blue ocean: we're the tour company that actually answers food questions properly.

---

## Part 9 — Niche publishing is the future

Niche blogs will replace mid-tier publishers: the big media ad model is broken (pay-per-transaction everywhere, and not every article yields a transaction). Substack-style subscription + niche authority is where independent publishing survives. If the information is not commodity information, a new informational site is still worth starting.

**What this means for us:**
- [VALIDATED] Our stories section IS a niche authority play: hyper-local, non-commodity information (vendor names, 14-year relationships, specific stalls and dishes) that no AI system or big publisher can commoditize. Lean into the specificity; that's the moat.
- [MONTH] Consider an email newsletter (Substack-style) for the stories: builds the owned audience AND gives the content another distribution surface (which AI systems also cite).

---

## Part 10 — Relevance engineering (the framework)

"Search engine optimization" is the wrong frame: you don't optimize engines, you do **feature engineering for their inputs**. Mike's term: **relevance engineering** = AI + information retrieval + content strategy + UX + digital PR, applicable to ANY search surface (Google, AI, app stores, future surfaces). Machine media: the bot is a first-class citizen (bot activity already exceeds human activity on the web). Digital PR's job: create the surface area so both humans and agents see you as the source.

**What this means for us:**
- [VALIDATED] This is what our stack already does: information retrieval (GSC data + colony architecture), content strategy (Payload pipeline + judge loop), UX (conversion-page patterns, answer-first), digital PR (press strategy), AI (GEO audit script). Name it internally as "relevance engineering" to keep the frame broad across surfaces.
- [STRATEGIC] When any new surface appears (AI chat, AI maps, agent shopping), the same five levers apply. Keep the toolkit surface-agnostic.

---

## Part 11 — Skills to learn this year

- **Vibe coding / build small tools**: the SEOs who understand the platforms as super-users will win. We already do this (Hermes pipelines, open-source tooling).
- **Know the platforms' nuances**: llms.txt matters for Claude/Brave even though it's irrelevant to classic Google. Don't dismiss signals because one engine ignores them.
- **Community**: the SEO community is decentralized now; there's room to establish expertise. For us: our Malaysia food-tour content and data assets could establish Simply Enak as a voice, not just a booking site.

---

## Part 12 — What we will NOT do (ethics / blue ocean)

- White-on-white text, cloaking on AI platforms, microsites, AI-mention spam services ("millions of mentions"): these are the old black-hat tactics resurfacing. They conflict with our blue-ocean, ethical position and the user's explicit stance. We compete on being the source of record for Malaysian food tours, not on gaming AI platforms with no rules.
- Astroturfing Reddit. Own subreddit + honest participation only.
- Fabricated engagement or fake press. Never.

---

## Action plan (prioritized)

### This week [WEEK]
1. 499/TTFB hardening on simplyenak.com: audit done 2026-08-05 (see Part 4 verification). REMAINING: make HTML actually edge-cached via Worker Cache API or Cloudflare Cache Rule, then re-verify TTFB < 500ms and 499-free. (Part 4)
2. ~~Add `llms.txt`~~ DONE — verified live on both domains 2026-08-05. (Part 3.1)
3. Common Crawl presence check for both domains; note the gap vs competitors. (Part 5) — **attempted 2026-08-05, index API down (504 on all shards); retry when index.commoncrawl.org recovers. Command in Part 5.**
4. Mentions audit — **FIRST PASS DONE 2026-08-05** (DuckDuckGo exact-phrase search, 10 results):
   - **ENTITY COLLISION (action)**: unrelated "Simply Enak" businesses exist — a restaurant at Kangar Jaya, Perlis (Malaysia, facebook.com/profile.php?id=61590478362553, "Indo-Asian dining") and an Indonesian site (simplyenakindo.com). Real entity-fragmentation risk for Google/AI. Mitigation: always pair "Simply Enak" with "Food Tours/Experiences" + "KL & Penang" in our own listings; monitor Knowledge Panel.
   - **STALE CITATIONS (action)**: wonderfulmalaysia.com still references the renamed "off the beaten track" tour and has a typo ("aweseom"); goKL.my uses off-brand copy with "authentic" (banned word). Request updates via their webforms.
   - **TripAdvisor**: snippet shows "We're not..." phrasing — check against brand voice ("sell presence, never absence"); update if needed.
   - **Consistent**: FB tagline "The Truly Malaysian Food Experience" (minor drift from current positioning), Instagram, CTE about page ("15+ years"), TripAdvisor "Since 2011".
   - Follow-up: full pass on Bing + Google News + blogs (this was DuckDuckGo only).
   - **All audit follow-ups tracked as an actionable backlog: `.hermes/plans/mentions-audit-followups.md`** (checkbox items with URLs, priorities 1-4).

### This month [MONTH]
5. Query-fanout research for the 5 strategic queries; check our coverage of each sub-query; produce content briefs for gaps. (Part 3.2)
6. AI-visibility baseline: record appearance rate in ChatGPT/Perplexity/Claude for top 10 queries; re-measure monthly. (Part 3.2)
7. Add the three measurement buckets (performance, brand visibility, inputs) to the weekly report. (Part 6)
8. YouTube: one video per strategic tour page, embedded, with transcript. (Part 7.1)
9. Start r/SimplyEnak; populate; first AMA; honest participation in r/Malaysia/r/malaysianfood/r/KualaLumpur/r/Penang. (Part 8)
10. Newsletter (Substack-style) for stories. (Part 9)

### Strategic [STRATEGIC]
11. Linkable asset: Malaysian street food price index or durian-season data report; pitch to travel/food press. (Part 2.2)
12. Event sponsorships (food festivals, bazaars) for press + mentions. (Part 2.2)
13. Press-release engine running monthly (existing plan, `.hermes/plans/press-release-strategy.md`). (Part 2.1)
14. External link targets filtered by traffic/rankings, not DA. (Part 1.1)
15. AI visibility as a tracked KPI in quarterly reviews, with assumption validation (499 fix → visibility correlation). (Part 4, 6)
16. CTE: use the three-bucket measurement framing in proposals; keep LinkedIn thought leadership running. (Part 6, 3.3)

## Tools & resources mentioned
- Qoria — open-source query-fanout research tool (Mike King / iPullRank)
- Profound — commercial AI-search visibility monitoring (shows fanout changes over time)
- iPullRank (ipullrank.com) — Mike's agency, home base for his open-source work
- ChatGPT devtools "conversation" network tab — free way to inspect fanouts
- Common Crawl index API — free training-data presence check
