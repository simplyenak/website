import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.resolve(process.cwd(), '../frontend/src/data/content')

function loadJson(filename) {
  const filepath = path.join(CONTENT_DIR, filename)
  if (!fs.existsSync(filepath)) {
    console.warn(`  ⚠️ File not found: ${filepath}`)
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (err) {
    console.warn(`  ⚠️ Failed to parse ${filepath}: ${err.message}`)
    return null
  }
}

// ─── CLEANUP: DELETE NON-BOOKABLE TOURS ───
async function cleanupTours(payload) {
  console.log('\n🧹 Cleaning up tours...')
  const nonBookable = await payload.find({
    collection: 'tours',
    where: { isBookable: { equals: false } },
    limit: 100,
  })

  let deleted = 0
  for (const tour of nonBookable.docs) {
    try {
      await payload.delete({ collection: 'tours', id: tour.id })
      console.log(`  🗑️  Deleted non-bookable tour: ${tour.slug}`)
      deleted++
    } catch (err) {
      console.error(`  ❌ Failed to delete tour ${tour.slug}: ${err.message}`)
    }
  }

  console.log(`  ✅ Deleted ${deleted} non-bookable tours`)
  return deleted
}

// ─── IMPORT REFERENCE COLLECTIONS ───
async function importReferenceCollection(payload, collection, filename, mapper) {
  console.log(`\n📦 Importing ${collection}...`)
  const data = loadJson(filename)
  if (!data) return { imported: 0, errors: 0, skipped: 0 }

  let imported = 0
  let errors = 0
  let skipped = 0

  for (const item of data) {
    try {
      const mapped = mapper(item)
      if (!mapped) { skipped++; continue }

      const existing = await payload.find({
        collection,
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection, id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated ${collection}: ${mapped.slug}`)
      } else {
        await payload.create({ collection, data: mapped })
        console.log(`  ✅ Created ${collection}: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing ${collection} ${item.slug || item.name}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors, skipped }
}

// ─── IMPORT TOURS (BOOKABLE ONLY) ───
async function importBookableTours(payload) {
  console.log('\n📦 Importing bookable tours...')
  const data = loadJson('tours.json')
  if (!data) return { imported: 0, errors: 0 }

  const bookableTours = data.filter(t => t.isBookable === true)
  console.log(`  Found ${bookableTours.length} bookable tours in JSON`)

  let imported = 0
  let errors = 0

  for (const item of bookableTours) {
    try {
      const mapped = {
        name: item.name,
        slug: item.slug,
        tagline: item.tagline || null,
        shortDescription: item.shortDescription || item.short_description || null,
        fullDescription: item.fullDescription || item.full_description || null,
        price: item.price ? Number(item.price) : null,
        currency: item.currency || 'MYR',
        duration: item.duration || null,
        durationMinutes: item.durationMinutes || item.duration_minutes ? Number(item.durationMinutes || item.duration_minutes) : null,
        location: item.location || null,
        meetingPoint: item.meetingPoint || item.meeting_point || null,
        maxParticipants: item.maxParticipants || item.max_participants ? Number(item.maxParticipants || item.max_participants) : null,
        minParticipants: item.minParticipants || item.min_participants ? Number(item.minParticipants || item.min_participants) : 2,
        tailoredAvailable: item.tailoredAvailable ?? item.tailored_available ?? false,
        tailoredNotes: item.tailoredNotes || item.tailored_notes || null,
        heroImage: null, // Media table is empty
        bookingUrl: item.bookingUrl || item.booking_url || null,
        instantConfirmation: item.instantConfirmation ?? item.instant_confirmation ?? true,
        scheduledPublish: item.scheduledPublish || item.scheduled_publish || null,
        featured: item.featured ?? false,
        popular: item.popular ?? false,
        new: item.new ?? false,
        publishedAt: item.publishedAt || item.published_at || null,
        status: item.status || 'published',
        workflowStatus: item.workflowStatus || item.workflow_status || 'published',
        meta: {
          title: item.meta?.title || null,
          description: item.meta?.description || null,
        },
        isBookable: true,
        ticketingHubId: item.ticketingHubId || item.ticketing_hub_id || null,
        tourFrequency: item.tourFrequency || item.tour_frequency || null,
        dishesCount: item.dishesCount || item.dishes_count ? Number(item.dishesCount || item.dishes_count) : null,
        difficulty: item.difficulty || 'easy',
        walkingDistance: item.walkingDistance || item.walking_distance || null,
        directionsHtml: item.directionsHtml || item.directions_html || null,
        promoVideoUrl: item.promoVideoUrl || item.promo_video_url || null,
        // Arrays
        highlights: (item.highlights || []).map(h =>
          typeof h === 'string' ? { highlight: h } : h
        ),
        whatsIncluded: (item.whatsIncluded || item.whats_included || []).map(i =>
          typeof i === 'string' ? { item: i } : i
        ),
        whatsExcluded: (item.whatsExcluded || item.whats_excluded || []).map(i =>
          typeof i === 'string' ? { item: i } : i
        ),
        // Relationships - skip since target collections are empty
        dietaryOptions: [],
        travelTypes: [],
        specialtyExperiences: [],
        foodItems: [],
      }

      const existing = await payload.find({
        collection: 'tours',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'tours', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated tour: ${mapped.slug}`)
      } else {
        await payload.create({ collection: 'tours', data: mapped })
        console.log(`  ✅ Created tour: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing tour ${item.slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── IMPORT PAGES ───
async function importPages(payload) {
  console.log('\n📦 Importing pages...')
  const data = loadJson('pages.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        title: item.title || item.name || null,
        slug: item.slug,
        type: item.type || 'general',
        status: item.status || 'published',
        location: item.location || null,
        tagline: item.tagline || null,
        heroTitle: item.hero_title || item.heroTitle || null,
        heroSubtitle: item.hero_subtitle || item.heroSubtitle || null,
        heroDescription: item.hero_description || item.heroDescription || null,
        heroImage: null, // Media empty
        shortDescription: item.short_description || item.shortDescription || null,
        fullDescription: item.full_description || item.fullDescription || null,
        highlights: (item.highlights || []).map(h =>
          typeof h === 'string' ? { item: h } : h
        ),
        price: item.price ? String(item.price) : null,
        duration: item.duration ? String(item.duration) : null,
        maxParticipants: item.max_participants || item.maxParticipants ? Number(item.max_participants || item.maxParticipants) : null,
        meta: {
          title: item.meta_title || item.meta?.title || null,
          description: item.meta_description || item.meta?.description || null,
        },
        order: item.order || 0,
      }

      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'pages', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated page: ${mapped.slug}`)
      } else {
        await payload.create({ collection: 'pages', data: mapped })
        console.log(`  ✅ Created page: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing page ${item.slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── IMPORT LANDING PAGES ───
async function importLandingPages(payload) {
  console.log('\n📦 Importing landing pages...')
  const files = [
    { file: 'dietary-landing-pages.json', type: 'dietary' },
    { file: 'location-landing-pages.json', type: 'location' },
    { file: 'specialty-landing-pages.json', type: 'specialty' },
    { file: 'travel-type-landing-pages.json', type: 'travel_type' },
  ]

  let imported = 0
  let errors = 0

  for (const { file, type } of files) {
    const data = loadJson(file)
    if (!data) continue

    for (const item of data) {
      try {
        const mapped = {
          title: item.title || item.dietary_name || item.hero_title || item.slug,
          slug: item.slug,
          type: item.type || type,
          status: item.status || 'published',
          icon: item.icon || null,
          color: item.color || null,
          heroTitle: item.hero_title || null,
          heroSubtitle: item.hero_subtitle || null,
          heroDescription: item.hero_description || null,
          heroImage: null, // Media empty
          introHeading: item.intro_heading || null,
          introContent: item.intro_content || null,
          challengesHeading: item.challenges_heading || null,
          challenges: (item.challenges || []).map(c => ({
            title: c.title || c.heading || '',
            description: c.description || c.content || null,
          })),
          optionsHeading: item.options_heading || null,
          optionsContent: item.options_content || null,
          featuresHeading: item.features_heading || null,
          highlights: (item.highlights || []).map(h => ({
            title: h.title || h.heading || '',
            description: h.description || h.content || null,
          })),
          tipsHeading: item.tips_heading || null,
          tipsContent: item.tips_content || null,
          tips: (item.tips || []).map(t => ({
            title: t.title || t.heading || '',
            content: t.content || t.description || null,
          })),
          safeDishesHeading: item.safe_dishes_heading || null,
          safeDishes: (item.safe_dishes || []).map(d => ({
            name: d.name || d.dish || '',
            description: d.description || null,
          })),
          avoidDishesHeading: item.avoid_dishes_heading || null,
          avoidDishes: (item.avoid_dishes || []).map(d => ({
            name: d.name || d.dish || '',
            description: d.description || null,
          })),
          toursHeading: item.tours_heading || null,
          suitableTours: (item.suitable_tours || []).map(t => ({
            tourSlug: t.tour_slug || t.tourSlug || '',
          })),
          travelTips: (item.travel_tips || []).map(t => ({
            title: t.title || t.heading || '',
            content: t.content || t.description || null,
          })),
          meta: {
            title: item.meta_title || item.meta?.title || null,
            description: item.meta_description || item.meta?.description || null,
          },
          publishedAt: item.published_at || null,
        }

        const existing = await payload.find({
          collection: 'landing_pages',
          where: { slug: { equals: mapped.slug } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({ collection: 'landing_pages', id: existing.docs[0].id, data: mapped })
          console.log(`  🔄 Updated landing page: ${mapped.slug}`)
        } else {
          await payload.create({ collection: 'landing_pages', data: mapped })
          console.log(`  ✅ Created landing page: ${mapped.slug}`)
        }
        imported++
      } catch (err) {
        console.error(`  ❌ Error importing landing page ${item.slug}: ${err.message}`)
        errors++
      }
    }
  }

  return { imported, errors }
}

// ─── IMPORT STORIES ───
async function importStories(payload) {
  console.log('\n📦 Importing stories...')
  const data = loadJson('stories.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || null,
        content: item.content || null,
        status: item.status || 'published',
        featuredImage: null, // Media empty
      }

      const existing = await payload.find({
        collection: 'stories',
        where: { slug: { equals: mapped.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'stories', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated story: ${mapped.slug}`)
      } else {
        await payload.create({ collection: 'stories', data: mapped })
        console.log(`  ✅ Created story: ${mapped.slug}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing story ${item.slug}: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── IMPORT FAQs ───
async function importFAQs(payload) {
  console.log('\n📦 Importing FAQs...')
  const data = loadJson('faqs.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        question: item.question,
        answer: item.answer || null,
        category: item.category || 'general',
        sortOrder: item.sort_order || item.sortOrder || 0,
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'faqs',
        where: { question: { equals: mapped.question } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'faqs', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated FAQ: ${mapped.question.slice(0, 50)}...`)
      } else {
        await payload.create({ collection: 'faqs', data: mapped })
        console.log(`  ✅ Created FAQ: ${mapped.question.slice(0, 50)}...`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing FAQ: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── IMPORT TESTIMONIALS ───
async function importTestimonials(payload) {
  console.log('\n📦 Importing testimonials...')
  const data = loadJson('testimonials.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        name: item.name,
        text: item.text || item.review || null,
        rating: item.rating ? Number(item.rating) : 5,
        source: item.source || 'google',
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'testimonials',
        where: { name: { equals: mapped.name } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'testimonials', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated testimonial: ${mapped.name}`)
      } else {
        await payload.create({ collection: 'testimonials', data: mapped })
        console.log(`  ✅ Created testimonial: ${mapped.name}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing testimonial: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── IMPORT MEDIA COVERAGE ───
async function importMediaCoverage(payload) {
  console.log('\n📦 Importing media coverage...')
  const data = loadJson('media-coverage.json')
  if (!data) return { imported: 0, errors: 0 }

  let imported = 0
  let errors = 0

  for (const item of data) {
    try {
      const mapped = {
        outlet: item.outlet || item.name || null,
        category: item.category || 'print',
        year: item.year ? Number(item.year) : null,
        url: item.url || null,
        logoDomain: item.logo_domain || null,
        status: item.status || 'published',
      }

      const existing = await payload.find({
        collection: 'media_coverage',
        where: { outlet: { equals: mapped.outlet } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'media_coverage', id: existing.docs[0].id, data: mapped })
        console.log(`  🔄 Updated media: ${mapped.outlet}`)
      } else {
        await payload.create({ collection: 'media_coverage', data: mapped })
        console.log(`  ✅ Created media: ${mapped.outlet}`)
      }
      imported++
    } catch (err) {
      console.error(`  ❌ Error importing media: ${err.message}`)
      errors++
    }
  }

  return { imported, errors }
}

// ─── MAIN ───
async function main() {
  console.log('🚀 Cleanup & Content Import Script')
  console.log('====================================\n')

  const payload = await getPayload({ config })
  console.log('✅ Payload initialized\n')

  const results = {}

  // 1. Cleanup
  results.toursDeleted = await cleanupTours(payload)

  // 2. Reference data
  results.dietary_options = await importReferenceCollection(
    payload, 'dietary_options', 'dietary-options.json',
    item => ({
      name: item.name,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
      icon: item.icon || null,
      color: item.color || null,
      description: item.description || null,
      status: item.status || 'published',
    })
  )

  results.travel_types = await importReferenceCollection(
    payload, 'travel_types', 'travel-types.json',
    item => ({
      name: item.name,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
      icon: item.icon || null,
      description: item.description || null,
      status: item.status || 'published',
    })
  )

  results.specialty_experiences = await importReferenceCollection(
    payload, 'specialty_experiences', 'specialty-experiences.json',
    item => ({
      name: item.name,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
      icon: item.icon || null,
      description: item.description || null,
      status: item.status || 'published',
    })
  )

  results.locations = await importReferenceCollection(
    payload, 'locations', 'locations.json',
    item => ({
      name: item.name,
      slug: item.slug || item.name?.toLowerCase().replace(/\s+/g, '-'),
      icon: item.icon || null,
      color: item.color || null,
      description: item.description || null,
      status: item.status || 'published',
    })
  )

  // 3. Main content
  results.tours = await importBookableTours(payload)
  results.pages = await importPages(payload)
  results.landing_pages = await importLandingPages(payload)
  results.stories = await importStories(payload)
  results.faqs = await importFAQs(payload)
  results.testimonials = await importTestimonials(payload)
  results.media_coverage = await importMediaCoverage(payload)

  // Summary
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Import Summary')
  console.log('═══════════════════════════════════════════')
  console.log(`  🗑️  Tours deleted (non-bookable): ${results.toursDeleted}`)
  console.log(`  ✅ Dietary options: ${results.dietary_options.imported}`)
  console.log(`  ✅ Travel types: ${results.travel_types.imported}`)
  console.log(`  ✅ Specialty experiences: ${results.specialty_experiences.imported}`)
  console.log(`  ✅ Locations: ${results.locations.imported}`)
  console.log(`  ✅ Tours (bookable): ${results.tours.imported}`)
  console.log(`  ✅ Pages: ${results.pages.imported}`)
  console.log(`  ✅ Landing pages: ${results.landing_pages.imported}`)
  console.log(`  ✅ Stories: ${results.stories.imported}`)
  console.log(`  ✅ FAQs: ${results.faqs.imported}`)
  console.log(`  ✅ Testimonials: ${results.testimonials.imported}`)
  console.log(`  ✅ Media coverage: ${results.media_coverage.imported}`)
  console.log('═══════════════════════════════════════════')

  const totalErrors = Object.values(results).reduce((sum, r) => sum + (r.errors || 0), 0)
  console.log(`  ❌ Total errors: ${totalErrors}`)
  console.log('═══════════════════════════════════════════')

  process.exit(totalErrors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
