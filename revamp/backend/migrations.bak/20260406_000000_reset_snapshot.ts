import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Reset migration — establishes a clean snapshot baseline of the current DB state.
 * No SQL changes: this migration documents what was fixed manually on 2026-04-06.
 *
 * Manual fixes applied outside of migrations (see payload_db_fixes.md):
 * - Set push: false in payload.config.ts
 * - Restored _path columns to all blocks tables
 * - Created missing _v version tables for 7 collections
 * - Removed stale tables/enums from disabled plugins (redirects, search, translations)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // No-op: DB already matches the snapshot produced by this migration
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No-op
}
