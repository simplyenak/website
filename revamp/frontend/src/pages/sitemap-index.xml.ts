import type { APIRoute } from 'astro';

const baseUrl = ((typeof process !== 'undefined' && process.env?.PUBLIC_SITE_URL) ? process.env.PUBLIC_SITE_URL : 'https://simplyenak.com').replace(/\/$/, '');
const today = new Date().toISOString().split('T')[0];

export const GET: APIRoute = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
