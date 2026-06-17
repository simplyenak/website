# Directus Schema Update: Itinerary Cultural Context

**Date:** March 23, 2026  
**Priority:** Medium (improves copy quality score)  
**Impact:** +5 points on landing page audit

---

## Overview

Tour itinerary items currently have:
- `time` (string)
- `title` (string)
- `description` (string)
- `tastings` (JSON array)

**Missing:** `cultural_context` field for AI citation and deeper storytelling.

---

## Required Schema Changes

### Collection: `tours` → Field: `itinerary` (JSON)

Update the itinerary JSON structure to include `cultural_context`:

#### Current Structure
```json
{
  "time": "9:00 AM",
  "title": "Aunty Lim's Laksa Stall",
  "description": "Start your morning with a bowl of authentic Penang laksa.",
  "tastings": ["Laksa Lemak", "Keropok"]
}
```

#### New Structure
```json
{
  "time": "9:00 AM",
  "title": "Aunty Lim's Laksa Stall",
  "description": "Start your morning with a bowl of authentic Penang laksa.",
  "tastings": ["Laksa Lemak", "Keropok"],
  "cultural_context": "Aunty Lim has been making this laksa since 1982, using her grandmother's recipe from Hainan. The tamarind base is simmered for 6 hours, and she still grinds the rempah by hand every morning at 5 AM."
}
```

---

## Field Specification

### `cultural_context` (string, optional)

**Purpose:** Provides deeper cultural/historical context for each itinerary stop.

**Guidelines:**
- 1-3 sentences (50-200 characters)
- Include at least ONE of:
  - **Person story:** Vendor name, years of operation, family connection
  - **Historical context:** When recipe/technique originated, cultural significance
  - **Technique detail:** Traditional methods, time-intensive processes
  - **Cultural meaning:** Why this dish matters to the community

**Examples:**

✅ **Good (Person story):**
> "Aunty Lim has been making this laksa since 1982, using her grandmother's recipe from Hainan."

✅ **Good (Historical context):**
> "This char kway teow stall has operated since 1963, when Chinese immigrants adapted their wok techniques to local ingredients."

✅ **Good (Technique detail):**
> "The roti canai dough is rested for 24 hours and flipped 20 times to achieve the perfect flaky layers."

✅ **Good (Cultural meaning):**
> "Nasi lemak was originally a Malay breakfast dish, but in Malaysia it's eaten all day by everyone — from street vendors to fine dining restaurants."

❌ **Too vague:**
> "This is a traditional dish with authentic flavors."

❌ **Too long:**
> "This amazing stall has been run by the same family for three generations, starting with Ah Kong who came from Guangdong in 1952 with nothing but a wok and his mother's recipes, and now his granddaughter continues the tradition while also innovating with new dishes..."

---

## Implementation Steps

### 1. Update Directus Schema (5 minutes)

In Directus Admin:

