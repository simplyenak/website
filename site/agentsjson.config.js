// HERALD config — Simply Enak agent discovery layer
// Generates: agents.txt, agents.json, .well-known/security.txt, _headers
// Run: npx herald emit --agents --security (wired into prebuild)
// See: https://github.com/agents-txt/herald
/** @type {import('@agentstxtdev/herald-core').AgenticConfig} */
export default {
  site: {
    name: 'Simply Enak',
    url: 'https://simplyenak.com',
    description:
      'Malaysian food tours in Kuala Lumpur, Penang, and Ipoh, led by locals since 2011. Small groups (max 9), heritage vendors, no tourist restaurants.',
  },

  // Static page index — mirrors the tours and key pages agents should know
  // about. Keep in sync with src/data/content/tours.json (tour pages) and the
  // site navigation (key pages).
  content: {
    driver: {
      type: 'static',
      pages: [
        { title: 'Home', url: 'https://simplyenak.com/', description: 'Malaysian food tours in KL and Penang' },
        { title: 'All Tours', url: 'https://simplyenak.com/tours/', description: 'Browse all food tours' },
        { title: 'Private Tours', url: 'https://simplyenak.com/tours/private-tours/', description: 'Custom private food tours' },
        { title: 'Kuala Lumpur Street Food', url: 'https://simplyenak.com/tours/kuala-lumpur-street-food/', description: 'The essential KL food tour, 3.5h, MYR 285' },
        { title: 'Flavours of Malaysia', url: 'https://simplyenak.com/tours/flavours-of-malaysia/', description: 'Intro to Malaysian culture through food, 4h, MYR 289' },
        { title: 'Secrets of KL', url: 'https://simplyenak.com/tours/secrets-of-kl-nightlife-street-art-and-cocktails/', description: 'Evening tour: nightlife, street art, cocktails, 4h, MYR 359' },
        { title: 'Inside Pudu', url: 'https://simplyenak.com/tours/inside-pudu/', description: 'Heritage walk through Pudu, 3.5h, MYR 289' },
        { title: 'Penang Street Food', url: 'https://simplyenak.com/tours/penang-street-food/', description: 'Penang food capital tour, 3.5h, MYR 289' },
        { title: 'Georgetown Night & Durian', url: 'https://simplyenak.com/tours/georgetown-night-food-durian/', description: 'Penang after dark + durian strip, 4h, MYR 289' },
        { title: 'Stories & Guides', url: 'https://simplyenak.com/stories/', description: 'Food guides and stories from Malaysia' },
        { title: 'How Our Tours Work', url: 'https://simplyenak.com/how-it-works/', description: 'What to expect on a Simply Enak tour' },
        { title: 'FAQ', url: 'https://simplyenak.com/faq/', description: 'Frequently asked questions' },
        { title: 'About', url: 'https://simplyenak.com/about/', description: 'Our story since 2011' },
        { title: 'Contact', url: 'https://simplyenak.com/contact/', description: 'Contact and booking' },
      ],
    },
  },

  crawlers: {
    blockFreeAiScrapers: false, // We WANT free AI crawlers (GPTBot, ClaudeBot, PerplexityBot) allowed
    allowSearchEngines: true,
    allowPaidAgents: false, // No paid-agent gateway, nothing to gate
  },

  // OKF knowledge bundle — surfaces the agent-readable knowledge base that the
  // generate-okf-bundle.py prebuild step produces at public/okf/.
  skills: {
    urls: [
      {
        url: 'https://simplyenak.com/okf/index.md',
        name: 'simply-enak-knowledge',
        type: 'skill-md',
      },
    ],
  },

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

  // No payments, no auth, no MCP/OpenAPI — we don't sell to bots.
}
