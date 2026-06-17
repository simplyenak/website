#!/usr/bin/env node
/**
 * bootstrap-translations.mjs
 *
 * Seeds the `translations` array with "en" entries in content JSON files
 * so the translate-content.mjs pipeline can find and translate them.
 *
 * Two modes:
 *   1. Items with translations[] but no "en" entry → add "en" from top-level fields
 *   2. Items with no translations[] at all → create full array (en + 9 targets)
 *
 * Idempotent — skips items that already have an "en" translation entry.
 *
 * Usage:
 *   node scripts/bootstrap-translations.mjs
 *   node scripts/bootstrap-translations.mjs --collection tours
 *   node scripts/bootstrap-translations.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  ALL_LANGS, COLLECTIONS, shouldSkipField,
} from './lib/translation-collections.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../frontend/src/data/content');
const BACKUP_DIR = path.resolve(__dirname, '../frontend/src/data/content/.translate-backup');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_COLLECTION = args.includes('--collection') ? args[args.indexOf('--collection') + 1] : null;

// Convert snake_case to camelCase for fallback field lookup
function snakeToCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function bootstrapCollection(name, config) {
  const filePath = path.join(CONTENT_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  ${config.file} not found — skipping`);
    return { items: 0, created: 0, skipped: 0 };
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const items = config.type === 'array' ? data : [data];
  const isArray = config.type === 'array';

  let created = 0, skipped = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Already has "en" — nothing to do
    if (item.translations && Array.isArray(item.translations) &&
        item.translations.some(t => t.languages_code === 'en')) {
      skipped++;
      continue;
    }

    const translatableFields = config.translatableFields || [];
    const enEntry = { languages_code: 'en' };

    // Copy translatable fields from top-level into the "en" entry
    // Try snake_case first (matches registry), then camelCase as fallback
    let fieldsCopied = 0;
    for (const field of translatableFields) {
      if (shouldSkipField(field)) continue;

      // Try direct field name (snake_case)
      let val = item[field];

      // Fallback: try camelCase version
      if (val === null || val === undefined) {
        val = item[snakeToCamel(field)];
      }

      if (val !== null && val !== undefined) {
        if (typeof val === 'string' && val.trim() === '') continue;
        if (Array.isArray(val) && val.length === 0) continue;
        enEntry[field] = val;
        fieldsCopied++;
      }
    }

    if (fieldsCopied === 0) {
      console.log(`  ⚠  No translatable fields found for "${item[config.matchField] || item.name || item.title || 'item'}" — skipping`);
      skipped++;
      continue;
    }

    if (Array.isArray(item.translations) && item.translations.length > 0) {
      // Case 1: has translations but missing "en" — insert en at the beginning
      item.translations.unshift(enEntry);
    } else {
      // Case 2: no translations at all — create full array
      const translations = [enEntry];
      for (const lang of ALL_LANGS) {
        translations.push({ languages_code: lang });
      }
      item.translations = translations;
    }

    created++;
    console.log(`    + "${item[config.matchField] || item.name || item.title || 'item'}" → en (${fieldsCopied} fields)`);
  }

  // Save if changes were made
  if (created > 0 && !DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  const label = isArray ? `${items.length} items` : 'singleton';
  console.log(`  ✓ ${name}: ${created} bootstrapped, ${skipped} already had en (${label})`);
  return { items: items.length, created, skipped };
}

function main() {
  console.log('🌱 Bootstrapping "en" translation entries in content JSON files');
  console.log(`   Content:  ${CONTENT_DIR}`);
  console.log(`   Target languages: ${ALL_LANGS.join(', ')}`);
  if (DRY_RUN) console.log('   Mode: DRY RUN');
  if (ONLY_COLLECTION) console.log(`   Filter: ${ONLY_COLLECTION}`);
  console.log('');

  if (!DRY_RUN) {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const stampDir = path.join(BACKUP_DIR, `pre-bootstrap-${timestamp}`);
    fs.mkdirSync(stampDir, { recursive: true });

    const collections = ONLY_COLLECTION
      ? { [ONLY_COLLECTION]: COLLECTIONS[ONLY_COLLECTION] }
      : COLLECTIONS;

    for (const config of Object.values(collections)) {
      const src = path.join(CONTENT_DIR, config.file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(stampDir, config.file));
      }
    }
    console.log(`💾 Backed up to ${stampDir}`);
    console.log('');
  }

  const collectionsToRun = ONLY_COLLECTION
    ? { [ONLY_COLLECTION]: COLLECTIONS[ONLY_COLLECTION] }
    : COLLECTIONS;

  let totalCreated = 0, totalSkipped = 0;

  for (const [name, config] of Object.entries(collectionsToRun)) {
    if (!config) {
      console.error(`❌ Unknown collection: ${name}`);
      continue;
    }
    const result = bootstrapCollection(name, config);
    totalCreated += result.created;
    totalSkipped += result.skipped;
  }

  console.log('');
  console.log(`═════════════════════════════════════════`);
  console.log(`  Bootstrapped: ${totalCreated}`);
  console.log(`  Already had:  ${totalSkipped}`);
  if (DRY_RUN) console.log('  (DRY RUN — no files written)');
  console.log(`═════════════════════════════════════════`);
}

main();
