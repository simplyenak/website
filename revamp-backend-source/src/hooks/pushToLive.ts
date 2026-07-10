import type { CollectionAfterChangeHook } from 'payload'

/**
 * When a TourMaster is marked as 'published' (workflowStatus),
 * push its content to the existing Tours (PublishedTours) collection.
 *
 * Uses slug as the matching key — upserts: create if new, update if exists.
 */
export const pushToLive: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  // Prevent infinite loops — skip if this call originated from the hook itself
  if (context?.skipPushToLive) return

  // Only push when workflowStatus is 'published'
  if (doc.workflowStatus !== 'published') return

  const { payload } = req
  if (!doc.slug) return

  // ── Map fields from TourMaster → PublishedTour (existing Tours collection) ──
  const publishedData: Record<string, any> = {
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline || '',
    shortDescription: doc.shortDescription || '',
    fullDescription: doc.fullDescription || '',
    price: doc.price,
    currency: doc.currency || 'MYR',
    duration: doc.duration || '',
    durationMinutes: doc.durationMinutes,
    location: doc.location || '',
    meetingPoint: doc.meetingPoint || '',
    maxParticipants: doc.maxParticipants,
    minParticipants: doc.minParticipants ?? 2,
    dietaryOptions: doc.dietaryOptions?.map((r: any) => (typeof r === 'object' ? r.id : r)) || [],
    travelTypes: doc.travelTypes?.map((r: any) => (typeof r === 'object' ? r.id : r)) || [],
    specialtyExperiences:
      doc.specialtyExperiences?.map((r: any) => (typeof r === 'object' ? r.id : r)) || [],
    foodItems: doc.foodItems?.map((r: any) => (typeof r === 'object' ? r.id : r)) || [],
    tailoredAvailable: doc.tailoredAvailable ?? false,
    tailoredNotes: doc.tailoredNotes || '',
    heroImage: (doc.heroImage && typeof doc.heroImage === 'object') ? doc.heroImage.id : doc.heroImage,
    galleryImages: doc.galleryImages || [],
    whatsIncluded: doc.whatsIncluded || [],
    whatsExcluded: doc.whatsExcluded || [],
    highlights: doc.highlights || [],
    ticketingHubId: doc.ticketingHubId || '',
    isBookable: doc.isBookable ?? false,
    bookingUrl: doc.bookingUrl || '',
    instantConfirmation: doc.instantConfirmation ?? true,
    scheduledPublish: doc.scheduledPublish,
    cancellationPolicy: doc.cancellationPolicy || '',
    tourFrequency: doc.tourFrequency || '',
    startTimes: doc.startTimes || [],
    dishesCount: doc.dishesCount,
    difficulty: doc.difficulty || 'easy',
    walkingDistance: doc.walkingDistance || '',
    directionsHtml: doc.directionsHtml || '',
    itinerary: doc.itinerary || [],
    differentiatorsTourist: doc.differentiatorsTourist || [],
    differentiatorsUs: doc.differentiatorsUs || [],
    whatToBring: doc.whatToBring || [],
    languagesOffered: doc.languagesOffered || [],
    segmentTags: doc.segmentTags || [],
    promoVideoUrl: doc.promoVideoUrl || '',
    galleryImageAlts: doc.galleryImageAlts || [],
    heroImageAlt: doc.heroImageAlt || '',
    featured: doc.featured ?? false,
    popular: doc.popular ?? false,
    new: doc.new ?? false,
    badgeLabel: doc.badgeLabel || '',
    publishedAt: doc.publishedAt || new Date().toISOString(),
    status: 'published',
  }

  try {
    // Check if a published tour with this slug already exists
    const existing = await payload.find({
      collection: 'tours',
      where: { slug: { equals: doc.slug } },
      limit: 1,
      depth: 0,
      req,
    })

    if (existing.docs.length > 0) {
      // Update existing
      const updated = await payload.update({
        collection: 'tours',
        id: existing.docs[0].id,
        data: publishedData as any,
        draft: false,
        context: { skipPushToLive: true },
        req,
      })

      // Update TourMaster with publishedTourId
      await payload.update({
        collection: 'tour-masters',
        id: doc.id,
        data: { publishedTourId: updated.id } as any,
        context: { skipPushToLive: true },
        req,
      })
    } else {
      // Create new
      const created = await payload.create({
        collection: 'tours',
        data: publishedData as any,
        draft: false,
        context: { skipPushToLive: true },
        req,
      })

      // Set publishedTourId on the new record
      await payload.update({
        collection: 'tour-masters',
        id: doc.id,
        data: { publishedTourId: created.id } as any,
        context: { skipPushToLive: true },
        req,
      })
    }

    // Update lastPushedAt on the TourMaster
    await payload.update({
      collection: 'tour-masters',
      id: doc.id,
      data: { lastPushedAt: new Date().toISOString() } as any,
      context: { skipPushToLive: true },
      req,
    })
  } catch (err: any) {
    req.payload.logger.error(
      `[pushToLive] Failed to push tour "${doc.slug}": ${err.message}`
    )
  }
}
