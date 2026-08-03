#!/usr/bin/env node
/**
 * check-i18n-coverage.mjs
 *
 * Scans all content JSON files against the translation collection registry
 * and reports missing/stale translations per language.
 *
 * EN is the ONLY source of truth. All 9 non-EN locales (ms, zh, de, es, fr,
 * nl, ru, ja, pt) are symmetric translation targets — no language is special.
 *
 * Output: JSON with summary + per-collection results.
 * Exit 0 always (informational — doesn't block builds).
 *
 * Usage:  node eval/check-i18n-coverage.mjs [--json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT, 'site/src/data/content');

const registryPath = path.resolve(ROOT, 'site/scripts/lib/translation-collections.mjs');
const { COLLECTIONS, ALL_LANGS } = await import(registryPath);

// All 9 non-EN languages are expected targets — symmetric, none special.
const EXPECTED_LANGS = ALL_LANGS.filter((l) => l !== 'en');

// Collections where translations are genuinely expected (all of them — every
// collection with translatable fields should eventually carry all languages).
const EXPECTED = new Set(Object.keys(COLLECTIONS));

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * For one item, return which of the 9 expected languages are missing.
 * Returns: { missingLangs: string[], staleCount: number, fieldGaps: string[] }
 */
function itemLanguageGaps(item, cfg) {
  const translations = Array.isArray(item.translations) ? item.translations : [];
  const missing = [];
  const stale = [];
  const fieldGaps = [];

  for (const lang of EXPECTED_LANGS) {
    const t = translations.find((x) => (x.languages_code || x.locale) === lang);
    if (!t) {
      missing.push(lang);
      continue;
    }
    // Field-level check: translatable fields should exist in the translation
    const transKeys = Object.keys(t).filter((k) => !['id', 'languages_code', 'locale', 'updatedAt', 'createdAt'].includes(k));
    const missingFields = cfg.translatableFields.filter((f) => !transKeys.includes(f));
    if (missingFields.length > 0) {
      fieldGaps.push(`${lang}:${missingFields.join('+')}`);
      stale.push(lang);
    }
  }
  return { missing, stale: stale.length, fieldGaps };
}

function checkArrayCollection(name, cfg) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  const allItems = loadJson(filePath);
  if (!allItems || !Array.isArray(allItems)) {
    return { collection: name, expected: EXPECTED.has(name), status: 'error', total: 0, untranslated: 0, stale: 0, issues: [`Cannot read ${cfg.file}`] };
  }

  // Skip draft items — dev copies (e.g. "georgetown-night-food-durian - Copy")
  // never rendered on the site; translate-content.mjs skips them too.
  const items = allItems.filter((i) => i._status !== 'draft');

  const total = items.length;
  const untranslatedByLang = Object.fromEntries(EXPECTED_LANGS.map((l) => [l, 0]));
  let staleCount = 0;
  const issues = [];

  for (const item of items) {
    const { missing, stale, fieldGaps } = itemLanguageGaps(item, cfg);
    for (const l of missing) untranslatedByLang[l]++;
    staleCount += stale;
    if (fieldGaps.length > 0 && issues.length < 5) {
      issues.push(`${item.slug || item.question || item.id}: incomplete fields (${fieldGaps.join(', ')})`);
    }
  }

  const untranslatedTotal = Object.values(untranslatedByLang).reduce((a, b) => a + b, 0);
  if (untranslatedTotal > 0) {
    const perLang = EXPECTED_LANGS.map((l) => `${l}:${untranslatedByLang[l]}/${total}`).join(', ');
    issues.unshift(`${untranslatedTotal} item-language pairs untranslated (${perLang})`);
  }
  if (staleCount > 0) issues.push(`${staleCount} stale field translations`);

  return {
    collection: name,
    expected: EXPECTED.has(name),
    total,
    untranslated: untranslatedTotal,
    untranslatedByLang,
    stale: staleCount,
    issues,
  };
}

function checkSingletonCollection(name, cfg) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  const page = loadJson(filePath);
  if (!page || typeof page !== 'object') {
    return { collection: name, expected: EXPECTED.has(name), status: 'error', total: 1, untranslated: 0, stale: 0, issues: [`Cannot read ${cfg.file}`] };
  }

  const { missing, stale, fieldGaps } = itemLanguageGaps(page, cfg);
  const issues = [];
  if (missing.length > 0) issues.push(`missing: ${missing.join(', ')}`);
  if (fieldGaps.length > 0) issues.push(`incomplete fields: ${fieldGaps.join(', ')}`);

  return {
    collection: name,
    expected: EXPECTED.has(name),
    total: 1,
    untranslated: missing.length,
    untranslatedByLang: Object.fromEntries(EXPECTED_LANGS.map((l) => [l, missing.includes(l) ? 1 : 0])),
    stale,
    issues,
  };
}

// ─── Main ────────────────────────────────────────────────────

const results = [];
for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  const r = cfg.type === 'array'
    ? checkArrayCollection(name, cfg)
    : checkSingletonCollection(name, cfg);
  results.push(r);
}

const totalExpected = results.filter((r) => r.expected).length;
const totalUntranslated = results.reduce((s, r) => s + r.untranslated, 0);
const totalStale = results.reduce((s, r) => s + r.stale, 0);

// Per-language totals across all collections
const perLangTotals = Object.fromEntries(EXPECTED_LANGS.map((l) => [
  l,
  results.reduce((s, r) => s + (r.untranslatedByLang?.[l] || 0), 0),
]));

const expectedWithIssues = results.filter((r) => r.expected && r.issues.length > 0).length;
const passed = expectedWithIssues === 0;

const allIssues = results
  .filter((r) => r.expected && r.issues.length > 0)
  .flatMap((r) => r.issues.map((i) => `[${r.collection}] ${i}`));

const output = {
  passed,
  collectionsChecked: results.length,
  expectedCollections: totalExpected,
  expectedWithIssues,
  totalUntranslated,
  totalStale,
  untranslatedByLang: perLangTotals,
  issues: allIssues.slice(0, 40),
  collections: results,
};

process.stdout.write(JSON.stringify(output, null, 2));
