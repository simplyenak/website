import type { APIRoute } from 'astro';
import toursData from '@/data/content/tours.json';
import storiesData from '@/data/content/stories.json';
import dietaryPages from '@/data/content/dietary-landing-pages.json';
import locationPages from '@/data/content/location-landing-pages.json';
import specialtyPages from '@/data/content/specialty-landing-pages.json';
import travelTypePages from '@/data/content/travel-type-landing-pages.json';

const baseUrl = ((typeof process !== 'undefined' && process.env?.PUBLIC_SITE_URL) ? process.env.PUBLIC_SITE_URL : 'https://simplyenak.com').replace(/\/$/, '');
const today = new Date().toISOString().split('T')[0];

const localeMap: Record<string, string> = {
  en: 'en', ms: 'ms', zh: 'zh-Hans', de: 'de', es: 'es',
  fr: 'fr', nl: 'nl', ru: 'ru', ja: 'ja', pt: 'pt-PT',
};
const localeKeys = Object.keys(localeMap) as string[];

function langPath(locale: string, path: string): string {
  return locale === 'en' ? path : `/${locale}${path}`;
}

function loc(locale: string, path: string): string {
  return `${baseUrl}${langPath(locale, path)}`;
}

const localizedStaticPages = [
  '/',
  '/about/',
  '/contact/',
  '/faq/',
  '/how-it-works/',
  '/tours/',
  '/tours/private-tours/',
  '/tours/join-in-tours/',
  '/stories/',
  '/stories/archive/',
];

const englishOnlyPages: Array<{ path: string; changefreq: string; priority: number }> = [
  { path: '/directions/', changefreq: 'monthly', priority: 0.7 },
  { path: '/how-to-prepare/', changefreq: 'monthly', priority: 0.6 },
  { path: '/media/', changefreq: 'monthly', priority: 0.6 },
  { path: '/reviews/', changefreq: 'monthly', priority: 0.7 },
  { path: '/track-record/', changefreq: 'monthly', priority: 0.7 },
  { path: '/privacy-policy/', changefreq: 'yearly', priority: 0.5 },
  { path: '/terms-conditions/', changefreq: 'yearly', priority: 0.5 },
  { path: '/tours/corporate-groups/', changefreq: 'monthly', priority: 0.7 },
  { path: '/about/our-values/', changefreq: 'monthly', priority: 0.6 },
  { path: '/stories/durian-guide/', changefreq: 'monthly', priority: 0.6 },
];

const tourSlugs = toursData
  .filter((t: any) => !t.noindex && t.slug)
  .map((t: any) => t.slug as string);

const storySlugs = storiesData
  .filter((s: any) => s.slug)
  .map((s: any) => s.slug as string);

const dietarySlugs = dietaryPages.filter((p: any) => p._status === 'published').map((p: any) => p.slug as string);
const locationSlugs = locationPages.filter((p: any) => p._status === 'published').map((p: any) => p.slug as string);
const specialtySlugs = specialtyPages.filter((p: any) => p._status === 'published').map((p: any) => p.slug as string);
const travelTypeSlugs = travelTypePages.filter((p: any) => p._status === 'published').map((p: any) => p.slug as string);

const AUDIENCE_SPECIALTY_SLUGS = ['corporate', 'celebrations', 'custom', 'tailored'];
const experienceSpecialtySlugs = specialtySlugs.filter((s) => !AUDIENCE_SPECIALTY_SLUGS.includes(s));

const citySegmentPages: string[] = [];
for (const city of locationSlugs) {
  for (const dietary of dietarySlugs) {
    citySegmentPages.push(`/tours/locations/${city}/${dietary}/`);
  }
  for (const specialty of experienceSpecialtySlugs) {
    citySegmentPages.push(`/tours/locations/${city}/${specialty}/`);
  }
}

const neighborhoodSlugs = [
  'chow-kit',
  'chinatown-petaling-street',
  'chowrasta-georgetown',
  'brickfields-little-india',
  'kampung-baru-malay-village',
  'gurney-drive',
  'georgetown-heritage',
  'little-india-lebuh-queen',
];

const landingPages = [
  ...dietarySlugs.map((s) => `/tours/dietary/${s}/`),
  ...locationSlugs.map((s) => `/tours/locations/${s}/`),
  ...specialtySlugs.map((s) => `/tours/specialty/${s}/`),
  ...travelTypeSlugs.map((s) => `/tours/travel-types/${s}/`),
];

function hreflangLinks(locale: string, path: string): string {
  return localeKeys
    .map((l) => {
      const href = loc(l, path);
      const hreflang = localeMap[l];
      return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`;
    })
    .join('\n');
}

function buildLocalizedUrl(path: string, changefreq: string, priority: number): string {
  const urls: string[] = [];
  for (const locale of localeKeys) {
    urls.push(`  <url>
    <loc>${loc(locale, path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks(locale, path)}
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('en', path)}" />
  </url>`);
  }
  return urls.join('\n');
}

function buildEnglishOnlyUrl(path: string, changefreq: string, priority: number): string {
  return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildDynamicLocalizedUrls(
  paths: string[],
  changefreq: string,
  priority: number,
): string {
  return paths.map((path) => buildLocalizedUrl(path, changefreq, priority)).join('\n');
}

const allUrls: string[] = [];

allUrls.push(
  ...localizedStaticPages.map((p) => buildLocalizedUrl(p, p === '/' ? 'daily' : 'weekly', p === '/' ? 1.0 : 0.8)),
);

allUrls.push(...englishOnlyPages.map((p) => buildEnglishOnlyUrl(p.path, p.changefreq, p.priority)));

allUrls.push(buildDynamicLocalizedUrls(tourSlugs.map((s) => `/tours/${s}/`), 'weekly', 0.8));

allUrls.push(buildDynamicLocalizedUrls(storySlugs.map((s) => `/stories/${s}/`), 'monthly', 0.6));

allUrls.push(...landingPages.map((p) => buildEnglishOnlyUrl(p, 'monthly', 0.6)));

allUrls.push(...citySegmentPages.map((p) => buildEnglishOnlyUrl(p, 'monthly', 0.55)));

allUrls.push(...neighborhoodSlugs.map((s) => buildEnglishOnlyUrl(`/tours/neighborhoods/${s}/`, 'monthly', 0.55)));

export const GET: APIRoute = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
