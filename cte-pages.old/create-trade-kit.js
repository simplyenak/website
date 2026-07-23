import { createClient } from "anytypeHelper@v1";

export function main(args) {
    var client = createClient({
        apiBaseUrl: env.ANYTYPE_API_BASE_URL,
        apiKey: env.ANYTYPE_API_KEY,
        spaceId: env.ANYTYPE_SPACE_ID
    });
    
    var body = `# Simply Enak Trade Kit 2026

Your clients want things that don't fit a package. We help you say yes. 15 years on the ground in Malaysia.

## Day Experiences & Rates

### Kuala Lumpur

| Tour | Rate (MYR/pax) | Duration | Max | Description |
|------|---------------|----------|-----|-------------|
| Kuala Lumpur Street Food | 285 | 3.5h | 7 | The Heart of KL Street Food |
| Flavours of Malaysia | 289 | 4h | 7 | Market Culture and Hidden Flavours |
| Secrets of KL | 359 | 4h | 7 | Nightlife, Street Art & Cocktails |
| Inside Pudu | 289 | 3.5h | 7 | Pudu Market Deep Dive |
| Vegetarian Food Tour | 450 | 4h | 8 | Private Vegetarian Experience |

### Penang

| Tour | Rate (MYR/pax) | Duration | Max | Description |
|------|---------------|----------|-----|-------------|
| Penang Street Food | 285 | 3.5h | 7 | Penang Food Capital Tour |
| Georgetown Best Hawkers | 289 | 4h | 7 | Experience Penang after dark |

## What is Included

- Senior Licensed Local Guide
- All food and non-alcoholic beverages (15+ tastings)
- Hotel pickup and drop-off (on foot or Grab/taxi)
- One alcoholic beverage (where applicable)

## Dietary Options

Halal, Vegetarian, Vegan, Gluten-Free, Nut-Free, Egg-Free, Dairy-Free, Pescatarian

## Partnership Terms

- Net rates. You add your margin.
- No exclusivity, no minimum volume.
- 48-hour proposal turnaround.
- 30% deposit to confirm, balance 14 days before.
- Full refund up to 30 days, 50% up to 14 days.
- White-label available.

## Contact

hello@simplyenak.com | simplyenak.com`;

    var result = client.createObject("page", {
        name: "Simply Enak Trade Kit 2026",
        markdown: body
    });
    
    return { ok: true, object_id: result?.object?.id || "no-id", title: result?.object?.name || "no-name" };
}
