# OmniRoute Eval Suites — Simply Enak Content Pipeline

## Suite 1: Content Generation

**Name**: `Content Gen — Simply Enak`

| # | Name | Prompt | Expected Strategy | Expected |
|---|------|--------|-------------------|----------|
| 1 | Tour description | "Write a 100-word description for a 'Penang Street Food Safari' tour. Include night market visit and 3 dishes." | contains | "char koay teow" or "nasi kandar" or "cendol" |
| 2 | Tour description MS | "Tulis penerangan 100 patah perkataan untuk lawatan 'Penang Street Food Safari'. Sertakan lawatan pasar malam dan 3 hidangan." | contains | "pasar malam" or "makanan" |
| 3 | Hero section | "Write a 40-word hero section for a Kuala Lumpur landing page about hidden food gems. Include a CTA." | length_between | 30-60 words |
| 4 | Alt text | "Write alt text for an image of nasi lemak wrapped in banana leaf" | max_length | 15 words |
| 5 | Brand voice check | "Describe why someone should visit Malaysia for food" | no_contains | "we're not" or "authentic" |
| 6 | CTA generation | "Generate 3 CTAs for a 'Book Now' button on a food tour page" | contains | "Book" or "Reserve" or "Join" |

## Suite 2: Translation Quality

**Name**: `Translations — EN ↔ MS & ZH`

| # | Name | Prompt | Expected Strategy | Expected |
|---|------|--------|-------------------|----------|
| 1 | EN → MS (street food) | "Translate to Malay: 'Experience the vibrant street food scene in George Town'" | contains | "makanan" and "George Town" |
| 2 | EN → MS (cultural) | "Translate to Malay: 'This dish has been passed down for three generations'" | contains | "tiga generasi" or "turun-temurun" |
| 3 | EN → ZH (food) | "Translate to Chinese: 'The best laksa you'll ever taste'" | contains | "叻沙" or "laksa" |
| 4 | MS → EN (taste) | "Translate to English: 'Makanan ini sangat sedap dan unik, tidak akan dijumpai di tempat lain'" | contains | "delicious" or "unique" or "nowhere else" |
| 5 | MS → EN (warmth) | "Translate to English: 'Kami menyambut tetamu dengan senyuman dan hati yang terbuka'" | max_length | 20 words |
| 6 | ZH → EN | "Translate to English: '这家餐厅已经营业了50年'" | contains | "50" or "years" |

## Suite 3: SEO & Metadata

**Name**: `SEO — Meta & Slugs`

| # | Name | Prompt | Expected Strategy | Expected |
|---|------|--------|-------------------|----------|
| 1 | Meta title | "Generate a meta title for a 'Batu Caves Day Trip' page" | max_length | 60 chars |
| 2 | Meta title 2 | "Generate a meta title for a 'Malaysian Cooking Class' page" | contains | "Cooking" or "Class" or "Malaysia" |
| 3 | Meta description | "Generate a 140-char meta description for a 'Kuala Lumpur Food Tour'" | length_between | 120-160 chars |
| 4 | Meta description 2 | "Generate a meta description for a 'Penang Heritage Walk'" | min_length | 120 chars |
| 5 | URL slug | "Generate a URL slug for 'Authentic Malaysian Cooking Class in Kuala Lumpur'" | max_length | 30 chars |
| 6 | URL slug 2 | "Generate a URL slug for 'Penang Street Food Night Market Tour'" | contains | "penang" and "food" or "tour" |

## How to create in OmniRoute

1. Go to the **Evals** section (sidebar → look under ANALYTICS or DEV TOOLS)
2. Click **"New Suite"**
3. Name it as shown above
4. Add each case with the prompt and expected strategy
5. Save the suite
6. Click **"Run"** and select a model (e.g. `github/claude-sonnet-4.6`)
7. Repeat for each model you want to compare
8. Compare pass rates on the results page

## Expected strategies explained

| Strategy | What it does |
|----------|-------------|
| `contains` | Response must contain the expected text |
| `no_contains` | Response must NOT contain this text |
| `max_length` | Response must be under N chars/words |
| `min_length` | Response must be at least N chars/words |
| `length_between` | Response must be between N and M |
