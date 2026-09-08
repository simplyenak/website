#!/usr/bin/env node
/**
 * push-translations-field.mjs
 *
 * Writes the `translations[]` array (per-locale copies, keyed by languages_code)
 * from the site JSON snapshots INTO Payload's `translations` json field for the
 * spreadsheet-style content collections (stories, faqs, testimonials, and the
 * singleton pages). This makes translations live in Payload (admin-editable) and
 * the single source of truth, while the committed JSON stays the non-live build
 * mirror (auto-sync reads it back).
 *
 * This is DIFFERENT from push-translations-payload.mjs, which writes native
 * localized:true fields via ?locale= for tours. These collections are NOT native
 * localized — writing the whole array as a plain field PATCH (NO ?locale) is the
 * only safe route (a ?locale write on a non-localized field corrupts the shared
 * English value).
 *
 * Env: PAYLOAD_URL, PAYLOAD_ADMIN_API_KEY (or PAYLOAD_EMAIL + PAYLOAD_PASSWORD)
 * Usage:
 *   node site/scripts/push-translations-field.mjs            # all collections
 *   node site/scripts/push-translations-field.mjs --collection stories
 *   node site/scripts/push-translations-field.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_ADMIN_API_KEY = process.env.PAYLOAD_ADMIN_API_KEY || '';
const PAYLOAD_EMAIL = process.env.PAYLOAD_EMAIL || '';
const PAYLOAD_PASSWORD = process.env.PAYLOAD_PASSWORD || '';

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_COLLECTION = process.argv.includes('--collection')
  ? process.argv[process.argv.indexOf('--collection') + 1] : null;

// JSON snapshot file -> Payload collection slug (collections with a `translations`
// json field added 2026-09-08; tours excluded — it uses native localized fields).
const COLLECTIONS = {
  stories: { file: 'stories.json', payloadSlug: 'stories' },
  faqs: { file: 'faqs.json', payloadSlug: 'faqs' },
  testimonials: { file: 'testimonials.json', payloadSlug: 'testimonials' },
  home_page: { file: 'home-page.json', payloadSlug: 'home_page' },
  about_page: { file: 'about-page.json', payloadSlug: 'about_page' },
  contact_page: { file: 'contact-page.json', payloadSlug: 'contact_page' },
  tours_page: { file: 'tours-page.json', payloadSlug: 'tours_page' },
  stories_page: { file: 'stories-page.json', payloadSlug: 'stories_page' },
};

let auth = '';
async function ensureAuth() {
  if (auth) return;
  if (PAYLOAD_ADMIN_API_KEY) {
    auth = `users API-Key ${PAYLOAD_ADMIN_API_KEY}`;
    return;
  }
  if (PAYLOAD_EMAIL && PAYLOAD_PASSWORD) {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
    const data = await res.json();
    auth = `JWT ${data.token}`;
    return;
  }
  throw new Error('No PAYLOAD_ADMIN_API_KEY or PAYLOAD_EMAIL/PASSWORD');
}

const emptyTranslations = (t) => !Array.isArray(t) || t.length === 0;

async function patchTranslations(payloadSlug, id, translations) {
  const url = `${PAYLOAD_URL}/api/${payloadSlug}/${id}?depth=0&draft=false`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ translations }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Payload validates the WHOLE doc on PATCH even for a partial body: a
    // singleton whose required fields are empty returns 400 for a translations-
    // only write. Retry by echoing the current scalar values (unchanged, but
    // present) so required-field validation passes. Values are preserved as-is.
    if (res.status === 400) {
      const docRes = await fetch(url, { headers: { Authorization: auth }, signal: AbortSignal.timeout(20000) });
      if (docRes.ok) {
        const doc = await docRes.json();
        const body = { translations };
        for (const [k, v] of Object.entries(doc)) {
          if (['id', 'createdAt', 'updatedAt', '_status', 'translations'].includes(k)) continue;
          if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) {
            body[k] = v;
          }
        }
        const retry = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: auth },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });
        if (retry.ok) return retry.json();
        throw new Error(`HTTP ${retry.status}: ${(await retry.text().catch(() => '')).slice(0, 200)}`);
      }
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function pushOne(name, cfg) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`  ⚠  ${cfg.file} not found — skipping`); return; }
  const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const list = Array.isArray(items) ? items : [items];
  let updated = 0, skipped = 0, errors = 0;
  for (const it of list) {
    if (!it.id && !it.slug) { skipped++; continue; }
    const id = it.id || it.slug;
    if (emptyTranslations(it.translations)) { skipped++; continue; }
    if (DRY_RUN) { skipped++; continue; }
    try {
      await patchTranslations(cfg.payloadSlug, id, it.translations);
      updated++;
    } catch (e) {
      errors++;
      console.log(`    ✗ ${name}/${id}: ${e.message}`);
    }
  }
  console.log(`  ${name}: ${updated} updated, ${skipped} skipped${DRY_RUN ? ' (dry-run)' : ''}, ${errors} errors`);
}

const targets = ONLY_COLLECTION
  ? { [ONLY_COLLECTION]: COLLECTIONS[ONLY_COLLECTION] }
  : COLLECTIONS;

for (const [name, cfg] of Object.entries(targets)) {
  if (!cfg) { console.log(`  ⚠  unknown collection '${ONLY_COLLECTION}'`); continue; }
  try {
    await ensureAuth();
    await pushOne(name, cfg);
  } catch (e) {
    console.log(`  ✗ ${name}: ${e.message}`);
  }
}