/**
 * Content layer for Simply Enak
 *
 * Reads from Payload CMS JSON snapshots in @/data/content/.
 * Run `npm run sync` to pull latest content from Payload API.
 */

/**
 * Extract plain text from a Payload Lexical rich-text JSON object.
 * Handles the structure: { en: { root: { children: [{ type: "paragraph", children: [{ text: "..." }] }] } } }
 */
function extractLexicalText(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  // Lexical format: { en: { root: { children: [...] } } }
  const root = value.en?.root ?? value.root;
  if (!root?.children) return JSON.stringify(value);
  return root.children
    .map(child => {
      if (child.children) return child.children.map(c => c.text || '').join('');
      return child.text || '';
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Usage:
 *   import { getAllTours, getTourBySlug, getSiteSettings } from '@/lib/content';
 */


// ── JSON snapshots (source of truth at build time) ──────────────────────────

import toursData from '@/data/content/tours.json';
import pagesData from '@/data/content/pages.json';
import siteSettingsData from '@/data/content/site-settings.json';
import homePageData from '@/data/content/home-page.json';
import faqsData from '@/data/content/faqs.json';
import testimonialsData from '@/data/content/testimonials.json';
import storiesData from '@/data/content/stories.json';
import vendorsData from '@/data/content/vendors.json';
import dietaryLandingPagesData from '@/data/content/dietary-landing-pages.json';
import locationLandingPagesData from '@/data/content/location-landing-pages.json';
import specialtyLandingPagesData from '@/data/content/specialty-landing-pages.json';
import travelTypeLandingPagesData from '@/data/content/travel-type-landing-pages.json';
import legalPagesData from '@/data/content/legal-pages.json';
import thankYouPagesData from '@/data/content/thank-you-pages.json';
import contactPageData from '@/data/content/contact-page.json';
import howItWorksPageData from '@/data/content/how-it-works-page.json';
import howToPreparePageData from '@/data/content/how-to-prepare-page.json';
import trackRecordPageData from '@/data/content/track-record-page.json';
import mediaPageData from '@/data/content/media-page.json';
import mediaCoverageData from '@/data/content/media-coverage.json';
import toursIndexPageData from '@/data/content/tours-index-page.json';
import privateToursPageData from '@/data/content/private-tours-page.json';
import joinInToursPageData from '@/data/content/join-in-tours-page.json';
import corporateGroupsPageData from '@/data/content/corporate-groups-page.json';
import aboutPageData from '@/data/content/about-page.json';
import faqPageData from '@/data/content/faq-page.json';
import tourQuizData from '@/data/content/tour-quiz.json';

// ── Data normalization ────────────────────────────────────────────────────────
// Sync exports `status` (no underscore).  Filter code below checks
// `_status === 'published'.  Bridge the gap so both field names work.
// Also pre-compute plain-text content for stories (Lexical JSON → text).
const DATA_SETS = [
  toursData, pagesData, faqsData, testimonialsData, storiesData, vendorsData,
  dietaryLandingPagesData, locationLandingPagesData, specialtyLandingPagesData,
  travelTypeLandingPagesData, legalPagesData, thankYouPagesData,
];
for (const arr of DATA_SETS) {
  if (!Array.isArray(arr)) continue;
  for (const item of arr) {
    if (item._status === undefined && item.status) {
      item._status = item.status;
    }
    // Pre-compute plain text for story content (Lexical JSON objects)
    if (item.content && typeof item.content === 'object' && item.content.root) {
      const texts = [];
      const walk = (node) => {
        if (node.type === 'text' && node.text) texts.push(node.text);
        if (node.children) node.children.forEach(walk);
      };
      walk(item.content.root);
      item._contentText = texts.join(' ');
    }
  }
}

// ── Lexical rich-text → HTML converter ──────────────────────────────────────
// Payload stores story content as Lexical JSON.  Convert to simple HTML
// so templates can use set:html directly.
export function getLexicalHtml(content) {
  if (typeof content === 'string') return content;
  if (!content || !content.root || !Array.isArray(content.root.children)) return '';
  return content.root.children.map(node => {
    if (node.type === 'paragraph') {
      const inner = (node.children || []).map(ch => ch.text || '').join('');
      return `<p>${inner}</p>`;
    }
    return '';
  }).join('\n');
}

/** Extract plain text from Lexical JSON (for word counts, excerpts). */
export function getLexicalText(content) {
  if (typeof content === 'string') return content.replace(/<[^>]+>/g, '');
  if (!content || !content.root || !Array.isArray(content.root.children)) return '';
  return content.root.children.map(node => {
    if (node.type === 'paragraph') {
      return (node.children || []).map(ch => ch.text || '').join('');
    }
    return '';
  }).join(' ');
}

// ── Image helper ─────────────────────────────────────────────────────────────
// Rewrites S3 URLs through Cloudflare CDN for WebP/AVIF optimisation.
// For images already stored as full URLs this is a no-op.

const S3_DOMAIN = 'se-website-images.s3.nl-ams.scw.cloud';
const CDN_URL = 'https://cdn.simplyenak.com';

export function getImageUrl(fileId, options = {}) {
  if (!fileId) return null;

  // Handle {url, alt} image objects — extract the URL
  if (typeof fileId === 'object' && fileId.url) {
    return getImageUrl(fileId.url, options);
  }

  // Payload media ID (integer) — construct API URL
  if (typeof fileId === 'number') {
    const payloadUrl = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_PAYLOAD_URL)
      || 'http://localhost:3000';
    const params = new URLSearchParams();
    if (options.width)   params.set('width',   options.width);
    if (options.height)  params.set('height',  options.height);
    if (options.fit)     params.set('fit',     options.fit);
    if (options.quality) params.set('quality', options.quality);
    const qs = params.toString();
    return `${payloadUrl}/api/media/file/${fileId}${qs ? `?${qs}` : ''}`;
  }

  // Already a full URL (S3, CDN, external)
  if (fileId.startsWith('http://') || fileId.startsWith('https://')) {
    // Rewrite S3 URLs through Cloudflare CDN — skip in dev
    if (fileId.includes(S3_DOMAIN) && !import.meta.env.DEV) {
      fileId = CDN_URL + fileId.split(S3_DOMAIN)[1];
    }
    return fileId;
  }

  // Local path — use as-is
  if (fileId.startsWith('/')) {
    return fileId;
  }

  // Payload media file UUID — construct asset URL
  const payloadUrl = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_PAYLOAD_URL)
    || 'http://localhost:3000';
  const params = new URLSearchParams();
  if (options.width)   params.set('width',   options.width);
  if (options.height)  params.set('height',  options.height);
  if (options.fit)     params.set('fit',     options.fit);
  if (options.quality) params.set('quality', options.quality);

  const qs = params.toString();
  return `${payloadUrl}/api/media/file/${fileId}${qs ? `?${qs}` : ''}`;
}

// ── Translation helpers ──────────────────────────────────────────────────────

/**
 * Eagerly load all standalone translation JSON files from src/i18n/translations/.
 * These are keyed by content ID: { "1": { title: "...", ... }, "2": { ... } }
 *
 * Build a lookup map: translationFileMap[type][lang] → { id: translatedFields }
 */
const translationFileMap = {};
try {
  const translationModules = import.meta.glob('@/i18n/translations/*-translations-*.json', { eager: true });
  for (const [filePath, mod] of Object.entries(translationModules)) {
    // Extract type and lang from filename (not full path):
    //   .../translations/home_page-translations-fr.json → type="home_page", lang="fr"
    //   .../translations/location-landing-pages-translations-fr.json → type="location-landing-pages", lang="fr"
    const fileName = filePath.split('/').pop();
    const dashIdx = fileName.lastIndexOf('-translations-');
    if (dashIdx === -1) continue;
    const type = fileName.substring(0, dashIdx);
    const lang = fileName.substring(dashIdx + '-translations-'.length).replace('.json', '');
    if (!translationFileMap[type]) translationFileMap[type] = {};
    translationFileMap[type][lang] = mod.default || mod;
  }
} catch (e) {
  // import.meta.glob may not be available in all contexts — fail gracefully
  console.warn('[content.js] Could not load translation files:', e.message);
}

/**
 * Get translated fields for a single content item from the standalone translation files.
 * Looks up the item by its `key` (slug for most content, id for position-based).
 * Returns null if no translation exists (caller should use English base data).
 */
function getTranslationForItem(type, lang, key) {
  if (!key || lang === 'en' || !lang) return null;
  const langMap = translationFileMap[type];
  if (!langMap) return null;
  const entries = langMap[lang];
  if (!entries) return null;
  return entries[String(key)] || null;
}

/**
 * Get the entire translation file for a type+lang (used for single-record pages like home_page).
 * home_page-translations-fr.json has structure { "6": { hero_title: "...", ... } }
 * We extract the inner object by the first (only) key.
 */
function getTranslationForPage(type, lang) {
  if (lang === 'en' || !lang) return null;
  const langMap = translationFileMap[type];
  if (!langMap) return null;
  const entries = langMap[lang];
  if (!entries) return null;
  // For single-page types, return the first value (e.g. "6" key for home_page)
  const keys = Object.keys(entries);
  if (keys.length === 1) return entries[keys[0]];
  return null;
}

/**
 * Apply standalone file translations to an item, overlaying non-null translated fields.
 * Used for items that don't have inline `translations` arrays.
 * Looks up by slug first, then falls back to numeric id for position-based content.
 */
function applyFileTranslation(item, type, lang) {
  if (!item || lang === 'en' || !lang) return item;
  const lookupKey = item.slug || item.id;
  if (!lookupKey) return item;
  const translated = getTranslationForItem(type, lang, lookupKey);
  if (!translated) return item;
  const merged = { ...item };
  for (const [key, val] of Object.entries(translated)) {
    if (val !== null && val !== undefined && val !== '') {
      merged[key] = val;
    }
  }
  return merged;
}

/**
 * Merge translations into a content item for the requested language.
 * Supports two sources:
 *   1. Inline translations: item.translations[{ languages_code, field_translated, ... }]
 *   2. Standalone files: src/i18n/translations/{type}-translations-{lang}.json
 *
 * Inline takes priority (it's from Payload sync). Falls back to standalone files.
 * Falls back to English base fields if neither source has translations.
 *
 * Two naming conventions are supported for inline translations:
 *   - `fieldname_translated` (most collections) — suffix is stripped
 *   - plain field names (any field that isn't an internal Payload key)
 */
const TRANSLATION_SKIP_KEYS = new Set(['id', 'languages_code']);
export function applyTranslation(item, lang = 'en', fileType = null) {
  if (!item || lang === 'en') return item;

  // First: try inline translations (Payload sync data)
  if (item.translations && Array.isArray(item.translations)) {
    const translation = item.translations.find(t => t.languages_code === lang);
    if (translation) {
      const merged = { ...item };
      for (const [key, val] of Object.entries(translation)) {
        if (TRANSLATION_SKIP_KEYS.has(key)) continue;
        if (!val) continue;
        if (key.endsWith('_translated')) {
          merged[key.replace('_translated', '')] = val;
        } else {
          merged[key] = val;
        }
      }
      return merged;
    }
  }

  // Second: try standalone translation files
  if (fileType) {
    return applyFileTranslation(item, fileType, lang);
  }

  return item;
}

// ── Tours ────────────────────────────────────────────────────────────────────

export async function getAllTours(_options = {}, lang = 'en') {
  const tours = toursData.filter(t => t._status === 'published');
  return lang === 'en' ? tours : tours.map(t => applyTranslation(t, lang, 'tours'));
}

export async function getTourBySlug(slug, lang = 'en') {
  const tour = toursData.find(t => t.slug === slug) ?? null;
  if (tour) return applyTranslation(tour, lang, 'tours');
  return null;
}

export async function getPageBySlug(slug, lang = 'en') {
  const page = pagesData.find(p => p.slug === slug && p._status === 'published') ?? null;
  return page ? applyTranslation(page, lang) : null;
}

export async function getAllPages(_options = {}, lang = 'en') {
  const pages = pagesData.filter(p => p._status === 'published');
  return lang === 'en' ? pages : pages.map(p => applyTranslation(p, lang));
}

export async function getFeaturedTours() {
  return toursData.filter(t => t._status === 'published' && t.featured);
}

/**
 * Tag-based filtering — the slug of each segment page IS the tag.
 *
 * How it works:
 *   • Each tour has segment_tags: ["kuala-lumpur","vegetarian","street-food",...]
 *   • Segment page slug (e.g. "vegetarian") is used as the lookup tag
 *   • Filter: tours where segment_tags includes that slug
 *
 * Adding a new segment page workflow (no code changes needed):
 *   1. Create the page in Payload with your chosen slug, e.g. "night-tours"
 *   2. On each relevant tour, add "night-tours" to segment_tags
 *   3. npm run sync → push → that segment page now lists those tours
 */
function toursByTag(tag) {
  return toursData.filter(
    t => t._status === 'published' &&
    Array.isArray(t.segment_tags) &&
    t.segment_tags.includes(tag)
  );
}

export async function getToursByDietary(dietarySlug) {
  return toursByTag(dietarySlug);
}

export async function getToursByLocation(locationSlug) {
  return toursByTag(locationSlug);
}

export async function getToursByTravelType(travelTypeSlug) {
  return toursByTag(travelTypeSlug);
}

export async function getToursBySpecialty(specialtySlug) {
  return toursByTag(specialtySlug);
}

export async function getToursByTag(tag) {
  return toursByTag(tag);
}

/**
 * Returns tours that match ALL of the given tags (intersection).
 * Used for sub-segmentation pages like /tours/locations/penang/vegetarian.
 */
export async function getToursByAllTags(tags) {
  if (!Array.isArray(tags) || !tags.length) return [];
  return toursData.filter(
    t => t._status === 'published' &&
    Array.isArray(t.segment_tags) &&
    tags.every(tag => t.segment_tags.includes(tag))
  );
}


// ── Home page ────────────────────────────────────────────────────────────────

function flattenHomePage(data) {
  if (!data || typeof data !== 'object') return data || {};

  const flat = { ...data };

  // ── Hero Section ──────────────────────────────────────────────────────────
  if (Array.isArray(data.heroSection) && data.heroSection[0]) {
    const hero = data.heroSection[0];
    if (hero.title) flat.hero_title = hero.title;
    if (hero.highlight) flat.hero_highlight = hero.highlight;
    if (hero.titleEnd) flat.hero_title_end = hero.titleEnd;
    if (hero.subtitle) flat.hero_subtitle = hero.subtitle;
    if (hero.description) flat.hero_description = hero.description;
    if (hero.priceInfo) flat.hero_price_info = hero.priceInfo;
    if (hero.bgImage) flat.hero_bg_image = hero.bgImage;

    // Hero CTA buttons
    if (hero.ctaPrimaryText) flat.hero_cta_primary = hero.ctaPrimaryText;
    if (hero.ctaPrimaryUrl) flat.hero_cta_primary_url = hero.ctaPrimaryUrl;
    if (hero.ctaSecondaryText) flat.hero_cta_secondary = hero.ctaSecondaryText;
    if (hero.ctaSecondaryUrl) flat.hero_cta_secondary_url = hero.ctaSecondaryUrl;

    // Badge ticker items → individual fields
    const tickerFields = [
      'hero_vendors', 'hero_since', 'hero_rated', 'hero_max_per_tour',
      'hero_low_waste', 'hero_guides', 'hero_stalls', 'hero_values',
      'hero_guests_hosted', 'hero_cities'
    ];
    if (Array.isArray(hero.badges)) {
      hero.badges.forEach((badge, i) => {
        if (badge.text && tickerFields[i]) flat[tickerFields[i]] = badge.text;
      });
    }
  }

  // ── Manifesto Section ─────────────────────────────────────────────────────
  if (Array.isArray(data.manifestoSection) && data.manifestoSection[0]) {
    const m = data.manifestoSection[0];
    if (m.eyebrow) flat.manifesto_eyebrow = m.eyebrow;
    if (m.headline) flat.manifesto_headline = m.headline;
    if (m.tagline) flat.manifesto_tagline = m.tagline;
    if (m.body) flat.manifesto_body = m.body;
    if (m.attributionRole) flat.manifesto_attribution_role = m.attributionRole;
  }

  // ── Pillars Section ───────────────────────────────────────────────────────
  if (Array.isArray(data.pillarsSection) && data.pillarsSection[0]) {
    const p = data.pillarsSection[0];
    if (p.intro) flat.pillars_intro = p.intro;
    const pillarPrefixes = ['pillar_people_', 'pillar_food_', 'pillar_place_'];
    if (Array.isArray(p.pillars)) {
      p.pillars.forEach((pillar, i) => {
        if (pillarPrefixes[i]) {
          const prefix = pillarPrefixes[i];
          if (pillar.label) flat[prefix + 'label'] = pillar.label;
          if (pillar.heading) flat[prefix + 'heading'] = pillar.heading;
          if (pillar.body) flat[prefix + 'body'] = pillar.body;
        }
      });
    }
  }

  // ── Vendors Section ───────────────────────────────────────────────────────
  if (Array.isArray(data.vendorsSection) && data.vendorsSection[0]) {
    const v = data.vendorsSection[0];
    if (v.eyebrow) flat.vendors_eyebrow = v.eyebrow;
    if (v.title) flat.vendors_title = v.title;
    if (v.subtitle) flat.vendors_subtitle = v.subtitle;
  }

  // ── Segments Section ──────────────────────────────────────────────────────
  if (Array.isArray(data.segmentsSection) && data.segmentsSection[0]) {
    const s = data.segmentsSection[0];
    if (s.heading) flat.segment_heading = s.heading;
    if (s.subheading) flat.segment_subheading = s.subheading;
    if (s.viewAllLabel) flat.segment_view_all = s.viewAllLabel;
  }

  // ── Expect / Stats Section ────────────────────────────────────────────────
  if (Array.isArray(data.expectSection) && data.expectSection[0]) {
    const e = data.expectSection[0];
    if (e.title) flat.expect_title = e.title;
    if (e.subtitle) flat.expect_subtitle = e.subtitle;
    if (Array.isArray(e.stats)) {
      const statPrefixes = ['expect_stat1_', 'expect_stat2_', 'expect_stat3_', 'expect_stat4_'];
      e.stats.forEach((stat, i) => {
        if (statPrefixes[i]) {
          const prefix = statPrefixes[i];
          if (stat.number) flat[prefix + 'number'] = stat.number;
          if (stat.heading) flat[prefix + 'heading'] = stat.heading;
          if (stat.body) flat[prefix + 'body'] = stat.body;
        }
      });
    }
  }

  // ── CTA Section ───────────────────────────────────────────────────────────
  if (Array.isArray(data.ctaSection) && data.ctaSection[0]) {
    const cta = data.ctaSection[0];
    if (cta.eyebrow) flat.cta_eyebrow = cta.eyebrow;
    if (cta.title) flat.cta_title = cta.title;
    if (cta.subtitle) flat.cta_subtitle = cta.subtitle;
    if (Array.isArray(cta.features)) {
      const featureFields = ['cta_free_cancellation', 'cta_reply_time', 'cta_max_people'];
      cta.features.forEach((feat, i) => {
        if (feat.text && featureFields[i]) flat[featureFields[i]] = feat.text;
      });
    }
    if (Array.isArray(cta.buttons)) {
      if (cta.buttons[0] && cta.buttons[0].label) flat.cta_book_experience = cta.buttons[0].label;
      if (cta.buttons[1] && cta.buttons[1].label) flat.cta_chat_whatsapp = cta.buttons[1].label;
    }
  }

  // ── Clean up: remove block arrays from output ─────────────────────────────
  const blockFields = [
    'heroSection', 'manifestoSection', 'pillarsSection', 'vendorsSection',
    'segmentsSection', 'aboutSection', 'expectSection', 'ctaSection',
    'whyUsSection', 'bookingGuaranteesSection', 'testimonialPlatformBadges'
  ];
  blockFields.forEach((k) => { delete flat[k]; });

  return flat;
}

export async function getHomePage(lang = 'en') {
  const flat = flattenHomePage(homePageData);
  // Apply standalone translation file overlay
  if (lang && lang !== 'en') {
    const translation = getTranslationForPage('home_page', lang);
    if (translation) {
      for (const [key, val] of Object.entries(translation)) {
        if (val !== null && val !== undefined && val !== '') {
          flat[key] = val;
        }
      }
    }
  }
  return flat;
}

// ── Site settings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return siteSettingsData;
}

