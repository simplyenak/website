import * as migration_20260805_074548_20260805_baseline from './20260805_074548_20260805_baseline';

export const migrations = [
  {
    up: migration_20260805_074548_20260805_baseline.up,
    down: migration_20260805_074548_20260805_baseline.down,
    name: '20260805_074548_20260805_baseline'
  },
];
