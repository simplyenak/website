#!/usr/bin/env node
/**
 * export-translations.mjs
 *
 * Extracts embedded translations from content JSON files and writes them
 * to the monitoring files in frontend/src/i18n/translations/.
 *
 * These monitoring files are used by:
 *   - scripts/validate-translations.mjs
 *   - scripts/generate-translation-dashboard.js
 *
 * They are NOT loaded at runtime — the frontend reads embedded translations
 * directly from the content JSON files via applyTranslation() in content.js.
 *
 * Usage:
 *   node scripts/export-translations.mjs
 *   node scripts/export-translations.mjs --collection tours
 *   node scripts/export-translations.mjs --dry-run
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
const TRANSLATIONS_DIR = path.resolve(__dirname, '../frontend/src/i18n/translations');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_COLLECTION = args.includes('--collection') ? args[args.indexOf('--collection') + 1] : null;

const ALL_LANGS_WITH_EN = [...ALL_LANGS, 'en'];

function exportCollection(name, config) {
  const filePath = path.join(CONTENT_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  ${config.file} not found — skipping`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const items = config.type === 'array' ? data : [data];

  let filesWritten = 0;

  for (const lang of ALL_LANGS_WITH_EN) {
    const output = {};

    for (const item of items) {
      if (!item.translations || !Array.isArray(item.translations)) continue;

      const trans = item.translations.find(t => t.languages_code === lang);
      if (!trans) continue;

      const itemKey = String(item.id);
      output[itemKey] = {};

      // Write all non-skip fields
      for (const [k, v] of Object.entries(trans)) {
        if (!shouldSkipField(k)) {
          output[itemKey][k] = v;
        }
      }
    }

    if (Object.keys(output).length === 0) continue;

    const outPath = path.join(TRANSLATIONS_DIR, `${name}-translations-${lang}.json`);

    if (DRY_RUN) {
      console.log(`  [DRY RUN] would write ${outPath} (${Object.keys(output).length} items)`);
    } else {
      fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
      filesWritten++;
    }
  }

  return filesWritten;
}

function main() {
  console.log('📤 Exporting embedded translations to monitoring files');
  console.log(`   Content:  ${CONTENT_DIR}`);
  console.log(`   Output:   ${TRANSLATIONS_DIR}`);
  if (ONLY_COLLECTION) console.log(`   Filter:   ${ONLY_COLLECTION}`);
  console.log('');

  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
  }

  const collectionsToRun = ONLY_COLLECTION
    ? { [ONLY_COLLECTION]: COLLECTIONS[ONLY_COLLECTION] }
    : COLLECTIONS;

  let totalFiles = 0;

  for (const [name, config] of Object.entries(collectionsToRun)) {
    if (!config) {
      console.error(`❌ Unknown collection: ${name}`);
      continue;
    }
    const written = exportCollection(name, config);
    totalFiles += written;
    console.log(`  ✓ ${name}: ${written} locale files written`);
  }

  console.log(`\n✅ Done. ${totalFiles} monitoring files updated.`);
}

main();
