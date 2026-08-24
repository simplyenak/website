#!/usr/bin/env node
/**
 * Sync dishes FROM Payload CMS → src/data/dishes.ts (snapshot, same pattern as site/ tours.json).
 *
 * Payload is source of truth for: name, description, category, origin, region,
 * dietary statuses (dietaryTags = safe; vendorNotes `dietaryId|status|note` lines = caution/avoid).
 * Local-only attributes (tourSlug, image, imageAlt) are merged back in by slug so they survive syncs.
 *
 * Run:  node --experimental-strip-types scripts/sync-dishes-from-payload.mjs
 * Fails loudly (exit 1, leaves file untouched) if Payload is unreachable or data is inconsistent.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DISHES_TS = join(root, 'src/data/dishes.ts');

for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const PAYLOAD_URL = (process.env.PAYLOAD_URL || '').replace(/\/+$/, '');

async function api(path) {
  if (!PAYLOAD_URL) throw new Error('PAYLOAD_URL missing');
  const res = await fetch(`${PAYLOAD_URL}${path}`, {
    headers: { Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY || ''}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
  return res.json();
}

// --- maps (mirror of push-dishes-to-payload.mjs) ---
const CATEGORY_LABEL = {
  rice: 'Rice', noodles: 'Noodles', main: 'Main', grilled: 'Grilled', snack: 'Snack',
  dessert: 'Dessert', beverage: 'Drink', coffee_tea: 'Drink', juice: 'Drink',
  traditional_drank: 'Drink', traditional_drink: 'Drink', breakfast: 'Breakfast',
  soup: 'Soup', seafood: 'Seafood', condiment: 'Condiment', herb: 'Ingredient',
  ingredient: 'Ingredient', sweetener: 'Ingredient',
};
const ORIGIN_LABEL = {
  malay: 'Malay', chinese: 'Chinese', indian: 'Indian', peranakan: 'Nyonya',
  thai: 'Thai', indonesian: 'Indonesian', fusion: 'Fusion', international: 'International',
  southeast_asian: 'Southeast Asian', universal: 'Universal',
};
// dietary_options slug → local DietaryId (camelCase)
const DIET_ID = {
  vegetarian: 'vegetarian', vegan: 'vegan', halal: 'halal', 'gluten-free': 'glutenFree',
  'nut-free': 'nutFree', 'shellfish-free': 'shellfishFree', 'dairy-free': 'dairyFree',
  'egg-free': 'eggFree',
};
const DIET_ORDER = ['vegetarian', 'vegan', 'halal', 'glutenFree', 'nutFree', 'shellfishFree', 'dairyFree', 'eggFree'];
const NOTE_LINE = /^(vegetarian|vegan|halal|glutenFree|nutFree|shellfishFree|dairyFree|eggFree)\|(safe|caution|avoid)\|(.+)$/;

// --- local-only attributes to preserve ---
const { dishes: localDishes, dietaryRestrictions } = await import(DISHES_TS);
const localBySlug = new Map(localDishes.map((d) => [d.id, d]));

// --- fetch ---
const [itemsRes, optionsRes] = await Promise.all([
  api('/api/food_items?limit=200&depth=1&where[status][equals]=published'),
  api('/api/dietary_options?limit=100&depth=0'),
]);
// Only include checker items: pushed dishes carry checker data (dietaryTags or
// the vendorNotes block) or are already known locally. Other food_items docs
// (e.g. unrelated published entries) are skipped with a notice.
const skipped = [];
const items = itemsRes.docs.filter((d) => {
  const isChecker = (d.dietaryTags && d.dietaryTags.length > 0)
    || (d.vendorNotes || '').includes('dietary-checker:')
    || localBySlug.has(d.slug);
  if (!isChecker) skipped.push(d.slug);
  return isChecker;
});
if (skipped.length) console.log(`Skipped non-checker food_items: ${skipped.join(', ')}`);
const optionsBySlug = new Map(optionsRes.docs.map((o) => [o.slug, o]));

// dietaryRestrictions: keep the 8 core ones in fixed order, values from CMS
const restrictions = DIET_ORDER.map((id) => {
  const slug = id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const opt = optionsBySlug.get(slug);
  const fallback = dietaryRestrictions.find((r) => r.id === id);
  return {
    id,
    label: opt?.name || fallback?.label,
    icon: opt?.icon || fallback?.icon,
    description: opt?.description || fallback?.description,
  };
});

// --- map dishes ---
const out = [];
const errors = [];
for (const item of items) {
  const statuses = {};
  const notes = {};

  for (const tag of item.dietaryTags || []) {
    const id = DIET_ID[tag.slug];
    if (id && !statuses[id]) statuses[id] = 'safe';
  }
  for (const line of (item.vendorNotes || '').split('\n')) {
    const m = line.match(NOTE_LINE);
    if (!m) continue;
    statuses[m[1]] = m[2];
    if (m[3]) notes[m[1]] = m[3];
  }

  for (const id of DIET_ORDER) {
    if (!statuses[id]) errors.push(`${item.slug}: no status for ${id} (not in dietaryTags nor vendorNotes)`);
  }
  if (item.dietaryTags?.some((t) => !DIET_ID[t.slug])) {
    // extra CMS tags (kosher, no-msg…) — fine, checker ignores
  }

  const local = localBySlug.get(item.slug);
  const originLabel = item.origin === 'southeast_asian' && item.region === 'Sarawak'
    ? 'Sarawak' : ORIGIN_LABEL[item.origin] || item.origin;

  out.push({
    id: item.slug,
    name: item.name,
    category: CATEGORY_LABEL[item.category] || item.category,
    origin: originLabel,
    description: item.description,
    ...Object.fromEntries(DIET_ORDER.map((id) => [id, statuses[id] || 'safe'])),
    ...(Object.keys(notes).length ? { notes } : {}),
    ...(local?.image ? { image: local.image, imageAlt: local.imageAlt } : {}),
    ...(local?.tourSlug ? { tourSlug: local.tourSlug } : {}),
  });
}

if (errors.length) {
  console.error('FAIL — data inconsistencies, file NOT written:');
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}

// --- emit ---
const q = (s) => JSON.stringify(s ?? '');
const dishBlock = (d) => {
  const lines = [
    `    id: ${q(d.id)},`,
    `    name: ${q(d.name)},`,
    `    category: ${q(d.category)},`,
    `    origin: ${q(d.origin)},`,
    `    description: ${q(d.description)},`,
    ...DIET_ORDER.map((id) => `    ${id}: ${q(d[id])},`),
  ];
  if (d.notes) {
    lines.push('    notes: {');
    for (const [k, v] of Object.entries(d.notes)) lines.push(`      ${k}: ${q(v)},`);
    lines.push('    },');
  }
  if (d.image) {
    lines.push(`    image: ${q(d.image)},`);
    lines.push(`    imageAlt: ${q(d.imageAlt)},`);
  }
  if (d.tourSlug) lines.push(`    tourSlug: ${q(d.tourSlug)},`);
  return `  {\n${lines.join('\n')}\n  },`;
};

const header = `/**
 * AUTO-GENERATED by scripts/sync-dishes-from-payload.mjs — DO NOT EDIT.
 * Source of truth: Payload CMS (food_items + dietary_options).
 * To change content: edit in Payload admin, then run \`npm run sync:dishes\`.
 *
 * Each dish has dietary status tags: 'safe' | 'caution' | 'avoid'.
 * \`notes\` holds a short explanation per dietary restriction — only for
 * restrictions where the dish is caution or avoid.
 */