// ── Vendors ──────────────────────────────────────────────────────────────────

/**
 * Returns featured vendors from the committed JSON snapshot.
 * Run `npm run sync` to refresh from Payload.
 */
export async function getFeaturedVendors(limit = 3, lang = 'en') {
  const featured = vendorsData.filter(v => v.featured);
  const subset = limit ? featured.slice(0, limit) : featured;
  if (lang !== 'en') {
    return subset.map(v => applyTranslation(v, lang));
  }
  return subset;
}

/**
 * Returns vendors linked to a specific tour.
 * Tours store vendors as: vendors: [{ vendors_id: { id, name, ... } }]
 */
export async function getVendorsByTour(tourSlug) {
  const tour = toursData.find(t => t.slug === tourSlug);
  if (!tour?.vendors?.length) return [];
  return tour.vendors
    .map(v => v.vendors_id)
    .filter(Boolean);
}

/**
 * Returns tours that a vendor appears on (for vendor story pages).
 * A vendor's tours are those that have the vendor in their junction rows.
 */
export async function getToursByVendor(vendorId) {
  return toursData.filter(t =>
    t._status === 'published' &&
    Array.isArray(t.vendors) &&
    t.vendors.some(v => v.vendors_id?.id === vendorId)
  );
}

// ── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFAQsByPage(page, lang = 'en') {
  const faqs = faqsData.filter(f => {
    // Support both field naming conventions: page_visibility (new) and pages (old)
    const visibility = f.page_visibility ?? f.pages;
    const pages = Array.isArray(visibility)
      ? visibility
      : (visibility || '').split(',').map(p => p.trim());
    return pages.includes(page) || pages.includes('all');
  });
  return faqs.map(f => {
    // Try inline translations first (Payload sync)
    let question = f.question;
    let answer = f.answer;

    const inlineT = (f.translations || []).find(t => t.languages_code === lang)
                   || (f.translations || []).find(t => t.languages_code === 'en');
    if (inlineT) {
      question = inlineT.question || question;
      answer = inlineT.answer || answer;
    }

    // Then try standalone translation files — use position in faqsData as key
    if (lang && lang !== 'en') {
      const faqIndex = faqsData.indexOf(f);
      if (faqIndex !== -1) {
        const fileT = getTranslationForItem('faqs', lang, faqIndex + 1);
        if (fileT) {
          if (fileT.question) question = fileT.question;
          if (fileT.answer) answer = fileT.answer;
        }
      }
    }

    // Extract plain text from Lexical rich-text JSON if present
    answer = extractLexicalText(answer);

    return {
      ...f,
      question,
      answer,
    };
  });
}

