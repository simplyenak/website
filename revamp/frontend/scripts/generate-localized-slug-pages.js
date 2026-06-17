#!/usr/bin/env node
/**
 * Generate localized [slug] pages for tours, stories, and landing pages
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PAGES_DIR = join(__dirname, '../src/pages');
const LANGUAGES = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

// Dynamic slug pages to localize
const SLUG_PAGES = [
  'tours/[slug].astro',
  'stories/[slug].astro',
  'tours/dietary/[slug].astro',
  'tours/locations/[slug].astro',
  'tours/neighborhoods/[slug].astro',
  'tours/specialty/[slug].astro',
  'tours/travel-types/[slug].astro',
  'tours/locations/[city]/[segment].astro',
];

function localizeSlugContent(content, lang) {
  // Add lang constant after imports
  if (!content.includes(`const lang = '${lang}'`)) {
    content = content.replace(
      /(export const prerender = true;)/,
      `$1\n\n// Language for this page\nconst lang = '${lang}';`
    );
  }
  
  // Update getStaticPaths to use language-prefixed paths
  content = content.replace(
    /params: { slug: ([^}]+) }/g,
    `params: { slug: $1 }, props: { lang: '${lang}' }`
  );
  
  // Replace hreflangPath
  content = content.replace(
    /hreflangPath="([^"]*)"/g,
    (match, path) => {
      if (path.includes('[slug]')) {
        return `hreflangPath="/${lang}${path}"`;
      }
      return match;
    }
  );
  
  // Update getLangFromUrl to use hardcoded lang
  content = content.replace(
    /const lang = getLangFromUrl\(Astro\.url\);/g,
    `// Language hardcoded for localized page\n// const lang = getLangFromUrl(Astro.url);`
  );
  
  return content;
}

function createLocalizedSlugPages() {
  let created = 0;
  let skipped = 0;

  for (const lang of LANGUAGES) {
    console.log(`\n🌐 Creating ${lang} slug pages...`);
    
    for (const pagePath of SLUG_PAGES) {
      const srcPath = join(PAGES_DIR, pagePath);
      const destPath = join(PAGES_DIR, lang, pagePath);
      
      if (!existsSync(srcPath)) {
        console.log(`  ⚠️  Skipping ${pagePath} - source not found`);
        skipped++;
        continue;
      }
      
      if (existsSync(destPath)) {
        console.log(`  ✓  /${lang}/${pagePath} - already exists`);
        skipped++;
        continue;
      }
      
      let content = readFileSync(srcPath, 'utf8');
      content = localizeSlugContent(content, lang);
      
      const destDir = join(PAGES_DIR, lang, pagePath.substring(0, pagePath.lastIndexOf('/')));
      mkdirSync(destDir, { recursive: true });
      
      writeFileSync(destPath, content, 'utf8');
      console.log(`  ✓  Created /${lang}/${pagePath}`);
      created++;
    }
  }
  
  console.log(`\n✅ Done! Created ${created} slug files, skipped ${skipped}`);
}

createLocalizedSlugPages();
