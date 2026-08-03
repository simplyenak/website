// HERALD config — Culinary Travel Experts agent discovery layer
// Generates: agents.txt, agents.json, .well-known/security.txt, _headers
// Run: npm run generate:herald (wired into prebuild)
// See: https://github.com/agents-txt/herald
/** @type {import('@agentstxtdev/herald-core').AgenticConfig} */
export default {
  site: {
    name: 'Culinary Travel Experts',
    url: 'https://culinarytravelexperts.com',
    description:
      'Malaysia food travel ground partner for travel agents, DMCs, and hotels. Fourth-generation producers, family recipes, sustainable practices. MOTAC licensed. B2B arm of Simply Enak.',
  },

  // Static page index — the real pages. AstroWind template demo pages
  // (landing/*) were deleted; they shipped "Coming soon" boilerplate.
  content: {
    driver: {
      type: 'static',
      pages: [
        { title: 'Home', url: 'https://culinarytravelexperts.com/', description: 'B2B culinary travel ground partner in Malaysia and Southeast Asia' },
        { title: 'Privacy Policy', url: 'https://culinarytravelexperts.com/privacy/', description: 'Privacy policy' },
        { title: 'Terms & Conditions', url: 'https://culinarytravelexperts.com/terms/', description: 'Terms and conditions' },
      ],
    },
  },

  crawlers: {
    blockFreeAiScrapers: false, // allow free AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
    allowSearchEngines: true,
    allowPaidAgents: false, // no paid-agent gateway
  },

  // Point agents at the simplyenak.com OKF bundle? NO — CTE is a separate
  // brand/site with no OKF bundle of its own. Skills block intentionally
  // omitted until CTE gets its own knowledge bundle.

  // Vulnerability disclosure contact (RFC 9116)
  security: {
    contact: 'mailto:booking@simplyenak.com',
    preferredLanguages: ['en'],
  },

  // Preserve the existing immutable cache rule for hashed Astro assets when
  // HERALD regenerates _headers (it emits the §4.5 Link/CORS rules).
  headersExtras: [
    {
      source: '/_astro/*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],

  // No payments, no auth, no MCP/OpenAPI — B2B enquiry site, not agent-commerce.
}
