#!/usr/bin/env node
/**
 * restore-payload-english.mjs
 *
 * RESTORES English content in Payload for collections whose shared (non-
 * localized) fields were overwritten by the ?locale=de push (2026-08-03).
 *
 * The bug: faqs/stories/testimonials have NO localized:true fields in
 * Payload, so PATCH ?locale=de wrote German into the shared English field.
 * This script reads the English source from the git JSON snapshots (base
 * fields, which are English) and PATCHes each doc WITHOUT ?locale to put
 * English back.
 *
 * Usage:
 *   node scripts/restore-payload-english.mjs                 # all collections
 *   node scripts/restore-payload-english.mjs --collection faqs
 *   node scripts/restore-payload-english.mjs --dry-run
 *
 * Env: PAYLOAD_URL, PAYLOAD_ADMIN_API_KEY
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_ADMIN_API_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY = process.argv.includes('--collection')
  ? process.argv[process.argv.indexOf('--collection') + 1] : null;

const COLLECTIONS = {
  faqs: { file: 'faqs.json', slug: 'faqs', idField: 'id', englishFields: ['question', 'answer'] },
  stories: { file: 'stories.json', slug: 'stories', idField: 'id', englishFields: ['title', 'excerpt'] },
  testimonials: { file: 'testimonials.json', slug: 'testimonials', idField: 'id', englishFields: ['review_title', 'review_text'] },
};

// English source override: the auto-sync pulled the corrupted German back
// into git, so the CURRENT base fields are German. Restore English from the
// last known-good commit (fd7c6a5cd — pre-corruption). Pass
// EN_SOURCE_DIR=/path/to/english/json to use different files.
const EN_SOURCE_DIR = process.env.EN_SOURCE_DIR || '';
const EN_SOURCES = {};
for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  if (EN_SOURCE_DIR) {
    const p = path.join(EN_SOURCE_DIR, cfg.file);
    if (fs.existsSync(p)) EN_SOURCES[name] = JSON.parse(fs.readFileSync(p, 'utf-8'));
  }
}

if (!PAYLOAD_ADMIN_API_KEY) {
  console.error('PAYLOAD_ADMIN_API_KEY not set');
  process.exit(1);
}

const auth = `users API-Key ${PAYLOAD_ADMIN_API_KEY}`;

async function patchDoc(collectionSlug, id, body) {
  const res = await fetch(`${PAYLOAD_URL}/api/${collectionSlug}/${id}?depth=0`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 150)}`);
  }
  return res.json();
}

let total = 0;
let errors = 0;

for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  if (ONLY && name !== ONLY) continue;
  const filePath = path.join(CONTENT_DIR, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠  ${cfg.file} missing`); continue; }

  const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  // Use the English source (from EN_SOURCE_DIR) if provided — the current
  // base fields may be corrupted (German pulled back by auto-sync).
  const enItems = EN_SOURCES[name] || items;
  const enById = Object.fromEntries(enItems.map((i) => [String(i[cfg.idField]), i]));
  console.log(`\n=== ${name}: restoring English for ${items.length} docs ===`);

  for (const item of items) {
    const id = item[cfg.idField];
    if (!id) { errors++; continue; }

    // Build English body from the ENGLISH source item (not the corrupted base)
    const enItem = enById[String(id)] || item;
    const body = {};
    for (const f of cfg.englishFields) {
      const val = enItem[f];
      if (val !== undefined && val !== null && val !== '') {
        body[f] = val;
      }
    }
    if (Object.keys(body).length === 0) { errors++; continue; }

    if (DRY_RUN) {
      console.log(`  [DRY] would restore ${name}/${id}: ${JSON.stringify(body).slice(0, 80)}`);
      total++;
      continue;
    }
    try {
      await patchDoc(cfg.slug, id, body);
      total++;
    } catch (err) {
      console.log(`  ✗ ${name}/${id}: ${err.message}`);
      errors++;
    }
  }
}

console.log(`\nDone: ${total} restored, ${errors} errors${DRY_RUN ? ' (DRY RUN)' : ''}`);
