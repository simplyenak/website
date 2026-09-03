import type { APIRoute } from 'astro';

const BASE = 'https://whattoeatinmalaysia.com';

export const GET: APIRoute = () => {
  // Pre-launch: only the homepage is ready. Guides/packages hidden via _redirects.
  const urls = [{ loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' }];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
