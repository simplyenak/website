#!/usr/bin/env node
/**
 * Auto-memory hook — imports session memory from ruflo on session start.
 * Exits 0 silently if ruflo is unavailable.
 */
import { execFileSync } from 'node:child_process';

const action = process.argv[2] || 'import';

if (action === 'import') {
  try {
    execFileSync('ruflo', ['memory', 'list', '--limit', '5'], {
      stdio: 'ignore',
      timeout: 7000
    });
  } catch {
    // ruflo unavailable — don't block Claude
  }
}

process.exit(0);
