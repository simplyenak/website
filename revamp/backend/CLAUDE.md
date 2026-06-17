# Payload CMS — Rules

## Schema Changes: Use the Migration CLI. Always.

**NEVER edit the Payload database directly** (no raw `psql`, no `ALTER TABLE`, no `CREATE TABLE` on Payload-owned tables).

Every schema change — adding a collection, adding/removing a field, changing a field type — must go through the migration workflow:

```bash
# 1. Make your change in TypeScript (src/collections/, src/blocks/, etc.)
# 2. Generate the migration
npx payload migrate:create --name describe_the_change
# 3. Review the generated file in migrations/
# 4. Apply it
npx payload migrate
# 5. Verify
npx payload migrate:status
```

**Why this rule exists:** In April 2026, direct SQL edits (manually creating `_v` tables, restoring `_path` columns) caused the live DB, TypeScript schema, and Drizzle snapshot to diverge. The resulting correction migration had 2730 statements and required 10 rounds of manual patching (IDENTITY columns, USING clauses, CASCADE, enum data fixes, DROP DEFAULT, DROP SEQUENCE) before it could run. Multiple sessions lost.

## Other Hard Rules

- `push: false` in `postgresAdapter` — **never change this back to `true`**
  - `push: true` is interactive-only; it silently fails under pm2 (no TTY for the "accept data loss?" prompt)
- Run `npx payload migrate:status` to check state before starting work
- If `migrate:create` shows disambiguation prompts, the snapshot is stale — create a reset snapshot migration first
