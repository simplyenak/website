/**
 * Content Library — Simply Enak AstroWind Site
 *
 * THREE-TIER FALLBACK CHAIN:
 *   1. Live Payload API  (fetch from cms.system.simplyenak.com during build)
 *   2. JSON snapshots     (src/data/content/*.json — synced from Payload)
 *   3. Hardcoded data     (src/data/tours.js, src/data/segments.js)
 *
 * Each function follows the same pattern: try live API first, fall back to
 * snapshots, then to hardcoded data.
 */

import { tours as hardcodedTours } from '~/data/tours';
import {
  dietarySegments,
  locationSegments,
  specialtySegments,
  travelTypeSegments,
} from '~/data/segments';
import {
  fetchCollection,
  fetchSingleton,
  clearPayloadCache,
} from '~/lib/payload-client';

// ── JSON snapshots (Payload-synced, fallback tier 2) ──────────────────

let snapshotTours: any[] = [];
let snapshotSiteSettings: any = {};
let snapshotLocations: any[] = [];
let snapshotDietaryOptions: any[] = [];
let snapshotSpecialtyExperiences: any[] = [];
let snapshotTravelTypes: any[] = [];
let snapshotFAQs: any[] = [];
let snapshotTestimonials: any[] = [];
let snapshotStories: any[] = [];
let snapshotHomePage: any = {};
let snapshotAboutPage: any = {};
let snapshotContactPage: any = {};
let snapshotThankYouPages: any[] = [];
let snapshotPages: any[] = [];
let snapshotLandingPages: any[] = [];

// Eager-import JSON at build time — Astro resolves these at compile
try {
  snapshotTours = (await import('~/data/content/tours.json')).default as any[] || [];
} catch {}
try {
  snapshotSiteSettings = (await import('~/data/content/site-settings.json')).default || {};
} catch {}
try {
  snapshotLocations = (await import('~/data/content/locations.json')).default as any[] || [];
} catch {}
try {
  snapshotDietaryOptions = (await import('~/data/content/dietary-options.json')).default as any[] || [];
} catch {}
try {
  snapshotSpecialtyExperiences = (await import('~/data/content/specialty-experiences.json')).default as any[] || [];
} catch {}
try {
  snapshotTravelTypes = (await import('~/data/content/travel-types.json')).default as any[] || [];
} catch {}
try {
  snapshotFAQs = (await import('~/data/content/faqs.json')).default as any[] || [];
} catch {}
try {
  snapshotTestimonials = (await import('~/data/content/testimonials.json')).default as any[] || [];
} catch {}
try {
  snapshotStories = (await import('~/data/content/stories.json')).default as any[] || [];
} catch {}
try {
  snapshotHomePage = (await import('~/data/content/home-page.json')).default || {};
} catch {}
try {
  snapshotAboutPage = (await import('~/data/content/about-page.json')).default || {};
} catch {}
try {
  snapshotContactPage = (await import('~/data/content/contact-page.json')).default || {};
} catch {}
try {
  snapshotThankYouPages = (await import('~/data/content/thank-you-pages.json')).default as any[] || [];
} catch {}
try {
  snapshotPages = (await import('~/data/content/pages.json')).default as any[] || [];
} catch {}
try {
  snapshotLandingPages = [
    ...((await import('~/data/content/dietary-landing-pages.json')).default as any[] || []),
    ...((await import('~/data/content/specialty-landing-pages.json')).default as any[] || []),
    ...((await import('~/data/content/travel-type-landing-pages.json')).default as any[] || []),
    ...((await import('~/data/content/location-landing-pages.json')).default as any[] || []),
  ];
} catch {
  snapshotLandingPages = [];
}

// ── Live Payload fetchers (tier 1) ─────────────────────────────────────
// These return the raw Payload docs. Callers use them as tier 1 fallback.

async function liveTours(locale?: string): Promise<any[] | null> {
  try {
    return await fetchCollection('tours', { locale });
  } catch {
    return null;
  }
}

async function liveHomePage(locale?: string) {
  return fetchSingleton('home_page', { locale });
}

async function livePages(locale?: string) {
  return fetchCollection('pages', { locale });
}

async function liveFAQs(locale?: string) {
  return fetchCollection('faqs', { locale });
}

async function liveTestimonials(locale?: string) {
  return fetchCollection('testimonials', { locale });
}

async function liveStories(locale?: string) {
  return fetchCollection('stories', { locale });
}

async function liveSiteSettings(locale?: string) {
  return fetchSingleton('site_settings', { locale });
}

async function liveLocations(locale?: string) {
  return fetchCollection('locations', { locale });
}

async function liveDietaryOptions(locale?: string) {
  return fetchCollection('dietary_options', { locale });
}

async function liveSpecialtyExperiences(locale?: string) {
  return fetchCollection('specialty_experiences', { locale });
}

async function liveTravelTypes(locale?: string) {
  return fetchCollection('travel_types', { locale });
}

async function liveLandingPages(locale?: string): Promise<any[] | null> {
  try {
    const docs = await fetchCollection('landing_pages', { locale });
    return docs || [];
  } catch {
    return null;
  }
}

