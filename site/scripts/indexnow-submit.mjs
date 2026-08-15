#!/usr/bin/env node
/**
 * indexnow-submit.mjs — POST live sitemap URLs to the IndexNow API for fast
 * Bing / Yandex / LinkedIn (and SEPR) indexing.
 *
 * IndexNow does NOT cover Google — Google ignores it. For Google same-day
 * indexing rely on sitemap + gsc-auto-index.py (URL Inspection API) instead.
 *
 * Usage (from cte/ or site/ root):
 *   node scripts/indexnow-submit.mjs --domain=culinarytravelexperts.com [--dry-run]
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

function argValue(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
}

const DOMAIN = argValue('domain') || process.env.INDEXNOW_DOMAIN;
const DRY = process.argv.includes('--dry-run');
const SITEMAP_INDEX = `https://${DOMAIN}/sitemap-index.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 1000;
const SLEEP_MS = 500;

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

const urls = new Set();
async function collect(sitemapUrl) {
  const res = await fetch(sitemapUrl, { headers: { 'user-agent': 'indexnow-submit/1.0' } });
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
  console.log(`[indexnow] host=${DOMAIN} sitemap=${SITEMAP_INDEX}`);
  await collect(SITEMAP_INDEX);
  const list = [...urls];
  console.log(`[indexnow] discovered ${list.length} URLs`);

  if (DRY) {
    console.log(`[indexnow] DRY-RUN — would submit ${list.length} URLs in ${Math.ceil(list.length / BATCH)} batch(es)`);
    console.log(`[indexnow] sample: ${list.slice(0, 3).join(', ')}`);
    console.log(`[indexnow] key: ${key.slice(0, 8)}…${key.slice(-8)}`);
    return;
  }

  let ok = 0, failed = 0;
  for (let i = 0; i < list.length; i += BATCH) {
    const batch = list.slice(i, i + BATCH);
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
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(`[indexnow] fatal: ${e.message}`); process.exit(1); });