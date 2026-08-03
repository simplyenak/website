#!/usr/bin/env node
/**
 * mirror-sitemap.mjs
 *
 * Post-build step: copy dist/sitemap-index.xml → dist/sitemap.xml so the
 * conventional /sitemap.xml path serves a valid <sitemapindex> root.
 * Agent-readiness checkers (HERALD) and some AI crawlers probe /sitemap.xml
 * specifically; without this the path fell through to the soft-404 HTML page.
 *
 * Usage: node scripts/mirror-sitemap.mjs   (after `astro build`)
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('dist/sitemap-index.xml');
const DST = path.resolve('dist/sitemap.xml');

if (!fs.existsSync(SRC)) {
  console.warn('[mirror-sitemap] dist/sitemap-index.xml not found — skipping');
  process.exit(0);
}

const content = fs.readFileSync(SRC, 'utf-8');
if (!/^<\?xml/.test(content)) {
  console.warn('[mirror-sitemap] dist/sitemap-index.xml does not look like XML — skipping');
  process.exit(0);
}

fs.writeFileSync(DST, content, 'utf-8');
console.log('[mirror-sitemap] Mirrored sitemap-index.xml → sitemap.xml');