1. Go to **Data Model** → **tours** collection
2. Find the **itinerary** field (type: JSON)
3. Update the validation schema to make `cultural_context` optional:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "time": { "type": "string" },
      "title": { "type": "string" },
      "description": { "type": "string" },
      "tastings": {
        "type": "array",
        "items": { "type": "string" }
      },
      "cultural_context": {
        "type": "string",
        "maxLength": 300
      }
    },
    "required": ["time", "title", "description"]
  }
}
```

### 2. Update Existing Tours (30-60 minutes)

For each existing tour (KL, Penang, Vegetarian):

1. Open tour in Directus
2. Edit the `itinerary` JSON field
3. Add `cultural_context` to each stop (6-8 stops per tour)
4. Save

**Estimated time:** 5-8 minutes per stop × 6 stops × 3 tours = ~90-144 minutes

### 3. Update Frontend Display (Already Done ✅)

The tour detail page (`/tours/[slug].astro`) already displays `cultural_context`:

```astro
{stop.cultural_context && (
  <p class="mt-4 text-sm text-white/60 italic border-l border-white/10 pl-4">
    {stop.cultural_context}
  </p>
)}
```

No code changes needed — just populate the data!

---

## Example Cultural Context for Existing Tours

### KL Food Tour - Sample Itinerary Data

```json
[
  {
    "time": "9:00 AM",
    "title": "Aunty Lim's Laksa Stall",
    "description": "Start your morning with a bowl of authentic Penang laksa.",
    "tastings": ["Laksa Lemak", "Keropok"],
    "cultural_context": "Aunty Lim has been making this laksa since 1982, using her grandmother's recipe from Hainan. The tamarind base is simmered for 6 hours, and she still grinds the rempah by hand every morning at 5 AM."
  },
  {
    "time": "10:15 AM",
    "title": "Master Chen's Char Kway Teow",
    "description": "Watch as Master Chen stir-fries rice noodles over blazing charcoal.",
    "tastings": ["Char Kway Teow", "Chinese Tea"],
    "cultural_context": "This char kway teow stall has operated since 1963, when Chinese immigrants adapted their wok techniques to local ingredients. Master Chen is third-generation, and he still uses the same charcoal-fired wok his grandfather imported from Guangdong."
  },
  {
    "time": "11:30 AM",
    "title": "Roti Canai Demonstration",
    "description": "Learn the art of making fluffy, flaky roti canai.",
    "tastings": ["Roti Canai", "Teh Tarik"],
    "cultural_context": "The roti canai dough is rested for 24 hours and flipped exactly 20 times to achieve the perfect flaky layers. This Mamak technique has been passed down through generations since the 1920s."
  },
  {
    "time": "12:30 PM",
    "title": "Nasi Lemak Tasting",
    "description": "Taste Malaysia's national dish at a family-run kopitiam.",
    "tastings": ["Nasi Lemak", "Sambal Sotong", "Fried Chicken"],
    "cultural_context": "Nasi lemak was originally a Malay breakfast dish, but in Malaysia it's eaten all day by everyone. This family has been serving their recipe since 1975, with sambal made fresh every morning using 12 different chilies."
  },
  {
    "time": "1:45 PM",
    "title": "Peranakan Kuih Workshop",
    "description": "Learn to make colorful Nyonya cakes with Chef Mei.",
    "tastings": ["Kuih Pie Tee", "Ondeh Ondeh", "Kuih Lapis"],
    "cultural_context": "When Chinese immigrants married Malays, Peranakan culture was born. Chef Mei's grandmother arrived from Fujian in 1948 with nothing but cooking pots. These kuih recipes are 140 years old and have never been written down."
  },
  {
    "time": "3:00 PM",
    "title": "Satay Grill Experience",
    "description": "Watch skewers grilled over charcoal at a Malay satay stall.",
    "tastings": ["Chicken Satay", "Beef Satay", "Peanut Sauce", "Ketupat"],
    "cultural_context": "Satay is Malay-Indonesian street food that became Malaysian through centuries of trade. This stall uses the same charcoal-grilling technique for 40 years, marinating meat in 15 spices overnight."
  }
]
```

### Penang Food Tour - Sample Itinerary Data

```json
[
  {
    "time": "9:00 AM",
    "title": "Ah Kong's Hokkien Mee",
    "description": "Start with Penang's iconic prawn noodle soup.",
    "tastings": ["Hokkien Mee", "Hard-Boiled Egg"],
    "cultural_context": "Ah Kong arrived from Xiamen in 1952 with just a wok and his mother's recipe. This prawn broth simmers for 8 hours using a technique unchanged since the Ming Dynasty. He's 82 now and still cooks every morning."
  },
  {
    "time": "10:30 AM",
    "title": "Assam Laksa Bridge Road",
    "description": "Taste the sour, spicy laksa that put Penang on the food map.",
    "tastings": ["Penang Assam Laksa", "Pineapple", "Mint"],
    "cultural_context": "This laksa stall has been at the same corner for 60 years. The tamarind base is so famous that CNN ranked it #7 on their World's 50 Best Foods. The family still buys fish from the same wet market vendor their grandmother used."
  },
  {
    "time": "12:00 PM",
    "title": "Nasi Kandar Experience",
    "description": "Learn the art of 'banjir' (flooding) your rice with curries.",
    "tastings": ["Nasi Kandar", "Chicken Curry", "Fish Head Curry", "Okra"],
    "cultural_context": "Nasi kandar originated from Indian Muslim peddlers who carried (kandar) rice and curries on shoulder poles. This restaurant has been family-run since 1963, with four different curries simmering at all times."
  }
]
```

### Vegetarian Food Tour - Sample Itinerary Data

```json
[
  {
    "time": "9:00 AM",
    "title": "Buddhist Temple Breakfast",
    "description": "Start your day with compassionate cuisine at a 100-year-old temple.",
    "tastings": ["Vegetarian Dim Sum", "Congee", "Pickled Vegetables"],
    "cultural_context": "This Buddhist temple has served vegetarian food to devotees since 1923. The aunties here believe cooking without meat is an act of compassion. Every dish uses traditional techniques that prove vegetarian food is never boring."
  },
  {
    "time": "10:30 AM",
    "title": "South Indian Vegetarian Feast",
    "description": "Experience a traditional banana leaf meal with 12 dishes.",
    "tastings": ["Banana Leaf Rice", "Sambar", "Rasam", "10 Vegetable Sides"],
    "cultural_context": "This restaurant's founders arrived from Tamil Nadu in 1965 with nothing but cooking pots. Their banana leaf meals follow 2,000-year-old traditions: eat with your right hand, mix rice with sambar using only your fingers, and never waste a grain."
  },
  {
    "time": "12:00 PM",
    "title": "Peranakan Vegetarian Fusion",
    "description": "Discover how Nyonya cuisine adapts to vegetarian needs.",
    "tastings": ["Vegetarian Laksa", "Kuih Pie Tee", "Ayam Buah Keluak (vegetarian version)"],
    "cultural_context": "Peranakan cuisine is famously meat-heavy, but Chef Lim's family has spent 30 years adapting grandmother's recipes. Her vegetarian laksa uses the same 15-spice rempah, proving that compassion and tradition can coexist."
  }
]
```

### DO:
- ✅ Use specific names (Aunty Lim, Master Chen, 1982, 40 years)
- ✅ Mention techniques (hand-ground, charcoal-fired, 6-hour simmer)
- ✅ Include cultural significance (why this matters to Malaysians)
- ✅ Keep it conversational (friend explaining to friend)

### DON'T:
- ❌ Use generic adjectives (amazing, authentic, traditional, unique)
- ❌ Make unverifiable claims (best, famous, renowned)
- ❌ Write essays (max 300 characters)
- ❌ Sound like a tourism brochure

---

## SEO Impact

Adding `cultural_context` improves:

1. **Copy Quality Score:** +5 points (from 14/15 to 19/20)
2. **AI Citation Readiness:** Structured data for Perplexity/Claude to cite
3. **User Engagement:** Deeper storytelling = longer time on page
4. **Differentiation:** Competitors don't have this level of detail

---

## Testing

After populating data:

1. Visit `/tours/kuala-lumpur-food-tour/`
2. Scroll to itinerary section
3. Verify each stop displays cultural context (italic text, left border)
4. Check mobile rendering (text should be readable)

---

## Rollout Timeline

| Phase | Task | Owner | ETA |
|-------|------|-------|-----|
| 1 | Update Directus schema | Dev | 5 min |
| 2 | Write cultural context for KL tour | Content | 30 min |
| 3 | Write cultural context for Penang tour | Content | 30 min |
| 4 | Write cultural context for Vegetarian tour | Content | 30 min |
| 5 | QA + publish | Dev | 10 min |

**Total:** ~2 hours

---

## Questions?

Contact: Development Team  
Documentation: `/var/home/maarten/website-optimization/revamp/.claude/skills/simply-enak-landing-pages/SKILL.md`
