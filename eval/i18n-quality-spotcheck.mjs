#!/usr/bin/env node
/**
 * i18n-quality-spotcheck.mjs — report-only translation quality sampler
 *
 * Rationale (2026-09-02, from the SEO collapse-case review): the heal loop
 * translates with an LLM and ships across 9 locales with structural
 * verification only (coverage, contamination). Nothing ever READS the
 * translated prose. This script samples a few fields per locale each run and
 * applies cheap deterministic heuristics, then reports for HUMAN review.
 * It never modifies anything and never blocks a deploy — flag, don't fix.
 *
 * Checks per sampled field (EN vs locale, string fields > 40 chars):
 *   untranslated_leak — locale value byte-identical to a long EN source
 *   truncation         — locale < 35% of EN length (EN > 120 chars)
 *   collapse           — one locale value reused for 3+ distinct EN sources
 *   artifact           — placeholder residue ([Your Name], TODO, lorem…)
 *   bad_entity         — double-encoded HTML entities (&amp;nbsp;, &amp;#)
 *
 * Usage:
 *   node eval/i18n-quality-spotcheck.mjs [--sample N] [--locale xx]
 *        [--seed N] [--json] [--strict]
 *   --sample  fields per locale (default 25)
 *   --seed    PRNG seed (default: today's YYYYMMDD — reproducible per day,
 *             drifts across days so cron coverage rotates)
 *   --strict  exit 1 when findings exist (NOT used by heal-i18n.sh)
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : dflt;
};
const SAMPLE_N = parseInt(flag('sample', '25'), 10);
const LOCALE_FILTER = flag('locale', null);
const WANT_JSON = argv.includes('--json');
const STRICT = argv.includes('--strict');
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const SEED = parseInt(flag('seed', today), 10);

// Deterministic PRNG (mulberry32)
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Works from repo root OR from site/ (heal-i18n.sh runs it via `cd site`)
const CONTENT_DIR = fs.existsSync(path.resolve(process.cwd(), 'src/data/content'))
  ? path.resolve(process.cwd(), 'src/data/content')
  : path.resolve(import.meta.dirname, '..', 'site', 'src', 'data', 'content');
const MIN_FIELD_LEN = 40;

const ARTIFACT_RE = /\[your name|insert_source|lorem ipsum|\btodo:?\b/i;
const ENTITY_RE = /&amp;nbsp;|&amp;#|&lt;br&gt;/i;
const CJK_RE = /[\u4e00-\u9fff\u3040-\u30ff]/;

/**
 * Effective length for ratio comparison: CJK scripts carry ~2.5x the
 * meaning per character vs alphabetic scripts, so a correct zh/ja
 * translation is routinely 30-50% of the EN character count. Weighting
 * CJK chars keeps the ratio comparable across scripts.
 */
function effectiveLen(s, locale) {
  if (!/^(zh|ja)$/.test(locale)) return s.length;
  let n = 0;
  for (const ch of s) n += CJK_RE.test(ch) ? 2.5 : 1;
  return n;
}

/** Collect comparable (en, locale) string-field pairs from a snapshot file. */
function collectPairs(file) {
  let docs;
  try {
    docs = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
  } catch {
    return [];
  }
  if (!Array.isArray(docs)) return [];
  const pairs = [];
  for (const doc of docs) {
    const tr = doc.translations;
    if (!Array.isArray(tr)) continue;
    const en = tr.find((t) => (t.languages_code || t.locale || 'en') === 'en');
    if (!en) continue;
    for (const loc of tr) {
      const code = loc.languages_code || loc.locale;
      if (!code || code === 'en') continue;
      for (const [k, enVal] of Object.entries(en)) {
        if (typeof enVal !== 'string' || enVal.length < MIN_FIELD_LEN) continue;
        const locVal = loc[k];
        if (typeof locVal !== 'string' || !locVal.trim()) continue;
        pairs.push({ file, id: doc.id ?? doc.slug ?? '?', field: k, locale: code, en: enVal, loc: locVal });
      }
    }
  }
  return pairs;
}