async function liveAboutPage(locale?: string) {
  return fetchSingleton('about_page', { locale });
}

async function liveContactPage(locale?: string) {
  return fetchSingleton('contact_page', { locale });
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Extract highlight text from Payload's nested highlight format.
 */
function unwrapHighlights(payloadTour: any) {
  const raw = payloadTour.highlights || [];
  if (raw.length === 0 && payloadTour.itinerary) {
    return payloadTour.itinerary.map((i: any) => typeof i === 'string' ? i : (i.title || ''));
  }
  return raw.map((h: any) => h.highlight || h.item || h).filter(Boolean);
}

/**
 * Unwrap Payload repeating fields: [{item: "..."}] → ["..."]
 */
function unwrap(arr: any[], key = 'item') {
  if (!Array.isArray(arr)) return [];
  return arr.map((i: any) => i[key] ?? i).filter(Boolean);
}

/**
 * Build the forYou tray from Payload data
 */
function buildForYou(payloadTour: any) {
  const items: any[] = [];
  const hl = unwrapHighlights(payloadTour);
  if (hl.length > 0) {
    items.push({ icon: '\u2713', label: 'Highlights', desc: hl.slice(0, 3).join(', ') });
  }
  if (payloadTour.isBookable) {
    items.push({ icon: '\ud83d\udcc5', label: 'Bookable Online', desc: 'Instant confirmation' });
  }
  if (payloadTour.maxParticipants && payloadTour.maxParticipants <= 9) {
    items.push({ icon: '\ud83d\udc65', label: 'Small Groups', desc: `Max ${payloadTour.maxParticipants} people` });
  }
  return items;
}

// ── Tour data: merge Payload + hardcoded fallback ───────────────────────

/**
 * Merge a single payload tour with its hardcoded counterpart.
 * Payload data takes priority where non-null; hardcoded fills gaps.
 */
function mergeTour(payload: any) {
  if (!payload || !payload.slug) return null;

  // Find matching hardcoded tour by slug prefix match
  const hardcoded = hardcodedTours.find(
    (t: any) => t.slug === payload.slug || payload.slug.startsWith(t.slug)
  );
  if (!hardcoded) {
    // No hardcoded fallback — return Payload data shaped like hardcoded tours
    return {
      slug: payload.slug,
      ticketingHubId: payload.ticketingHubId || null,
      isBookable: payload.isBookable === true,
      name: payload.name || payload.slug,
      tagline: payload.tagline || '',
      shortDesc: payload.shortDescription || '',
      fullDesc: payload.fullDescription || '',
      price: payload.price ? `RM ${payload.price}` : '',
      currency: payload.currency || 'MYR',
      duration: payload.duration || '',
      schedule: 'Daily',
      groupSize: payload.maxParticipants ? `2–${payload.maxParticipants} people` : '2–9 people',
      tastings: null,
      walkingDistance: null,
      cancellation: 'Free cancellation',
      difficulty: 'Easy',
      location: payload.location || '',
      image: payload.heroImage || null,
      heroImageAlt: payload.heroImageAlt || '',
      highlights: unwrapHighlights(payload),
      itinerary: [],
      foods: [],
      forYou: buildForYou(payload),
      dietaryOptions: unwrap(payload.dietaryOptions, 'slug'),
      specialtyExperiences: unwrap(payload.specialtyExperiences, 'slug'),
      locations: unwrap(payload.locations, 'slug'),
      travelTypes: unwrap(payload.travelTypes, 'slug'),
      segmentTags: [],
      whatsIncluded: unwrap(payload.whatsIncluded),
      whatsExcluded: unwrap(payload.whatsExcluded),
      featured: payload.featured === true,
      popular: payload.popular === true,
      new: payload.new === true,
      publishedAt: payload.publishedAt || null,
      status: payload.status || 'published',
    };
  }

  return {
    slug: payload.slug || hardcoded.slug,
    ticketingHubId: payload.ticketingHubId || hardcoded.ticketingHubId || null,
    isBookable: payload.isBookable === true,
    name: payload.name || hardcoded.name,
    tagline: payload.tagline || hardcoded.tagline,
    shortDesc: payload.shortDescription || hardcoded.shortDesc,
    fullDesc: payload.fullDescription || hardcoded.fullDesc,
    price: payload.price ? `RM ${payload.price}` : hardcoded.price,
    currency: payload.currency || 'MYR',
    duration: payload.duration || hardcoded.duration,
    schedule: hardcoded.schedule || 'Daily',
    groupSize: payload.maxParticipants
      ? `2–${payload.maxParticipants} people`
      : hardcoded.groupSize,
    tastings: hardcoded.tastings || null,
    walkingDistance: hardcoded.walkingDistance || null,
    cancellation: hardcoded.cancellation || 'Free cancellation',
    difficulty: hardcoded.difficulty || 'Easy',
    location: payload.location || hardcoded.location,
    image: payload.image || hardcoded.image,
    heroImageAlt: payload.heroImageAlt || '',
    highlights: hardcoded.highlights && hardcoded.highlights.length > 0 ? hardcoded.highlights : unwrapHighlights(payload),
    itinerary: hardcoded.itinerary || [],
    foods: hardcoded.foods || [],
    forYou: hardcoded.forYou && hardcoded.forYou.length > 0 ? hardcoded.forYou : buildForYou(payload),
    dietaryOptions: (payload.dietaryOptions && payload.dietaryOptions.length > 0) ? unwrap(payload.dietaryOptions, 'slug') : (hardcoded.dietaryOptions || []),
    specialtyExperiences: (payload.specialtyExperiences && payload.specialtyExperiences.length > 0) ? unwrap(payload.specialtyExperiences, 'slug') : (hardcoded.specialtyExperiences || []),
    locations: (payload.locations && payload.locations.length > 0) ? unwrap(payload.locations, 'slug') : (hardcoded.locations || []),
    travelTypes: (payload.travelTypes && payload.travelTypes.length > 0) ? unwrap(payload.travelTypes, 'slug') : (hardcoded.travelTypes || []),
    segmentTags: (hardcoded as any).segment_tags || [],
    whatsIncluded: unwrap(payload.whatsIncluded),
    whatsExcluded: unwrap(payload.whatsExcluded),
    featured: payload.featured === true,
    popular: payload.popular === true,
    new: payload.new === true,
    publishedAt: payload.publishedAt || null,
    status: payload.status || 'published',
  };
}

// ── Home Page Types ────────────────────────────────────────────────────

interface HomePageCta {
  text: string;
  url: string;
}

interface HomePageStat {
  number?: string;
  label?: string;
  icon?: string;
  stars?: number;
}

interface HomePageTestimonial {
  text: string;
  name: string;
  location: string;
}

interface HomePageFaqItem {
  question: string;
  answer: string;
}

interface HomePageFeature {
  icon: string;
  title: string;
  description: string;
}

interface ComparisonRow {
  label: string;
  value: string;
}

interface ComparisonType {
  name: string;
  subtitle: string;
  popular: boolean;
  rows: ComparisonRow[];
  cta: HomePageCta;
}

interface PressLogo {
  src: string;
  alt: string;
  title: string;
}

interface HeroSection {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  heroImage: string;
  ctaPrimary: HomePageCta;
  ctaSecondary: HomePageCta;
  stats: HomePageStat[];
}

interface FeaturedInSection {
  title: string;
  logos: PressLogo[];
}

interface PhilosophySection {
  eyebrow: string;
  heading: string;
  description: string;
  features: HomePageFeature[];
}

interface ToursSectionMeta {
  eyebrow: string;
  heading: string;
  description: string;
}

interface ComparisonSection {
  eyebrow: string;
  heading: string;
  description: string;
  types: ComparisonType[];
}

interface TestimonialsSection {
  eyebrow: string;
  heading: string;
  stats: HomePageStat[];
  testimonials: HomePageTestimonial[];
}

interface FaqSection {
  eyebrow: string;
  heading: string;
  items: HomePageFaqItem[];
}

interface CtaSection {
  heading: string;
  description: string;
  ctaPrimary: HomePageCta;
  ctaSecondary: HomePageCta;
}

interface HomePageData {
  hero: HeroSection;
  featuredIn: FeaturedInSection;
  philosophy: PhilosophySection;
  toursSection: ToursSectionMeta;
  comparisonSection: ComparisonSection;
  testimonialsSection: TestimonialsSection;
  faqSection: FaqSection;
  ctaSection: CtaSection;
}

// ── shapeHomePage ──────────────────────────────────────────────────

function shapeHomePage(raw: any): HomePageData {
  return {
    hero: {
      eyebrow: raw.hero?.eyebrow ?? 'Kuala Lumpur · Ipoh · Penang Food Tours',
      title: raw.hero?.title ?? "Malaysia's Culture and Heritage",
      titleHighlight: raw.hero?.titleHighlight ?? 'As Only Locals Know It',
      description: raw.hero?.description ?? 'Small-group walking food tours through neighborhoods where we actually live and eat. We take you to family-run stalls, share stories behind each dish, and show you why this food matters.',
      heroImage: raw.hero?.heroImage ?? 'https://se-website-images.s3.nl-ams.scw.cloud/Food_Experience_optimized_adc493606c.jpg',
      ctaPrimary: raw.hero?.ctaPrimary ?? { text: 'SEE OUR TOURS', url: '/tours' },
      ctaSecondary: raw.hero?.ctaSecondary ?? { text: 'ABOUT US', url: '/about' },
      stats: raw.hero?.stats ?? [
        { icon: 'google', stars: 5, label: 'Google Reviews' },
        { icon: 'tripadvisor', stars: 5, label: 'Travellers Choice' },
      ],
    },
    featuredIn: {
      title: raw.featuredIn?.title ?? 'As Featured In',
      logos: raw.featuredIn?.logos ?? [
        { src: '/images/press-logos/national_geographic.png', alt: 'National Geographic', title: 'National Geographic' },
        { src: '/images/press-logos/bbc.svg', alt: 'BBC', title: 'BBC' },
        { src: '/images/press-logos/lonely-planet.png', alt: 'Lonely Planet', title: 'Lonely Planet' },
        { src: '/images/press-logos/timeout.png', alt: 'Time Out', title: 'Time Out' },
        { src: '/images/press-logos/tlc.png', alt: 'TLC', title: 'TLC' },
        { src: '/images/press-logos/the_food_ranger.png', alt: 'The Food Ranger', title: 'The Food Ranger' },
      ],
    },
    philosophy: {
      eyebrow: raw.philosophy?.eyebrow ?? 'Our Philosophy',
      heading: raw.philosophy?.heading ?? 'Great food lives in the people, places and the stories we share.',
      description: raw.philosophy?.description ?? 'The people who cook it, the places that shaped it, and the stories that make every dish unforgettable. This is what we share on every tour.',
      features: raw.philosophy?.features ?? [
        { icon: 'heart', title: 'Heritage Vendors', description: 'We partner with family-run stalls that have been feeding their neighborhoods for decades. Recipes passed down through generations.' },
        { icon: 'flame', title: 'Authentic Flavours', description: 'No tourist menus. No shortcuts. We take you to the spots where we eat with our own families on weekends.' },
        { icon: 'books', title: 'Cultural Context', description: 'Every dish tells a story of migration, trade, and community. We share the history behind what is on your plate.' },
      ],
    },
    toursSection: {
      eyebrow: raw.toursSection?.eyebrow ?? 'Signature Experiences',
      heading: raw.toursSection?.heading ?? 'Our Signature Food Tours',
      description: raw.toursSection?.description ?? "Hand-picked routes through Malaysia's most flavorful neighborhoods",
    },
    comparisonSection: {
      eyebrow: raw.comparisonSection?.eyebrow ?? 'Choose Your Way',
      heading: raw.comparisonSection?.heading ?? 'How Would You Like to Experience?',
      description: raw.comparisonSection?.description ?? "Three ways to explore Malaysia's flavours  -  pick what suits you best",
      types: raw.comparisonSection?.types ?? [
        { name: 'Join-In Tour', subtitle: 'Small group, fixed schedule', popular: false, rows: [
          { label: 'Group', value: 'Join other travellers (max 8)' },
          { label: 'Schedule', value: 'Fixed daily schedule' },
          { label: 'Route', value: 'Curated route' },
          { label: 'Price', value: 'From RM 285/person' },
          { label: 'Dietary', value: 'Accommodated' },
          { label: 'Best for', value: 'Solo travellers & couples' },
        ], cta: { text: 'Browse Tours', url: '/tours' } },
        { name: 'Private Tour', subtitle: 'Your group, your schedule', popular: true, rows: [
          { label: 'Group', value: 'Just you & your party' },
          { label: 'Schedule', value: 'Pick your date & time' },
          { label: 'Route', value: 'Choose from our routes' },
          { label: 'Price', value: 'From RM 350/person' },
          { label: 'Dietary', value: 'Fully accommodated' },
          { label: 'Best for', value: 'Families & small groups' },
        ], cta: { text: 'Inquire via WhatsApp', url: "https://wa.me/60172878929?text=Hi%20Simply%20Enak!%20I'm%20interested%20in%20a%20private%20tour" } },
        { name: 'Tailored Experience', subtitle: 'Fully custom itinerary', popular: false, rows: [
          { label: 'Group', value: 'Just you & your party' },
          { label: 'Schedule', value: 'You decide everything' },
          { label: 'Route', value: 'Fully custom itinerary' },
          { label: 'Price', value: 'Custom quote' },
          { label: 'Dietary', value: 'Designed around you' },
          { label: 'Best for', value: 'Special occasions & corporates' },
        ], cta: { text: 'Contact Us', url: '/contact' } },
      ],
    },
    testimonialsSection: {
      eyebrow: raw.testimonialsSection?.eyebrow ?? "14+ years of sharing Malaysia's best flavours",
      heading: raw.testimonialsSection?.heading ?? 'Trusted by Thousands of Food Lovers',
      stats: raw.testimonialsSection?.stats ?? [
        { number: '14+', label: 'Years Experience' },
        { number: '5,000+', label: 'Happy Guests' },
        { number: '4.9', label: 'TripAdvisor Rating' },
        { number: '5', label: 'Tour Options' },
      ],
      testimonials: raw.testimonialsSection?.testimonials ?? [
        { text: '"The Flavours of Malaysia tour was the highlight of our trip. Our guide was knowledgeable and the food was incredible."', name: 'Sarah Johnson', location: 'Australia' },
        { text: '"Great way to experience local culture. The market visit was eye-opening and all the food stops were fantastic."', name: 'Michael Chen', location: 'Singapore' },
        { text: '"We have done food tours around the world, and this one tops them all. Great stories behind every dish."', name: 'Emma Williams', location: 'United Kingdom' },
      ],
    },
    faqSection: {
      eyebrow: raw.faqSection?.eyebrow ?? 'Everything you need to know before booking',
      heading: raw.faqSection?.heading ?? 'Frequently Asked Questions',
      items: raw.faqSection?.items ?? [
        { question: 'How long are the tours?', answer: 'Most tours run 3.5 to 4 hours. We cover about 2km of walking at a relaxed pace with plenty of seating at each stop.' },
        { question: 'What dietary options do you accommodate?', answer: 'We accommodate vegetarian, halal, nut-allergy, and gluten-sensitive diets. Just let us know when booking.' },
        { question: 'How much walking is involved?', answer: 'About 2km of easy walking with frequent stops. Suitable for most fitness levels.' },
        { question: 'Can I book a private tour?', answer: 'Yes. Private tours are available for groups, families, and corporate events. Contact us for a custom experience.' },
        { question: 'Is the food spicy?', answer: 'Malaysian food has heat, but your guide will help navigate spice levels. Mild options are always available.' },
        { question: 'What happens if it rains?', answer: 'Tours run rain or shine. Many food stops have covered seating. In extreme weather we will reschedule.' },
      ],
    },
    ctaSection: {
      heading: raw.ctaSection?.heading ?? 'Ready to Taste Malaysia?',
      description: raw.ctaSection?.description ?? 'Book your food tour today and discover the flavors that make Malaysia one of the greatest food destinations.',
      ctaPrimary: raw.ctaSection?.ctaPrimary ?? { text: 'Browse All Tours', url: '/tours' },
      ctaSecondary: raw.ctaSection?.ctaSecondary ?? { text: 'Contact Us', url: '/contact' },
    },
  };
}

// ── Three-tier resolvers ──────────────────────────────────────────────
// Each resolver tries live Payload API first, falls back to JSON snapshot,
// then to hardcoded data where applicable.

async function resolveTours(locale?: string): Promise<any[]> {
  // Tier 1: Live Payload API
  const live = await liveTours(locale);
  if (live && live.length > 0) {
    return live
      .filter((t: any) => t.slug && (t.status === 'published' || !t.status))
      .map(mergeTour)
      .filter(Boolean) as any[];
  }

  // Tier 2: JSON snapshots (English only — skip for other locales)
  if ((!locale || locale === 'en') && snapshotTours.length > 0) {
    return snapshotTours
      .filter((t: any) => t.slug && (t.status === 'published' || !t.status))
      .map(mergeTour)
      .filter(Boolean) as any[];
  }

  // Tier 3: Hardcoded
  return hardcodedTours;
}

async function resolveHomePage(locale?: string): Promise<HomePageData> {
  let raw: any;
  const live = await liveHomePage(locale);
  if (live && Object.keys(live).length > 0) raw = live;
  else if ((!locale || locale === 'en') && snapshotHomePage && Object.keys(snapshotHomePage).length > 0) raw = snapshotHomePage;
  else raw = {};

  // Map Payload block structure to flat keys that shapeHomePage expects.
  // Payload stores: heroSection[{block with fields}]
  // shapeHomePage reads: raw.hero, raw.featuredIn, raw.philosophy, etc.

  // --- Map from Payload blocks format (tier 1 live API) ---
  // Each section is an array of blocks with maxRows: 1
  if (raw.heroSection && Array.isArray(raw.heroSection) && raw.heroSection.length > 0 && !raw.hero) {
    const h = raw.heroSection[0];
    const bgUrl = typeof h.bgImage === 'object' && h.bgImage?.url ? h.bgImage.url : (typeof h.bgImage === 'string' ? h.bgImage : '');
    raw.hero = {
      eyebrow: h.subtitle || '',
      title: h.title || '',
      titleHighlight: h.highlight || '',
      description: h.description || '',
      heroImage: bgUrl,
      ctaPrimary: { text: 'SEE OUR TOURS', url: '/tours' },
      ctaSecondary: { text: 'ABOUT US', url: '/about' },
    };
  }
  // Manifesto → Philosophy
  if (raw.manifestoSection && Array.isArray(raw.manifestoSection) && raw.manifestoSection.length > 0 && !raw.philosophy) {
    const m = raw.manifestoSection[0];
    raw.philosophy = {
      eyebrow: m.eyebrow || '',
      heading: m.headline || '',
      description: m.tagline || '',
    };
  }
  // Expect/Stats → TestimonialsSection
  if (raw.expectSection && Array.isArray(raw.expectSection) && raw.expectSection.length > 0 && !raw.testimonialsSection) {
    const s = raw.expectSection[0];
    const stats = Array.isArray(s.stats) ? s.stats.map((st: any) => ({ number: st.number || '', label: st.heading || '' })) : [];
    if (stats.length > 0) {
      raw.testimonialsSection = {
        eyebrow: s.subtitle || '',
        heading: s.title || '',
        stats,
        testimonials: [],
      };
    }
  }
  // CTA Section
  if (raw.ctaSection && Array.isArray(raw.ctaSection) && raw.ctaSection.length > 0) {
    const c = raw.ctaSection[0];
    raw.ctaSection = {
      heading: c.title || '',
      description: c.subtitle || '',
      ctaPrimary: c.buttons?.[0] ? { text: c.buttons[0].label, url: c.buttons[0].url } : { text: 'Browse All Tours', url: '/tours' },
      ctaSecondary: c.buttons?.[1] ? { text: c.buttons[1].label, url: c.buttons[1].url } : { text: 'Contact Us', url: '/contact' },
    };
  }
  // FAQs (top-level array field) — only if there are actual items
  if (raw.faqs && Array.isArray(raw.faqs) && raw.faqs.length > 0 && !raw.faqSection) {
    raw.faqSection = {
      eyebrow: 'Frequently Asked Questions',
      heading: 'Everything you need to know',
      items: raw.faqs.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })),
    };
  }

  // --- Map from JSON snapshot flat fields (e.g., hero_title → raw.hero.title) ---
  if (raw.hero_title && !raw.hero) {
    raw.hero = {
      eyebrow: raw.hero_subtitle || '',
      title: raw.hero_title || '',
      titleHighlight: raw.hero_highlight || '',
      description: raw.hero_description || '',
      heroImage: raw.hero_image || raw.hero_bg_image || '',
      ctaPrimary: { text: raw.hero_cta_primary || 'SEE OUR TOURS', url: raw.hero_cta_primary_url || '/tours' },
      ctaSecondary: { text: raw.hero_cta_secondary || 'ABOUT US', url: raw.hero_cta_secondary_url || '/about' },
      stats: [
        { icon: 'google', stars: 5, label: raw.hero_vendors || '14+ Years Experience' },
        { icon: 'tripadvisor', stars: 5, label: raw.hero_rated || 'TripAdvisor Certificate of Excellence' },
        { icon: 'google', stars: 5, label: raw.hero_since || '5,000+ Happy Guests' },
        { icon: 'google', stars: 5, label: raw.hero_max_per_tour || '40+ Heritage Vendors' },
      ],
    };
  }
  if (raw.vendors_title && !raw.featuredIn) {
    raw.featuredIn = {
      title: raw.vendors_title || raw.vendors_eyebrow || 'As Featured In',
      logos: (raw.vendors_footer || '').includes(',')
        ? raw.vendors_footer.split(',').map((l: string) => ({ src: l.trim(), alt: '', title: '' }))
        : undefined,
    };
  }
  if (raw.manifesto_eyebrow && !raw.philosophy) {
    raw.philosophy = {
      eyebrow: raw.manifesto_eyebrow || '',
      heading: raw.manifesto_headline || '',
      description: raw.manifesto_tagline || '',
    };
  }
  if (raw.expect_title && !raw.testimonialsSection) {
    raw.testimonialsSection = {
      eyebrow: raw.expect_subtitle || '',
      heading: raw.expect_title || '',
      stats: [
        { number: raw.expect_stat1_number || '', label: raw.expect_stat1_heading || '' },
        { number: raw.expect_stat2_number || '', label: raw.expect_stat2_heading || '' },
        { number: raw.expect_stat3_number || '', label: raw.expect_stat3_heading || '' },
        { number: raw.expect_stat4_number || '', label: raw.expect_stat4_heading || '' },
      ].filter((s: any) => s.number),
    };
  }
  if (raw.cta_title && !raw.ctaSection) {
    raw.ctaSection = {
      heading: raw.cta_title || '',
      description: raw.cta_description || '',
      ctaPrimary: { text: raw.cta_book_experience || 'Browse All Tours', url: '/tours' },
      ctaSecondary: { text: raw.cta_chat_whatsapp || 'Contact Us', url: '/contact' },
    };
  }
  if (raw.faqs && Array.isArray(raw.faqs) && raw.faqs.length > 0 && !raw.faqSection) {
    raw.faqSection = { items: raw.faqs.map((f: any) => ({
      question: f.question || '',
      answer: f.answer || '',
    }))};
  }

  // Pull FAQs from the main faqs collection as fallback
  if (!raw.faqSection) {
    try {
      const faqs = await resolveFAQs(locale);
      if (faqs && faqs.length > 0) {
        raw.faqSection = {
          eyebrow: 'Frequently Asked Questions',
          heading: 'Everything you need to know',
          items: faqs.slice(0, 8).map((f: any) => ({
            question: f.question || '',
            answer: typeof f.answer === 'object' ? f.answer?.en?.root?.children?.[0]?.children?.[0]?.text || '' : f.answer || '',
          })),
        };
      }
    } catch {}
  }

  return shapeHomePage(raw);
}

