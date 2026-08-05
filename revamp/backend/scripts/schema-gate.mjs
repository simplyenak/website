#!/usr/bin/env node
/**
 * Schema gate — run AFTER `payload migrate` in deploy-payload.yml, BEFORE the
 * service update.
 *
 * Verifies every table declared in the migrations (baseline) actually exists
 * in the target database. Catches the "someone added a collection to the
 * config but forgot to create a migration" failure mode — without this, the
 * deploy succeeds and the API 500s at runtime on the missing table.
 *
 * Exit 0 = all expected tables present. Exit 1 = missing tables (deploy aborts).
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// Override when the script is copied elsewhere (e.g. run from /app in the
// deploy container while the migrations live in the bind-mounted checkout).
const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR || join(SCRIPT_DIR, '..', 'migrations');

async function main() {
  // 1. Collect expected tables from the migration index + files
  const index = readFileSync(join(MIGRATIONS_DIR, 'index.ts'), 'utf8');
  const migrationFiles = [...index.matchAll(/from '\.\/([^']+)'/g)].map((m) => m[1]);
  const expected = new Set(['payload_migrations']);
  for (const file of migrationFiles) {
    const src = readFileSync(join(MIGRATIONS_DIR, `${file}.ts`), 'utf8');
    // Generated SQL uses both `CREATE TABLE "name"` and `CREATE TABLE "public"."name"`
    for (const m of src.matchAll(/CREATE TABLE\s+"(?:public"\.")?([^"]+)"/g)) {
      expected.add(m[1]);
    }
  }

  // 2. Query the DB for existing tables
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  );
  await client.end();

  const existing = new Set(rows.map((r) => r.table_name));
  const missing = [...expected].filter((t) => !existing.has(t));

  if (missing.length > 0) {
    console.error(
      `❌ Schema gate FAILED — ${missing.length} expected table(s) missing: ${missing.join(', ')}`
    );
    console.error(
      '   A collection exists in the config/migrations but its table is not in the DB.'
    );
    console.error('   Create a migration (payload migrate:create) and redeploy.');
    process.exit(1);
  }

  console.log(`✅ Schema gate OK — all ${expected.size} expected tables present.`);
}

main().catch((err) => {
  console.error('❌ Schema gate error:', err.message);
  process.exit(1);
});