// ── Stories ──────────────────────────────────────────────────────────────────

/**
 * Compute a `categories` array from the story's `tags` JSON field.
 * Payload stores multi-category as `tags: '["Culture & Heritage","Food Culture"]'`
 * while page templates expect `story.categories: string[]`.
 */
function normalizeStory(story) {
  if (!story) return story;

  let categories = Array.isArray(story.categories)
    ? [...story.categories]
    : [];
  if (story.tags) {
    if (Array.isArray(story.tags)) {
      categories = story.tags;
    } else {
      try { categories = JSON.parse(story.tags); } catch { /* ignore */ }
    }
  }
  if (!categories.length && story.category) categories = [story.category];

  // Extract tour IDs from M2M relation (Payload: related_tours tour_id)
  // Falls back to the tour_ids array if set directly on the story object.
  let tour_ids = Array.isArray(story.tour_ids) ? story.tour_ids : [];
  if (Array.isArray(story.related_tours) && story.related_tours.length) {
    tour_ids = story.related_tours
      .map(r => (typeof r.tours_id === 'object' ? r.tours_id?.id : r.tours_id))
      .filter(Boolean);
  }

  return { ...story, categories, tour_ids };
}

export async function getStoryBySlug(slug, lang = 'en') {
  const story = storiesData.find(s => s.slug === slug) ?? null;
  const translated = story ? applyTranslation(story, lang, 'stories') : null;
  return normalizeStory(translated);
}

