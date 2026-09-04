import type { APIRoute } from 'astro';
import { states } from '~/data/dishes';

const BASE = 'https://whattoeatinmalaysia.com';

export const GET: APIRoute = () => {
  const urls = [
    { loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${BASE}/packages/`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${BASE}/guides/`, changefreq: 'monthly', priority: '0.7' },
    ...states.map((s) => ({
      loc: `${BASE}/guides/${s.id}/`,
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
