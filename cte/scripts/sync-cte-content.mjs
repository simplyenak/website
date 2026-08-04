#!/usr/bin/env node
/**
 * CTE Content Sync Script
 * Syncs CTE blog posts from Payload CMS to local JSON files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || '';

async function fetchFromPayload(endpoint, token) {
  const url = `${PAYLOAD_URL}/api/${endpoint}?limit=100&depth=0`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }
  const data = await response.json();
  return data.docs || [];
}

async function syncCtePosts() {
  console.log('Syncing CTE posts from Payload...');

  try {
    const posts = await fetchFromPayload('cte-posts', PAYLOAD_TOKEN);
    console.log(`Found ${posts.length} posts`);

    // Convert to simpler format for static rendering
    const syncedPosts = posts.map(doc => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt || '',
      content_markdown: doc.content_markdown || '',
      publishedDate: doc.publishedDate || doc.createdAt,
      meta_title: doc.meta_title || doc.title,
      meta_description: doc.meta_description || doc.excerpt,
      featuredImage: doc.featuredImage ?
        (typeof doc.featuredImage === 'object' ? doc.featuredImage.url : doc.featuredImage) :
        null,
      author: doc.author ?
        (typeof doc.author === 'object' ? doc.author.name : doc.author) :
        'CTE Team',
      workflowStatus: doc.workflowStatus,
      _status: doc._status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    // Sort by date
    syncedPosts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    // Write to content file
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
    const pages = await fetchFromPayload('cte-pages', PAYLOAD_TOKEN);
    console.log(`Found ${pages.length} pages`);

    // Convert to simpler format for static rendering
    const syncedPages = pages.map(doc => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      content_markdown: doc.content_markdown || '',
      meta_title: doc.meta_title || doc.title,
      meta_description: doc.meta_description || '',
      featuredImage: doc.featuredImage ?
        (typeof doc.featuredImage === 'object' ? doc.featuredImage.url : doc.featuredImage) :
        null,
      workflowStatus: doc.workflowStatus,
      _status: doc._status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    // Write to content file
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

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
