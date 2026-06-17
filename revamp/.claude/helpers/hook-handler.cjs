#!/usr/bin/env node
/**
 * Claude Code hook handler — delegates to ruflo CLI for session/task events.
 * Falls back silently if ruflo is unavailable so hooks never block Claude.
 */
'use strict';

const { execFileSync } = require('child_process');

const event = process.argv[2] || 'unknown';

function ruflo(sub, cmd) {
  try {
    execFileSync('ruflo', [sub, cmd], {
      stdio: 'ignore',
      timeout: 4000
    });
  } catch {
    // ruflo unavailable or errored — don't block Claude
  }
}

switch (event) {
  case 'session-restore':
    ruflo('hooks', 'session-restore');
    break;
  case 'session-end':
    ruflo('hooks', 'session-end');
    break;
  case 'pre-bash':
    ruflo('hooks', 'pre-command');
    break;
  case 'post-bash':
    ruflo('hooks', 'post-command');
    break;
  case 'pre-edit':
    ruflo('hooks', 'pre-edit');
    break;
  case 'post-edit':
    ruflo('hooks', 'post-edit');
    break;
  case 'post-task':
    ruflo('hooks', 'post-task');
    break;
  case 'compact-manual':
  case 'compact-auto':
  case 'status':
    // informational only — no-op
    break;
  default:
    break;
}

process.exit(0);
