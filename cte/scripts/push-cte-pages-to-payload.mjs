#!/usr/bin/env node
/**
 * Push CTE pages to Payload CMS using admin API key
 * Usage: node scripts/push-cte-pages-to-payload.mjs [--push]
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(SCRIPT_DIR, '..', 'src', 'data', 'content');
const PAYLOAD_URL = 'https://cms.system.simplyenak.com';

// Load admin API key from site/.env
const siteEnvPath = join(SCRIPT_DIR, '..', '..', 'site', '.env');
let API_KEY = '';
try {
  const envContent = readFileSync(siteEnvPath, 'utf8');
  const match = envContent.match(/^PAYLOAD_ADMIN_API_KEY=(.+)$/m);
  if (match) {
    API_KEY = match[1].trim();
  }
} catch (e) {
  // Use env var if available
  API_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
}

const PAGES = [
  {
    slug: 'for-agents',
    title: 'For Travel Agents',
    content_markdown: `Your clients want something real. We have spent 14 years building the relationships that make that possible.

Most food tours show visitors a curated version of street food. Ours show them the stalls where the Chen family has been making char siew bao since 1985, where Pak Hassan still pounds his sambal by hand every morning, where the auntie at the back of Lorong Selamat makes her roti canai the way her mother taught her.

These are not vendor arrangements. They are relationships. Some go back to when we started in 2011. Your clients do not just taste the food, they meet the people who make it.

## What Your Clients Experience
- Breakfast at a 40-year-old kopi tiam with the owner
- Watch Pak Hassan prepare his sambal before the market opens
- Eat char kway teow at a stall where the wok hei is so good locals line up at 6am
- Try cendol made with palm sugar from a farm two hours north of Penang
- Leave with the contact of a family that will welcome them back

## What We Handle
- **Guest communication:** Pre-tour instructions, meeting point details
- **Dietary needs:** Halal, vegetarian, vegan, allergies — coordinated with vendors
- **Day-of support:** English, Malay, Mandarin, Cantonese-speaking guides
- **Problem-solving:** If something goes wrong, we fix it
- **Post-tour:** Follow-up messages, feedback collection

## Why This Is Different
TripAdvisor and GetYourGuide sell standardized tours. Many run from the same meeting point in Chinatown, visit the same 10 stalls, serve the same 15 dishes. Your clients get the experience that every other tourist gets.

We operate differently. Every tour is built around relationships, not routes. Your clients eat where we eat. They meet the families we have worked with for years. They experience the food culture the way locals do, not the way guidebooks describe it.

This matters because your clients will remember this. They will tell their friends. They will come back.

## For High-Volume Partners
Agencies that regularly book with us receive priority access to our most sought-after experiences, co-branded marketing materials, and a dedicated account manager.

We invest in partners who invest in delivering exceptional experiences to their clients.

## How to Partner With Us
1. **Sign our supplier agreement** — Standard terms that protect both parties and ensure we maintain our quality standards
2. **Receive our trade kit** — Destination guides, photos, marketing copy you can use
3. **Book experiences for your clients** — We handle all logistics and guest communication
4. **Build a long-term partnership** — Priority access and dedicated support for high-volume partners`,
    meta_title: 'For Travel Agents | Malaysian Food Tours B2B Partner',
    meta_description: 'Book authentic Malaysian food experiences for your clients. Culinary Travel Experts offers curated food tours, heritage walks, and cultural experiences across Malaysia. 14 years of relationships.',
  },
  {
    slug: 'dmc-services',
    title: 'DMC Services',
    content_markdown: `MOTAC application in progress. Experienced with groups from 2 to 200.

We are not just another tour operator. We are a destination management company built around food culture, with an application to operate across Malaysia, and experienced in handling groups of every size.

What makes us different is not our licenses or insurance, it is our relationships. Every vendor we work with has been part of our network for years. Some for 14. This means your clients get access to places most operators cannot reach.

## Group Sizes
- **FIT Groups:** 2-8 travelers — Private guides, custom itineraries, flexible scheduling
- **Small Groups:** 8-20 travelers — Join-in tours, team building, incentive programs
- **Large Groups:** 20-200 travelers — Corporate events, FAM trips, conference add-ons

## What We Cover
- **Guides:** English, Malay, Mandarin, Cantonese-speaking
- **Transport:** Air-con vehicles for pickup and drop-off
- **Food:** All meals and drinks included
- **Dietary:** Halal, vegetarian, vegan, gluten-free, allergies
- **Language:** Multi-lingual guides, translated materials

## Coverage Areas
- **Kuala Lumpur:** Street food from three cultures, wet markets, family-run hawker stalls
- **Penang:** George Town heritage food, Nyonya home cooking, fishing villages
- **Ipoh:** White coffee, bean sprout chicken, Hakka cuisine
- **Melaka:** Baba Nyonya heritage, Portuguese Eurasian dishes, Jonker Street vendors
- **Cameron Highlands:** Family-run tea plantations, strawberry farms, highland cuisine
- **Johor Bahru:** Laksa Johor, murtabak, southern Malaysia food culture

## Case Study: European Food Industry Delegation
Last year, we hosted a 45-person delegation from a European food industry association. They wanted to understand Malaysian ingredients, meet local producers, and experience street food culture at scale.

We coordinated three guides, six vendor locations, and a private cooking session with a family in George Town who has been making Nyonya dishes for three generations.

That is what we do. We do not just run tours, we build experiences that your clients talk about.`,
    meta_title: 'DMC Services | Malaysian Food Tour Operator B2B',
    meta_description: 'Culinary Travel Experts is a destination management company specializing in food and cultural experiences across Malaysia. FIT groups, small groups, large groups.',
  },
  {
    slug: 'fam-trip-resources',
    title: 'FAM Trip Resources',
    content_markdown: `Everything you need to confidently sell Malaysian food experiences to your clients.

We have created these resources to help you sell with confidence. Each guide includes the information your clients will ask about, and the talking points that help you differentiate Simply Enak from standard food tours.

## Resources Available
- **Destination Guides** — Coming Soon
- **Sample Itineraries** — Coming Soon
- **Pricing Sheet** — Request now
- **Marketing Assets** — Coming Soon

## Trade Kit
Register as a partner and we will send you the complete trade kit, all guides, itineraries, pricing, and marketing materials in one package.

## What is in the Trade Kit?
- **Destination Guides:** 6 cities × 10 pages each = 60 pages of vendor profiles, dish highlights, cultural notes
- **Sample Itineraries:** 12 customizable itineraries across all regions
- **Pricing Sheet:** Agent rates, commission structure, group size recommendations
- **Marketing Assets:** 50+ photos, 20 social media templates, 10 email templates
- **Agent Toolkit:** FAQ document, objection handling guide, sustainability talking points`,
    meta_title: 'FAM Trip Resources | Travel Agent Toolkit Malaysia',
    meta_description: 'Download our FAM trip guides, destination overviews, sample itineraries, and marketing materials for travel agents selling Malaysian food experiences.',
  },
];

const DO_PUSH = process.argv.includes('--push');

async function pushToPayload() {
  if (!API_KEY) {
    console.error('ERROR: PAYLOAD_ADMIN_API_KEY not found in site/.env');
    process.exit(1);
  }

  console.log(`Pushing ${PAGES.length} pages to Payload...`);
  console.log(`Mode: ${DO_PUSH ? 'LIVE (creating/updating)' : 'DRY RUN (no changes)'}`);
  console.log('');

  for (const page of PAGES) {
    try {
      // Check if page exists
      const checkUrl = `${PAYLOAD_URL}/api/cte_pages?slug[equals]=${page.slug}&limit=1`;
      const checkRes = await fetch(checkUrl, {
        headers: { 'Authorization': `Key ${API_KEY}`, 'Content-Type': 'application/json' }
      });
      
      if (!checkRes.ok) {
        console.error(`  ✗ ${page.slug}: check failed (${checkRes.status})`);
        continue;
      }
      
      const checkData = await checkRes.json();
      const existingPage = checkData.docs?.[0];
      
      if (DO_PUSH) {
        if (existingPage) {
          // Update existing
          const updateUrl = `${PAYLOAD_URL}/api/cte_pages/${existingPage.id}`;
          const updateRes = await fetch(updateUrl, {
            method: 'PUT',
            headers: { 'Authorization': `Key ${API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(page)
          });
          
          if (updateRes.ok) {
            console.log(`  ✓ ${page.slug}: updated`);
          } else {
            const err = await updateRes.text();
            console.error(`  ✗ ${page.slug}: update failed (${updateRes.status}): ${err.slice(0, 100)}`);
          }
        } else {
          // Create new
          const createUrl = `${PAYLOAD_URL}/api/cte_pages`;
          const createRes = await fetch(createUrl, {
            method: 'POST',
            headers: { 'Authorization': `Key ${API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(page)
          });
          
          if (createRes.ok) {
            console.log(`  ✓ ${page.slug}: created`);
          } else {
            const err = await createRes.text();
            console.error(`  ✗ ${page.slug}: create failed (${createRes.status}): ${err.slice(0, 100)}`);
          }
        }
      } else {
        console.log(`  ~ ${page.slug}: ${existingPage ? 'found (would update)' : 'not found (would create)'}`);
      }
    } catch (error) {
      console.error(`  ✗ ${page.slug}: ${error.message}`);
    }
  }

  if (!DO_PUSH) {
    console.log('');
    console.log('To push these pages, run:');
    console.log('  node scripts/push-cte-pages-to-payload.mjs --push');
  }
}

pushToPayload().catch(console.error);
