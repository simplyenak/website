#!/usr/bin/env node
/**
 * CTE Content Sync Script
 * Syncs CTE blog posts + pages from Payload CMS to local JSON files.
 *
 * Usage:
 *   PAYLOAD_URL=... PAYLOAD_TOKEN=... node scripts/sync-cte-content.mjs
 *
 * Output: src/data/content/cte-posts.json, src/data/content/cte-pages.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || '';

async function fetchFromPayload(endpoint, token) {
  // depth=1 resolves featuredImage + author relationships to objects (with url/name)
  // Only workflowStatus=published content is synced — drafts/in-review/approved
  // stay in the CMS until an editor publishes them.
  const url = `${PAYLOAD_URL}/api/${endpoint}?limit=100&depth=1&sort=-publishedDate&where[workflowStatus][equals]=published`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }
  const data = await response.json();
  return data.docs || [];
}

function imageUrl(image) {
  if (!image) return null;
  if (typeof image === 'object') return image.url || image.filename || null;
  return image; // already a URL string
}

function authorName(author) {
  if (!author) return 'CTE Team';
  if (typeof author === 'object') return author.fullName || author.name || 'CTE Team';
  return author;
}

async function syncCtePosts() {
  console.log('Syncing CTE posts from Payload...');

  try {
    const posts = await fetchFromPayload('cte_posts', PAYLOAD_TOKEN);
    console.log(`Found ${posts.length} posts`);

    const syncedPosts = posts.map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt || '',
      content_markdown: doc.content_markdown || '',
      publishedDate: doc.publishedDate || doc.createdAt,
      meta_title: doc.meta_title || doc.title,
      meta_description: doc.meta_description || doc.excerpt || '',
      featuredImage: imageUrl(doc.featuredImage),
      author: authorName(doc.author),
      workflowStatus: doc.workflowStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    // Sort by date (newest first)
    syncedPosts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    const contentDir = join(process.cwd(), 'src', 'data', 'content');
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }

    const outputPath = join(contentDir, 'cte-posts.json');
    writeFileSync(outputPath, JSON.stringify(syncedPosts, null, 2));

    console.log(`Synced ${syncedPosts.length} posts to ${outputPath}`);
    return syncedPosts;
  } catch (error) {
    console.error('Error syncing CTE posts:', error.message);
    throw error;
  }
}

async function syncCtePages() {
  console.log('Syncing CTE pages from Payload...');

  try {
    const pages = await fetchFromPayload('cte_pages', PAYLOAD_TOKEN);
    console.log(`Found ${pages.length} pages`);

    const syncedPages = pages.map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      content_markdown: doc.content_markdown || '',
      meta_title: doc.meta_title || doc.title,
      meta_description: doc.meta_description || '',
      featuredImage: imageUrl(doc.featuredImage),
      workflowStatus: doc.workflowStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    const contentDir = join(process.cwd(), 'src', 'data', 'content');
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }

    const outputPath = join(contentDir, 'cte-pages.json');
    writeFileSync(outputPath, JSON.stringify(syncedPages, null, 2));

    console.log(`Synced ${syncedPages.length} pages to ${outputPath}`);
    return syncedPages;
  } catch (error) {
    console.error('Error syncing CTE pages:', error.message);
    throw error;
  }
}

async function main() {
  console.log('CTE Content Sync - Starting...\n');

  await syncCtePosts();
  console.log('');
  await syncCtePages();

  console.log('\nSync complete!');
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