async function resolvePages(locale?: string): Promise<any[]> {
  const live = await livePages(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotPages.length > 0) return snapshotPages;
  return [];
}

async function resolveFAQs(locale?: string): Promise<any[]> {
  const live = await liveFAQs(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotFAQs.length > 0) return snapshotFAQs;
  const { tourFaqs } = await import('~/data/tours');
  return tourFaqs || [];
}

async function resolveTestimonials(locale?: string): Promise<any[]> {
  const live = await liveTestimonials(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotTestimonials.length > 0) return snapshotTestimonials;
  return [];
}

async function resolveStories(locale?: string): Promise<any[]> {
  const live = await liveStories(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotStories.length > 0) return snapshotStories;
  return [];
}

async function resolveSiteSettings(locale?: string): Promise<any> {
  const live = await liveSiteSettings(locale);
  if (live && Object.keys(live).length > 0) return live;
  if ((!locale || locale === 'en') && snapshotSiteSettings && Object.keys(snapshotSiteSettings).length > 0) return snapshotSiteSettings;
  return {};
}

async function resolveLocations(locale?: string): Promise<any[]> {
  const live = await liveLocations(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotLocations.length > 0) return snapshotLocations;
  return [];
}

async function resolveDietaryOptions(locale?: string): Promise<any[]> {
  const live = await liveDietaryOptions(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotDietaryOptions.length > 0) return snapshotDietaryOptions;
  return [];
}

