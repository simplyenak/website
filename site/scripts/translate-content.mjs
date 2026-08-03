#!/usr/bin/env node
/**
 * translate-content.mjs
 *
 * AI-powered translation agent for Simply Enak content JSON files.
 * Translates English source content into 9 languages using Google Gemini Flash.
 *
 * Works directly with local JSON files — no CMS API needed.
 * Reads embedded translations from content JSON, fills gaps, writes back.
 *
 * Modes:
 *   Default  — skip translations that already exist
 *   --smart  — re-translate if the source item is newer (timestamp check)
 *   --force  — re-translate everything unconditionally
 *
 * Usage:
 *   GEMINI_API_KEY=your-key node scripts/translate-content.mjs
 *   node scripts/translate-content.mjs --smart
 *   node scripts/translate-content.mjs --collection tours
 *   node scripts/translate-content.mjs --lang pt
 *   node scripts/translate-content.mjs --lang pt,nl
 *   node scripts/translate-content.mjs --force --lang pt
 *   node scripts/translate-content.mjs --dry-run
 *
 * Environment:
 *   GEMINI_API_KEY  — required (get one free at https://aistudio.google.com/apikey)
 *
 * After translation, monitoring files in frontend/src/i18n/translations/ are updated.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  ALL_LANGS, LANG_NAMES, BRAND_CONTEXT, COLLECTIONS,
  hasContent, shouldSkipField,
} from './lib/translation-collections.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const BACKUP_DIR = path.resolve(__dirname, '../src/data/content/.translate-backup');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const SMART = args.includes('--smart');
const DRY_RUN = args.includes('--dry-run');
const ONLY_COLLECTION = args.includes('--collection') ? args[args.indexOf('--collection') + 1] : null;

// --lang pt  or  --lang pt,nl  to limit to specific languages
const LANG_ARG = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;
const TARGET_LANGS = LANG_ARG ? LANG_ARG.split(',').map(l => l.trim()).filter(l => ALL_LANGS.includes(l)) : ALL_LANGS;

// ─── Translation Provider ────────────────────────────────────────────────────
//
// Supports three providers (set TRANSLATE_PROVIDER env var):
//   "gemini"      (default) — Google Gemini Flash via REST API
//   "openrouter"  — OpenRouter free models via OpenAI-compatible API
//   "omniroute"   — Omniroute AI gateway via OpenAI-compatible API
//
// Keys:
//   GEMINI_API_KEY=key1,key2,...       — for gemini provider (round-robin)
//   OPENROUTER_API_KEY=key             — for openrouter provider
//
// OpenRouter free models (no credit card, generous limits):
//   meta-llama/llama-4-maverick:free, google/gemma-3-27b-it:free, etc.

const TRANSLATE_PROVIDER = (process.env.TRANSLATE_PROVIDER || 'gemini').toLowerCase();

// ─── Key rotation for Gemini ─────────────────────────────────────────────────
const GEMINI_KEYS = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
let geminiKeyIdx = 0;

function getNextGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[geminiKeyIdx % GEMINI_KEYS.length];
  geminiKeyIdx++;
  return key;
}

const GEMINI_MODEL = 'gemini-2.0-flash';
function geminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
}

// ─── OpenRouter (OpenAI-compatible) ──────────────────────────────────────────
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-4-maverick:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ─── Omniroute (OpenAI-compatible, Simply Enak AI gateway) ─────────────────────
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || '';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'auto/best-coding';
const OMNIROUTE_URL = (process.env.OMNIROUTE_BASE_URL || 'https://omniroute.system.simplyenak.com') + '/v1/chat/completions';

// Fields longer than this are sent individually; shorter ones are batched.
const LONG_FIELD_THRESHOLD = 500;

// Rate limiting
let lastCallTime = 0;
const MIN_INTERVAL_MS = TRANSLATE_PROVIDER === 'openrouter' ? 2000
  : TRANSLATE_PROVIDER === 'omniroute' ? 1000
  : Math.max(2000, Math.round(60000 / (15 * Math.max(GEMINI_KEYS.length, 1))));

async function llmCall(prompt) {
  if (TRANSLATE_PROVIDER === 'openrouter') return openrouterCall(prompt);
  if (TRANSLATE_PROVIDER === 'omniroute') return omnirouteCall(prompt);
  return geminiCall(prompt);
}

async function geminiCall(prompt) {
  if (GEMINI_KEYS.length === 0) throw new Error('GEMINI_API_KEY not set. Get one free at https://aistudio.google.com/apikey');

  // Rate limit
  const elapsed = Date.now() - lastCallTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }

  let attempts = 0;
  const MAX_ATTEMPTS = 5;
  while (attempts < MAX_ATTEMPTS) {
    const apiKey = getNextGeminiKey();
    try {
      lastCallTime = Date.now();
      const res = await fetch(geminiUrl(apiKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (res.status === 429) {
        const waitSec = 15 * Math.pow(2, attempts);
        console.log(`  ⏳ Rate limited, waiting ${waitSec}s (attempt ${attempts + 1}/${MAX_ATTEMPTS})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        attempts++;
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Gemini API ${res.status}: ${body.slice(0, 200)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        const blockReason = data?.candidates?.[0]?.finishReason;
        throw new Error(`Empty Gemini response (finishReason: ${blockReason || 'unknown'})`);
      }
      return text;
    } catch (err) {
      attempts++;
      if (attempts >= MAX_ATTEMPTS) throw new Error(`Gemini failed after ${MAX_ATTEMPTS} attempts: ${err.message}`);
      await new Promise(r => setTimeout(r, 3000 * attempts));
    }
  }
  throw new Error('Gemini call exhausted all retries without returning');
}

async function openrouterCall(prompt) {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set. Get a free key at https://openrouter.ai/keys');

  // Rate limit
  const elapsed = Date.now() - lastCallTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }

  let attempts = 0;
  const MAX_ATTEMPTS = 5;
  while (attempts < MAX_ATTEMPTS) {
    try {
      lastCallTime = Date.now();
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://simplyenak.com',
          'X-Title': 'Simply Enak Translator',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 8192,
        }),
      });

      if (res.status === 429) {
        const waitSec = 10 * Math.pow(2, attempts);
        console.log(`  ⏳ Rate limited, waiting ${waitSec}s (attempt ${attempts + 1}/${MAX_ATTEMPTS})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        attempts++;
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`OpenRouter API ${res.status}: ${body.slice(0, 300)}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`Empty OpenRouter response: ${JSON.stringify(data).slice(0, 200)}`);
      }
      return text;
    } catch (err) {
      attempts++;
      if (attempts >= MAX_ATTEMPTS) throw new Error(`OpenRouter failed after ${MAX_ATTEMPTS} attempts: ${err.message}`);
      await new Promise(r => setTimeout(r, 3000 * attempts));
    }
  }
  throw new Error('OpenRouter call exhausted all retries without returning');
}

// ─── Omniroute (OpenAI-compatible) ────────────────────────────────────────────
async function omnirouteCall(prompt) {
  if (!OMNIROUTE_KEY) throw new Error('OMNIROUTE_API_KEY not set');

  const elapsed = Date.now() - lastCallTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }

  let attempts = 0;
  const MAX_ATTEMPTS = 3;
  while (attempts < MAX_ATTEMPTS) {
    try {
      lastCallTime = Date.now();
      const res = await fetch(OMNIROUTE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OMNIROUTE_KEY}`,
        },
        body: JSON.stringify({
          model: OMNIROUTE_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 8192,
          stream: false,
        }),
      });

      if (res.status === 429) {
        const waitSec = 5 * Math.pow(2, attempts);
        console.log(`  ⏳ Rate limited (Omniroute), waiting ${waitSec}s...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        attempts++;
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Omniroute API ${res.status}: ${body.slice(0, 300)}`);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`Empty Omniroute response: ${JSON.stringify(data).slice(0, 200)}`);
      }
      return text;
    } catch (err) {
      attempts++;
      if (attempts >= MAX_ATTEMPTS) throw new Error(`Omniroute failed after ${MAX_ATTEMPTS} attempts: ${err.message}`);
      await new Promise(r => setTimeout(r, 3000 * attempts));
    }
  }
  throw new Error('Omniroute call exhausted all retries without returning');
}

// Translate a single field — plain text in, plain text out.
async function translateField(text, targetLang) {
  const langName = LANG_NAMES[targetLang] || targetLang;
  const prompt = `${BRAND_CONTEXT}

Translate the following English text to ${langName}. Return ONLY the translated text — no explanation, no quotes, no preamble.

${text}`;

  return (await llmCall(prompt)).trim();
}

// Translate multiple short fields in one call using a numbered list.
async function translateFieldsBatch(fieldNames, texts, targetLang) {
  const langName = LANG_NAMES[targetLang] || targetLang;
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');

  const prompt = `${BRAND_CONTEXT}

Translate the following ${fieldNames.length} items from English to ${langName}. Return a numbered list with the same numbering — one item per line, starting with its number.

${numbered}`;

  const raw = (await llmCall(prompt)).trim();

  // Parse: accumulate lines until the next numbered item starts
  const results = [];
  let current = '';
  for (const line of raw.split('\n')) {
    const match = line.match(/^\d+\.\s*(.*)$/);
    if (match) {
      if (current !== '') results.push(current.trim());
      current = match[1];
    } else if (current !== '') {
      current += '\n' + line;
    }
  }
  if (current !== '') results.push(current.trim());

  if (results.length !== fieldNames.length) {
    throw new Error(`Expected ${fieldNames.length} items, got ${results.length}`);
  }
  return results;
}

// Translate a JSON array of strings (e.g. whats_included: ["All food", "Drinks"])
async function translateStringArray(strings, targetLang) {
  const langName = LANG_NAMES[targetLang] || targetLang;
  const numbered = strings.map((s, i) => `${i + 1}. ${s}`).join('\n');

  const prompt = `${BRAND_CONTEXT}

Translate each of these ${strings.length} items from English to ${langName}. Return a numbered list with the exact same count. Each item is a short phrase for a food tour. Keep it natural and concise.

${numbered}`;

  const raw = (await llmCall(prompt)).trim();

  const results = [];
  let current = '';
  for (const line of raw.split('\n')) {
    const match = line.match(/^\d+\.\s*(.*)$/);
    if (match) {
      if (current !== '') results.push(current.trim());
      current = match[1];
    } else if (current !== '') {
      current += ' ' + line.trim();
    }
  }
  if (current !== '') results.push(current.trim());

  if (results.length !== strings.length) {
    // Try splitting by newlines as fallback
    const fallback = raw.split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    if (fallback.length === strings.length) return fallback;
    throw new Error(`Expected ${strings.length} items, got ${results.length}`);
  }
  return results;
}

// Translate all fields for one item.
// Short fields are batched into one numbered-list call.
// Long fields (>500 chars) and array fields are sent individually.
async function translateFields(fields, sourceValues, config, targetLang) {
  const result = {};
  const shortFields = [], shortTexts = [], longFields = [], arrayFields = [];

  const arrayFieldSet = new Set(config.arrayFields || []);

  for (const field of fields) {
    const text = sourceValues[field];
    if (!hasContent(text)) continue;

    if (arrayFieldSet.has(field) && Array.isArray(text)) {
      arrayFields.push({ field, text });
    } else {
      const str = typeof text === 'string' ? text : String(text);
      if (str.length > LONG_FIELD_THRESHOLD) {
        longFields.push({ field, text: str });
      } else {
        shortFields.push(field);
        shortTexts.push(str);
      }
    }
  }

  // One call for all short fields
  if (shortFields.length === 1) {
    result[shortFields[0]] = await translateField(shortTexts[0], targetLang);
  } else if (shortFields.length > 1) {
    const translated = await translateFieldsBatch(shortFields, shortTexts, targetLang);
    shortFields.forEach((f, i) => { result[f] = translated[i]; });
  }

  // One call per long field
  for (const { field, text } of longFields) {
    result[field] = await translateField(text, targetLang);
  }

  // One call per array field
  for (const { field, text } of arrayFields) {
    const strArray = text.map(s => typeof s === 'string' ? s : String(s));
    result[field] = await translateStringArray(strArray, targetLang);
  }

  return result;
}

// Translate an array of objects by translating specified sub-fields on each object.
// Non-translatable sub-fields (e.g. icon) are preserved unchanged.
async function translateObjectArray(sourceArray, subFields, targetLang) {
  const result = [];
  for (const obj of sourceArray) {
    const newObj = { ...obj };
    const fieldsToTranslate = subFields.filter(f => hasContent(obj[f]) && typeof obj[f] === 'string');
    if (fieldsToTranslate.length > 0) {
      const sourceValues = {};
      for (const f of fieldsToTranslate) sourceValues[f] = obj[f];
      const translated = await translateFields(fieldsToTranslate, sourceValues, {}, targetLang);
      for (const [f, v] of Object.entries(translated)) {
        newObj[f] = v;
      }
    }
    result.push(newObj);
  }
  return result;
}

// ─── Main translation logic ──────────────────────────────────────────────────

let backupDone = false;

function ensureBackup() {
  if (backupDone || DRY_RUN) return;
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const stampDir = path.join(BACKUP_DIR, timestamp);
  fs.mkdirSync(stampDir, { recursive: true });

  for (const config of Object.values(COLLECTIONS)) {
    const src = path.join(CONTENT_DIR, config.file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(stampDir, config.file));
    }
  }
  console.log(`💾 Backed up content JSON to ${stampDir}`);
  backupDone = true;
}

async function translateCollection(name, config) {
  console.log(`\n📦 ${name} (${config.file})`);

  const filePath = path.join(CONTENT_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠  File not found — skipping');
    return { created: 0, skipped: 0, errors: 0 };
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const items = config.type === 'array' ? data : [data];

  if (!items.length || !items[0]) {
    console.log('  ⚠  Empty file — skipping');
    return { created: 0, skipped: 0, errors: 0 };
  }

  // Check if items have translations. If none exist, bootstrap: create the
  // translations array with an `en` entry (base item IS the English content),
  // so the translator can start from zero instead of skipping forever.
  let itemsWithTranslations = items.filter(item => item.translations && Array.isArray(item.translations));
  if (!itemsWithTranslations.length) {
    if (DRY_RUN) {
      console.log(`  ⚠  No translations found — would bootstrap (${items.length} items)`);
      return { created: 0, skipped: 0, errors: 0 };
    }
    console.log(`  ➕ Bootstrapping translations arrays (${items.length} items)`);
    for (const item of items) {
      if (!item.translations) {
        item.translations = [{ languages_code: 'en' }];
      }
    }
    itemsWithTranslations = items;
  }

  console.log(`  ${items.length} item(s) × ${TARGET_LANGS.length} languages`);

  let created = 0, skipped = 0, errors = 0;
  const translatableFields = config.translatableFields || [];
  const objectArrayFields = config.objectArrayFields || {};
  const hasObjectArrayFields = Object.keys(objectArrayFields).length > 0;

  for (const item of items) {
    if (!item.translations || !Array.isArray(item.translations)) continue;

    const label = item[config.matchField] || item.name || item.title || item.slug || (config.type === 'singleton' ? name : `#${item.id}`);

    // Find English source translation. The base item holds the English field
    // values (translations store only localized overrides), so fall back to it
    // whenever the 'en' entry is missing or empty.
    const enTrans = item.translations.find(t => t.languages_code === 'en');
    const enSource = enTrans ?? item;
    if (!enSource && !hasObjectArrayFields) continue;

    for (const lang of TARGET_LANGS) {
      const langLabel = `${lang} (${LANG_NAMES[lang]})`;

      // Find target language translation — create it if missing (bootstrap)
      let targetTrans = item.translations.find(t => t.languages_code === lang);
      if (!targetTrans) {
        targetTrans = { languages_code: lang };
        item.translations.push(targetTrans);
        created++;
      }

      // ── Translatable scalar / array fields ──────────────────────────────────
      if (enSource) {
        const fieldsToTranslate = [];
        const sourceValues = {};

        for (const field of translatableFields) {
          if (shouldSkipField(field)) continue;

          // For fields not in the translation entry (e.g. arrayFields stored on the
          // base item of a singleton), fall back to the base item value.
          const enVal = hasContent(enSource[field]) ? enSource[field] : item[field];
          if (!hasContent(enVal)) continue;

          // Check if target already has content
          const targetVal = targetTrans[field];
          if (hasContent(targetVal) && !FORCE) {
            // Smart mode: re-translate if source is newer
            if (SMART && enSource.updated_at && targetTrans.updated_at) {
              const enUpdated = new Date(enSource.updated_at);
              const targetUpdated = new Date(targetTrans.updated_at);
              if (enUpdated <= targetUpdated) {
                skipped++;
                continue;
              }
            } else {
              skipped++;
              continue;
            }
          }

          fieldsToTranslate.push(field);
          sourceValues[field] = enVal;
        }

        if (fieldsToTranslate.length > 0) {
          if (DRY_RUN) {
            console.log(`  [DRY RUN] "${label}" → ${langLabel}: ${fieldsToTranslate.length} fields (${fieldsToTranslate.join(', ')})`);
            skipped += fieldsToTranslate.length;
          } else {
            process.stdout.write(`  "${label}" → ${langLabel}: ${fieldsToTranslate.length} fields... `);
            try {
              if (!backupDone) ensureBackup();
              const translated = await translateFields(fieldsToTranslate, sourceValues, config, lang);
              for (const [field, val] of Object.entries(translated)) {
                targetTrans[field] = val;
              }
              console.log('✓');
              created++;
            } catch (err) {
              console.log(`ERROR: ${err.message}`);
              errors++;
            }
          }
        }
      }

      // ── Object-array fields (source: base item, not translation entry) ──────
      for (const [field, fieldConfig] of Object.entries(objectArrayFields)) {
        const sourceArray = item[field];
        if (!Array.isArray(sourceArray) || sourceArray.length === 0) continue;

        // Skip if already translated (unless --force)
        if (hasContent(targetTrans[field]) && !FORCE) {
          skipped++;
          continue;
        }

        if (DRY_RUN) {
          console.log(`  [DRY RUN] "${label}" → ${langLabel}: objectArray ${field} (${sourceArray.length} items × [${fieldConfig.translatableSubFields.join(', ')}])`);
          skipped++;
          continue;
        }

        process.stdout.write(`  "${label}" → ${langLabel}: objectArray ${field} (${sourceArray.length} items)... `);
        try {
          if (!backupDone) ensureBackup();
          const translated = await translateObjectArray(sourceArray, fieldConfig.translatableSubFields, lang);
          targetTrans[field] = translated;
          console.log('✓');
          created++;
        } catch (err) {
          console.log(`ERROR: ${err.message}`);
          errors++;
        }
      }
    }
  }

  // Save the file if we made changes
  if (created > 0 && !DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`  → Saved ${config.file}`);
  }

  console.log(`  → ${created} translated, ${skipped} skipped, ${errors} errors`);
  return { created, skipped, errors };
}

// ─── Export translations to monitoring files ──────────────────────────────────

function exportMonitoringFiles() {
  console.log('\n📤 Updating monitoring files in i18n/translations/...');

  for (const [name, config] of Object.entries(COLLECTIONS)) {
    const filePath = path.join(CONTENT_DIR, config.file);
    if (!fs.existsSync(filePath)) continue;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const items = config.type === 'array' ? data : [data];

    for (const lang of [...ALL_LANGS, 'en']) {
      const output = {};

      for (const item of items) {
        if (!item.translations) continue;
        const trans = item.translations.find(t => t.languages_code === lang);
        if (!trans) continue;

        const itemKey = String(item.id);
        output[itemKey] = {};

        // Write all fields from the translation
        for (const [k, v] of Object.entries(trans)) {
          if (!shouldSkipField(k)) {
            output[itemKey][k] = v;
          }
        }
      }

      if (Object.keys(output).length === 0) continue;

      const outPath = path.join(TRANSLATIONS_DIR, `${name}-translations-${lang}.json`);
      fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
    }

    console.log(`  ✓ ${name}`);
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main() {
  // Validate provider config
  if (TRANSLATE_PROVIDER === 'omniroute') {
    if (!OMNIROUTE_KEY) {
      console.error('❌ OMNIROUTE_API_KEY not set.');
      console.error('   Set it in your environment');
      process.exit(1);
    }
  } else if (TRANSLATE_PROVIDER === 'openrouter') {
    if (!OPENROUTER_KEY) {
      console.error('❌ OPENROUTER_API_KEY not set.');
      console.error('   Get a free key at https://openrouter.ai/keys');
      console.error('   Then run: OPENROUTER_API_KEY=*** npm run translate');
      process.exit(1);
    }
  } else {
    if (GEMINI_KEYS.length === 0) {
      console.error('❌ GEMINI_API_KEY not set.');
      console.error('   Get a free key at https://aistudio.google.com/apikey');
      console.error('   Then run: GEMINI_API_KEY=*** npm run translate');
      process.exit(1);
    }
  }

  const providerLabel = TRANSLATE_PROVIDER === 'openrouter'
    ? `OpenRouter (${OPENROUTER_MODEL})`
    : TRANSLATE_PROVIDER === 'omniroute'
    ? `Omniroute (${OMNIROUTE_MODEL || 'auto/best-coding'})`
    : `Gemini Flash (${GEMINI_KEYS.length} key${GEMINI_KEYS.length > 1 ? 's' : ''})`;
  console.log(`🌐 Simply Enak — Content Translation Agent (via ${providerLabel})`);
  console.log(`   Content dir: ${CONTENT_DIR}`);
  if (TRANSLATE_PROVIDER === 'openrouter') {
    console.log(`   Model: ${OPENROUTER_MODEL}`);
  } else if (TRANSLATE_PROVIDER === 'omniroute') {
    console.log(`   Model: ${OMNIROUTE_MODEL || 'auto/best-coding'}`);
  } else {
    console.log(`   API keys: ${GEMINI_KEYS.length} (${GEMINI_KEYS.length * 1500} requests/day capacity)`);
  }
  console.log(`   Rate limit: ~${Math.round(60000 / MIN_INTERVAL_MS)} RPM`);
  console.log(`   Target languages: ${TARGET_LANGS.join(', ')}`);
  const modeLabel = DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE (re-translate all)' : SMART ? 'SMART (re-translate outdated)' : 'NORMAL (skip existing)';
  console.log(`   Mode: ${modeLabel}`);
  if (ONLY_COLLECTION) console.log(`   Collection filter: ${ONLY_COLLECTION}`);
  console.log('');

  // Verify content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const collectionsToRun = ONLY_COLLECTION
    ? { [ONLY_COLLECTION]: COLLECTIONS[ONLY_COLLECTION] }
    : COLLECTIONS;

  let totalCreated = 0, totalSkipped = 0, totalErrors = 0;

  for (const [name, config] of Object.entries(collectionsToRun)) {
    if (!config) {
      console.error(`❌ Unknown collection: ${name}`);
      continue;
    }
    try {
      const { created, skipped, errors } = await translateCollection(name, config);
      totalCreated += created;
      totalSkipped += skipped;
      totalErrors += errors;
    } catch (err) {
      console.error(`  ❌ Fatal error in ${name}:`, err.message);
      totalErrors++;
    }
  }

  // Update monitoring files if we made changes
  if (totalCreated > 0 && !DRY_RUN) {
    exportMonitoringFiles();
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Translation Summary');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Translated:     ${totalCreated}`);
  console.log(`  ⏭️  Skipped:        ${totalSkipped}`);
  console.log(`  ❌ Errors:          ${totalErrors}`);
  console.log('═══════════════════════════════════════════');

  if (totalErrors > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
