#!/usr/bin/env node
/**
 * Sync changes from English pages to all localized versions
 * Usage: node scripts/sync-page-changes.js <page-path>
 * Example: node scripts/sync-page-changes.js about.astro
 *          node scripts/sync-page-changes.js tours/index.astro
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PAGES_DIR = join(__dirname, '../src/pages');
const LANGUAGES = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

const pagePath = process.argv[2];
if (!pagePath) {
  console.error('❌ Usage: node scripts/sync-page-changes.js <page-path>');
  console.error('   Example: node scripts/sync-page-changes.js about.astro');
  process.exit(1);
}

const srcPath = join(PAGES_DIR, pagePath);
if (!existsSync(srcPath)) {
  console.error(`❌ Source file not found: ${srcPath}`);
  process.exit(1);
}

const srcContent = readFileSync(srcPath, 'utf8');
let updated = 0;
let skipped = 0;

console.log(`🔄 Syncing ${pagePath} to all languages...\n`);

for (const lang of LANGUAGES) {
  const destPath = join(PAGES_DIR, lang, pagePath);
  
  if (!existsSync(destPath)) {
    console.log(`⚠️  /${lang}/${pagePath} - does not exist, skipping`);
    skipped++;
    continue;
  }
  
  const destContent = readFileSync(destPath, 'utf8');
  
  // Preserve localized imports and lang constant
  let newContent = srcContent;
  
  // Keep the localized lang constant
  if (destContent.includes(`const lang = '${lang}'`)) {
    newContent = newContent.replace(
      /const lang = getLangFromUrl\(Astro\.url\);/,
      `const lang = '${lang}';`
    );
  }
  
  // Keep localized hreflangPath
  const hreflangMatch = destContent.match(/hreflangPath="\/([^"]+)"/);
  if (hreflangMatch) {
    newContent = newContent.replace(
      /hreflangPath="([^"]*)"/,
      `hreflangPath="/${hreflangMatch[1]}"`
    );
  }
  
  // Fix import paths for nested pages
  if (pagePath.includes('/')) {
    const depth = pagePath.split('/').length;
    const dots = '../'.repeat(depth);
    newContent = newContent.replace(
      /from ["'](\.\.\/)+src\//g,
      `from "${dots}src/`
    );
  }
  
  writeFileSync(destPath, newContent, 'utf8');
  console.log(`✓  /${lang}/${pagePath}`);
  updated++;
}

console.log(`\n✅ Done! Updated ${updated} files, skipped ${skipped}`);
console.log('\n📝 Next steps:');
console.log('   git add -A && git commit -m "Sync ${pagePath} to all languages" && git push');