async function resolveSpecialtyExperiences(locale?: string): Promise<any[]> {
  const live = await liveSpecialtyExperiences(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotSpecialtyExperiences.length > 0) return snapshotSpecialtyExperiences;
  return [];
}

async function resolveTravelTypes(locale?: string): Promise<any[]> {
  const live = await liveTravelTypes(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotTravelTypes.length > 0) return snapshotTravelTypes;
  return [];
}

async function resolveLandingPages(locale?: string): Promise<any[]> {
  const live = await liveLandingPages(locale);
  if (live && live.length > 0) return live;
  if ((!locale || locale === 'en') && snapshotLandingPages.length > 0) return snapshotLandingPages;
  return [];
}

// ── Public API ──────────────────────────────────────────────────────────

// -- Tours --

export async function getAllTours(locale?: string) {
  return resolveTours(locale);
}

export async function getTourBySlug(slug: string, locale?: string) {
  const all = await resolveTours(locale);
  return all.find((t: any) => t.slug === slug || t.slug.startsWith(slug)) || null;
}

export async function getFeaturedTours(locale?: string) {
  const all = await resolveTours(locale);
  return all.filter((t: any) => t.featured);
}

// -- Segments (locations, dietary, specialty, travel types) --

export async function getLocationSegments(locale?: string) {
  const payloadLocations = await resolveLocations(locale);
  const payloadSlugs = new Set(payloadLocations.map((l: any) => l.slug));
  // Also check landing pages — any location-type landing page counts
  const landingPages = await resolveLandingPages(locale);
  const lpSlugs = new Set(landingPages.filter((p: any) => p.type === 'location').map((p: any) => p.slug));
  if (payloadSlugs.size > 0 || lpSlugs.size > 0) {
    return locationSegments.filter((s: any) => payloadSlugs.has(s.slug) || lpSlugs.has(s.slug));
  }
  return locationSegments;
}