function classify(p) {
  const reasons = [];
  if (p.loc === p.en && p.en.length > 60) reasons.push('untranslated_leak');
  if (p.en.length > 120 && effectiveLen(p.loc, p.locale) < p.en.length * 0.35) reasons.push('truncation');
  if (ARTIFACT_RE.test(p.loc)) reasons.push('artifact');
  if (ENTITY_RE.test(p.loc)) reasons.push('bad_entity');
  // Known limitation: mixed-script defects (e.g. '巴当lepas' — a half-
  // translated proper noun inside zh prose) are NOT detected. Every cheap
  // heuristic tried (latin-run length, food-term allowlists, EN-source
  // cross-checks) drowned in legitimate latin retainments (brand, place and
  // dish names). Catching these reliably needs an LLM read — that's the
  // human-review layer this report feeds, not a regex.
  return reasons;
}

function snippet(s) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > 70 ? `${t.slice(0, 70)}…` : t;
}

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
  const all = files.flatMap(collectPairs);

  const byLocale = new Map();
  for (const p of all) {
    if (LOCALE_FILTER && p.locale !== LOCALE_FILTER) continue;
    if (!byLocale.has(p.locale)) byLocale.set(p.locale, []);
    byLocale.get(p.locale).push(p);
  }

  const report = { seed: SEED, samplePerLocale: SAMPLE_N, locales: {}, findings: [] };
  let sampledTotal = 0;

  for (const [locale, pairs] of [...byLocale.entries()].sort()) {
    const rng = mulberry32(SEED + locale.length * 7919 + locale.charCodeAt(0));
    const pool = [...pairs];
    const n = Math.min(SAMPLE_N, pool.length);
    const sample = [];
    for (let i = 0; i < n; i++) {
      sample.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    }
    sampledTotal += sample.length;

    // collapse detection is over the FULL pool, not the sample — cheap enough
    const seen = new Map();
    for (const p of pairs) {
      const key = `${p.file}|${p.locale}|${p.loc}`;
      if (!seen.has(key)) seen.set(key, { loc: p.loc, ens: new Set() });
      seen.get(key).ens.add(p.en);
    }

    const findings = [];
    for (const p of sample) {
      for (const type of classify(p)) {
        findings.push({
          locale, file: p.file, id: p.id, field: p.field, type,
          detail: `${type}: EN="${snippet(p.en)}" → ${p.locale.toUpperCase()}="${snippet(p.loc)}"`,
        });
      }
    }
    for (const [, v] of seen) {
      if (v.ens.size >= 3 && v.loc.length > 40) {
        findings.push({
          locale, file: '(multiple)', id: '(multiple)', field: '(multiple)', type: 'collapse',
          detail: `collapse: one ${locale} string reused for ${v.ens.size} distinct EN sources: "${snippet(v.loc)}"`,
        });
      }
    }

    report.locales[locale] = {
      pool: pairs.length, sampled: sample.length, findings: findings.length,
    };
    report.findings.push(...findings);
  }

  if (WANT_JSON) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`i18n quality spot-check (seed ${SEED}, ${sampledTotal} fields sampled across ${byLocale.size} locales)`);
    for (const [loc, s] of Object.entries(report.locales)) {
      const mark = s.findings === 0 ? '✅' : '⚠️ ';
      console.log(`  ${mark} ${loc}: ${s.sampled}/${s.pool} sampled, ${s.findings} finding(s)`);
    }
    if (report.findings.length) {
      console.log('');
      for (const f of report.findings.slice(0, 30)) {
        console.log(`  ⚠️  [${f.locale}] ${f.file} ${f.id}.${f.field}`);
        console.log(`      ${f.detail}`);
      }
      if (report.findings.length > 30) console.log(`  … and ${report.findings.length - 30} more (use --json)`);
      console.log('');
      console.log('  Report-only: review in Payload CMS, fix by hand. Nothing was changed.');
    } else {
      console.log('  No findings in this sample.');
    }
  }

  if (STRICT && report.findings.length) process.exit(1);
  process.exit(0);
}

main();
