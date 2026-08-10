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
  
  // Get all pages
  const res = await fetch(`${PAYLOAD_URL}/api/cte_pages?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  
  console.log('Pages in Payload:');
  for (const page of data.docs || []) {
    console.log(`  - id: ${page.id}, slug: ${page.slug}, title: ${page.title}, status: ${page.workflowStatus}`);
  }
  
  // Try to delete for-agents
  const forAgents = data.docs?.find(d => d.slug === 'for-agents');
  if (forAgents) {
    console.log('\n--- Deleting for-agents (id:', forAgents.id, ') ---');
    const delRes = await fetch(`${PAYLOAD_URL}/api/cte_pages/${forAgents.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    console.log('Delete status:', delRes.status);
    console.log('Delete response:', await delRes.text());
  }
}

main().catch(console.error);
