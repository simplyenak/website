import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

# Crawl-delay for polite crawling
Crawl-delay: 1

# Disallow admin/preview paths
Disallow: /_astro/
Disallow: /api/
Disallow: /Payload/
Disallow: /preview/

# Allow all search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# AI crawlers (allow for AI search visibility)
User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
