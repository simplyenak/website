# Experience Collection via Buzz

Guides submit experience notes via Buzz channel. Notes are saved to Payload CMS for content enrichment.

## How Guides Submit

Send a message to the `#experience` channel on Buzz with this format:

```
Morning at Pudu Market

Location: Pudu Market, Jalan Tuanku Abdul Rahman, KL

Dishes:
- char kway teow (RM 8) at the stall near 7-Eleven
- hokkien mee (RM 10) at Lot 10 Hutong
- nasi lemak (RM 5) opposite the mosque

Vendors:
- The char kway teow stall on Jalan Alor near 7-Eleven
  - Been there 30 years
  - Uses charcoal fire
  - Cook adjusts seasoning by feel

Sensory:
- Wok hei smoke from charcoal
- Runny egg yolk
- Smoky char on noodles

Tips:
- Go before 8 AM for fresh ingredients
- Cash only
- Try the char kway teow, it's the best in KL

Surprises:
- The cook has been using the same wok for 20 years
- Fish arrives from Terengganu that morning
```

## What Gets Collected

- **Dishes with prices** (RM amounts) → enriches blog posts with specific pricing
- **Vendor names and locations** → adds verification signals
- **Sensory details** → improves E-E-A-T experience scores
- **Tips and surprises** → unique insights for content

## Backend

1. Note posted to Buzz `#experience` channel
2. Script saves to Payload `experience_notes` collection
3. Weekly enrichment check analyzes gaps
4. Content team reviews and updates posts

## Setup

1. Create the channel: `node scripts/create-experience-channel.cjs`
2. Update CHANNEL_IDS in `buzz-experience-submit.cjs`
3. Add guides to the channel
4. Test submission
