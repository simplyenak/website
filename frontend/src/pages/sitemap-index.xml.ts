import type { APIRoute } from "astro";

const getSitemapIndex = (site: URL) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
        
  <!-- Main Pages Sitemap -->
  <sitemap>
    <loc>${new URL("sitemap-pages.xml", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("sitemap-pages.xml", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("sitemap-pages.xml", site).href}" />
  </sitemap>
  
</sitemapindex>`;

export const GET: APIRoute = ({ site }) => {
  return new Response(getSitemapIndex(site), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};