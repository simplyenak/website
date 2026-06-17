import { z } from 'zod';

/**
 * Tour schema for Simply Enak individual tour pages
 * Based on schema.org/TouristTrip
 * Optimized for food tour specifics
 */
export interface TourSchema {
  "@context": "https://schema.org";
  "@type": "TouristTrip";
  name: string;
  description: string;
  image: string | string[];
  tourOperator: {
    "@type": "Organization";
    name: string;
    url: string;
    sameAs: string[];
  };
  itinerary: string;
  duration: string; // ISO 8601 duration format (e.g., "PT4H" for 4 hours)
  distance: {
    "@type": "Distance";
    value: number;
    unitCode: string; // KMT for kilometers, SMI for statute miles
  };
  tourType: string[]; // e.g., ["FoodTour", "WalkingTour", "CulturalTour"]
  offers: {
    "@type": "Offer";
    priceSpecification: {
      "@type": "PriceSpecification";
      price: string;
      priceCurrency: string;
      valueAddedTaxIncluded: boolean;
    };
    availability: "https://schema.org/InStock" | "https://schema.org/PreOrder";
    url: string;
    itemCondition: "https://schema.org/NewCondition";
  };
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
  review: {
    "@type": "Review";
    reviewRating: {
      "@type": "Rating";
      ratingValue: number;
      bestRating: number;
      worstRating: number;
    };
    author: {
      "@type": "Person";
      name: string;
    };
    datePublished: string; // ISO date
    reviewBody: string;
  }[];
  availableLanguage: string[]; // e.g., ["en", "ms", "zh"]
  suitableForAudience: string[]; // e.g., ["Families", "Couples", "Solo travelers"]
  activitySchedule: {
    "@type": "Schedule";
    repeats: string; // e.g., "Weekly", "Daily"
    byDay: string[]; // e.g., ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
  sameAs: string[];
}

/**
 * Creates a Tour schema object for Simply Enak
 * @param tourData - Tour data from JSON snapshots
 * @param siteSettings - Site settings for operator info
 * @returns TourSchema object
 */
export function createTourSchema(tourData: any, siteSettings: any): TourSchema {
  // Default values
  const tourName = tourData?.name || 'Unnamed Tour';
  const tourDescription = tourData?.description || 'A delightful food tour experience';
  const tourImage = tourData?.hero_image || 
    'https://se-website-images.s3.nl-ams.scw.cloud/Food_Tour_Default_optimized_xyz789.jpg';
  const tourSlug = tourData?.slug || 'tour';
  const tourUrl = `https://simplyenak.com/tours/${tourSlug}/`;
  
  // Operator info
  const operatorName = siteSettings?.business_name || 'Simply Enak';
  const operatorUrl = 'https://simplyenak.com';
  const operatorSameAs = [
    siteSettings?.facebook_url || '',
    siteSettings?.instagram_url || '',
    siteSettings?.youtube_url || '',
    siteSettings?.tiktok_url || ''
  ].filter(Boolean);
  
  // Duration (convert from minutes to ISO 8601)
  const durationMinutes = tourData?.duration || 180; // Default 3 hours
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationISO = `PT${hours}H${minutes > 0 ? minutes + 'M' : ''}`;
  
  // Distance (estimated walking distance)
  const distanceValue = tourData?.walking_distance_km || 3.5; // Default 3.5km
  
  // Tour types
  const tourTypes = ["FoodTour", "WalkingTour"];
  if (tourData?.includes_market_visit) tourTypes.push("MarketTour");
  if (tourData?.includes_cooking_demo) tourTypes.push("CookingClass");
  if (tourData?.cultural_focus) tourTypes.push("CulturalTour");
  
  // Pricing
  const price = tourData?.price || 285; // Default price
  const currency = tourData?.currency || "MYR";
  
  // Aggregate rating (would come from reviews)
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: tourData?.average_rating || 4.8,
    reviewCount: tourData?.review_count || 42
  };
  
