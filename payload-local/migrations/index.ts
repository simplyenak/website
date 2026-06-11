import * as migration_20260402_235142_initial_schema from './20260402_235142_initial_schema';
import * as migration_20260404_051151_testimonial_page_visibility from './20260404_051151_testimonial_page_visibility';
import * as migration_20260406_000000_reset_snapshot from './20260406_000000_reset_snapshot';
import * as migration_20260406_073926 from './20260406_073926';
import * as migration_20260414_031259 from './20260414_031259';
import * as migration_20260415_155000_fix_faqs_and_landing_pages from './20260415_155000_fix_faqs_and_landing_pages';
import * as migration_20260415_160000_fix_landing_pages_v from './20260415_160000_fix_landing_pages_v';
import * as migration_20260415_170000_fix_remaining_schema_drift from './20260415_170000_fix_remaining_schema_drift';
import * as migration_20260416_070630 from './20260416_070630';
import * as migration_20260416_081537 from './20260416_081537';
import * as migration_20260416_100051 from './20260416_100051';
import * as migration_20260528_014033 from './20260528_014033';

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
    up: migration_20260406_073926.up,
    down: migration_20260406_073926.down,
    name: '20260406_073926',
  },
  {
    up: migration_20260414_031259.up,
    down: migration_20260414_031259.down,
    name: '20260414_031259',
  },
  {
    up: migration_20260415_155000_fix_faqs_and_landing_pages.up,
    down: migration_20260415_155000_fix_faqs_and_landing_pages.down,
    name: '20260415_155000_fix_faqs_and_landing_pages',
  },
  {
    up: migration_20260415_160000_fix_landing_pages_v.up,
    down: migration_20260415_160000_fix_landing_pages_v.down,
    name: '20260415_160000_fix_landing_pages_v',
  },
  {
    up: migration_20260415_170000_fix_remaining_schema_drift.up,
    down: migration_20260415_170000_fix_remaining_schema_drift.down,
    name: '20260415_170000_fix_remaining_schema_drift',
  },
  {
    up: migration_20260416_070630.up,
    down: migration_20260416_070630.down,
    name: '20260416_070630',
  },
  {
    up: migration_20260416_081537.up,
    down: migration_20260416_081537.down,
    name: '20260416_081537',
  },
  {
    up: migration_20260416_100051.up,
    down: migration_20260416_100051.down,
    name: '20260416_100051',
  },
  {
    up: migration_20260528_014033.up,
    down: migration_20260528_014033.down,
    name: '20260528_014033'
  },
];
