#!/usr/bin/env node
/**
 * push-translations-payload.mjs
 *
 * Reads MS translations from local content JSON files and pushes them to
 * Payload CMS via REST API, so they survive content resyncs.
 *
 * For each translated item, it PATCHes the Payload document with the MS
 * locale fields using Payload's ?locale=ms query parameter pattern.
 *
 * Usage:
 *   node scripts/push-translations-payload.mjs
 *   node scripts/push-translations-payload.mjs --dry-run
 *   node scripts/push-translations-payload.mjs --collection tours
 *
 * Env:
 *   PAYLOAD_URL
 *   PAYLOAD_TOKEN           — direct API token
 *   PAYLOAD_EMAIL + PAYLOAD_PASSWORD  — email login (fallback)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || '';
const PAYLOAD_EMAIL = process.env.PAYLOAD_EMAIL || '';
const PAYLOAD_PASSWORD = process.env.PAYLOAD_PASSWORD || '';
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_COLLECTION = process.argv.includes('--collection')
  ? process.argv[process.argv.indexOf('--collection') + 1] : null;

const { COLLECTIONS, ALL_LANGS } = await import('./lib/translation-collections.mjs');

const MANDATORY_LANG = 'ms';
let authToken = PAYLOAD_TOKEN;

// Stats
let updated = 0;
let skipped = 0;
let errors = 0;

// Collection slug → JSON file mapping for Payload
const COLLECTION_SLUGS = {
  tours: 'tours',
  stories: 'stories',
  faqs: 'faqs',
  testimonials: 'testimonials',
  home_page: 'home_page',
  about_page: 'about_page',
  tours_index_page: 'tour-index-pages',
  faq_page: 'faq-pages',
  private_tours_page: 'private-tours-pages',
  join_in_tours_page: 'join-in-tours-pages',
  stories_index_page: 'stories-index-pages',
  stories_archive_page: 'stories-archive-pages',
  landing_pages_dietary: 'landing_pages',
  landing_pages_specialty: 'landing_pages',
  landing_pages_travel_type: 'landing_pages',
  landing_pages_location: 'landing_pages',
};

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return null;
  }
}

async function authenticate() {
  if (authToken) return;
  if (!PAYLOAD_EMAIL || !PAYLOAD_PASSWORD) {
    throw new Error('Need PAYLOAD_TOKEN or PAYLOAD_EMAIL+PAYLOAD_PASSWORD');
  }
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
  const data = await res.json();
  authToken = data.token;
  if (!authToken) throw new Error('Login returned no token');
}

async function patchItem(collectionSlug, itemId, body) {
  const url = `${PAYLOAD_URL}/api/${collectionSlug}/${itemId}?locale=${MANDATORY_LANG}&depth=0`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${authToken}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function pushCollection(name, cfg) {
  const slug = COLLECTION_SLUGS[name];
  if (!slug) {
    console.log(`  ⚠  No Payload collection slug for '${name}' — skipping`);
    return;
  }

  const filePath = path.join(CONTENT_DIR, cfg.file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  ${cfg.file} not found — skipping`);
    return;
  }

  const items = loadJson(filePath);
  if (!items || (cfg.type === 'array' && !Array.isArray(items))) {
    console.log(`  ⚠  ${cfg.file} invalid — skipping`);
    return;
  }

  const itemList = cfg.type === 'array' ? items : [items];
  const label = `${name} (${itemList.length} items)`;

  process.stdout.write(`  ${label}... `);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of itemList) {
    if (!item.id && !item.slug) {
      skippedCount++;
      continue;
    }

    // Find the MS translation
    const translations = item.translations;
    if (!translations || !Array.isArray(translations)) {
      skippedCount++;
      continue;
    }

    const msTrans = translations.find(t =>
      (t.languages_code || t.locale) === MANDATORY_LANG
    );

    if (!msTrans) {
      skippedCount++;
      continue;
    }

    // Build payload with translatable fields
    const body = {};
    let hasContent = false;
    const ignoreKeys = new Set(['id', 'languages_code', 'locale', 'updatedAt', 'createdAt']);

    for (const field of cfg.translatableFields) {
      if (msTrans[field] !== undefined && msTrans[field] !== null) {
        body[field] = msTrans[field];
        hasContent = true;
      }
    }

    if (!hasContent) {
      skippedCount++;
      continue;
    }

    const itemId = item.id;

    if (DRY_RUN) {
      console.log(`\n    [DRY RUN] would update ${slug}/${itemId} (${Object.keys(body).length} fields)`);
      skippedCount++;
      continue;
    }

    try {
      await patchItem(slug, itemId, body);
      updatedCount++;
    } catch (err) {
      console.log(`\n    ✗ ${slug}/${itemId}: ${err.message}`);
      errors++;
    }
  }

  // Don't log per-collection line if dry run already printed
  if (!DRY_RUN) {
    console.log(`${updatedCount} updated, ${skippedCount} skipped`);
  }

  updated += updatedCount;
  skipped += skippedCount;
}

// ─── Main ────────────────────────────────────────────────────

console.log(`\nPushing MS translations to Payload: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

try {
  await authenticate();
} catch (err) {
  console.error(`Auth failed: ${err.message}`);
  process.exit(1);
}

for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  if (ONLY_COLLECTION && name !== ONLY_COLLECTION) continue;
  await pushCollection(name, cfg);
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors\n`);
process.exit(errors > 0 ? 1 : 0);
