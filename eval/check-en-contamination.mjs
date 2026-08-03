#!/usr/bin/env node
/**
 * check-en-contamination.mjs
 *
 * Guardrail: flags items whose EN base fields contain NON-ENGLISH text
 * (e.g. Portuguese/Chinese/German/Spanish entered as the English base in
 * Payload admin — observed 2026-08-03: 225+ contaminated fields).
 *
 * Detection strategy: targeted language markers for the languages observed
 * in this codebase (pt, es, de, fr, zh, ja, ru, ms) + script detection for
 * CJK/Cyrillic. Tuned to avoid false positives on proper-noun-heavy tourism
 * text (franc was tested and misdetected "Penang Street Food" etc.).
 *
 * Conservative thresholds: accents/scripts on short text, word markers with
 * boundaries, min length 12 chars.
 *
 * Output: JSON { clean, contaminatedCount, contaminated: [...] }
 * Exit code 1 if contaminated (for CI gating), 0 otherwise.
 *
 * Usage: node eval/check-en-contamination.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT, 'site/src/data/content');
const registryPath = path.resolve(ROOT, 'site/scripts/lib/translation-collections.mjs');
const { COLLECTIONS } = await import(registryPath);

// ── Language markers (word-boundary anchored to avoid false positives) ──────
// Portuguese (the most common contaminant observed)
const PT = [
  /\bvocê\b/i, /\bpode\b/i, /\bquanto\b/i, /\bpasseio\b/i, /\bcomida\b/i,
  /\breservar\b/i, /\brestrições\b/i, /\bacontece\b/i, /\bcaminhada\b/i,
  /\bescolha\b/i, /\bexcursões?\b/i, /\bmalásia\b/i, /\bguia\b/i, /\bpara\b/i,
];
// Spanish
const ES = [
  /\busted\b/i, /\bpuede\b/i, /\bpueden\b/i, /\bcuánto\b/i, /\bguía\b/i,
  /\bcomida\b/i, /\bexcursiones?\b/i, /\bmalasia\b/i, /\breservar\b/i,
  /\bqué\b/i, /\bpara\b/i, /\bchefs\b/i, /\bmapa\b/i, /\bmundial\b/i,
];
// German (no accents — missed by accent heuristics)
const DE = [
  /\bder\b/i, /\bdie\b/i, /\bdas\b/i, /\bund\b/i, /\bfür\b/i, /\bvon\b/i,
  /\bmit\b/i, /\bauf\b/i, /\bnicht\b/i, /\bein\b|\beine\b/i, /\bmalaysisch/i,
  /\bessen\b/i, /\bküche\b/i, /\bstädte\b/i, /\bstrasse\b/i, /\blebensmittel\b/i,
  /\bkultur\b/i, /\bführer\b/i, /\bführung\b/i, /\bwas\b/i, /\bwo\b/i, /\bist\b/i,
];
// French
const FR = [
  /\ble\b/i, /\bla\b/i, /\bles\b/i, /\bdes\b/i, /\bavec\b/i, /\bpour\b/i,
  /\bmalaisie\b/i, /\bcuisine\b/i, /\bvotre\b/i, /\bnos\b/i, /\bnous\b/i,
];
// Malay (Bahasa Malaysia)
const MS = [
  /\bpusingan\b/i, /\bmakanan\b/i, /\bkami\b/i, /\btentang\b/i, /\blawatan\b/i,
  /\bhubungi\b/i, /\bperjalanan\b/i, /\bcerita\b/i, /\blokasi\b/i, /\bpilih\b/i,
];

const ACCENTS_PT_ES_FR = /[çãõáàâéèêíìîóòôúùûüñ]/;
const CJK = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/;
const CYRILLIC = /[\u0400-\u04ff]/;

function looksNonEnglish(text) {
  if (typeof text !== 'string') return null;
  const t = text.trim();
  if (t.length < 12) return null; // too short to judge

  // Script detection — unambiguous
  if (CJK.test(t)) return 'cjk';
  if (CYRILLIC.test(t)) return 'cyrillic';

  // Portuguese (the most common contaminant — its markers are distinctive)
  let hits = PT.filter((m) => m.test(t)).length;
  if (hits >= 2) return 'pt';
  // Single very distinctive pt word also counts
  if (/\bvocê\b|\bexcursões?\b|\brestrições\b|\bmalásia\b/i.test(t)) return 'pt';

  // Spanish
  hits = ES.filter((m) => m.test(t)).length;
  if (hits >= 3) return 'es';
  if (/\busted\b|\bexcursiones?\b|\bmalasia\b|\bcuánto\b/i.test(t)) return 'es';

  // German
  hits = DE.filter((m) => m.test(t)).length;
  if (hits >= 4) return 'de';
  if (/\bmalaysisch\b|\bküche\b|\bführung\b|\bführer\b/i.test(t)) return 'de';

  // French
  hits = FR.filter((m) => m.test(t)).length;
  if (hits >= 4) return 'fr';
  if (/\bmalaisie\b/i.test(t)) return 'fr';

  // Malay
  hits = MS.filter((m) => m.test(t)).length;
  if (hits >= 3) return 'ms';
  if (/\bpusingan\b|\blawatan\b/i.test(t)) return 'ms';

  // Accent density (fallback for pt/es/fr not caught above)
  const accents = (t.match(ACCENTS_PT_ES_FR) || []).length;
  if (accents >= 4) return 'accented';

  return null;
}

function scanItem(item, collection, cfg) {
  const hits = [];
  for (const field of cfg.translatableFields || []) {
    const v = item[field];
    if (typeof v !== 'string') continue;
    const lang = looksNonEnglish(v);
    if (lang) hits.push({ field, snippet: v.slice(0, 60), lang });
  }
  return hits;
}

const contaminated = [];
for (const [name, cfg] of Object.entries(COLLECTIONS)) {
  const filePath = path.join(CONTENT_DIR, cfg.file);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    const hits = scanItem(item, name, cfg);
    for (const h of hits) {
      contaminated.push({
        collection: name,
        id: item.id ?? item.slug ?? '?',
        field: h.field,
        lang: h.lang,
        snippet: h.snippet,
      });
    }
  }
}

const output = {
  clean: contaminated.length === 0,
  contaminatedCount: contaminated.length,
  contaminated,
};
process.stdout.write(JSON.stringify(output, null, 2));
process.exit(contaminated.length > 0 ? 1 : 0);
