import type { APIRoute } from "astro";

const getPagesSitemap = (site: URL) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        
  <!-- Homepage - Most Important -->
  <url>
    <loc>${site.href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${new URL("/images/simply_enak_logo.webp", site).href}</image:loc>
      <image:title>Simply Enak - Malaysian Food Tours</image:title>
      <image:caption>Premium Malaysian food tour operator offering authentic culinary experiences</image:caption>
    </image:image>
    <xhtml:link rel="alternate" hreflang="en" href="${site.href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.href}" />
  </url>
  
  <!-- Tours Landing Page -->
  <url>
    <loc>${new URL("/tours/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/tours/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/tours/", site).href}" />
  </url>
  
  <!-- Individual Tour Pages -->
  <url>
    <loc>${new URL("/tours/kuala-lumpur-street-food/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/tours/kuala-lumpur-street-food/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/tours/kuala-lumpur-street-food/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/tours/penang-street-food/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/tours/penang-street-food/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/tours/penang-street-food/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/tours/flavours-of-malaysia-off-the-beaten-track/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/tours/flavours-of-malaysia-off-the-beaten-track/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/tours/flavours-of-malaysia-off-the-beaten-track/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/tours/eat-drink-georgetown/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/tours/eat-drink-georgetown/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/tours/eat-drink-georgetown/", site).href}" />
  </url>
  
  <!-- Specialized Tour Pages -->
  <url>
    <loc>${new URL("/vegetarian-food-tours/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/vegetarian-food-tours/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/vegetarian-food-tours/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/kuala-lumpur-food-tour/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/kuala-lumpur-food-tour/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/kuala-lumpur-food-tour/", site).href}" />
  </url>
  
  <!-- Content Pages -->
  <url>
    <loc>${new URL("/stories/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/stories/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/stories/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/about/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/about/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/about/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/contact/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/contact/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/contact/", site).href}" />
  </url>
  
  <!-- Practical Information -->
  <url>
    <loc>${new URL("/directions/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/directions/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/directions/", site).href}" />
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>${new URL("/privacy-policy/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/privacy-policy/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/privacy-policy/", site).href}" />
  </url>
  
  <url>
    <loc>${new URL("/terms-conditions/", site).href}</loc>
    <lastmod>2025-10-13T00:00:00+00:00</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${new URL("/terms-conditions/", site).href}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL("/terms-conditions/", site).href}" />
  </url>
  
</urlset>`;

export const GET: APIRoute = ({ site }) => {
  return new Response(getPagesSitemap(site), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};