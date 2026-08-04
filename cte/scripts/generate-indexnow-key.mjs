#!/usr/bin/env node
/**
 * generate-indexnow-key.mjs
 *
 * Generate a new IndexNow key and save it to public/indexnow-key.txt
 * if it doesn't already exist.
 *
 * Usage: node scripts/generate-indexnow-key.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../public/indexnow-key.txt');

// Check if key already exists
if (fs.existsSync(keyFile)) {
  console.log('[indexnow] Key already exists, skipping generation');
  process.exit(0);
}

// Generate a new 64-character hex key
const key = crypto.randomUUID().replace(/-/g, '').slice(0, 64);

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the key
fs.writeFileSync(keyFile, key, 'utf-8');
console.log(`[indexnow] Generated new key: ${key}`);
console.log(`[indexnow] Saved to: ${keyFile}`);
