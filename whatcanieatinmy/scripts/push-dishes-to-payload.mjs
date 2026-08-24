#!/usr/bin/env node
/**
 * Push local dish database → Payload CMS `food_items` (upsert by slug).
 *
 * Mapping:
 *   - id                    → slug
 *   - safe restrictions     → dietaryTags (relationship to dietary_options)
 *   - caution/avoid + note  → vendorNotes structured lines: `<dietaryId>|<status>|<note>`
 *   - avoid statuses        → allergens (shellfish/fish/peanuts/wheat/eggs/dairy)
 *   - category/origin       → Payload enum values
 *
 * Run:  node --experimental-strip-types scripts/push-dishes-to-payload.mjs
 * Env:  PAYLOAD_URL / PAYLOAD_TOKEN (read from ../.env of this project)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- env (no deps) ---
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const PAYLOAD_URL = process.env.PAYLOAD_URL || '';
// Users-collection API key (admin) — Payload header format: `users API-Key <key>`
// A plain JWT (PAYLOAD_TOKEN) expires; the API key does not.
const PAYLOAD_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
if (!PAYLOAD_URL || !PAYLOAD_KEY) {
  console.error('FAIL: PAYLOAD_URL / PAYLOAD_ADMIN_API_KEY missing in .env — aborting (empty default = loud failure)');
  process.exit(1);
}

const { dishes, dietaryRestrictions } = await import(join(root, 'src/data/dishes.ts'));

// --- maps ---
const CATEGORY_MAP = {
  Rice: 'rice', Noodles: 'noodles', Bread: 'main', Grilled: 'grilled',
  Snack: 'snack', Dessert: 'dessert', Fruit: 'snack', Drink: 'beverage',
  Breakfast: 'breakfast', Vegetarian: 'main', Curry: 'main', Soup: 'soup',
};
const ORIGIN_MAP = {
  Malay: 'malay', Chinese: 'chinese', Indian: 'indian', 'Indian-Muslim': 'indian',
  Nyonya: 'peranakan', Sarawak: 'southeast_asian',
};
// local DietaryId → dietary_options slug
const DIET_SLUG_MAP = Object.fromEntries(dietaryRestrictions.map((r) => {
  const slug = r.id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); // glutenFree → gluten-free
  return [r.id, slug];
}));

const ALLERGEN_FROM_DIET = {
  shellfishFree: 'shellfish', nutFree: 'peanuts', glutenFree: 'wheat',
  eggFree: 'eggs', dairyFree: 'dairy', vegan: null, vegetarian: null, halal: null,
};

// --- fetch dietary_options ids ---
async function api(path, opts = {}) {
  const res = await fetch(`${PAYLOAD_URL.replace(/\/+$/, '')}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${PAYLOAD_KEY}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const dietDocs = (await api('/api/dietary_options?limit=100')).docs;
const dietBySlug = new Map(dietDocs.map((d) => [d.slug, d.id]));

// create missing dietary_options (e.g. shellfish-free) — content op, no schema change
for (const [localId, slug] of Object.entries(DIET_SLUG_MAP)) {
  if (!dietBySlug.has(slug)) {
    const local = dietaryRestrictions.find((r) => r.id === localId);
    const label = slug.replace(/(^|-)([a-z])/g, (_, a, b) => (a ? ' ' : '') + b.toUpperCase())
      .replace(' Free', '-Free');
    const created = await api('/api/dietary_options', {
      method: 'POST',
      body: JSON.stringify({ name: label, slug, icon: local?.icon || '🍽️', description: local?.description || '', status: 'published' }),
    });
    dietBySlug.set(slug, created.doc.id);
    console.log(`+ dietary_options created: ${slug} (id ${created.doc.id})`);
  }
}

// --- build payload docs ---
function toPayloadDoc(dish) {
  const safeTags = [];
  const noteLines = [];
  const allergens = [];
  for (const r of dietaryRestrictions) {
    const status = dish[r.id];
    if (!status) throw new Error(`${dish.id}: missing status for ${r.id}`);
    if (status === 'safe') {
      const dietId = dietBySlug.get(DIET_SLUG_MAP[r.id]);
      if (!dietId) throw new Error(`${dish.id}: no dietary_options doc for ${r.id}`);
      safeTags.push(dietId);
    } else {
      const note = dish.notes?.[r.id] || '';
      if (note.includes('|')) throw new Error(`${dish.id}: note for ${r.id} contains "|" — reserved separator`);
      noteLines.push(`${r.id}|${status}|${note}`);
      if (status === 'avoid' && ALLERGEN_FROM_DIET[r.id]) allergens.push({ allergen: ALLERGEN_FROM_DIET[r.id] });
    }
  }
  const category = CATEGORY_MAP[dish.category];
  const origin = ORIGIN_MAP[dish.origin];
  if (!category) throw new Error(`${dish.id}: unmapped category "${dish.category}"`);
  if (!origin) throw new Error(`${dish.id}: unmapped origin "${dish.origin}"`);

  return {
    name: dish.name,
    slug: dish.id,
    description: dish.description,
    category,
    origin,
    region: dish.origin === 'Sarawak' ? 'Sarawak' : null,
    dietaryTags: safeTags,
    allergens,
    vendorNotes: noteLines.length ? `dietary-checker:\n${noteLines.join('\n')}` : null,
    status: 'published',
  };
}

// --- upsert ---
const existing = new Map(
  (await api('/api/food_items?limit=200&depth=0')).docs.map((d) => [d.slug, d.id]),
);

let created = 0, updated = 0, failed = 0;
for (const dish of dishes) {
  const doc = toPayloadDoc(dish);
  try {
    if (existing.has(dish.id)) {
      await api(`/api/food_items/${existing.get(dish.id)}`, { method: 'PATCH', body: JSON.stringify(doc) });
      updated++;
    } else {
      const res = await api('/api/food_items', { method: 'POST', body: JSON.stringify(doc) });
      existing.set(dish.id, res.doc.id);
      created++;
    }
  } catch (err) {
    failed++;
    console.error(`FAIL ${dish.id}: ${err.message}`);
  }
}
console.log(`\nPushed ${dishes.length} dishes → food_items: ${created} created, ${updated} updated, ${failed} failed`);
process.exit(failed ? 1 : 0);
