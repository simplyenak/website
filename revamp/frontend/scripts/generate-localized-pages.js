#!/usr/bin/env node
/**
 * Generate localized page files for all languages
 * Creates /ms/, /zh/, /de/, /es/, /fr/, /nl/, /ru/, /ja/, /pt/ versions
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PAGES_DIR = join(__dirname, '../src/pages');
const LANGUAGES = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

// Pages to localize (relative to src/pages)
const PAGES_TO_LOCALIZE = [
  'about.astro',
  'about/our-values.astro',
  'contact.astro',
  'directions.astro',
  'faq.astro',
  'how-it-works.astro',
  'how-to-prepare.astro',
  'media.astro',
  'track-record.astro',
  'tours/index.astro',
  'tours/private-tours.astro',
  'tours/join-in-tours.astro',
  'tours/corporate-groups.astro',
  'stories/index.astro',
  'stories/archive.astro',
  'thank-you.astro',
  'thank-you-contact.astro',
  'thank-you-inquiry.astro',
  'privacy-policy.astro',
  'terms-conditions.astro',
];

function getRelativePathToSrc(pagePath) {
  // Count directory depth in the page path
  const depth = pagePath.split('/').length - 1;
  // Return appropriate relative path to src
  return '../'.repeat(depth + 1) + 'src';
}

function localizeContent(content, lang, pagePath) {
  // Replace hreflangPath to include language
  content = content.replace(
    /hreflangPath="([^"]*)"/g,
    (match, path) => `hreflangPath="/${lang}${path}"`
  );
  
  // Replace hreflangEnOnly={true} with false for localized pages
  content = content.replace(
    /hreflangEnOnly={true}/g,
    'hreflangEnOnly={false}'
  );
  
  // Fix import paths for nested pages
  if (pagePath.includes('/')) {
    const relativeSrc = getRelativePathToSrc(pagePath);
    
    // Fix Layout import
    content = content.replace(
      /from ["']\.\.\/layouts\/Layout\.astro["']/g,
      `from "${relativeSrc}/layouts/Layout.astro"`
    );
    
    // Fix other @ imports stay the same (they're aliased)
    content = content.replace(
      /from ["']\.\.\//g,
      `from "${relativeSrc}/`
    );
  }
  
  return content;
}

function createLocalizedPages() {
  let created = 0;
  let skipped = 0;

  for (const lang of LANGUAGES) {
    console.log(`\n🌐 Creating ${lang} pages...`);
    
    for (const pagePath of PAGES_TO_LOCALIZE) {
      const srcPath = join(PAGES_DIR, pagePath);
      const destPath = join(PAGES_DIR, lang, pagePath);
      
      // Check if source exists
      if (!existsSync(srcPath)) {
        console.log(`  ⚠️  Skipping ${pagePath} - source not found`);
        skipped++;
        continue;
      }
      
      // Check if already exists
      if (existsSync(destPath)) {
        console.log(`  ✓  /${lang}/${pagePath} - already exists`);
        skipped++;
        continue;
      }
      
      // Read source
      let content = readFileSync(srcPath, 'utf8');
      
      // Localize content
      content = localizeContent(content, lang, pagePath);
      
      // Create directory
      const destDir = join(PAGES_DIR, lang, pagePath.substring(0, pagePath.lastIndexOf('/')));
      mkdirSync(destDir, { recursive: true });
      
      // Write localized file
      writeFileSync(destPath, content, 'utf8');
      console.log(`  ✓  Created /${lang}/${pagePath}`);
      created++;
    }
  }
  
  console.log(`\n✅ Done! Created ${created} files, skipped ${skipped}`);
}

createLocalizedPages();
