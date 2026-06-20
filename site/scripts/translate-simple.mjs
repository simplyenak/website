#!/usr/bin/env node
/**
 * Simple translation script for flat content JSON files.
 * Reads English content, translates via Gemini, saves per-language JSON.
 *
 * Usage:
 *   GEMINI_API_KEY=*** node scripts/translate-simple.mjs
 *   GEMINI_API_KEY=*** node scripts/translate-simple.mjs --lang ms
 *   GEMINI_API_KEY=*** node scripts/translate-simple.mjs --force
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

// 9 non-English languages
const ALL_LANGS = ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];
const LANG_NAMES = {
  ms: 'Malay', zh: 'Simplified Chinese', de: 'German', es: 'Spanish',
  fr: 'French', nl: 'Dutch', ru: 'Russian', ja: 'Japanese', pt: 'Portuguese',
};

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');
const targetLangs = args.includes('--lang')
  ? args[args.indexOf('--lang') + 1].split(',').filter(l => ALL_LANGS.includes(l))
  : ALL_LANGS;

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.error('❌ GEMINI_API_KEY not set.');
  process.exit(1);
}

// Collections to translate — file -> fields
const COLLECTIONS = {
  'tours.json': ['name', 'tagline', 'shortDescription', 'fullDescription', 'meetingPoint'],
  'stories.json': ['title', 'excerpt', 'content'],
  'faqs.json': ['question', 'answer'],
  'testimonials.json': ['review_text', 'review_title'],
  'home-page.json': ['hero_title', 'hero_highlight', 'hero_subtitle', 'hero_description',
    'hero_cta_primary', 'hero_cta_secondary', 'hero_vendors', 'hero_since',
    'hero_rated', 'hero_max_per_tour', 'manifesto_eyebrow', 'manifesto_headline',
    'manifesto_tagline', 'manifesto_body', 'vendors_eyebrow', 'vendors_title',
    'vendors_subtitle', 'segment_heading', 'segment_subheading', 'segment_view_all',
    'expect_title', 'expect_subtitle', 'cta_title', 'cta_subtitle',
    'cta_book_experience', 'cta_chat_whatsapp', 'about_eyebrow', 'about_title',
    'about_subtitle', 'about_description', 'meta_title', 'meta_description'],
  'about-page.json': ['heroEyebrow', 'heroHeading', 'heroDescription',
    'seo_title', 'seo_description', 'founder_eyebrow', 'founder_heading',
    'philosophy_eyebrow', 'philosophy_heading', 'team_eyebrow', 'team_heading',
    'cta_heading', 'cta_description'],
  'contact-page.json': ['hero_title', 'hero_subtitle', 'intro_title', 'intro_subtitle',
    'meta_title', 'meta_description'],
  'private-tours-page.json': ['seo_title', 'seo_description', 'hero_title', 'hero_highlight', 'hero_subtitle'],
  'corporate-groups-page.json': ['seo_title', 'seo_description', 'hero_eyebrow', 'hero_title', 'hero_subtitle'],
  'how-it-works-page.json': ['seo_title', 'seo_description', 'hero_title', 'hero_subtitle', 'steps_title'],
  'how-to-prepare-page.json': ['seo_title', 'seo_description', 'hero_title', 'hero_description'],
  'track-record-page.json': ['seo_title', 'seo_description', 'hero_title', 'hero_subtitle'],
  'legal-pages.json': ['headline', 'content'],
};

async function translate(text, targetLang) {
  const prompt = `Translate the following content to ${LANG_NAMES[targetLang] || targetLang}. 
Keep the brand voice warm and personal. 
Preserve all HTML tags, formatting, and line breaks exactly.
Do NOT translate: Simply Enak, Pauline, Maarten, KL, Penang, Ipoh, nasi lemak, char kway teow, curry laksa, rendang, roti jala, whatsaap, ticketinghub.
Do NOT add explanations or notes — only return the translated text.

Source: ${text}`;

  const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function processCollection(file, fields) {
  const filePath = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(filePath)) return { items: 0 };
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const items = Array.isArray(data) ? data : [data];
  if (!items.length) return { items: 0 };

  let total = 0;
  for (const lang of targetLangs) {
    const outFile = path.join(TRANSLATIONS_DIR, `${file.replace('.json', '')}-${lang}.json`);
    const existing = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf-8')) : [];
    
    const translated = [];
    for (const item of items) {
      const label = item.slug || item.name || item.title || item.id;
      const existingItem = existing.find(e => (e.slug || e.name || e.id) === label);
      
      if (!FORCE && existingItem) {
        translated.push(existingItem);
        continue;
      }

      const result = { id: label };
      for (const field of fields) {
        const source = item[field];
        if (!source || typeof source !== 'string' || !source.trim()) {
          result[field] = '';
          continue;
        }
        if (DRY_RUN) {
          result[field] = `[translated: ${source.substring(0, 30)}...]`;
          continue;
        }
        try {
          result[field] = await translate(source, lang);
          await new Promise(r => setTimeout(r, 300)); // rate limit
        } catch (e) {
          console.error(`  ✗ ${label}/${field}: ${e.message}`);
          result[field] = source;
        }
      }
      translated.push(result);
      total++;
      if (!DRY_RUN) process.stdout.write('.');
    }

    if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, JSON.stringify(translated, null, 2) + '\n');
      console.log(` ${path.basename(outFile)} (${translated.length} items)`);
    }
  }
  return { items: items.length };
}

console.log(`\n📖 Translating to: ${targetLangs.join(', ')}${DRY_RUN ? ' [DRY RUN]' : ''}\n`);
let totalItems = 0;
for (const [file, fields] of Object.entries(COLLECTIONS)) {
  const result = await processCollection(file, fields);
  if (result.items > 0) {
    console.log(`  ${file}: ${result.items} item(s)`);
    totalItems += result.items;
  }
}
console.log(`\n✅ Done. ${totalItems} items processed across ${targetLangs.length} languages.\n`);
