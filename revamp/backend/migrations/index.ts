import * as migration_20260805_074548_20260805_baseline from './20260805_074548_20260805_baseline';
import * as migration_20260805_100000_content_briefs_status_enums from './20260805_100000_content_briefs_status_enums';
import * as migration_20260805_180000_fix_stories_rels from './20260805_180000_fix_stories_rels';

export const migrations = [
  {
    up: migration_20260805_074548_20260805_baseline.up,
    down: migration_20260805_074548_20260805_baseline.down,
    name: '20260805_074548_20260805_baseline'
  },
  {
    up: migration_20260805_100000_content_briefs_status_enums.up,
    down: migration_20260805_100000_content_briefs_status_enums.down,
    name: '20260805_100000_content_briefs_status_enums'
  },
  {
    up: migration_20260805_180000_fix_stories_rels.up,
    down: migration_20260805_180000_fix_stories_rels.down,
    name: '20260805_180000_fix_stories_rels'
  },
];
