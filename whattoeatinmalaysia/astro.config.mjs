import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';

/**
 * Mode-dependent static artifacts. _redirects and robots.txt must differ
 * between 'gate' (production email-capture state) and 'full' (launched site),
 * but public/ files are copied verbatim — so they are generated here at
 * astro:build:done instead of living in public/.
 *
 * Fail-closed: only the literal PUBLIC_WTM_MODE=full produces the full-site
 * artifacts; anything else (unset, typo) produces the gate.
 */
const REDIRECTS = {
  gate: `# Gate mode: email-capture only (302 so pages return at launch)
/guides/          /           302
/guides/*         /           302
/packages/        /           302
/packages/*       /           302
/state/*          /           302
/app/             /           302
/app/*            /           302
/login/           /           302
/login            /           302
/account/         /           302
/account          /           302
/offline/         /           302
/thanks/          /           302

# Duplicate-URL cleanup (permanent)
/penang           /guides/penang/  301
/penang/          /guides/penang/  301
`,
  full: `# Legacy /app/ path (checklist lived here pre-launch)
/app/             /           301
/app/*            /           301

# Duplicate-URL cleanup (permanent)
/penang           /guides/penang/  301
/penang/          /guides/penang/  301
`,
};

const ROBOTS = {
  gate: `User-agent: *\nAllow: /$\nAllow: /?$\nDisallow: /\n`,
  full: `User-agent: *\nAllow: /\n`,
};

function modeArtifacts() {
  return {
    name: 'mode-artifacts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const mode = process.env.PUBLIC_WTM_MODE === 'full' ? 'full' : 'gate';
        await writeFile(new URL('_redirects', dir), REDIRECTS[mode]);
        await writeFile(new URL('robots.txt', dir), ROBOTS[mode]);
        logger.info(`mode=${mode}: wrote _redirects + robots.txt`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://whattoeatinmalaysia.com',
  compressHTML: true,
  integrations: [modeArtifacts()],
});
