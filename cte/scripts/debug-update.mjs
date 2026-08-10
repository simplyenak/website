#!/usr/bin/env node
/**
 * Debug: Test GraphQL update for Payload
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
  
  // First, get the for-agents page ID
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
  
  // Try GraphQL update
  console.log('\n--- GraphQL update ---');
  const graphqlRes = await fetch(`${PAYLOAD_URL}/api/graphql`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      query: `
        mutation UpdateCtePage($id: JSON!, $workflowStatus: String!) {
          updateCtePages(id: $id, data: { workflowStatus: $workflowStatus }) {
            id
            slug
            workflowStatus
            title
          }
        }
      `,
      variables: {
        id: forAgents.id,
        workflowStatus: 'published'
      }
    })
  });
  
  console.log('GraphQL Status:', graphqlRes.status);
  const graphqlData = await graphqlRes.json();
  console.log('GraphQL Response:', JSON.stringify(graphqlData, null, 2));
}

main().catch(console.error);
