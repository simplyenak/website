#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const siteEnvPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'site', '.env');
let PAYLOAD_PASSWORD = '';
try {
  const envContent = readFileSync(siteEnvPath, 'utf8');
  const match = envContent.match(/^PAYLOAD_PASSWORD=(.+)$/m);
  if (match) PAYLOAD_PASSWORD = match[1].trim();
} catch (e) {}

const PAYLOAD_URL = 'https://cms.system.simplyenak.com';
const PAYLOAD_EMAIL = 'admin@simplyenak.com';

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
  
  // Get for-agents page
  const res = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  const forAgents = data.docs?.find(d => d.slug === 'for-agents');
  
  console.log('for-agents page:', JSON.stringify({ id: forAgents?.id, slug: forAgents?.slug, status: forAgents?.workflowStatus }, null, 2));
  
  if (!forAgents) {
    console.log('Page not found');
    return;
  }
  
  // Try to update workflowStatus to published
  console.log('\n--- Updating workflowStatus to published ---');
  
  // Method 1: PUT with only workflowStatus
  const update1 = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ workflowStatus: 'published' })
  });
  console.log('PUT workflowStatus only:', update1.status);
  console.log('Response:', await update1.text());
  
  // Method 2: PUT with all fields
  const update2 = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      ...forAgents,
      workflowStatus: 'published'
    })
  });
  console.log('\nPUT all fields:', update2.status);
  console.log('Response:', await update2.text());
  
  // Method 3: PATCH
  const update3 = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ workflowStatus: 'published' })
  });
  console.log('\nPATCH workflowStatus:', update3.status);
  console.log('Response:', await update3.text());
}

main().catch(console.error);
