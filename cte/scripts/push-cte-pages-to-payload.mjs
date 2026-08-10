#!/usr/bin/env node
/**
 * Push CTE pages to Payload CMS
 * 
 * This script pulls content from the local cte-pages.json and pushes it to
 * Payload CMS. Use this to update Payload with the latest content from the
 * JSON file.
 * 
 * Usage:
 *   node scripts/push-cte-pages-to-payload.mjs [--push]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(SCRIPT_DIR, '..', 'src', 'data', 'content');
const SITE_ENV_PATH = join(SCRIPT_DIR, '..', '..', 'site', '.env');

// Load credentials from site/.env
const credentials = {};
try {
  const envContent = readFileSync(SITE_ENV_PATH, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      credentials[key.trim()] = valueParts.join('=').trim();
    }
  }
} catch (e) {
  console.warn('Warning: Could not read site/.env');
}

const PAYLOAD_URL = 'https://cms.system.simplyenak.com';
const PAYLOAD_EMAIL = credentials.PAYLOAD_EMAIL || 'admin@simplyenak.com';
const PAYLOAD_PASSWORD = credentials.PAYLOAD_PASSWORD || '';

async function login() {
  const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} - ${await response.text()}`);
  }
  
  const data = await response.json();
  return data.token;
}

async function getPages(token) {
  const response = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.status}`);
  }
  
  const data = await response.json();
  return data.docs || [];
}

async function createOrUpdatePage(token, pageData) {
  const slug = pageData.slug;
  
  // Check if page already exists
  const existingPages = await getPages(token);
  const existingPage = existingPages.find(p => p.slug === slug);
  
  const payloadPage = {
    title: pageData.title,
    slug: slug,
    content_markdown: pageData.content_markdown,
    meta_title: pageData.meta_title || pageData.title,
    meta_description: pageData.meta_description || '',
    workflowStatus: 'published',
  };
  
  let response;
  
  if (existingPage) {
    // Update existing page
    response = await fetch(`${PAYLOAD_URL}/api/cte_pages/${existingPage.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payloadPage),
    });
    
    if (!response.ok) {
      console.error(`Failed to update page ${slug}: ${response.status}`);
      return null;
    }
    
    console.log(`Updated page: ${slug}`);
  } else {
    // Create new page
    response = await fetch(`${PAYLOAD_URL}/api/cte_pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payloadPage),
    });
    
    if (!response.ok) {
      console.error(`Failed to create page ${slug}: ${response.status}`);
      return null;
    }
    
    console.log(`Created page: ${slug}`);
  }
  
  return response.json();
}

async function main() {
  const shouldPush = process.argv.includes('--push');
  
  // Read pages from JSON
  const pagesPath = join(CONTENT_DIR, 'cte-pages.json');
  if (!existsSync(pagesPath)) {
    console.error('Error: cte-pages.json not found');
    process.exit(1);
  }
  
  const pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
  console.log(`Found ${pages.length} pages in cte-pages.json`);
  
  if (shouldPush) {
    console.log('Logging in to Payload...');
    const token = await login();
    console.log('Logged in successfully');
    
    for (const page of pages) {
      await createOrUpdatePage(token, page);
    }
    
    console.log('\nPush complete!');
  } else {
    console.log('Pages in cte-pages.json:');
    pages.forEach(p => console.log(`  - ${p.slug}: ${p.title}`));
    console.log('\nUse --push to sync these to Payload CMS');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