export async function getAllStories(_options = {}, lang = 'en') {
  const stories = storiesData.filter(s => s._status === 'published');
  const list = lang === 'en' ? stories : stories.map(s => applyTranslation(s, lang, 'stories'));
  return list.map(normalizeStory);
}

export async function getFeaturedStories(lang = 'en') {
  const stories = storiesData.filter(s => s._status === 'published' && s.featured);
  const list = lang === 'en' ? stories : stories.map(s => applyTranslation(s, lang, 'stories'));
  return list.map(normalizeStory);
}

export async function getStoriesByCategory(category) {
  return storiesData
    .filter(s => s._status === 'published' && s.category === category)
    .map(normalizeStory);
}

export async function getToursById(tourIds) {
  if (!Array.isArray(tourIds) || !tourIds.length) return [];
  return toursData.filter(t =>
    t._status === 'published' &&
    tourIds.includes(t.id)
  );
}

/**
 * Returns up to `limit` stories relevant to a given tour.
 *
 * Scoring:
 *   - Penang tours → prefer stories with "Heritage" or "Culture" in category (+3 each)
 *   - "Expert Guide" category stories → relevant to any tour (+2)
 *   - "Vendor Story" category stories → relevant to KL tours (+2)
 *   - Stories sorted by score descending, then by published_at descending
 *
 * Takes `allStories` as a parameter so the caller can fetch once and reuse.
 */