export async function getDietarySegments(locale?: string) {
  const dietaryOptions = await resolveDietaryOptions(locale);
  const payloadSlugs = new Set(dietaryOptions.map((d: any) => d.slug));
  const landingPages = await resolveLandingPages(locale);
  const lpSlugs = new Set(landingPages.filter((p: any) => p.type === 'dietary').map((p: any) => p.slug));
  if (payloadSlugs.size > 0 || lpSlugs.size > 0) {
    return dietarySegments.filter((s: any) => payloadSlugs.has(s.slug) || lpSlugs.has(s.slug));
  }
  return dietarySegments;
}

export async function getSpecialtySegments(locale?: string) {
  const specialtyExperiences = await resolveSpecialtyExperiences(locale);
  const payloadSlugs = new Set(specialtyExperiences.map((s: any) => s.slug));
  const landingPages = await resolveLandingPages(locale);
  const lpSlugs = new Set(landingPages.filter((p: any) => p.type === 'specialty').map((p: any) => p.slug));
  if (payloadSlugs.size > 0 || lpSlugs.size > 0) {
    return specialtySegments.filter((s: any) => payloadSlugs.has(s.slug) || lpSlugs.has(s.slug));
  }
  return specialtySegments;
}

export async function getTravelTypeSegments(locale?: string) {
  const travelTypes = await resolveTravelTypes(locale);
  const payloadSlugs = new Set(travelTypes.map((t: any) => t.slug));
  const landingPages = await resolveLandingPages(locale);
  const lpSlugs = new Set(landingPages.filter((p: any) => p.type === 'travel_type').map((p: any) => p.slug));
  if (payloadSlugs.size > 0 || lpSlugs.size > 0) {
    return travelTypeSegments.filter((s: any) => payloadSlugs.has(s.slug) || lpSlugs.has(s.slug));
  }
  return travelTypeSegments;
}

