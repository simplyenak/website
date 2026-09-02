#!/usr/bin/env node
/**
 * indexnow-submit.mjs — POST sitemap URLs to the IndexNow API for fast
 * Bing / Yandex / LinkedIn (and SEPR) indexing.
 *
 * IndexNow does NOT cover Google — Google ignores it. For Google same-day
 * indexing rely on sitemap + gsc-auto-index.py (URL Inspection API) instead.
 *
 * Submits ONLY URLs not present in the last successful run (state file
 * .indexnow-state.json next to this script, per-domain URL set). IndexNow's
 * own guidance is changed-URLs-only; bulk-resubmitting ~1400 static URLs
 * daily got the host rate-limited with HTTP 403 (Aug 2026). The Simply Enak
 * sitemaps carry no <lastmod>, so a URL-set diff is the freshness signal.
 * Changed (not new) URLs are NOT resubmitted — rely on GSC for those.
 *
 * Usage (from cte/ or site/ root):
 *   node scripts/indexnow-submit.mjs --domain=culinarytravelexperts.com [--dry-run] [--full]
 *   node scripts/indexnow-submit.mjs --domain=simplyenak.com
 *
 * Key file: public/indexnow-key.txt (served at https://<domain>/indexnow-key.txt)
 * The key is served publicly on purpose — that is how IndexNow validates the host.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../public/indexnow-key.txt');
const stateFile = path.resolve(__dirname, '../.indexnow-state.json');

function argValue(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
}

const DOMAIN = argValue('domain') || process.env.INDEXNOW_DOMAIN;
const DRY = process.argv.includes('--dry-run');
const FULL = process.argv.includes('--full');
const SITEMAP_INDEX = `https://${DOMAIN}/sitemap-index.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 100;
const SLEEP_MS = 500;
// Hard cap per run: IndexNow flags hosts that submit their entire site daily.
// A normal day adds far fewer URLs than this; a first run (no state) submits
// at most this many and records the rest as seen.
const MAX_URLS_PER_RUN = 300;

if (!DOMAIN) {
  console.error('[indexnow] missing --domain=<host>');
  process.exit(1);
}
if (!fs.existsSync(keyFile)) {
  console.error(`[indexnow] key file not found: ${keyFile} — run a generator or add the key first`);
  process.exit(1);
}

const key = fs.readFileSync(keyFile, 'utf8').trim();
if (!/^[a-f0-9]{64}$/i.test(key)) {
  console.error(`[indexnow] key not a 64-hex value (got ${key.length} chars): ${keyFile}`);
  process.exit(1);
}

// State: { "<domain>": [urls seen in last successful run] }
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {
    return {};
  }
}
function saveState(state) {
  try {
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n');
  } catch (e) {
    console.warn(`[indexnow] could not write state file: ${e.message}`);
  }
}

const state = loadState();
const known = new Set(FULL ? [] : state[DOMAIN] || []);

const urls = new Set();
async function collect(sitemapUrl) {
  const res = await fetchRetry(sitemapUrl, { headers: { 'user-agent': 'indexnow-submit/1.0' } });
  if (!res.ok) throw new Error(`GET ${sitemapUrl} -> HTTP ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+?)\s*<\/loc>/g)].map((m) => m[1].trim());
  for (const loc of locs) {
    const host = new URL(loc).hostname;
    if (host === DOMAIN && loc.endsWith('.xml')) await collect(loc);
    else if (host === DOMAIN) urls.add(loc);
    // ignore cross-domain locs (e.g. a canonical pointing at a sibling build)
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sitemap fetches through the CDN Worker occasionally flake (transient
// 5xx/timeout) — retry with backoff instead of failing the whole run.
async function fetchRetry(url, opts, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      console.warn(`[indexnow] GET ${url} -> HTTP ${res.status} (attempt ${i}/${attempts})`);
    } catch (e) {
      console.warn(`[indexnow] GET ${url} -> ${e.message} (attempt ${i}/${attempts})`);
    }
    if (i < attempts) await sleep(1000 * i);
  }
  throw new Error(`GET ${url} failed after ${attempts} attempts`);
}

async function submit(batch) {
  const body = { host: DOMAIN, key, urlList: batch };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return res.status;
}

async function main() {
  const mode = FULL ? 'full' : known.size ? 'diff' : 'first run';
  console.log(`[indexnow] host=${DOMAIN} sitemap=${SITEMAP_INDEX} mode=${mode}`);
  await collect(SITEMAP_INDEX);
  const all = [...urls];
  const fresh = all.filter((u) => !known.has(u));
  // First run / --full: cap to avoid a bulk resubmit; later runs are small.
  const capped = fresh.length > MAX_URLS_PER_RUN ? fresh.slice(0, MAX_URLS_PER_RUN) : fresh;
  if (fresh.length > MAX_URLS_PER_RUN) {
    console.warn(`[indexnow] capping ${fresh.length} -> ${MAX_URLS_PER_RUN} URLs (guard against bulk resubmit 403s)`);
  }
  console.log(`[indexnow] discovered ${all.length} URLs, ${fresh.length} new, submitting ${capped.length}`);

  if (DRY) {
    console.log(`[indexnow] DRY-RUN — would submit ${capped.length} URLs in ${Math.ceil(capped.length / BATCH)} batch(es)`);
    if (capped.length) console.log(`[indexnow] sample: ${capped.slice(0, 3).join(', ')}`);
    console.log(`[indexnow] key: ${key.slice(0, 8)}…${key.slice(-8)}`);
    return;
  }

  let ok = 0, failed = 0;
  for (let i = 0; i < capped.length; i += BATCH) {
    const batch = capped.slice(i, i + BATCH);
    try {
      const status = await submit(batch);
      if (status === 200 || status === 202) { ok += batch.length; }
      else { failed += batch.length; console.warn(`[indexnow] batch ${i / BATCH + 1} -> HTTP ${status} (${batch.length} not submitted)`); }
    } catch (e) {
      failed += batch.length;
      console.warn(`[indexnow] batch ${i / BATCH + 1} -> error: ${e.message}`);
    }
    await sleep(SLEEP_MS);
  }
  console.log(`[indexnow] done: ${ok} submitted, ${failed} failed`);
  // Only update the known-URL set on a fully successful run so failures retry tomorrow.
  if (!failed) {
    state[DOMAIN] = [...urls].sort();
    saveState(state);
  } else {
    process.exit(1);
  }
}

main().catch((e) => { console.error(`[indexnow] fatal: ${e.message}`); process.exit(1); });
