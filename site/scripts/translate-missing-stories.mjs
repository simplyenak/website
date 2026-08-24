#!/usr/bin/env node
/**
 * translate-missing-stories.mjs
 * 
 * Simple translator for missing story content.
 * Translates title + excerpt only (fast, reliable).
 * Writes to monitoring files so merge-stories-translations.mjs picks them up.
 * 
 * Usage: TRANSLATE_PROVIDER=omniroute node scripts/translate-missing-stories.mjs [--lang de] [--all]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const ALL_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

// Languages to translate
const TARGET_LANGS = process.argv.includes('--all') 
  ? ALL_LANGS 
  : (process.argv.includes('--lang') ? process.argv[process.argv.indexOf('--lang') + 1]?.split(',') || ALL_LANGS : ALL_LANGS);

const OMNI_KEY = process.env.OMNIROUTE_API_KEY || '';
const OMNI_URL = 'https://omniroute.system.simplyenak.com/v1/chat/completions';
const MODEL = 'auto/best-coding';

const BRAND_CONTEXT = `You are translating content for Simply Enak, a Malaysian food tour company established in 2011.
Brand voice: warm, personal, like a passionate friend showing you around. Short, direct sentences.
No superlatives, no em-dashes for dramatic pauses. Never use: "authentic", "immersive", "embark", "bustling", "vibrant".
Preserve proper nouns: Simply Enak, Pauline, Maarten, KL, Penang, Ipoh, etc.
Food names like nasi lemak, char kway teow, laksa stay untranslated.`;

async function llmCall(prompt) {
  const res = await fetch(OMNI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OMNI_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [{role: 'user', content: `${BRAND_CONTEXT}\n\n${prompt}`}],
      temperature: 0.3,
      max_tokens: 500
    })
  });
  
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function main() {
  console.log(`🌐 Translating missing stories → ${TARGET_LANGS.join(', ')}`);
  
  // Load stories
  const storiesPath = path.join(CONTENT_DIR, 'stories.json');
  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  const storyById = new Map(stories.map(s => [String(s.id), s]));
  
  // Load existing translations
  const existingTranslations = {};
  for (const lang of ALL_LANGS) {
    const transPath = path.join(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
    existingTranslations[lang] = fs.existsSync(transPath) 
      ? JSON.parse(fs.readFileSync(transPath, 'utf8')) 
      : {};
  }
  
  let translated = 0;
  let errors = 0;
  
  for (const lang of TARGET_LANGS) {
    console.log(`\n📝 Translating to ${lang}...`);
    
    // Find stories missing this language
    const transSet = new Set(Object.keys(existingTranslations[lang]));
    const missingIds = stories
      .filter(s => (s._status !== 'draft' || !s._status) && !transSet.has(String(s.id)))
      .map(s => s.id);
    
    if (missingIds.length === 0) {
      console.log(`  ✓ All stories already have ${lang} translations`);
      continue;
    }
    
    console.log(`  ${missingIds.length} stories missing ${lang} translations`);
    
    for (const id of missingIds) {
      const story = storyById.get(String(id));
      if (!story) continue;
      
      try {
        // Translate title
        const titlePrompt = `Translate this title to ${lang}. Return ONLY the translated title, nothing else:\n\n"${story.title}"`;
        const translatedTitle = await llmCall(titlePrompt);
        
        // Translate excerpt
        const excerpt = (story.excerpt || '').slice(0, 200);
        const excerptPrompt = `Translate this excerpt to ${lang}. Return ONLY the translated text, nothing else:\n\n"${excerpt}"`;
        const translatedExcerpt = await llmCall(excerptPrompt);
        
        // Translate meta title (if different from title)
        const metaTitle = story.meta_title || story.title;
        const translatedMetaTitle = metaTitle !== story.title 
          ? await llmCall(`Translate this title to ${lang}. Return ONLY the translated title:\n\n"${metaTitle}"`)
          : translatedTitle;
        
        // Translate meta description
        const metaDesc = story.meta_description || '';
        let translatedMetaDesc = '';
        if (metaDesc) {
          translatedMetaDesc = await llmCall(`Translate this description to ${lang}. Return ONLY the translated text:\n\n"${metaDesc}"`);
        }
        
        existingTranslations[lang][String(id)] = {
          title: translatedTitle,
          excerpt: translatedExcerpt,
          ...(translatedMetaTitle && { meta_title: translatedMetaTitle }),
          ...(translatedMetaDesc && { meta_description: translatedMetaDesc })
        };
        
        translated++;
        console.log(`  ✓ ${story.slug}: ${translatedTitle.slice(0, 40)}...`);
        
        // Rate limit: 1s between calls
        await new Promise(r => setTimeout(r, 1000));
        
      } catch (err) {
        console.error(`  ✗ ${story.slug}: ${err.message}`);
        errors++;
      }
    }
  }
  
  // Write back all translations
  for (const lang of TARGET_LANGS) {
    const transPath = path.join(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
    fs.writeFileSync(transPath, JSON.stringify(existingTranslations[lang], null, 2) + '\n', 'utf8');
    console.log(`\n💾 Saved ${Object.keys(existingTranslations[lang]).length} translations for ${lang}`);
  }
  
  console.log(`\n✅ Done: ${translated} translated, ${errors} errors`);
}

main().catch(console.error);
