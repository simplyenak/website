#!/usr/bin/env node
/**
 * Push whattoeatinmalaysia state dishes → Payload CMS `food_items` (upsert by slug).
 *
 * Keeps datasets separate from the dietary checker (whatcanieatinmy):
 *   - NO dietaryTags, NO allergens, vendorNotes uses `wtm-dish:` marker
 *     (checker sync only picks up docs with dietaryTags or `dietary-checker:`)
 *   - `region` field carries the WTM state name
 *   - where / famousAt / bestTime / halal / full origin text live in
 *     vendorNotes lines: `key|value` (famousAt joined with ` ;; `)
 *
 * Skips slugs owned by the checker dataset (char-kway-teow, nasi-kandar).
 *
 * Run:  node --experimental-strip-types scripts/push-dishes-to-payload.mjs
 * Env:  ./.env, or falls back to ../whatcanieatinmy/.env (no secret duplication)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- env (own .env first, then sibling checker project's) ---
const envPaths = [join(root, '.env'), join(root, '..', 'whatcanieatinmy', '.env')];
for (const p of envPaths) {
  try {
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
    break;
  } catch {}
}
const PAYLOAD_URL = process.env.PAYLOAD_URL || '';
const PAYLOAD_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
if (!PAYLOAD_URL || !PAYLOAD_KEY) {
  console.error('FAIL: PAYLOAD_URL / PAYLOAD_ADMIN_API_KEY missing (checked ./.env and ../whatcanieatinmy/.env)');
  process.exit(1);
}
const api = async (path, opts = {}) => {
  const res = await fetch(`${PAYLOAD_URL}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `users API-Key ${PAYLOAD_KEY}`, ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
};

// --- data ---
const { states } = await import(join(root, 'src', 'data', 'dishes.ts'));

// Checker-owned slugs: full 8-restriction data lives there already; never overwrite.
const SKIP = new Set(['char-kway-teow', 'nasi-kandar']);

const ORIGIN_MAP = {
  'Malay': 'malay',
  'Malay (northern)': 'malay',
  'Malay (Pahang)': 'malay',
  'Arab-Malay': 'malay',
  'Chinese': 'chinese',
  'Chinese (Teochew)': 'chinese',
  'Chinese (Hokkien)': 'chinese',
  'Chinese (Cantonese)': 'chinese',
  'Chinese-Hainanese': 'chinese',
  'Chinese-Sarawakian': 'chinese',
  'Indian-Muslim': 'indian',
  'Peranakan': 'peranakan',
  'Malay-Peranakan': 'peranakan',
  'Minangkabau': 'indonesian',
  'Kadazan-Dusun': 'southeast_asian',
  'Iban': 'southeast_asian',
  'Sarawakian': 'southeast_asian',
  'Melanau': 'southeast_asian',
  'Perlis (native variety)': 'malay',
};

// Category: explicit per-dish overrides beat keyword rules (ordered, first match wins).
const CATEGORY_OVERRIDE = {
  'oh-chien': 'main', 'satay-celup': 'main', 'sambal-hitam': 'condiment',
  'harumanis': 'dessert', 'air-nira': 'beverage', 'pekasam': 'ingredient',
  'teluk-intan-ccf': 'snack', 'pulut-sambal': 'rice', 'manok-pansoh': 'main',
  'masak-lemak-cili-api': 'main', 'daging-salai-lemak': 'main',
  'kacang-pool-jb': 'main', 'patin-tempoyak-temerloh': 'main',
};
function categorize(id) {
  if (CATEGORY_OVERRIDE[id]) return CATEGORY_OVERRIDE[id];
  if (/cendol|cek-mek|kuih/.test(id)) return 'dessert';
  if (/murtabak|percik/.test(id)) return 'grilled';
  if (/satay|ikan-bakar|otak-otak/.test(id)) return 'grilled';
  if (/crab|seafood|umai|hinava|fish-soup/.test(id)) return 'seafood';
  if (/midin|tuhau/.test(id)) return 'herb';
  if (/keropok|sata|pau|heong-peng/.test(id)) return 'snack';
  if (/laksa|mee|hor-fun|kolok|pan-mee|ccf/.test(id)) return 'noodles';
  if (/nasi|briyani/.test(id)) return 'rice';
  if (/bak-kut-teh|fish-head|soup/.test(id)) return 'soup';
  return 'main';
}

function toPayloadDoc(dish, state) {
  const origin = ORIGIN_MAP[dish.origin];
  if (!origin) throw new Error(`${dish.id}: unmapped origin "${dish.origin}"`);
  const lines = [
    'wtm-dish:',
    `state|${state.id}`,
    `stateName|${state.name}`,
    `halal|${dish.halal}`,
    `where|${dish.where}`,
  ];
  if (dish.famousAt?.length) lines.push(`famous|${dish.famousAt.join(' ;; ')}`);
  if (dish.bestTime) lines.push(`best|${dish.bestTime}`);
  if (dish.origin) lines.push(`origin-full|${dish.origin}`);
  for (const ln of lines) {
    if (ln.split('|').slice(1).join('|').includes('\n')) throw new Error(`${dish.id}: newline in value`);
  }
  return {
    name: dish.name,
    slug: dish.id,
    description: dish.what,
    category: categorize(dish.id),
    origin,
    region: state.name,
    dietaryTags: [],
    allergens: [],
    vendorNotes: lines.join('\n'),
    status: 'published',
  };
}

// --- upsert ---
const existing = new Map(
  (await api('/api/food_items?limit=500&depth=0')).docs.map((d) => [d.slug, d.id]),
);

let created = 0, updated = 0, failed = 0, skipped = 0;
for (const state of states) {
  for (const dish of state.dishes) {
    if (SKIP.has(dish.id)) { skipped++; continue; }
    try {
      const doc = toPayloadDoc(dish, state);
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
}
console.log(`\nWTM dishes → Payload: ${created} created, ${updated} updated, ${skipped} skipped (checker-owned), ${failed} failed`);
if (failed) process.exit(1);
