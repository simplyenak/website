/**
 * Site-wide Configuration
 * 
 * Reads from Payload CMS JSON snapshots (synced via `npm run sync`).
 * Falls back to hardcoded defaults if snapshots are unavailable.
 * 
 * After a sync, ALL values come from Payload. No static data.
 */

import siteSettingsData from '@/data/content/site-settings.json'

/**
 * Read a value from the synced Payload snapshot.
 * Falls back to the provided default if the snapshot is empty or the key is missing.
 */
function getSetting<T>(key: keyof typeof siteSettingsData, fallback: T): T {
  const val = (siteSettingsData as any)[key]
  return (val !== undefined && val !== null && val !== '') ? val as T : fallback
}

/**
 * Read a nested property from siteSettingsData.social_* fields.
 */
function getSocial(key: string, fallback: string): string {
  return getSetting(`social_${key}` as any, fallback)
}

// ── Site Config (all values from Payload, fallback to hardcoded) ──

export const siteConfig = {
  // Tour Pricing
  tourPrice: {
    amount: getSetting('tour_price', 285),
    currency: getSetting('tour_currency', 'MYR'),
    get display(): string { return `${this.currency} ${this.amount}` },
  },
  
  // Tour Capacity
  maxPeoplePerTour: getSetting('max_people_per_tour', 8),
  
  // Tour Duration
  tourDuration: getSetting('tour_duration', '4–5 hours'),
  
  // Forms — default to Cloudflare Worker endpoint; override via Payload settings or PUBLIC_FORMS_WEBHOOK env var
  formsWebhookUrl: getSetting('forms_webhook_url', 'https://simply-enak-forms.workers.dev/api/contact'),

  // Contact
  whatsappNumber: getSetting('whatsapp_number', '+60172878929'),
  /** WhatsApp number stripped to digits-only for wa.me links */
  get whatsappDigits(): string {
    return (this.whatsappNumber as string).replace(/\D/g, '');
  },
  phone: getSetting('contact_phone', '+60 17-287 8929'),
  email: getSetting('contact_email', 'booking@simplyenak.com'),
  
  // Business Hours
  businessHours: getSetting('business_hours', 'Mon – Sun: 9:00 – 20:00'),
  
  // Social Links
  social: {
    facebook: getSocial('facebook', 'https://www.facebook.com/SimplyEnak'),
    instagram: getSocial('instagram', 'https://www.instagram.com/simply.enak/'),
    youtube: getSocial('youtube', 'https://www.youtube.com/channel/UCgRvAZ86vyYwkk6-bvnDRCg'),
    tripadvisor: getSocial('tripadvisor', ''),
    tripadvisorPenang: getSocial('tripadvisor_penang', ''),
    linkedinCompany: getSocial('linkedin_company', ''),
    linkedinMaarten: getSocial('linkedin_maarten', ''),
    linkedinPauline: getSocial('linkedin_pauline', ''),
  },
  
  // Company Info
  company: {
    name: getSetting('site_name', 'Simply Enak'),
    tagline: getSetting('tagline', 'Food Tours That Reveal Malaysian Culture & Heritage'),
    established: getSetting('company_established', 2011),
    registrationNo: getSetting('registration_no', ''),
  },
  
  // Tour Features (social proof)
  tourFeatures: {
    heritageVendors: getSetting('heritage_vendors_count', '40+'),
    yearsOperating: getSetting('years_operating', '14+'),
    guestsHosted: getSetting('guests_hosted', '5,000+'),
    rating: getSetting('rating', '4.9'),
    reviewCount: getSetting('review_count', '5000+'),
  },

  // Press
  press: {
    natgeo: getSetting('press_natgeo_url', ''),
    lonelyplanet: getSetting('press_lonelyplanet_url', ''),
    cnn: getSetting('press_cnn_url', ''),
    routard: getSetting('press_routard_url', ''),
    timeoutPenang: getSetting('press_timeout_penang_url', ''),
  },

  // Navigation (from Payload menus)
  bookingUrl: getSetting('booking_url', ''),
};

/**
 * Helper function to format price
 */
export function formatPrice(amount?: number, currency?: string): string {
  const amt = amount ?? siteConfig.tourPrice.amount;
  const curr = currency ?? siteConfig.tourPrice.currency;
  const display = curr === 'MYR' ? 'RM' : curr;
  return `${display} ${amt}`;
}

/**
 * Helper function to format max people text
 */
export function formatMaxPeople(count?: number): string {
  const max = count ?? siteConfig.maxPeoplePerTour;
  return `Max ${max} people`;
}

/**
 * Helper function to format duration
 */
export function formatDuration(): string {
  return siteConfig.tourDuration;
}

/**
 * Helper function to format complete price info
 */
export function formatPriceInfo(): string {
  return `From ${formatPrice()} · ${formatDuration()} · ${formatMaxPeople()}`;
}
