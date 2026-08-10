#!/usr/bin/env node
/**
 * Debug: Check Payload API routes and try different update approaches
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
  
  // Get all pages
  const res = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  
  console.log('Pages found:', data.docs?.length);
  for (const page of data.docs || []) {
    console.log(`  - id: ${page.id}, slug: ${page.slug}, status: ${page.workflowStatus}`);
  }
  
  // Try updating with full document body
  const forAgents = data.docs?.find(d => d.slug === 'for-agents');
  if (forAgents) {
    console.log('\n--- Updating for-agents (id:', forAgents.id, ') ---');
    
    // Method 1: PUT with full doc
    const update1 = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        ...forAgents,
        workflowStatus: 'published',
        title: 'For Travel Agents'
      })
    });
    console.log('PUT response:', update1.status, await update1.text().then(t => t.slice(0, 200)));
    
    // Method 2: PATCH
    const update2 = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        workflowStatus: 'published'
      })
    });
    console.log('PATCH response:', update2.status, await update2.text().then(t => t.slice(0, 200)));
    
    // Method 3: POST with _status
    const update3 = await fetch(`${PAYLOAD_URL}/api/cte_pages`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        id: forAgents.id,
        title: 'For Travel Agents',
        slug: 'for-agents',
        content_markdown: forAgents.content_markdown,
        workflowStatus: 'published'
      })
    });
    console.log('POST response:', update3.status, await update3.text().then(t => t.slice(0, 200)));
  }
}

main().catch(console.error);
