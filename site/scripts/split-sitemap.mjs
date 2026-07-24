#!/usr/bin/env node

/**
 * split-sitemap.mjs
 *
 * Post-build script that splits the single @astrojs/sitemap output
 * (sitemap-0.xml) into per-locale sitemap files.
 *
 * Google Search Console can't report indexation per language when all
 * locales are in one file.  This script creates one sitemap per locale
 * and rewrites sitemap-index.xml to point to them.
 *
 * Usage:  node scripts/split-sitemap.mjs
 *         (run after `astro build`)
 *
 * ── Integration ──────────────────────────────────────────────────
 * To make this run automatically after every build, update the
 * "build" script in package.json from:
 *
 *     "build": "astro build"
 *
 * to:
 *
 *     "build": "astro build && node scripts/split-sitemap.mjs"
 *
 * ── Output ───────────────────────────────────────────────────────
 *   dist/sitemap-de.xml   — German URLs
 *   dist/sitemap-en.xml   — English (default, no prefix)
 *   dist/sitemap-es.xml   — Spanish URLs
 *   dist/sitemap-fr.xml   — French URLs
 *   dist/sitemap-ja.xml   — Japanese URLs
 *   dist/sitemap-ms.xml   — Malay URLs
 *   dist/sitemap-nl.xml   — Dutch URLs
 *   dist/sitemap-pt.xml   — Portuguese URLs
 *   dist/sitemap-ru.xml   — Russian URLs
 *   dist/sitemap-zh.xml   — Chinese URLs
 *   dist/sitemap-index.xml  — Rewritten to point to per-locale files
 *
 * The original dist/sitemap-0.xml is removed after splitting.
 */

import fs from 'node:fs';
import path from 'node:path';

// ── Configuration ────────────────────────────────────────────────
const SITE_BASE = 'https://simplyenak.com';
const SRC_FILE = 'dist/sitemap-0.xml';
const INDEX_FILE = 'dist/sitemap-index.xml';

// All supported locales (first path segment of the URL after domain).
// English (en) pages have no locale prefix.
const ALL_LOCALES = ['en', 'de', 'es', 'fr', 'ja', 'ms', 'nl', 'pt', 'ru', 'zh'];

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Determine the locale of a sitemap URL from its <loc> value.
 *
 *   https://simplyenak.com/de/tours/  →  de
 *   https://simplyenak.com/about      →  en
 *   https://simplyenak.com            →  en
 */
function localeFromLoc(loc) {
  const pathname = loc.replace(SITE_BASE, '');
  // Strip leading slash and take the first segment
  const firstSegment = pathname.replace(/^\//, '').split('/')[0];
  if (firstSegment && ALL_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }
  return 'en';
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  // Resolve paths relative to site/ (the cwd expected when running)
  const srcPath = path.resolve(SRC_FILE);
  const indexPath = path.resolve(INDEX_FILE);

  if (!fs.existsSync(srcPath)) {
    console.error(
      `[split-sitemap] ERROR: ${SRC_FILE} not found.\n` +
      '  Run `astro build` first, then this script.'
    );
    process.exit(1);
  }

  // ── 1. Parse the single sitemap into <url> blocks ─────────
  const content = fs.readFileSync(srcPath, 'utf-8');

  // Match the XML declaration (if present)
  const xmlDecl = content.match(/<\?xml[^>]*\?>/) || ['<?xml version="1.0" encoding="UTF-8"?>'];

  // Match the <urlset …> opening tag to capture its attributes
  const urlsetOpen = content.match(/<urlset[^>]*>/);
  if (!urlsetOpen) {
    console.error('[split-sitemap] ERROR: Could not find <urlset> opening tag.');
    process.exit(1);
  }
  const urlsetAttrs = urlsetOpen[0];

  // Extract every <url>…</url> block (the file is one compressed line)
  const urlRegex = /<url>.*?<\/url>/gs;
  const urlBlocks = content.match(urlRegex);

  if (!urlBlocks || urlBlocks.length === 0) {
    console.error('[split-sitemap] ERROR: No <url> elements found in sitemap.');
    process.exit(1);
  }

  console.log(`[split-sitemap] Read ${urlBlocks.length} URLs from ${SRC_FILE}`);

  // ── 2. Group <url> blocks by locale ───────────────────────
  const grouped = {};
  let unmapped = 0;

  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) {
      unmapped++;
      continue;
    }
    const loc = locMatch[1];
    const locale = localeFromLoc(loc);

    if (!grouped[locale]) {
      grouped[locale] = [];
    }
    grouped[locale].push(block);
  }

  if (unmapped > 0) {
    console.warn(`[split-sitemap] Warning: ${unmapped} URL blocks without <loc>.`);
  }

  const detectedLocales = Object.keys(grouped).sort();
  console.log(
    `[split-sitemap] Grouped into ${detectedLocales.length} locale(s):`,
    detectedLocales.map((l) => `${l} (${grouped[l].length})`).join(', ')
  );

  // ── 3. Write per-locale sitemaps ──────────────────────────
  for (const locale of detectedLocales) {
    const blocks = grouped[locale];
    const outFile = path.resolve(`dist/sitemap-${locale}.xml`);
    const output = `${xmlDecl[0]}${urlsetAttrs}${blocks.join('')}</urlset>`;
    fs.writeFileSync(outFile, output, 'utf-8');
    console.log(`[split-sitemap] Written ${blocks.length} URLs → dist/sitemap-${locale}.xml`);
  }

  // ── 4. Rewrite sitemap-index.xml ──────────────────────────
  const indexEntries = detectedLocales
    .map((locale) => `<sitemap><loc>${SITE_BASE}/sitemap-${locale}.xml</loc></sitemap>`)
    .join('');

  const indexOutput =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexEntries}</sitemapindex>`;

  fs.writeFileSync(indexPath, indexOutput, 'utf-8');
  console.log(`[split-sitemap] Rewritten sitemap-index.xml with ${detectedLocales.length} locale entries`);

  // ── 5. Cleanup: remove the original monolithic file ───────
  try {
    fs.unlinkSync(srcPath);
    console.log(`[split-sitemap] Removed original ${SRC_FILE}`);
  } catch {
    console.warn(`[split-sitemap] Could not remove ${SRC_FILE} — leaving in place.`);
  }

  console.log('[split-sitemap] Done.');
}

main();
