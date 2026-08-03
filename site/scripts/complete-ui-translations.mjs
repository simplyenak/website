#!/usr/bin/env node
/**
 * complete-ui-translations.mjs
 *
 * Fills missing UI string keys in src/i18n/ui.ts for all 9 non-EN languages
 * using the Omniroute gateway (same provider as content translation).
 *
 * Reads the EN block, diffs against each language block, translates the
 * missing keys (batched), and writes them back. Preserves existing keys.
 *
 * Usage:
 *   node --env-file=.env scripts/complete-ui-translations.mjs
 *   node --env-file=.env scripts/complete-ui-translations.mjs --lang ru,ja
 *   node --env-file=.env scripts/complete-ui-translations.mjs --dry-run
 *
 * Env: OMNIROUTE_API_KEY (in site/.env), OMNIROUTE_MODEL (default zai/glm-5.2)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_FILE = path.resolve(__dirname, '../src/i18n/ui.ts');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LANG_ARG = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;
const TARGET_LANGS = LANG_ARG ? LANG_ARG.split(',').filter(Boolean) : ['ms', 'zh', 'de', 'es', 'fr', 'nl', 'ru', 'ja', 'pt'];

const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || '';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'zai/glm-5.2';
const OMNIROUTE_URL = (process.env.OMNIROUTE_BASE_URL || 'https://omniroute.system.simplyenak.com') + '/v1/chat/completions';

const LANG_NAMES = {
  ms: 'Bahasa Malaysia', zh: 'Chinese (Simplified)', de: 'German', es: 'Spanish',
  fr: 'French', nl: 'Dutch', ru: 'Russian', ja: 'Japanese', pt: 'Portuguese',
};

const BRAND = `You are translating website UI strings for Simply Enak, a Malaysian food tour company.
Brand voice: warm, personal, knowledgeable. Use the natural local phrasing for a food-tourism website.
Translate each UI label accurately. Keep placeholders and formatting exactly as-is.`;

async function llmTranslate(keyValues, targetLang) {
  const numbered = Object.entries(keyValues).map(([k, v], i) => `${i + 1}. ${k} = ${v}`).join('\n');
  const prompt = `${BRAND}\n\nTranslate these ${keyValues.length} UI strings from English to ${LANG_NAMES[targetLang] || targetLang}.
Return ONLY a numbered list in the same order — one per line, format: N. translated-text
Do not include the key name, only the translated value.

${numbered}`;

  const res = await fetch(OMNIROUTE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OMNIROUTE_KEY}` },
    body: JSON.stringify({
      model: OMNIROUTE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 8192,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content || '').trim();
}

function parseNumbered(raw, count) {
  const lines = raw.split('\n');
  const results = [];
  for (const line of lines) {
    const m = line.match(/^\s*(\d+)[.):-]\s*(.*)$/);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      while (results.length < idx) results.push('');
      results[idx] = m[2].trim();
    }
  }
  return results;
}

function parseUiFile(content) {
  const blocks = {};
  // language blocks are "  xx: { ... }," at 2-space indent
  const blockRe = /^  ([a-z]{2}): \{/gm;
  let m;
  const starts = [];
  while ((m = blockRe.exec(content))) starts.push({ lang: m[1], idx: m.index });
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].idx;
    const end = i + 1 < starts.length ? starts[i + 1].idx : content.length;
    blocks[starts[i].lang] = content.slice(start, end);
  }
  return blocks;
}

function extractKeys(block) {
  const keys = {};
  const re = /"([^"]+)":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(block))) keys[m[1]] = m[2];
  return keys;
}

function buildBlock(lang, keys) {
  const lines = [`  ${lang}: {`];
  for (const [k, v] of Object.entries(keys)) {
    lines.push(`    "${k}": "${v.replace(/"/g, '\\"')}",`);
  }
  lines.push('  },');
  return lines.join('\n');
}

async function main() {
  if (!OMNIROUTE_KEY) { console.error('OMNIROUTE_API_KEY not set'); process.exit(1); }
  const content = fs.readFileSync(UI_FILE, 'utf-8');
  const blocks = parseUiFile(content);
  const enKeys = extractKeys(blocks['en']);
  if (!enKeys) { console.error('EN block not found'); process.exit(1); }

  let totalMissing = 0;
  let totalFilled = 0;

  for (const lang of TARGET_LANGS) {
    if (!blocks[lang]) { console.log(`  ⚠  ${lang} block not found`); continue; }
    const langKeys = extractKeys(blocks[lang]);
    const missing = Object.entries(enKeys).filter(([k]) => !(k in langKeys));
    if (missing.length === 0) { console.log(`  ${lang}: complete`); continue; }
    totalMissing += missing.length;

    if (DRY_RUN) {
      console.log(`  [DRY] ${lang}: would translate ${missing.length} missing keys`);
      continue;
    }

    console.log(`  ${lang}: translating ${missing.length} missing keys...`);
    const raw = await llmTranslate(Object.fromEntries(missing), lang);
    const values = parseNumbered(raw, missing.length);
    const merged = { ...langKeys };
    missing.forEach(([k], i) => {
      const v = values[i];
      if (v && !v.includes('[object')) merged[k] = v;
      else console.log(`    ⚠  ${lang}.${k}: bad translation "${v}", keeping English fallback (t() handles it)`);
    });

    const newBlock = buildBlock(lang, merged);
    // Replace the block in the file — preserve anything AFTER the block
    // (the closing `};` and `export type UiKey` lines).
    const langBlock = blocks[lang];
    const blockEnd = content.indexOf(langBlock) + langBlock.length;
    const afterBlock = content.slice(blockEnd);
    const updated = content.replace(langBlock, newBlock);
    if (updated === content) { console.log(`    ✗ could not write ${lang} block`); continue; }
    fs.writeFileSync(UI_FILE, updated, 'utf-8');
    totalFilled += missing.length;
    console.log(`    ✓ wrote ${missing.length} keys`);
    // Re-read for next language
    const fresh = fs.readFileSync(UI_FILE, 'utf-8');
    const freshBlocks = parseUiFile(fresh);
    Object.assign(blocks, freshBlocks);
  }

  console.log(`\nDone: ${totalFilled} keys filled (${totalMissing} were missing)${DRY_RUN ? ' [DRY RUN]' : ''}`);
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
