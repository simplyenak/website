# Simply Enak Landing Page Skill

**A Claude Skill for creating and optimizing high-converting pages for Simply Enak food tours.**

---

## 🎯 What This Does

This skill teaches Claude to create content for **two page types**:

### 1. Landing Pages (SEO + Education)
- **Examples:** `/kuala-lumpur-food-tours/`, `/penang-food-tours/`
- **Goal:** Warm up cold traffic, rank on Google
- **Length:** 1,500-2,500 words
- **Structure:** 11 sections (heritage, cultures, dishes, neighborhoods)

### 2. Tour Pages (Conversion + Booking)
- **Examples:** `/tours/kuala-lumpur-food-tour/`, `/tours/vegetarian-food-tour/`
- **Goal:** Book this specific tour
- **Length:** 800-1,200 words
- **Structure:** 11 sections (overview, itinerary, inclusions, pricing, calendar)

**Both use:**
- ✅ Simply Enak brand voice (The Passionate Friend)
- ✅ Forbidden words blocked (adventure, journey, discover, etc.)
- ✅ Educational-first approach (teach before selling)
- ✅ Conversion best practices (sticky CTA, social proof)

---

## 📦 Installation

### Option 1: Claude.ai (Recommended)

1. Go to **Claude.ai** → **Settings** → **Skills**
2. Click **"Add skill"**
3. Upload the folder: `/var/home/maarten/website-optimization/revamp/.claude/skills/simply-enak-landing-pages/`
4. Name it: **"Simply Enak Landing Pages"**

### Option 2: Claude Code (CLI)

```bash
# Navigate to the skill directory
cd /var/home/maarten/website-optimization/revamp/.claude/skills/

# Add the skill
claude skill add ./simply-enak-landing-pages
```

### Option 3: Manual (For Testing)

Copy the contents of `SKILL.md` and paste into your conversation as a system prompt or first message.

---

## 🚀 How to Use

### Example Prompts

#### Create a New Landing Page
```
Create a landing page for Penang food tours using the educational-first model.
Target keyword: "Penang food tours"
Include: Heritage story, 4 food cultures, 6 signature dishes, 4 neighborhoods
Tone: Warm, educational, friend-to-friend
```

#### Audit an Existing Page
```
Audit this landing page: [paste URL or content]

Score it using the 100-point system:
- Hero Section /20
- Value Proposition /15
- Social Proof /15
- CTA Optimization /15
- Copy Quality /15
- Design & UX /10
- Technical Performance /10

Provide prioritized recommendations (Critical/High/Medium).
```

#### Improve Copy
```
Rewrite this section to follow the Simply Enak brand voice:
[paste copy]

Check for:
- Forbidden words (adventure, journey, discover, explore, authentic, etc.)
- Claims vs. showing (replace with specific details)
- Friend voice vs. tourism brochure
```

#### Generate Meta Tags
```
Write SEO meta tags for a Kuala Lumpur food tours landing page.

Requirements:
- Meta title: 50-60 characters, includes "Kuala Lumpur food tours"
- Meta description: 150-160 characters, includes primary keyword + CTA
- OG title/description for social sharing
```

#### Create FAQ Section
```
Generate an FAQ section for the Penang food tour page.

Answer these objections:
- Vegetarian options?
- Halal considerations?
- Group size?
- Weather policy?
- Walking difficulty?
- Dietary restrictions?

Format: Question + 2-3 sentence answer, warm tone.
```

---

## 📊 What's Included

### 1. Brand Voice Rules
- **Forbidden words list** (adventure, journey, discover, explore, authentic, etc.)
- **Three-Feeling Test** (Welcomed, Fascinated, Connected)
- **Writing rules** (no em-dashes, no "it's not just X, it's Y" pattern)
- **Word swap reference** (what to say instead)

### 2. Landing Page Structure
- **11-section template** (Hero → Heritage → Food Cultures → Dishes → Neighborhoods → Why Tours Matter → Our Tours → Social Proof → FAQ → Final CTA → Newsletter)
- **Word count targets** (1,500-2,500 words optimal)
- **SEO requirements** (keyword placement, schema markup, internal linking)

### 3. Conversion Optimization
- **100-point audit system** (7 categories)
- **CTA best practices** (sticky mobile, trust indicators, objection handling)
- **Benchmarks** (5-6% conversion target, <35% bounce rate, 3-5 min time on page)
- **Anti-patterns** (10 things to never do)