export async function getSegmentBySlug(slug: string) {
  const all = [
    ...(await getLocationSegments()),
    ...(await getDietarySegments()),
    ...(await getSpecialtySegments()),
    ...(await getTravelTypeSegments()),
  ];
  return all.find((s: any) => s.slug === slug) || null;
}

export async function getToursByTag(tag: string, locale?: string) {
  const all = await resolveTours(locale);
  return all.filter((t: any) =>
    (t.segmentTags && t.segmentTags.includes(tag)) ||
    (t.dietaryOptions && t.dietaryOptions.includes(tag)) ||
    (t.specialtyExperiences && t.specialtyExperiences.includes(tag)) ||
    (t.locations && t.locations.includes(tag)) ||
    (t.travelTypes && t.travelTypes.includes(tag))
  );
}

export async function getToursByDietary(slug: string) { return getToursByTag(slug); }
export async function getToursByLocation(slug: string) { return getToursByTag(slug); }
export async function getToursBySpecialty(slug: string) { return getToursByTag(slug); }
export async function getToursByTravelType(slug: string) { return getToursByTag(slug); }

// -- Reference data (dietary options, locations, specialties, travel types) --

export async function getDietaryOptionList(locale?: string) {
  return resolveDietaryOptions(locale);
}

export async function getSpecialtyList(locale?: string) {
  return resolveSpecialtyExperiences(locale);
}

