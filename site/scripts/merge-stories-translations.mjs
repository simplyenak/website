#!/usr/bin/env node
/**
 * merge-stories-translations.mjs
 * 
 * Merges translation monitoring files from src/i18n/translations/
 * back into src/data/content/stories.json so that locale pages work.
 * 
 * This must run AFTER translate-content.mjs and BEFORE astro build.
 * Matches by story ID (both systems use the same numeric IDs).
 * 
 * Usage: node scripts/merge-stories-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const ALL_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

function main() {
  console.log('🔄 Merging stories translations into stories.json...');
  
  // Load stories
  const storiesPath = path.join(CONTENT_DIR, 'stories.json');
  if (!fs.existsSync(storiesPath)) {
    console.log('  ⚠️  stories.json not found, skipping');
    return;
  }
  
  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  console.log(`  📖 Loaded ${stories.length} stories`);
  
  // Build a map of story ID → translations by language
  const translationsBySlug = {};
  
  for (const lang of ALL_LANGS) {
    const transPath = path.join(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
    if (!fs.existsSync(transPath)) {
      console.log(`  ⚠️  No translations file for ${lang}`);
      continue;
    }
    
    const transData = JSON.parse(fs.readFileSync(transPath, 'utf8'));
    translationsBySlug[lang] = transData;
    console.log(`  📝 ${lang}: ${Object.keys(transData).length} translations`);
  }
  
  // Create a lookup by story ID
  const storyById = new Map(stories.map(s => [String(s.id), s]));
  
  // Merge translations into each story by ID
  let mergedCount = 0;
  for (const story of stories) {
    const storyId = String(story.id);
    const translations = [];
    
    for (const lang of ALL_LANGS) {
      const transMap = translationsBySlug[lang];
      const trans = transMap?.[storyId];
      if (trans && Object.keys(trans).length > 0) {
        translations.push({
          languages_code: lang,
          ...trans
        });
      }
    }
    
    if (translations.length > 0) {
      story.translations = translations;
      mergedCount++;
    }
  }
  
  // Write back
  fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2) + '\n', 'utf8');
  console.log(`  ✅ Merged translations for ${mergedCount}/${stories.length} stories`);
}

main();