  // Sample review (in real implementation, would fetch actual reviews)
  const review = tourData?.sample_review ? [{
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: tourData?.sample_review_rating || 5,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      "@type": "Person",
      name: tourData?.sample_review_author || "Happy Customer"
    },
    datePublished: tourData?.sample_review_date || "2024-01-15",
    reviewBody: tourData?.sample_review_text || "Amazing food tour! Highly recommend."
  }] : [];
  
  // Available languages
  const availableLanguage = ["en", "ms"]; // English and Malay default
  if (tourData?.available_languages?.includes('zh')) availableLanguage.push('zh');
  if (tourData?.available_languages?.includes('fr')) availableLanguage.push('fr');
  
  // Suitable audience
  const suitableForAudience = ["Food lovers", "Culture enthusiasts"];
  if (tourData?.family_friendly) suitableForAudience.push("Families");
  if (tourData?.vegetarian_options) suitableForAudience.push("Vegetarians");
  
  // Activity schedule (when tours typically run)
  const activitySchedule = {
    "@type": "Schedule",
    repeats: "Weekly",
    byDay: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], // Daily
    startTime: "09:00", // 9 AM start
    endTime: `${hours + 9}:${minutes.toString().padStart(2, '0')}` // End time based on duration
  };
  
  // Social media
  const sameAs = [
    `${tourUrl}facebook`,
    `${tourUrl}instagram`
  ];
  
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tourName,
    description: tourDescription,
    image: [
      tourImage,
      `${tourUrl}images/cover.jpg`,
      `${tourUrl}images/gallery1.jpg`
    ],
    tourOperator: {
      "@type": "Organization",
      name: operatorName,
      url: operatorUrl,
      sameAs: operatorSameAs
    },
    itinerary: tourData?.itinerary || 'Explore local food spots with expert guide',
    duration: durationISO,
    distance: {
      "@type": "Distance",
      value: distanceValue,
      unitCode: "KMT" // Kilometers
    },
    tourType: tourTypes,
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: price.toString(),
        priceCurrency: currency,
        valueAddedTaxIncluded: true
      },
      availability: "https://schema.org/InStock",
      url: tourUrl,
      itemCondition: "https://schema.org/NewCondition"
    },
    aggregateRating: aggregateRating,
    review: review,
    availableLanguage: availableLanguage,
    suitableForAudience: suitableForAudience,
    activitySchedule: activitySchedule,
    sameAs: sameAs
  };
}

/**
 * Zod schema for validation
 */
export const tourSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("TouristTrip"),
  name: z.string(),
  description: z.string(),
  image: z.union([z.string(), z.array(z.string())]),
  tourOperator: z.object({
    "@type": z.literal("Organization"),
    name: z.string(),
    url: z.string().url(),
    sameAs: z.array(z.string().url())
  }),
  itinerary: z.string(),
  duration: z.string().regex(/^P(?:[0-9]+Y)?(?:[0-9]+M)?(?:[0-9]+W)?(?:[0-9]+D)?(?:T(?:[0-9]+H)?(?:[0-9]+M)?(?:[0-9]+S)?)?$/),
  distance: z.object({
    "@type": z.literal("Distance"),
    value: z.number().positive(),
    unitCode: z.union([z.literal("KMT"), z.literal("SMI")]) // Kilometers or Statute Miles
  }),
  tourType: z.array(z.string()).nonempty(),
  offers: z.object({
    "@type": z.literal("Offer"),
    priceSpecification: z.object({
      "@type": z.literal("PriceSpecification"),
      price: z.string(),
      priceCurrency: z.string(),
      valueAddedTaxIncluded: z.boolean()
    }),
    availability: z.union([
      z.literal("https://schema.org/InStock"),
      z.literal("https://schema.org/PreOrder"),
      z.literal("https://schema.org/OutOfStock")
    ]),
    url: z.string().url(),
    itemCondition: z.literal("https://schema.org/NewCondition")
  }),
  aggregateRating: z.object({
    "@type": z.literal("AggregateRating"),
    ratingValue: z.number().min(0).max(5),
    reviewCount: z.number().int().nonnegative()
  }),
  review: z.array(
    z.object({
      "@type": z.literal("Review"),
      reviewRating: z.object({
        "@type": z.literal("Rating"),
        ratingValue: z.number().min(0).max(5),
        bestRating: z.number().int().positive(),
        worstRating: z.number().int().nonnegative()
      }),
      author: z.object({
        "@type": z.literal("Person"),
        name: z.string()
      }),
      datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      reviewBody: z.string()
    })
  ),
  availableLanguage: z.array(
    z.union([
      z.literal("en"),
      z.literal("ms"),
      z.literal("zh"),
      z.literal("fr"),
      z.literal("de"),
      z.literal("es"),
      z.literal("ja"),
      z.literal("pt")
    ])
  ).nonempty(),
  suitableForAudience: z.array(z.string()).nonempty(),
  activitySchedule: z.object({
    "@type": z.literal("Schedule"),
    repeats: z.string(),
    byDay: z.array(
      z.union([
        z.literal("Mo"),
        z.literal("Tu"),
        z.literal("We"),
        z.literal("Th"),
        z.literal("Fr"),
        z.literal("Sa"),
        z.literal("Su")
      ])
    ).nonempty(),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  sameAs: z.array(z.string().url())
});

export type { TourSchema };