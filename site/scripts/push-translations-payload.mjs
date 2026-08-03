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
// Admin API key (from a user with create/update access on the target
// collections) — the read-only PAYLOAD_TOKEN cannot write. Set
// PAYLOAD_ADMIN_API_KEY to a user's API key (Users collection has
// useAPIKey enabled). Auth header: "users API-Key <key>".
const PAYLOAD_ADMIN_API_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
const PAYLOAD_EMAIL = process.env.PAYLOAD_EMAIL || '';
const PAYLOAD_PASSWORD = process.env.PAYLOAD_PASSWORD || '';
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_COLLECTION = process.argv.includes('--collection')
  ? process.argv[process.argv.indexOf('--collection') + 1] : null;

const { COLLECTIONS, ALL_LANGS } = await import('./lib/translation-collections.mjs');

// Language filter: --lang ms,zh  or --lang all  (default: all)
const LANG_ARG = process.argv.find(a => a.startsWith('--lang='));
const TARGET_LANGS = LANG_ARG ? LANG_ARG.split('=')[1].split(',').map(l => l.trim()).filter(l => ALL_LANGS.includes(l)) : ALL_LANGS;
let authToken = ''; // set by authenticate() — prefer admin key, then login, then read-only token

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
  private_tours_page: 'private_tours_page',
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
  // Prefer the admin API key (can write). Falls back to login, then read-only token.
  if (authToken) return;
  if (PAYLOAD_ADMIN_API_KEY) {
    authToken = `users API-Key ${PAYLOAD_ADMIN_API_KEY}`;
    return;
  }
  if (!PAYLOAD_EMAIL || !PAYLOAD_PASSWORD) {
    authToken = `users API-Key ${PAYLOAD_TOKEN}`;
    return;
  }
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
  const data = await res.json();
  authToken = `JWT ${data.token}`;
  if (!data.token) throw new Error('Login returned no token');
}

