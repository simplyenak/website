// Central backend base URL for the WTM frontend.
// Build-time overridable via PUBLIC_WTM_ACCESS so a staging build can point at
// the staging backend while production defaults to the live one.
// See https://docs.astro.build/en/guides/environment-variables/
export const ACCESS_BASE: string =
  (import.meta.env.PUBLIC_WTM_ACCESS as string | undefined) ||
  'https://wtm-access.system.simplyenak.com';

// Site mode, build-time overridable via PUBLIC_WTM_MODE.
//   'gate' (default): production-safe — email-capture homepage, all other
//                     routes 302 to /, robots + sitemap locked to the homepage.
//   'full':           the launched site — checklist homepage, all routes open.
// Fail-closed: only the literal 'full' builds the full site; any other value
// (including unset or a typo) builds the gate.
export type SiteMode = 'gate' | 'full';
export const SITE_MODE: SiteMode =
  import.meta.env.PUBLIC_WTM_MODE === 'full' ? 'full' : 'gate';