### 4. Copywriting Frameworks
- **Hero Headline Formula** (Specific Result + Cultural Context)
- **PAS Framework** (Problem-Agitation-Solution)
- **Benefit > Feature Mapping**
- **STAR Testimonials** (Situation, Task, Action, Result)

### 5. Design System Compliance
- **Brand colors** (#b52d38 primary, #885e40 secondary, #ffa333 accent)
- **Typography** (Merriweather headings, PT Sans body)
- **Spacing standards** (section padding, card gaps, max-w-prose)
- **Component library** (GlobalHero, Section, Badge, Button, Prose)

---

## 🎯 Use Cases

### When to Use This Skill

✅ **Creating new location landing pages** (e.g., `/penang-food-tours/`)
✅ **Creating/updating tour detail pages** (e.g., `/tours/kuala-lumpur-food-tour/`)
✅ **Auditing existing pages** (score + prioritize improvements)
✅ **Rewriting copy** (align with brand voice, remove forbidden words)
✅ **Generating SEO meta tags** (titles, descriptions, schema)
✅ **Creating FAQ sections** (objection handling, structured data)
✅ **Optimizing for conversion** (CTA placement, social proof, trust indicators)

### When NOT to Use

❌ **Blog posts / Stories** (use blog writing guide instead)
❌ **Email campaigns** (different voice, different goals)
❌ **Social media posts** (shorter format, different platforms)
❌ **Homepage** (already optimized, different structure)

---

## 📈 Expected Results

### SEO Targets (4-8 Weeks)
- Rank #1-5 for primary keyword (`[city] food tours`)
- Organic traffic: +400% vs. homepage baseline
- Impressions: 10,000+/month in Search Console

### Conversion Targets
- Conversion rate: **5-6%** (vs. 2% homepage baseline)
- Time on page: **3-5 minutes**
- Bounce rate: **<35%**
- Mobile CTR: **3-4%**

### Revenue Impact
- **+300-500%** revenue from organic search alone
- Average booking value: RM 250-400 per person
- Payback period: 4-8 weeks (vs. paid ads)

---

## 🔧 Troubleshooting

### Problem: Claude Uses Forbidden Words
**Solution:** Remind it explicitly:
```
Remember: Never use "adventure", "journey", "discover", "explore", "authentic", "immersive", "premium", "luxury". Use the word swap table in the skill.
```

### Problem: Output Sounds Like Tourism Brochure
**Solution:** Reinforce brand voice:
```
Rewrite this in the "Passionate Friend" voice. Would you text this to a friend? Replace claims with specific details (names, ages, years).
```

### Problem: Page Too Salesy
**Solution:** Emphasize educational-first:
```
Shift the balance: 70% education, 30% promotion. Teach visitors WHY [city] food matters before asking them to book.
```

### Problem: Missing Social Proof
**Solution:** Specify requirements:
```
Add social proof section: TripAdvisor Travellers' Choice 2023 badge, 1,250+ guests, 4.9 rating, media logos (NatGeo, Discovery, Lonely Planet).
```

---

## 📚 Related Documentation

- **Brand Voice:** `/var/home/maarten/website-optimization/revamp/WORDS_TO_AVOID.md`
- **Design Guidelines:** `/var/home/maarten/website-optimization/revamp/PAGE-DESIGN-GUIDELINES.md`
- **Landing Page Strategy:** `/var/home/maarten/website-optimization/revamp/LANDING-PAGE-STRATEGY.md`
- **Blog Writing Guide:** `/var/home/maarten/website-optimization/revamp/agent_docs/blog-writing-guide.md`

---

## 🤝 Contributing

Found a new pattern? Update the skill:

1. Edit `SKILL.md` in `/var/home/maarten/website-optimization/revamp/.claude/skills/simply-enak-landing-pages/`
2. Add new anti-patterns, word swaps, or frameworks
3. Test with a sample prompt
4. Commit changes with message: "Update skill: [what changed]"

---

## ⚖️ License

Apache 2.0 (based on Mafia-Claude-Skills)

**Created:** March 2026
**Language:** English (Simply Enak brand voice)
**Maintained by:** Simply Enak Development Team
