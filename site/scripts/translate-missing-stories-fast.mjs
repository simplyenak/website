#!/usr/bin/env node
/**
 * translate-missing-stories-fast.mjs
 * 
 * Fast translator: writes files AFTER EACH story (not at end).
 * Translates title, excerpt, content (markdown), meta_title, meta_description.
 * 
 * Usage: TRANSLATE_PROVIDER=omniroute node scripts/translate-missing-stories-fast.mjs [--lang de]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const ALL_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
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
      max_tokens: 2000
    })
  });
  
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function cleanMarkdown(text) {
  return text.replace(/\[object Object\]/g, '').replace(/\\n/g, '\n').trim();
}

async function main() {
  console.log(`🌐 Translating missing stories → ${TARGET_LANGS.join(', ')}`);
  console.log(`💡 Note: Files written after each story for real-time progress\n`);
  
  // Load stories
  const storiesPath = path.join(CONTENT_DIR, 'stories.json');
  const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));
  const storyById = new Map(stories.map(s => [String(s.id), s]));
  
  let translated = 0;
  let errors = 0;
  
  for (const lang of TARGET_LANGS) {
    console.log(`\n📝 Translating to ${lang}...`);
    
    // Load existing translations or create empty
    const transPath = path.join(TRANSLATIONS_DIR, `stories-translations-${lang}.json`);
    let existingTranslations = {};
    if (fs.existsSync(transPath)) {
      existingTranslations = JSON.parse(fs.readFileSync(transPath, 'utf8'));
    }
    
    // Find stories missing this language
    const missingIds = stories
      .filter(s => !existingTranslations[String(s.id)])
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
        const translation = { languages_code: lang };
        
        // Translate title
        const titlePrompt = `Translate this title to ${lang}. Return ONLY the translated title, nothing else:\n\n"${story.title}"`;
        translation.title = await llmCall(titlePrompt);
        
        // Translate excerpt
        const excerpt = (story.excerpt || '').slice(0, 200);
        const excerptPrompt = `Translate this excerpt to ${lang}. Return ONLY the translated text, nothing else:\n\n"${excerpt}"`;
        translation.excerpt = await llmCall(excerptPrompt);
        
        // Translate content (markdown)
        const content = story.content_markdown || story.content || '';
        if (content && content.length > 100) {
          const contentPrompt = `Translate this article from English to ${lang}. Preserve all markdown formatting. Return ONLY the translated markdown, nothing else:\n\n${content}`;
          translation.content = await llmCall(contentPrompt);
        }
        
        // Translate meta title
        const metaTitle = story.meta_title || story.title;
        translation.meta_title = metaTitle !== story.title 
          ? await llmCall(`Translate this title to ${lang}:\n\n"${metaTitle}"`)
          : translation.title;
        
        // Translate meta description
        const metaDesc = story.meta_description || '';
        if (metaDesc) {
          translation.meta_description = await llmCall(`Translate this description to ${lang}:\n\n"${metaDesc}"`);
        }
        
        // Clean and save
        for (const key of Object.keys(translation)) {
          if (typeof translation[key] === 'string') {
            translation[key] = cleanMarkdown(translation[key]);
          }
        }
        
        existingTranslations[String(id)] = translation;
        
        // Write file immediately after each story
        fs.writeFileSync(transPath, JSON.stringify(existingTranslations, null, 2) + '\n', 'utf8');
        
        translated++;
        console.log(`  ✓ [${translated}/${missingIds.length}] ${story.slug}: ${translation.title.slice(0, 30)}...`);
        
        // Rate limit
        await new Promise(r => setTimeout(r, 1500));
        
      } catch (err) {
        console.error(`  ✗ ${story.slug}: ${err.message}`);
        errors++;
      }
    }
  }
  
  console.log(`\n✅ Done: ${translated} translated, ${errors} errors`);
}

main().catch(console.error);
