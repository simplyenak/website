#!/usr/bin/env node
/**
 * check-i18n-coverage.mjs
 *
 * Scans all content JSON files against the translation collection registry
 * and reports missing/stale translations.
 *
 * Output: JSON with summary + per-collection results.
 * Exit 0 always (informational — doesn't block builds).
 *
 * Usage:  node eval/check-i18n-coverage.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT, 'site/src/data/content');

const registryPath = path.resolve(ROOT, 'site/scripts/lib/translation-collections.mjs');
const { COLLECTIONS, ALL_LANGS } = await import(registryPath);

const MANDATORY_LANG = 'ms';

// Collections where MS translation is genuinely expected
const EXPECT_MS = new Set([
  'tours', 'stories', 'faqs',
  'landing_pages_dietary', 'landing_pages_specialty',
  'landing_pages_travel_type', 'landing_pages_location',
  'home_page', 'about_page',
]);

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function checkArrayCollection(name, cfg) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  const items = loadJson(filePath);
  if (!items || !Array.isArray(items)) {
    return { collection: name, expected: EXPECT_MS.has(name), status: 'error', total: 0, untranslated: 0, stale: 0, issues: [`Cannot read ${cfg.file}`] };
  }

  const total = items.length;
  const untranslated = [];
  const stale = [];

  for (const item of items) {
    const match = item[cfg.matchField] || item.slug || item.id || '?';
    const translations = item.translations;

    if (translations && Array.isArray(translations) && translations.length > 0) {
      const msTrans = translations.find(t => (t.languages_code || t.locale) === MANDATORY_LANG);
      if (!msTrans) {
        untranslated.push(match);
      } else if (EXPECT_MS.has(name)) {
        // Staleness check: English updatedAt more than 1h after translation
        const sourceUpdated = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
        const transUpdated = msTrans.updatedAt ? new Date(msTrans.updatedAt).getTime() : 0;
        if (sourceUpdated > 0 && transUpdated > 0 && sourceUpdated > transUpdated + 3600000) {
          const transKeys = Object.keys(msTrans).filter(k => !['id', 'languages_code', 'locale', 'updatedAt', 'createdAt'].includes(k));
          const missingFields = cfg.translatableFields.filter(f => !transKeys.includes(f));
          if (missingFields.length > 0) {
            stale.push({ slug: match, missingFields });
          }
        }
      }
    } else if (EXPECT_MS.has(name)) {
      untranslated.push(match);
    }
  }

  const issues = [];
  if (untranslated.length > 0) issues.push(`${untranslated.length}/${total} lack MS translation`);
  if (stale.length > 0) issues.push(`${stale.length} have potentially stale MS translations`);

  return {
    collection: name,
    expected: EXPECT_MS.has(name),
    total,
    untranslated: untranslated.length,
    stale: stale.length,
    issues,
  };
}

function checkSingletonCollection(name, cfg) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  const page = loadJson(filePath);
  if (!page || typeof page !== 'object') {
    return { collection: name, expected: EXPECT_MS.has(name), status: 'error', total: 1, untranslated: 0, stale: 0, issues: [`Cannot read ${cfg.file}`] };
  }

  const translations = page.translations;
  let untranslated = 0;
  let stale = 0;
  const issues = [];

  if (EXPECT_MS.has(name)) {
    if (!translations || !Array.isArray(translations)) {
      untranslated = 1;
      issues.push('No translations at all');
    } else {
      const msTrans = translations.find(t => (t.languages_code || t.locale) === MANDATORY_LANG);
      if (!msTrans) {
        untranslated = 1;
        issues.push('Lacks MS translation');
      } else {
        const transKeys = Object.keys(msTrans);
        const missingFields = cfg.translatableFields.filter(f => !transKeys.includes(f));
        if (missingFields.length > 0) {
          stale = missingFields.length;
          issues.push(`MS translation missing ${missingFields.length} fields`);
        }
      }
    }
  }

  return { collection: name, expected: EXPECT_MS.has(name), total: 1, untranslated, stale, issues };
}

// ─── Main ────────────────────────────────────────────────────

const results = [];
for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  const r = cfg.type === 'array'
    ? checkArrayCollection(name, cfg)
    : checkSingletonCollection(name, cfg);
  results.push(r);
}

const totalExpected = results.filter(r => r.expected).length;
const totalUntranslated = results.reduce((s, r) => s + r.untranslated, 0);
const totalStale = results.reduce((s, r) => s + r.stale, 0);

// Pass = no issues in expected collections
const expectedWithIssues = results.filter(r => r.expected && r.issues.length > 0).length;
const passed = expectedWithIssues === 0;

// Collect all issues across expected collections
const allIssues = results
  .filter(r => r.expected && r.issues.length > 0)
  .flatMap(r => r.issues.map(i => `[${r.collection}] ${i}`));

process.stdout.write(JSON.stringify({
  passed,
  collectionsChecked: results.length,
  expectedCollections: totalExpected,
  expectedWithIssues,
  totalUntranslated,
  totalStale,
  issues: allIssues,
  collections: results,
}, null, 2));