export type DietaryId =
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'glutenFree'
  | 'nutFree'
  | 'shellfishFree'
  | 'dairyFree'
  | 'eggFree';

type Status = 'safe' | 'caution' | 'avoid';

export interface Dish {
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  vegetarian: Status;
  vegan: Status;
  halal: Status;
  glutenFree: Status;
  nutFree: Status;
  shellfishFree: Status;
  dairyFree: Status;
  eggFree: Status;
  notes?: Partial<Record<DietaryId, string>>;
  image?: string;
  imageAlt?: string;
  tourSlug?: string;
}

export const dishes: Dish[] = [
`;

const footer = `];

export const dietaryRestrictions = [
${restrictions.map((r) => `  { id: ${q(r.id)}, label: ${q(r.label)}, icon: ${q(r.icon)}, description: ${q(r.description)} },`).join('\n')}
];
`;

writeFileSync(DISHES_TS, header + out.map(dishBlock).join('\n') + '\n' + footer);
console.log(`Synced ${out.length} dishes from Payload → src/data/dishes.ts (restrictions: ${restrictions.map((r) => r.id).join(', ')})`);
console.log(`Preserved local-only attrs: images on ${out.filter((d) => d.image).length}, tourSlug on ${out.filter((d) => d.tourSlug).length}`);
