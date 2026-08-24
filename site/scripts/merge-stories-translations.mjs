#!/usr/bin/env node
/**
 * merge-stories-translations.mjs
 * 
 * Merges translation monitoring files from src/i18n/translations/
 * back into src/data/content/stories.json so that locale pages work.
 * 
 * Matches translations by story ID (translation file keys = story IDs).
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
  
  // Build a map of story ID → story
  const storyById = new Map(stories.map(s => [String(s.id), s]));
  
  // Load all translation files
  let totalMerged = 0;
  
  for (const lang of ALL_LANGS) {
    const transPath = path.join(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
    if (!fs.existsSync(transPath)) {
      console.log(`  ⚠️  No translations file for ${lang}`);
      continue;
    }
    
    const transData = JSON.parse(fs.readFileSync(transPath, 'utf8'));
    console.log(`  📝 ${lang}: ${Object.keys(transData).length} translations to merge`);
    
    // Merge each translation into its corresponding story by ID
    for (const [storyIdStr, trans] of Object.entries(transData)) {
      const story = storyById.get(storyIdStr);
      if (!story) {
        console.log(`  ⚠️  Story ID ${storyIdStr} not found in stories.json`);
        continue;
      }
      
      // Initialize translations array if needed
      if (!story.translations) {
        story.translations = [];
      }
      
      // Check if translation already exists
      const existingTrans = story.translations.find(t => t.languages_code === lang);
      if (existingTrans) {
        // Update existing translation
        Object.assign(existingTrans, trans);
      } else {
        // Add new translation
        story.translations.push({
          languages_code: lang,
          ...trans
        });
      }
      
      totalMerged++;
    }
  }
  
  // Write back
  fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2) + '\n', 'utf8');
  console.log(`  ✅ Merged ${totalMerged} translations total`);
}

main();
