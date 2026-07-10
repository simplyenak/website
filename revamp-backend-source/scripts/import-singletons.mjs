#!/usr/bin/env node
/**
 * Import missing singleton collections into Payload
 * Handles localized fields and upload fields correctly
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const match = envContent.match(/^PAYLOAD_SECRET=(.+)$/m)
  if (match) process.env.PAYLOAD_SECRET = match[1].trim()
  const dbMatch = envContent.match(/^DATABASE_URL=(.+)$/m)
  if (dbMatch) process.env.DATABASE_URL = dbMatch[1].trim()
}

const CONTENT_DIR = path.resolve(__dirname, '../../frontend/src/data/content')

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) return null
  return JSON.parse(fs.readFileSync(filepath, 'utf8'))
}

// Wrap localized text fields into { en: value } format
function loc(value) {
  if (!value) return undefined
  return { en: value }
}

async function main() {
  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  const users = await payload.find({ collection: 'users', limit: 1 })
  const adminUser = users.docs[0]

  // ─── SITE SETTINGS ───
  console.log('⚙️  Importing site_settings...')
  const settingsData = loadJson('site-settings.json')
  if (settingsData) {
    // Only include fields that exist in the schema and the JSON
    const data = {
      site_name: settingsData.site_name || 'Simply Enak',
      tagline: loc(settingsData.tagline),
      description: loc(settingsData.description),
      company_established: settingsData.company_established ? Number(settingsData.company_established) : undefined,
      registration_no: settingsData.registration_no || undefined,
      tour_price: settingsData.tour_price ? Number(settingsData.tour_price) : undefined,
      tour_currency: settingsData.tour_currency || 'MYR',
      max_people_per_tour: settingsData.max_people_per_tour ? Number(settingsData.max_people_per_tour) : undefined,
      tour_duration: settingsData.tour_duration || undefined,
      heritage_vendors_count: settingsData.heritage_vendors_count || undefined,
      years_operating: settingsData.years_operating || undefined,
      guests_hosted: settingsData.guests_hosted || undefined,
      rating: settingsData.rating || undefined,
      review_count: settingsData.review_count || undefined,
      contact_email: settingsData.contact_email || undefined,
      contact_phone: settingsData.contact_phone || undefined,
      whatsapp_number: settingsData.whatsapp_number || undefined,
      business_hours: loc(settingsData.business_hours),
      address: loc(settingsData.address),
      forms_webhook_url: settingsData.forms_webhook_url || undefined,
      social_facebook: settingsData.social_facebook || undefined,
      social_instagram: settingsData.social_instagram || undefined,
      social_youtube: settingsData.social_youtube || undefined,
      social_tripadvisor: settingsData.social_tripadvisor || undefined,
      social_tripadvisor_penang: settingsData.social_tripadvisor_penang || undefined,
      social_linkedin_company: settingsData.social_linkedin_company || undefined,
      social_linkedin_maarten: settingsData.social_linkedin_maarten || undefined,
      social_linkedin_pauline: settingsData.social_linkedin_pauline || undefined,
      // og_image and hero_image are upload fields — skip (no media in staging)
      booking_url: settingsData.booking_url || undefined,
      main_navigation: settingsData.main_navigation || undefined,
      mobile_navigation: settingsData.mobile_navigation || undefined,
      footer_navigation: settingsData.footer_navigation || undefined,
      footer_copyright_text: loc(settingsData.footer_copyright_text),
      sub_page_menus: settingsData.sub_page_menus || undefined,
      show_vendors: settingsData.show_vendors ?? undefined,
      show_values: settingsData.show_values ?? undefined,
      guide_image: null, // upload field, no media
      guide_image_alt: settingsData.guide_image_alt || undefined,
      guide_heading: settingsData.guide_heading || undefined,
      guide_body: settingsData.guide_body || undefined,
      travellers_choice_year: settingsData.travellers_choice_year ? Number(settingsData.travellers_choice_year) : undefined,
      currency_usd_rate: settingsData.currency_usd_rate ? Number(settingsData.currency_usd_rate) : undefined,
      currency_aud_rate: settingsData.currency_aud_rate ? Number(settingsData.currency_aud_rate) : undefined,
      countries_served: settingsData.countries_served || undefined,
      label_the_experience: settingsData.label_the_experience || undefined,
      label_straight_from_guests: settingsData.label_straight_from_guests || undefined,
      label_stop_by_stop: settingsData.label_stop_by_stop || undefined,
      label_why_join_us: settingsData.label_why_join_us || undefined,
      label_the_full_story: settingsData.label_the_full_story || undefined,
      label_on_the_tour: settingsData.label_on_the_tour || undefined,
      label_the_people: settingsData.label_the_people || undefined,
      label_private_tailored: settingsData.label_private_tailored || undefined,
      label_what_you_get: settingsData.label_what_you_get || undefined,
      label_where_to_find_us: settingsData.label_where_to_find_us || undefined,
      label_good_to_know: settingsData.label_good_to_know || undefined,
      label_common_questions: settingsData.label_common_questions || undefined,
      label_background: settingsData.label_background || undefined,
      label_come_with_us: settingsData.label_come_with_us || undefined,
      label_insider_guides: settingsData.label_insider_guides || undefined,
      label_local_specialties: settingsData.label_local_specialties || undefined,
      label_food_culture: settingsData.label_food_culture || undefined,
      label_culture_heritage: settingsData.label_culture_heritage || undefined,
      label_vendor_stories: settingsData.label_vendor_stories || undefined,
      label_walk_it_with_us: settingsData.label_walk_it_with_us || undefined,
      label_stay_in_loop: settingsData.label_stay_in_loop || undefined,
      label_good_for: settingsData.label_good_for || undefined,
      main_tour_slugs: settingsData.main_tour_slugs || undefined,
      // SEO
      meta_title: loc(settingsData.meta_title),
      meta_description: loc(settingsData.meta_description),
      contact_page_title: loc(settingsData.contact_page_title),
      contact_page_description: loc(settingsData.contact_page_description),
      corporate_page_title: loc(settingsData.corporate_page_title),
      corporate_page_content: loc(settingsData.corporate_page_content),
      faq_page_title: loc(settingsData.faq_page_title),
      faq_page_description: loc(settingsData.faq_page_description),
      // Guide
      guide_meta_description: loc(settingsData.guide_meta_description),
      guide_max_bio_length: settingsData.guide_max_bio_length ? Number(settingsData.guide_max_bio_length) : undefined,
      guide_max_education_length: settingsData.guide_max_education_length ? Number(settingsData.guide_max_education_length) : undefined,
      guide_max_expertise_length: settingsData.guide_max_expertise_length ? Number(settingsData.guide_max_expertise_length) : undefined,
      guide_max_highlight_length: settingsData.guide_max_highlight_length ? Number(settingsData.guide_max_highlight_length) : undefined,
      guide_max_personality_length: settingsData.guide_max_personality_length ? Number(settingsData.guide_max_personality_length) : undefined,
      guide_max_testimonial_length: settingsData.guide_max_testimonial_length ? Number(settingsData.guide_max_testimonial_length) : undefined,
      // Currency rates
      currency_rate_usd: settingsData.currency_rate_usd ? Number(settingsData.currency_rate_usd) : undefined,
      currency_rate_eur: settingsData.currency_rate_eur ? Number(settingsData.currency_rate_eur) : undefined,
      currency_rate_gbp: settingsData.currency_rate_gbp ? Number(settingsData.currency_rate_gbp) : undefined,
      currency_rate_sgd: settingsData.currency_rate_sgd ? Number(settingsData.currency_rate_sgd) : undefined,
      currency_rate_aud: settingsData.currency_rate_aud ? Number(settingsData.currency_rate_aud) : undefined,
      currency_rate_cad: settingsData.currency_rate_cad ? Number(settingsData.currency_rate_cad) : undefined,
      currency_rate_chf: settingsData.currency_rate_chf ? Number(settingsData.currency_rate_chf) : undefined,
      currency_rate_cny: settingsData.currency_rate_cny ? Number(settingsData.currency_rate_cny) : undefined,
      currency_rates_fetched_at: settingsData.currency_rates_fetched_at || undefined,
      // Analytics
      google_analytics_id: settingsData.google_analytics_id || undefined,
      google_tag_manager_id: settingsData.google_tag_manager_id || undefined,
      facebook_pixel_id: settingsData.facebook_pixel_id || undefined,
      head_scripts: settingsData.head_scripts || undefined,
      meta_facebook_verification: settingsData.meta_facebook_verification || undefined,
      // Nav
      press_natgeo_url: settingsData.press_natgeo_url || undefined,
      press_lonelyplanet_url: settingsData.press_lonelyplanet_url || undefined,
      press_cnn_url: settingsData.press_cnn_url || undefined,
      press_routard_url: settingsData.press_routard_url || undefined,
      press_timeout_penang_url: settingsData.press_timeout_penang_url || undefined,
      gmb_kl_url: settingsData.gmb_kl_url || undefined,
      gmb_penang_url: settingsData.gmb_penang_url || undefined,
      // Cookie banner
      analytics_type: settingsData.analytics_type || undefined,
      cookie_banner_enabled: settingsData.cookie_banner_enabled ?? undefined,
      cookie_banner_message: settingsData.cookie_banner_message || undefined,
      cookie_banner_privacy_link: settingsData.cookie_banner_privacy_link || undefined,
      cookie_banner_decline_text: settingsData.cookie_banner_decline_text || undefined,
      cookie_banner_accept_text: settingsData.cookie_banner_accept_text || undefined,
      // Newsletter
      newsletter_success_message: settingsData.newsletter_success_message || undefined,
      newsletter_placeholder_text: settingsData.newsletter_placeholder_text || undefined,
      newsletter_section_heading: settingsData.newsletter_section_heading || undefined,
      newsletter_submit_button: settingsData.newsletter_submit_button || undefined,
      // WhatsApp
      whatsapp_button_label: settingsData.whatsapp_button_label || undefined,
      whatsapp_greeting_message: settingsData.whatsapp_greeting_message || undefined,
    }

    try {
      const existing = await payload.find({ collection: 'site_settings', limit: 1 })
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'site_settings', id: existing.docs[0].id, data })
        console.log('  🔄 Updated site_settings')
      } else {
        await payload.create({ collection: 'site_settings', data })
        console.log('  ✅ Created site_settings')
      }
    } catch (err) {
      console.error(`  ❌ site_settings: ${err.message}`)
    }
  }

  // ─── CONTACT PAGE ───
  console.log('\n📄 Importing contact_page...')
  const contactData = loadJson('contact-page.json')
  if (contactData) {
    const data = {
      title: contactData.title || null,
      slug: contactData.slug || 'contact',
      hero_title: loc(contactData.hero_title),
      hero_subtitle: loc(contactData.hero_subtitle),
      hero_description: loc(contactData.hero_description),
      hero_image: null, // upload field, no media
      intro_title: loc(contactData.intro_title),
      intro_subtitle: loc(contactData.intro_subtitle),
      contact_email: contactData.contact_email || null,
      contact_phone: contactData.contact_phone || null,
      whatsapp_number: contactData.whatsapp_number || null,
      contact_hours: loc(contactData.contact_hours),
      social_facebook: contactData.social_facebook || null,
      social_instagram: contactData.social_instagram || null,
      faq_content: loc(contactData.faq_content),
      meta: {
        title: contactData.meta_title || contactData.meta?.title || null,
        description: contactData.meta_description || contactData.meta?.description || null,
      },
      status: 'published',
    }
    try {
      const existing = await payload.find({ collection: 'contact_page', limit: 1 })
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'contact_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated contact_page')
      } else {
        await payload.create({ collection: 'contact_page', data })
        console.log('  ✅ Created contact_page')
      }
    } catch (err) {
      console.error(`  ❌ contact_page: ${err.message}`)
    }
  }

  // ─── ABOUT PAGE ───
  console.log('\n📄 Importing about_page...')
  const aboutData = loadJson('about-page.json')
  if (aboutData) {
    const data = {
      title: aboutData.title || null,
      slug: aboutData.slug || 'about',
      hero_title: loc(aboutData.hero_title),
      hero_subtitle: loc(aboutData.hero_subtitle),
      hero_description: loc(aboutData.hero_description),
      hero_image: null,
      short_description: loc(aboutData.short_description),
      full_description: loc(aboutData.full_description),
      highlights: (aboutData.highlights || []).map(h => typeof h === 'string' ? { item: h } : h),
      meta: {
        title: aboutData.meta_title || aboutData.meta?.title || null,
        description: aboutData.meta_description || aboutData.meta?.description || null,
      },
      status: 'published',
    }
    try {
      const existing = await payload.find({ collection: 'about_page', limit: 1 })
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'about_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated about_page')
      } else {
        await payload.create({ collection: 'about_page', data })
        console.log('  ✅ Created about_page')
      }
    } catch (err) {
      console.error(`  ❌ about_page: ${err.message}`)
    }
  }

  // ─── HOMEPAGE ───
  console.log('\n🏠 Importing home_page...')
  const homeData = loadJson('home-page.json')
  if (homeData) {
    const data = {
      heroSection: homeData.heroSection || homeData.hero_section || null,
      manifestoSection: homeData.manifestoSection || homeData.manifesto_section || null,
      pillarsSection: homeData.pillarsSection || homeData.pillars_section || null,
      vendorsSection: homeData.vendorsSection || homeData.vendors_section || null,
      segmentsSection: homeData.segmentsSection || homeData.segments_section || null,
      aboutSection: homeData.aboutSection || homeData.about_section || null,
      expectSection: homeData.expectSection || homeData.expect_section || null,
      ctaSection: homeData.ctaSection || homeData.cta_section || null,
      testimonialPlatformBadges: homeData.testimonialPlatformBadges || homeData.testimonial_platform_badges || null,
      faqs: homeData.faqs || null,
      whyUsSection: homeData.whyUsSection || homeData.why_us_section || null,
      bookingGuaranteesSection: homeData.bookingGuaranteesSection || homeData.booking_guarantees_section || null,
      meta_title: homeData.meta_title || null,
      meta_description: homeData.meta_description || null,
    }
    try {
      const existing = await payload.find({ collection: 'home_page', limit: 1 })
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'home_page', id: existing.docs[0].id, data })
        console.log('  🔄 Updated home_page')
      } else {
        await payload.create({ collection: 'home_page', data })
        console.log('  ✅ Created home_page')
      }
    } catch (err) {
      console.error(`  ❌ home_page: ${err.message}`)
    }
  }

  // ─── VERIFY ───
  console.log('\n══════════════════════════════════════')
  console.log('📊 Verification')
  console.log('══════════════════════════════════════')
  const collections = ['home_page', 'site_settings', 'about_page', 'contact_page', 'tours', 'stories', 'faqs', 'testimonials']
  for (const col of collections) {
    try {
      const result = await payload.find({ collection: col, limit: 1 })
      console.log(`  ${result.totalDocs > 0 ? '✅' : '❌'} ${col}: ${result.totalDocs} doc(s)`)
    } catch (err) {
      console.log(`  ❌ ${col}: error - ${err.message}`)
    }
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })