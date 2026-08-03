#!/usr/bin/env node
/**
 * check-en-contamination.mjs
 *
 * Guardrail: flags items whose EN base fields contain NON-ENGLISH text
 * (e.g. the 2026-08-03 discovery: 10 FAQ questions had Portuguese entered
 * as the English base in Payload admin). Such items render foreign text on
 * the EN site and mislead the translation pipeline.
 *
 * Heuristic: for each item's translatable base fields, detect the language
 * via simple marker heuristics (accented chars common to pt/fr/es, CJK,
 * Cyrillic). Portuguese markers: ç, ã, õ, "Você", "pode", "quanto", etc.
 *
 * Output: JSON { clean: bool, contaminated: [{collection, id, field, snippet}] }
 * Exit 0 always (informational).
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

// Strong non-English markers (Portuguese was the observed contaminant)
const PT_MARKERS = ['ç', 'ã', 'õ', /você/i, /pode/i, /quanto/i, /passeio/i, /comida/i, /reservar/i, /restrições/i, /acontece/i, /caminhada/i];
// German markers — German has FEW accented chars so the accent heuristic
// misses it (observed: 17 story metas were German without accents).
// Word-boundary anchored to avoid false positives ("ein" in "being" etc.)
const DE_MARKERS = [/\bder\b/i, /\bdie\b/i, /\bdas\b/i, /\bund\b/i, /\bfür\b/i, /\bvon\b/i, /\bmit\b/i, /\bauf\b/i, /\bnicht\b/i, /\bein\b|\beine\b/i, /\bmalaysisch/i, /\bessen\b/i, /\bküche\b/i, /\bstädte\b/i, /\bstrasse\b/i, /\blebensmittel\b/i, /\bkultur\b/i, /\bführer\b/i, /\bführung\b/i];
const NON_EN_RE = /[áàâäéèêëíìîïóòôöúùûüçñãõ]/;

function looksNonEnglish(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  // CJK / Cyrillic are obviously non-EN
  if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text)) return 'cjk';
  if (/[\u0400-\u04ff]/.test(text)) return 'cyrillic';
  // Accent density: 2+ accented chars in short text strongly suggests pt/fr/es
  const accents = (text.match(NON_EN_RE) || []).length;
  if (accents >= 2) return 'accented';
  // Portuguese-specific words
  for (const m of PT_MARKERS) {
    if (m instanceof RegExp ? m.test(text) : text.includes(m)) return 'pt-word';
  }
  // German markers (works on non-accented text)
  const deHits = DE_MARKERS.filter((m) => m.test(text)).length;
  if (deHits >= 2) return 'german';
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

process.stdout.write(JSON.stringify({
  clean: contaminated.length === 0,
  contaminatedCount: contaminated.length,
  contaminated,
}, null, 2));
