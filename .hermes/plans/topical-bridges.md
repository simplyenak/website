# Topical Bridge Map — Simply Enak GSC Analysis

**Generated:** 2026-07-23
**Data:** 28-day GSC query×page co-occurrence analysis (2,432 query-page rows)

## Concept

Topical bridges are queries that appear across pages from different topic clusters in GSC's co-occurrence data.
These represent opportunities to link between colonies — each bridge query is a natural anchor text that
connects two topical areas. When you link from colony A to colony B using a bridge query as anchor text,
you pass link authority across colonies and build a connected topical network.

## Bridge Map

```
                              ┌─────────────────┐
                              │  Malaysia Food   │
                              │  Tours (Hub)     │
                              │  238 imp, 14.7   │
                              └────────┬────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     │                 │                 │
                     ▼                 ▼                 │
          ┌──────────────────┐  ┌──────────────────┐     │
          │  KL Food Tour     │  │  Penang Food     │     │
          │  Colony           │  │  Tour Colony     │     │
          │  157 imp, 14.3    │  │  193 imp, 12.6   │     │
          └────────┬─────────┘  └────────┬─────────┘     │
                   │                      │               │
                   ▼                      ▼               │
          ┌──────────────────┐  ┌──────────────────┐     │
          │  Chow Kit        │  │  George Town     │     │
          │  Food Guide      │  │  Food Tour       │     │
          │  87 imp, 7.1     │  │  54 imp, 5.7     │     │
          └──────────────────┘  └──────────────────┘     │
                                                          │
          ┌────────────────────────────────────────────────┘
          │
          ▼
  ┌──────────────────┐
  │  Durian Colony   │
  │  (existing)      │
  │  bridge: 'durian │
  │  malaysia'       │
  └──────────────────┘
```

## Concrete Bridge Recommendations

### Bridge 1: `malaysia food tours`

- **Impression data:** 238 imp/28d, position 14.7
- **Connects topics:** food-tour ↔ kuala-lumpur ↔ penang
- **Action:** Link from Malaysia Food Tours guide → KL Food Tour guide using 'food tour kuala lumpur' anchor
- **From:** `/stories/malaysia-food-tours/`
- **To:** `/stories/kuala-lumpur-food-tour/`
- **Anchor text:** "food tour Kuala Lumpur"

### Bridge 2: `food tour kuala lumpur`

- **Impression data:** 157 imp/28d, position 14.3
- **Connects topics:** kuala-lumpur ↔ street-food
- **Action:** Link from KL Food Tour guide → Chow Kit guide using 'chow kit food' anchor
- **From:** `/stories/kuala-lumpur-food-tour/`
- **To:** `/stories/chow-kit-food-guide/`
- **Anchor text:** "Chow Kit food"

### Bridge 3: `penang food tours`

- **Impression data:** 162 imp/28d, position 8.0
- **Connects topics:** penang ↔ street-food
- **Action:** Link from Penang Food Tours page → Penang street food guide using 'penang street food' anchor
- **From:** `/stories/penang-food-tour/`
- **To:** `/stories/penang-street-food/`
- **Anchor text:** "Penang street food"

### Bridge 4: `food tour penang`

- **Impression data:** 104 imp/28d, position 5.2
- **Connects topics:** penang ↔ street-food
- **Action:** Link from Penang food tour page → What to Eat in Penang guide using 'food tour penang george town' anchor
- **From:** `/stories/penang-food-tour-george-town/`
- **To:** `/stories/what-to-eat-in-penang/`
- **Anchor text:** "Penang food tour"

### Bridge 5: `food tour penang george town`

- **Impression data:** 54 imp/28d, position 5.7
- **Connects topics:** penang ↔ street-food
- **Action:** Link from George Town tour page → what to eat in Penang page using 'Penang local food' anchor
- **From:** `/stories/penang-food-tour-george-town/`
- **To:** `/stories/what-to-eat-in-penang/`
- **Anchor text:** "what to eat in Penang"

## Cross-Colony Bridge Opportunities

These bridges connect the new food tour colonies with the existing durian colony:

| Bridge Query | Origin Colony | Destination Colony | Anchor Text |
|-------------|---------------|-------------------|-------------|
| `durian malaysia` | KL Food Tour (`/stories/kuala-lumpur-food-tour/`) | Durian Colony (`/stories/eating-durians/`) | "durian in Malaysia" |
| `best time to eat durian` | Penang Food Tour (`/stories/penang-food-tour/`) | Durian Colony (`/stories/durian-season-malaysia/`) | "durian season" |
| `malaysian durian` | Malaysia Food Tours hub | Durian Colony | "Malaysian durian" |

## Raw Bridge Query Data

| Query | Topics Bridged | Impressions | Position | Bridge Score |
|-------|---------------|------------|----------|-------------|
| `simply enak kangar jaya` | general ↔ kuala-lumpur ↔ penang | 623 | 6.6 | 94.4 |
| `durian malaysia` | durian ↔ general | 246 | 10.5 | 23.4 |
| `penang food tours` | general ↔ penang ↔ street-food | 162 | 8.0 | 20.2 |
| `food tour penang` | general ↔ penang ↔ street-food | 104 | 5.2 | 20.0 |
| `malaysia food tours` | food-tour ↔ kuala-lumpur ↔ penang | 238 | 14.7 | 16.2 |
| `food tour kuala lumpur` | general ↔ kuala-lumpur ↔ street-food | 157 | 14.3 | 11.0 |