async function patchItem(collectionSlug, itemId, body, locale) {
  const url = `${PAYLOAD_URL}/api/${collectionSlug}/${itemId}?locale=${locale}&depth=0`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken, // "users API-Key <key>" or "JWT <token>"
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

async function pushCollection(name, cfg, locale) {
  const slug = COLLECTION_SLUGS[name];
  if (!slug) {
    console.log(`  ⚠  No Payload collection slug for '${name}' — skipping`);
    return;
  }

  // Only collections explicitly marked `localizedInPayload: true` (native
  // localized:true fields in Payload) can accept ?locale=de PATCHes. For
  // everything else, writing with ?locale OVERWRITES the shared English field
  // (Payload behavior confirmed 2026-08-03: faqs/stories/testimonials/
  // landing_pages en got corrupted). SAFE DEFAULT: no flag = don't push.
  if (cfg.localizedInPayload !== true) {
    console.log(`  ⏭️  ${name}: not natively localized in Payload — translations stay in git JSON (skipping Payload push)`);
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

    // Find the target locale translation
    const translations = item.translations;
    if (!translations || !Array.isArray(translations)) {
      skippedCount++;
      continue;
    }

    const targetTrans = translations.find(t =>
      (t.languages_code || t.locale) === locale
    );
    const enTrans = translations.find(t =>
      (t.languages_code || t.locale) === 'en'
    );

    if (!targetTrans) {
      skippedCount++;
      continue;
    }

    // Build payload with translatable fields
    const body = {};
    let hasContent = false;
    const ignoreKeys = new Set(['id', 'languages_code', 'locale', 'updatedAt', 'createdAt']);
    const htmlFields = new Set(cfg.htmlFields || []);
    // Map local (snake_case) field names → Payload (camelCase) field names
    const fieldMap = cfg.payloadFieldMap || {};

    // Checkbox fields Payload validates on locale PATCH — must be sent
    // explicitly or the update fails ("can only be equal to true or false").
    // Pull the current value from the item (default false).
    const checkboxFields = cfg.checkboxFields || [];
    for (const cb of checkboxFields) {
      body[cb] = item[cb] === true || item[cb] === 'true';
    }

    for (const field of cfg.translatableFields) {
      const payloadField = fieldMap[field] || field;
      if (htmlFields.has(field)) {
        // Include original English value for required rich text fields to satisfy validation
        const origVal = item[field] || (enTrans || {})[field];
        if (origVal !== undefined && origVal !== null) {
          body[payloadField] = origVal;
        }
        continue;
      }
      const targetVal = targetTrans[field];
      if (targetVal !== undefined && targetVal !== null) {
        // Skip corrupted values: arrays/strings containing "[object Object]"
        // (translator stringified nested objects it can't handle). Pushing
        // them breaks Payload's structured-field validation (HTTP 500).
        const serialized = typeof targetVal === 'string' ? targetVal : JSON.stringify(targetVal);
        if (serialized && serialized.includes('[object Object]')) {
          console.log(`    ⏭️  ${label}: skipping corrupted field ${field}`);
          continue;
        }
        // Wrap plain string arrays into Payload object-array shape
        // ({item: ...}) for fields like whatsIncluded/whatsExcluded.
        if ((cfg.arrayObjectFields || []).includes(field) && Array.isArray(targetVal)) {
          body[payloadField] = targetVal.map((s) => (typeof s === 'string' ? { item: s } : s));
        } else {
          body[payloadField] = targetVal;
        }
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
      await patchItem(slug, itemId, body, locale);
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

// ─── Schema verification (schema-first discipline) ──────────────────────────
// Before pushing, verify the localizedInPayload flags against the actual
// Payload collection source. A collection flagged true but with no
// localized:true fields would corrupt English on push (confirmed 2026-08-03).
// Run check-localized-collections.sh and warn on any mismatch.
const { execSync } = await import('node:child_process');

function verifyLocalizedFlags() {
  try {
    const out = execSync('bash scripts/check-localized-collections.sh ../revamp/backend/src/collections', {
      encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000,
    }).trim();
    // Map filename → count (case-insensitive, strip .ts)
    const schema = {};
    for (const line of out.split('\n')) {
      const [fname, count] = line.trim().split(/\s+/);
      if (fname && count !== undefined) schema[fname.toLowerCase().replace(/\.ts$/, '')] = parseInt(count, 10);
    }
    for (const [name, cfg] of Object.entries(COLLECTIONS)) {
      // Find the matching schema entry (Tours→tours, FAQs→faqs, AboutPage→about_page)
      const slug = cfg.file.replace(/\.json$/, '').replace(/-/g, '');
      let schemaCount = 0;
      for (const [fname, cnt] of Object.entries(schema)) {
        if (fname.replace(/_/g, '') === slug || fname === slug.replace(/_/g, '')) {
          schemaCount = cnt;
          break;
        }
      }
      if (cfg.localizedInPayload === true && schemaCount === 0) {
        console.warn(`  ⚠️  WARNING: ${name} flagged localizedInPayload but schema shows 0 localized fields — push would corrupt English! Verify before continuing.`);
      }
      if (cfg.localizedInPayload !== true && schemaCount > 0) {
        console.log(`  ℹ️  ${name}: schema has ${schemaCount} localized fields but not flagged — safe default keeps it in git JSON.`);
      }
    }
  } catch (e) {
    console.log('  (schema check skipped — collections dir not found locally)');
  }
}

// ─── Main ────────────────────────────────────────────────────

console.log(`\nPushing translations to Payload: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n  Languages: ${TARGET_LANGS.join(', ')}\n`);

try {
  await authenticate();
} catch (err) {
  console.error(`Auth failed: ${err.message}`);
  process.exit(1);
}

// Schema-first: verify localizedInPayload flags against the collection source
verifyLocalizedFlags();

for (const locale of TARGET_LANGS) {
  console.log(`\n── Locale: ${locale} ──\n`);
  for (const [name, cfg] of Object.entries(COLLECTIONS)) {
    if (ONLY_COLLECTION && name !== ONLY_COLLECTION) continue;
    await pushCollection(name, cfg, locale);
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors\n`);
process.exit(errors > 0 ? 1 : 0);
