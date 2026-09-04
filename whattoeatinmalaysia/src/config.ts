// Central backend base URL for the WTM frontend.
// Build-time overridable via PUBLIC_WTM_ACCESS so a staging build can point at
// the staging backend while production defaults to the live one.
// See https://docs.astro.build/en/guides/environment-variables/
export const ACCESS_BASE: string =
  (import.meta.env.PUBLIC_WTM_ACCESS as string | undefined) ||
  'https://wtm-access.system.simplyenak.com';