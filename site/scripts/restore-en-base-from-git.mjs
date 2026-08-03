#!/usr/bin/env node
/**
 * restore-en-base-from-git.mjs
 *
 * Restores contaminated EN base fields (Spanish/Portuguese/Japanese/Chinese
 * written into the English base by the earlier ?locale= PATCH bug) from the
 * last-known-good git JSON.
 *
 * Flow:
 *   1. Run check-en-contamination.mjs to find contaminated items
 *   2. For each, read the EN source from EN_SOURCE_DIR (git-exported JSON)
 *   3. Copy the EN value into the base field
 *   4. Optionally push the corrected EN to Payload
 *
 * Usage:
 *   EN_SOURCE_DIR=/tmp/en-src node scripts/restore-en-base-from-git.mjs
 *   EN_SOURCE_DIR=/tmp/en-src node scripts/restore-en-base-from-git.mjs --dry-run
 *   EN_SOURCE_DIR=/tmp/en-src node scripts/restore-en-base-from-git.mjs --push
 *
 * Env: PAYLOAD_ADMIN_API_KEY (for --push)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Script lives at site/scripts/ — ROOT is the repo root (one level up from site)
const ROOT = path.resolve(__dirname, '../../');
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const registryPath = path.resolve(__dirname, '../scripts/lib/translation-collections.mjs');
const { COLLECTIONS } = await import(registryPath);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PUSH = args.includes('--push');
const EN_SOURCE_DIR = process.env.EN_SOURCE_DIR || '';

if (!EN_SOURCE_DIR) { console.error('EN_SOURCE_DIR not set (path to git-exported English JSON)'); process.exit(1); }

// ─── EN source strategy ─────────────────────────────────────────────────────
// Payload live is the source of truth for EN base fields (verified correct
// 2026-08-03). Fall back to EN_SOURCE_DIR (git-exported) only for fields
// Payload doesn't return. Fetching live EN avoids using contaminated git
// snapshots as the restore source.
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const ADMIN = process.env.PAYLOAD_ADMIN_API_KEY || '';

// Local JSON filename → Payload collection slug
const FILE_TO_SLUG = {
  'home-page.json': 'home_page',
  'about-page.json': 'about_page',
  'contact-page.json': 'contact_page',
  'tours-page.json': 'tours_page',
  'faqs.json': 'faqs',
  'stories.json': 'stories',
  'tours.json': 'tours',
  'testimonials.json': 'testimonials',
  'location-landing-pages.json': 'landing_pages',
  'dietary-landing-pages.json': 'landing_pages',
  'specialty-landing-pages.json': 'landing_pages',
  'travel-type-landing-pages.json': 'landing_pages',
};

async function fetchEnFromPayload(fileName, id) {
  if (!ADMIN) return null;
  const slug = FILE_TO_SLUG[fileName];
  if (!slug) return null;
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/${slug}/${id}?locale=en&depth=0`, {
      headers: { 'Authorization': `users API-Key ${ADMIN}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// Reuse the contamination checker logic (eval/ is at repo root)
const { execSync } = await import('node:child_process');
const checkOut = execSync(`node "${path.resolve(ROOT, 'eval/check-en-contamination.mjs')}"`, { encoding: 'utf-8', cwd: ROOT });
const { contaminated } = JSON.parse(checkOut);

// Group by collection → id → fields
const byColl = {};
for (const c of contaminated) {
  (byColl[c.collection] ||= {})[c.id] ||= [];
  byColl[c.collection][c.id].push(c.field);
}

let restored = 0;
let errors = 0;

for (const [collName, items] of Object.entries(byColl)) {
  const cfg = COLLECTIONS[collName];
  if (!cfg) { console.log(`  ⚠  no config for ${collName}`); continue; }
  const filePath = path.join(CONTENT_DIR, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`  ⚠  ${cfg.file} missing`); continue; }

  const enSrcPath = path.join(EN_SOURCE_DIR, cfg.file);
  if (!fs.existsSync(enSrcPath)) { console.log(`  ⚠  EN source missing: ${cfg.file} — skipping collection`); continue; }
  const enItems = JSON.parse(fs.readFileSync(enSrcPath, 'utf-8'));
  const enById = Object.fromEntries((Array.isArray(enItems) ? enItems : [enItems]).map((i) => [String(i.id ?? i.slug ?? i.question ?? '?'), i]));

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const itemArr = Array.isArray(data) ? data : [data];
  const fieldsByItem = byColl[collName];

  for (const item of itemArr) {
    const idKey = String(item.id ?? item.slug ?? item.question ?? '?');
    const fields = fieldsByItem[idKey] || [];
    if (fields.length === 0) continue;
    // EN source: prefer the git snapshot (9c85674ae-era has clean English for
    // singletons). Payload live may ALSO be contaminated for these fields
    // (the ?locale bug wrote wrong-locale values into Payload's base too), so
    // only fall back to Payload when git lacks the field.
    const enItem = enById[idKey];
    if (!enItem) { console.log(`  ⚠  ${collName}/${idKey}: no git EN source found`); errors++; continue; }

    for (const field of fields) {
      const enVal = enItem[field];
      const current = item[field];
      if (enVal === undefined || enVal === null || enVal === '') {
        console.log(`  ⚠  ${collName}/${idKey}.${field}: EN source empty, keeping current`);
        errors++;
        continue;
      }
      if (DRY_RUN) {
        console.log(`  [DRY] ${collName}/${idKey}.${field}: "${String(current).slice(0, 30)}" → "${String(enVal).slice(0, 30)}"`);
        restored++;
        continue;
      }
      item[field] = enVal;
      restored++;
      if (PUSH && ADMIN && item.id) {
        // push corrected EN to Payload (no ?locale — base field)
        const body = { [field]: enVal };
        const res = await fetch(`${PAYLOAD_URL}/api/${cfg.localizedInPayload === true ? cfg.file.replace('.json','') : cfg.file.replace('.json','')}/${item.id}?depth=0`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `users API-Key ${ADMIN}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) console.log(`    ✗ Payload ${item.id}.${field}: ${(await res.text()).slice(0, 80)}`);
      }
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`  ✓ wrote ${cfg.file}`);
  }
}

console.log(`\nDone: ${restored} fields restored, ${errors} errors${DRY_RUN ? ' [DRY RUN]' : ''}`);