export async function getTravelTypeList(locale?: string) {
  return resolveTravelTypes(locale);
}

// -- Site settings --

export async function getSiteSettings(locale?: string) {
  return resolveSiteSettings(locale);
}

// -- FAQs, Testimonials, Stories --

export async function getFAQs(locale?: string) {
  return resolveFAQs(locale);
}

export async function getFAQsByPage(page: string, locale?: string) {
  const all = await resolveFAQs(locale);
  if (!all || all.length === 0) return [];
  return all.filter((faq: any) => {
    const vis = faq.page_visibility || [];
    return vis.length === 0 || vis.includes('all') || vis.includes(page);
  });
}

export async function getTestimonials(locale?: string) {
  return resolveTestimonials(locale);
}

export async function getStories(locale?: string) {
  return resolveStories(locale);
}

// -- Pages (home, about, contact) --

export async function getHomePage(locale?: string) {
  return resolveHomePage(locale);
}

export async function getAboutPage(locale?: string) {
  // Tier 1: Live Payload API
  const live = await liveAboutPage(locale);
  if (live && Object.keys(live).length > 0) return live;
  // Tier 2: JSON snapshot (English only)
  if ((!locale || locale === 'en') && snapshotAboutPage && Object.keys(snapshotAboutPage).length > 0) return snapshotAboutPage;
  return {};
}

