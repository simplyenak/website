#!/usr/bin/env node
/**
 * Debug: List all CTE pages with their workflowStatus
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const siteEnvPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'site', '.env');
const credentials = {};
try {
  const envContent = readFileSync(siteEnvPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      credentials[key.trim()] = valueParts.join('=').trim();
    }
  }
} catch (e) {}

const PAYLOAD_URL = 'https://cms.system.simplyenak.com';
const PAYLOAD_EMAIL = credentials.PAYLOAD_EMAIL || 'admin@simplyenak.com';
const PAYLOAD_PASSWORD = credentials.PAYLOAD_PASSWORD || '';

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD })
  });
  const data = await res.json();
  return data.token;
}

async function main() {
  const token = await login();
  
  // Get ALL pages (no workflowStatus filter)
  const res = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  
  console.log('All CTE Pages in Payload:');
  for (const page of data.docs || []) {
    console.log(`  - id: ${page.id}, slug: ${page.slug}, title: ${page.title}, status: ${page.workflowStatus || 'none'}`);
  }
  
  // Also check with workflowStatus=published filter
  console.log('\nPublished CTE Pages (workflowStatus=published):');
  const publishedRes = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100&where[workflowStatus][equals]=published`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const publishedData = await publishedRes.json();
  for (const page of publishedData.docs || []) {
    console.log(`  - id: ${page.id}, slug: ${page.slug}, title: ${page.title}`);
  }
}

main().catch(console.error);
