import * as migration_20260402_235142_initial_schema from './20260402_235142_initial_schema';
import * as migration_20260404_051151_testimonial_page_visibility from './20260404_051151_testimonial_page_visibility';
import * as migration_20260406_000000_reset_snapshot from './20260406_000000_reset_snapshot';

export const migrations = [
  {
    up: migration_20260402_235142_initial_schema.up,
    down: migration_20260402_235142_initial_schema.down,
    name: '20260402_235142_initial_schema',
  },
  {
    up: migration_20260404_051151_testimonial_page_visibility.up,
    down: migration_20260404_051151_testimonial_page_visibility.down,
    name: '20260404_051151_testimonial_page_visibility',
  },
  {
    up: migration_20260406_000000_reset_snapshot.up,
    down: migration_20260406_000000_reset_snapshot.down,
    name: '20260406_000000_reset_snapshot',
  },
  {
  },
];