export async function getContactPage(locale?: string) {
  // Tier 1: Live Payload API
  const live = await liveContactPage(locale);
  if (live && Object.keys(live).length > 0) return live;
  // Tier 2: JSON snapshot (English only)
  if ((!locale || locale === 'en') && snapshotContactPage && Object.keys(snapshotContactPage).length > 0) return snapshotContactPage;
  return {};
}

export async function getPageBySlug(slug: string, locale?: string) {
  const pages = await resolvePages(locale);
  if (pages.length > 0) {
    return pages.find((p: any) => p.slug === slug && (!p._status || p._status === 'published')) || null;
  }
  return null;
}

// -- Thank You Pages --

export function getThankYouPage(slug: string) {
  if (snapshotThankYouPages.length > 0) {
    const page = snapshotThankYouPages.find((p: any) => p.slug === slug);
    if (page) {
      // Map Payload fields to what the template expects
      return {
        title: page.title || '',
        subtitle: page.heroSection?.subheading || page.heroSection?.heading || '',
        paragraphs: page.message ? [page.message] : [],
        nextSteps: page.nextSteps || [],
        ctaText: page.ctaSection?.label || '',
        buttons: page.ctaSection?.url ? [
          { title: page.ctaSection?.label || 'Get Started', href: page.ctaSection?.url || '/' },
          { title: 'Back to Home', href: '/' },
        ] : [],
        metaTitle: page.seo?.metaTitle || '',
        metaDescription: page.seo?.metaDescription || '',
      };
    }
  }
  return null;
}

// -- Legal Pages --

let snapshotLegalPages: any[] = [];
try {
  snapshotLegalPages = (await import('~/data/content/legal-pages.json')).default as any[] || [];
} catch {}

export function getLegalPage(slug: string) {
  if (snapshotLegalPages.length > 0) {
    return snapshotLegalPages.find((p: any) => p.slug === slug) || null;
  }
  return null;
}

// -- Landing Pages --

export async function getLandingPages(locale?: string) {
  const pages = await resolveLandingPages(locale);
  return pages.filter((p: any) => p._status === 'published' || !p._status);
}

export async function getLandingPagesByType(type: string, locale?: string) {
  const all = await getLandingPages(locale);
  return all.filter((p: any) => p.type === type);
}

export async function getLandingPageBySlug(slug: string, locale?: string) {
  const all = await getLandingPages(locale);
  return all.find((p: any) => p.slug === slug) || null;
}

// -- Image URLs --

export function getImageUrl(url: any) {
  if (!url) return null;
  if (typeof url === 'object' && url.url) return getImageUrl(url.url);
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) return url;
  if (typeof url === 'string') return `https://cdn.simplyenak.com/${url.replace(/^\//, '')}`;
  return null;
}
