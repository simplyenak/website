#!/usr/bin/env node
/**
 * regenerate-landing-en.mjs
 *
 * Regenerates CONTAMINATED English base fields for landing pages (colony
 * pages). The EN base hero/meta fields were entered in the wrong language
 * (Chinese/Portuguese) in Payload CMS originally — pre-existing data quality
 * issue. This uses the clean English context (dietary_name, specialty_name,
 * slug, location) + the existing translations to produce proper English.
 *
 * Output: writes corrected EN base fields back to the JSON snapshots.
 * Use --push to also update Payload (the EN base, no ?locale).
 *
 * Usage:
 *   node --env-file=.env scripts/regenerate-landing-en.mjs
 *   node --env-file=.env scripts/regenerate-landing-en.mjs --dry-run
 *   node --env-file=.env scripts/regenerate-landing-en.mjs --push
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../src/data/content');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PUSH = args.includes('--push');

const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || '';
const OMNIROUTE_MODEL = process.env.OMNIROUTE_MODEL || 'zai/glm-5.2';
const OMNIROUTE_URL = (process.env.OMNIROUTE_BASE_URL || 'https://omniroute.system.simplyenak.com') + '/v1/chat/completions';
const ADMIN = process.env.PAYLOAD_ADMIN_API_KEY || '';
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';

const NON_EN = /[\u4e00-\u9fff\u3040-\u30ff\u0400-\u04ffçãõáàâéèêíìîóòôúùûü]/;

const FILES = [
  'location-landing-pages.json',
  'dietary-landing-pages.json',
  'specialty-landing-pages.json',
];

async function llmGenerate(context, targetFields) {
  const prompt = `You are writing website copy for Simply Enak, a Malaysian food tour company.
Brand voice: warm, personal, knowledgeable, specific. No superlatives, no clichés.

A landing page needs its English base fields regenerated. Context about the page:
${context}

Write these fields in natural English (return as numbered list, one per line):
1. title (short page title, max 6 words)
2. hero_title (max 8 words, benefit-focused)
3. hero_subtitle (max 12 words)
4. hero_description (2 sentences, what guests experience)
5. intro_heading (short section heading, max 5 words, e.g. "Food Tours in Kuala Lumpur")
6. meta_title (max 60 chars, SEO: include location + "food tour")
7. meta_description (max 155 chars, SEO)`;

  const res = await fetch(OMNIROUTE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OMNIROUTE_KEY}` },
    body: JSON.stringify({
      model: OMNIROUTE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1500,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content || '').trim();
}

function parseNumbered(raw) {
  const out = [];
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*\d+[.):-]\s*(.*)$/);
    if (m) out.push(m[1].trim());
  }
  return out;
}

async function main() {
  if (!OMNIROUTE_KEY) { console.error('OMNIROUTE_API_KEY not set'); process.exit(1); }
  let regenerated = 0, errors = 0;

  for (const file of FILES) {
    const filePath = path.join(CONTENT_DIR, file);
    const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let dirty = 0;

    for (const item of items) {
      const fields = ['title', 'hero_title', 'hero_subtitle', 'hero_description', 'intro_heading', 'meta_title', 'meta_description']
        .filter((f) => NON_EN.test(item[f] || ''));
      if (fields.length === 0) continue;
      dirty++;

      // Build context from clean English fields
      const contextBits = [];
      for (const k of ['name', 'dietary_name', 'specialty_name', 'location', 'type', 'slug']) {
        if (item[k] && !NON_EN.test(item[k])) contextBits.push(`${k}: ${item[k]}`);
      }
      // Add any clean EN translation as reference (first non-EN-translated locale that has English-ish text)
      for (const t of (item.translations || [])) {
        if (t.languages_code === 'en' && t.hero_title && !NON_EN.test(t.hero_title)) {
          contextBits.push(`existing EN hero_title: ${t.hero_title}`);
          break;
        }
      }
      const context = contextBits.join('\n') || `slug: ${item.slug}`;

      if (DRY_RUN) {
        console.log(`  [DRY] ${file}/${item.slug}: would regenerate ${fields.length} fields (${fields.join(',')})`);
        regenerated++;
        continue;
      }

      console.log(`  ${file}/${item.slug}: regenerating ${fields.length} fields...`);
      try {
        const raw = await llmGenerate(context, fields);
        const values = parseNumbered(raw);
        const fieldList = ['title', 'hero_title', 'hero_subtitle', 'hero_description', 'intro_heading', 'meta_title', 'meta_description'];
        fieldList.forEach((f, i) => {
          const v = values[i];
          if (v && !NON_EN.test(v)) item[f] = v;
        });
        regenerated++;

        if (PUSH && ADMIN && item.id) {
          const body = {};
          for (const f of fieldList) if (item[f]) body[f] = item[f];
          const res = await fetch(`${PAYLOAD_URL}/api/landing_pages/${item.id}?depth=0`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `users API-Key ${ADMIN}` },
            body: JSON.stringify(body),
          });
          if (!res.ok) console.log(`    ✗ Payload ${item.id}: ${(await res.text()).slice(0, 80)}`);
        }
      } catch (e) {
        console.log(`    ✗ ${item.slug}: ${e.message}`);
        errors++;
      }
    }

    if (dirty > 0 && !DRY_RUN) {
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf-8');
      console.log(`  ✓ wrote ${file} (${dirty} pages processed)`);
    }
  }
  console.log(`\nDone: ${regenerated} pages processed, ${errors} errors${DRY_RUN ? ' [DRY RUN]' : ''}`);
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