export function getRelatedStories(tour, allStories, limit = 2) {
  if (!Array.isArray(allStories) || !allStories.length) return [];

  const isPenang = tour?.location === 'Penang';
  const klSlugs = ['flavours-of-malaysia', 'kuala-lumpur-street-food', 'secrets-of-kl-nightlife-street-art-and-cocktails'];
  const isKL = !isPenang || klSlugs.includes(tour?.slug);

  function scoreStory(story) {
    const cat = story.category ?? '';
    let score = 0;
    if (isPenang) {
      if (cat.includes('Heritage')) score += 3;
      if (cat.includes('Culture')) score += 3;
    }
    if (cat === 'Expert Guide') score += 2;
    if (cat === 'Vendor Story' && isKL) score += 2;
    return score;
  }

  const scored = allStories
    .filter(s => (s._contentText?.trim().length ?? 0) >= 500)
    .map(s => ({ story: s, score: scoreStory(s) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // secondary: most recently published first
      const dateA = a.story.published_at ? new Date(a.story.published_at).getTime() : 0;
      const dateB = b.story.published_at ? new Date(b.story.published_at).getTime() : 0;
      return dateB - dateA;
    });

  return scored.slice(0, limit).map(s => s.story);
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function isTestimonialVerified(t) {
  return t.visibility?.verified ?? t.verified ?? false;
}

function isTestimonialFeatured(t) {
  return t.visibility?.featured ?? t.featured ?? false;
}

export async function getFeaturedTestimonials(limit) {
  const featured = testimonialsData.filter(t => isTestimonialFeatured(t) && isTestimonialVerified(t));
  // Fallback: if none are explicitly featured, return all verified testimonials
  const result = featured.length > 0
    ? featured
    : testimonialsData.filter(t => isTestimonialVerified(t));
  return limit ? result.slice(0, limit) : result;
}

/**
 * Get testimonials assigned to a specific page slug.
 * Uses the same page_visibility pattern as getFAQsByPage:
 *   - "tours" → shows on all tour pages
 *   - "eat-drink-george-town" → shows only on that tour
 *   - "eat-drink-george-town,kl-street-food" → shows on both
 * Falls back to all featured+verified testimonials if none have page_visibility set.
 */
export async function getTestimonialsByPage(page, lang = 'en') {
  const filtered = testimonialsData.filter(t => {
    if (!isTestimonialVerified(t)) return false;
    // Check page_visibility (general pages like "tours", "home")
    const visibility = t.page_visibility;
    const pages = Array.isArray(visibility)
      ? visibility
      : (visibility ? visibility.split(',').map(p => p.trim()) : []);
    if (pages.includes(page)) return true;
    // Check relatedTours (specific tour slugs from Payload relationship)
    const related = t.relatedTours ?? [];
    return related.some(r => (typeof r === 'string' ? r : r?.slug) === page);
  });
  return lang === 'en' ? filtered : filtered.map(t => applyTranslation(t, lang));
}

// ── Dietary landing pages ────────────────────────────────────────────────────

export async function getDietaryLandingPageBySlug(slug, lang = 'en') {
  const page = dietaryLandingPagesData.find(p => p.slug === slug) ?? null;
  return page ? applyTranslation(page, lang, 'dietary-landing-pages') : null;
}

export async function getAllDietaryLandingPages(lang = 'en') {
  const pages = dietaryLandingPagesData.filter(p => p._status === 'published');
  return lang === 'en' ? pages : pages.map(p => applyTranslation(p, lang, 'dietary-landing-pages'));
}

// ── Location landing pages ───────────────────────────────────────────────────

export async function getLocationLandingPageBySlug(slug, lang = 'en') {
  const page = locationLandingPagesData.find(p => p.slug === slug) ?? null;
  return page ? applyTranslation(page, lang, 'location-landing-pages') : null;
}

export async function getAllLocationLandingPages(lang = 'en') {
  const pages = locationLandingPagesData.filter(p => p._status === 'published');
  return lang === 'en' ? pages : pages.map(p => applyTranslation(p, lang, 'location-landing-pages'));
}

// ── Travel type landing pages ────────────────────────────────────────────────

export async function getTravelTypeLandingPageBySlug(slug, lang = 'en') {
  const page = travelTypeLandingPagesData.find(p => p.slug === slug) ?? null;
  return page ? applyTranslation(page, lang, 'travel-type-landing-pages') : null;
}

export async function getAllTravelTypeLandingPages(lang = 'en') {
  const pages = travelTypeLandingPagesData.filter(p => p._status === 'published');
  return lang === 'en' ? pages : pages.map(p => applyTranslation(p, lang, 'travel-type-landing-pages'));
}

// ── Specialty landing pages ──────────────────────────────────────────────────

export async function getSpecialtyLandingPageBySlug(slug, lang = 'en') {
  const page = specialtyLandingPagesData.find(p => p.slug === slug) ?? null;
  return page ? applyTranslation(page, lang, 'specialty-landing-pages') : null;
}

export async function getAllSpecialtyLandingPages(lang = 'en') {
  const pages = specialtyLandingPagesData.filter(p => p._status === 'published');
  return lang === 'en' ? pages : pages.map(p => applyTranslation(p, lang, 'specialty-landing-pages'));
}

// ── Legal pages ──────────────────────────────────────────────────────────────

/**
 * Extracts HTML string from Payload rich-text array.
 * Payload stores legal content as [{ type: 'paragraph', children: [{ text: '<p>...</p>' }] }].
 * The actual HTML lives in children[0].text — we flatten it so templates can use set:html directly.
 */
function extractPayloadHtml(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map(block => block?.children?.map(child => child?.text || '').join('') || '')
    .join('');
}

export async function getLegalPageBySlug(slug) {
  const page = legalPagesData.find(p => p.slug === slug) ?? null;
  if (!page) return null;
  // Convert Payload rich-text array to HTML string for set:html rendering
  return { ...page, content: extractPayloadHtml(page.content) };
}

export async function getAllLegalPages() {
  return legalPagesData.filter(p => p._status === 'published');
}

// ── Thank-you pages ───────────────────────────────────────────────────────────

export async function getThankYouPageByType(type) {
  return thankYouPagesData.find(p => p.type === type) ?? null;
}

// ── Navigation ───────────────────────────────────────────────────────────────

/**
 * Returns header nav items from site-settings.json (main_navigation).
 * Falls back to [] so header.astro uses i18n-translated nav.
 */
export async function getHeaderNavItems() {
  const links = (siteSettingsData.main_navigation || []).map(item => ({
    name: item.label || item.name || '',
    href: item.url || item.href || '/',
  }));
  // Conditionally insert vendors link after Tours when enabled
  const showVendors = siteSettingsData?.show_vendors !== false;
  if (showVendors) {
    const toursIdx = links.findIndex(l => l.href?.includes('/tours') && !l.href?.includes('private'));
    if (toursIdx >= 0) {
      links.splice(toursIdx + 1, 0, { name: 'Vendors', href: '/#vendors' });
    }
  }
  return links;
}

/**
 * Returns footer quick links from site-settings.json (footer_navigation).
 * Filters out vendor-related links when show_vendors is false.
 */
export async function getFooterLinks() {
  const showVendors = siteSettingsData?.show_vendors !== false;
  const links = (siteSettingsData.footer_navigation || []).filter(item => {
    if (!showVendors) {
      // Filter out vendor-related footer links
      const label = (item.label || '').toLowerCase();
      if (label.includes('vendor') || label.includes('meet')) return false;
    }
    return true;
  }).map(item => ({
    name: item.label || item.name || '',
    href: item.url || item.href || '/',
  }));
  return links;
}

// ── FAQ alias ────────────────────────────────────────────────────────────────

/**
 * Alias for getFAQsByPage — both names are used across pages.
 */
export const getFAQsForPage = getFAQsByPage;

/**
 * Returns the "main 5" tour slugs from site-settings.json.
 * Falls back to the hardcoded default if not configured.
 */
const MAIN_TOUR_SLUGS_DEFAULT = [
  'flavours-of-malaysia',
  'eat-drink-george-town',
  'kuala-lumpur-street-food',
  'penang-street-food',
  'secrets-of-kl-nightlife-street-art-and-cocktails',
];
export function getMainTourSlugs() {
  return siteSettingsData?.main_tour_slugs || MAIN_TOUR_SLUGS_DEFAULT;
}

// ── Contact page ──────────────────────────────────────────────────────────────

export async function getContactPage(lang = 'en') {
  return applyTranslation(contactPageData, lang);
}

// ── How It Works page ─────────────────────────────────────────────────────────

export async function getHowItWorksPage(lang = 'en') {
  return applyTranslation(howItWorksPageData, lang);
}

// ── How to Prepare page ───────────────────────────────────────────────────────

export async function getHowToPreparePage(lang = 'en') {
  return applyTranslation(howToPreparePageData, lang);
}

// ── Track Record page ─────────────────────────────────────────────────────────

export async function getTrackRecordPage(lang = 'en') {
  return applyTranslation(trackRecordPageData, lang);
}

// ── Media page ────────────────────────────────────────────────────────────────

export async function getMediaPage(lang = 'en') {
  return applyTranslation(mediaPageData, lang);
}

// ── Media coverage (press mentions) ───────────────────────────────────────────

export async function getMediaCoverage() {
  return mediaCoverageData.filter(item => item.status !== 'archived');
}

// ── Tour Quiz ────────────────────────────────────────────────────────────────

export async function getTourQuiz() {
  if (!tourQuizData || !tourQuizData.id) return null;
  
  const steps = (tourQuizData.steps || []).map(step => ({
    id: step.id_key,
    question: step.question,
    options: (step.options || []).map(opt => ({
      value: opt.value, label: opt.label, icon: opt.icon || '',
      description: opt.description || '',
    })),
  }));

  const personalities = (tourQuizData.personalities || []).map(p => ({
    key: p.key, emoji: p.emoji || '', title: p.title,
    description: p.description || '', tourMatch: p.tour_match || '',
  }));

  const scoringWeights = (tourQuizData.scoring_weights || []).map(w => ({
    question_id: w.question_id, answer_value: w.answer_value, weights: w.weights || {},
  }));

  const resultHeadlines = (tourQuizData.result_headlines || []).map(h => ({
    key: h.key, headline: h.headline, subtext: h.subtext || '',
  }));

  const fallbackTours = (tourQuizData.fallback_tours || []).map(t => t?.slug || '').filter(Boolean);

  return {
    intro: {
      title: tourQuizData.intro_title || 'What Type of Malaysian Foodie Are You?',
      description: tourQuizData.intro_description || 'Tell us about your Malaysian food experience and we\'ll reveal your foodie personality.',
      buttonLabel: tourQuizData.intro_button_label || 'Take the Quiz',
    },
    steps, personalities, scoringWeights, resultHeadlines,
    fallback: { headline: tourQuizData.fallback_headline || 'Our Top Picks For You', tourSlugs: fallbackTours },
    contactCTAText: tourQuizData.contact_cta_text || 'Still not sure which tour is right for you?',
    contactCTAButton: tourQuizData.contact_cta_button || 'Let Us Help You Choose',
  };
}

// ── Tours section pages ───────────────────────────────────────────────────────

export async function getToursIndexPage(lang = 'en') {
  return applyTranslation(toursIndexPageData, lang);
}

export async function getPrivateToursPage(lang = 'en') {
  return applyTranslation(privateToursPageData, lang);
}

export async function getJoinInToursPage(lang = 'en') {
  return applyTranslation(joinInToursPageData, lang);
}

export async function getCorporateGroupsPage(lang = 'en') {
  return applyTranslation(corporateGroupsPageData, lang);
}

// ── About page ────────────────────────────────────────────────────────────────

export async function getAboutPage(lang = 'en') {
  return applyTranslation(aboutPageData, lang, 'about-page');
}

// ── FAQ page ──────────────────────────────────────────────────────────────────

export async function getFaqPage(lang = 'en') {
  return applyTranslation(faqPageData, lang);
}

// ── Stories index page ────────────────────────────────────────────────────────

import storiesIndexPageData from '../data/content/stories-index-page.json';

export async function getStoriesIndexPage(lang = 'en') {
  return applyTranslation(storiesIndexPageData, lang);
}

// ── Stories archive page ──────────────────────────────────────────────────────

import storiesArchivePageData from '../data/content/stories-archive-page.json';

export async function getStoriesArchivePage(lang = 'en') {
  return applyTranslation(storiesArchivePageData, lang);
}

// ── Directions page ───────────────────────────────────────────────────────────

import directionsPageData from '../data/content/directions-page.json';

export async function getDirectionsPage(lang = 'en') {
  return applyTranslation(directionsPageData, lang);
}

