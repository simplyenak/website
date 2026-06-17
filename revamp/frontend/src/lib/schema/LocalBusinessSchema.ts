import { z } from 'zod';

/**
 * LocalBusiness schema for Simply Enak
 * Based on schema.org/LocalBusiness
 * Optimized for Malaysian food tour business
 */
export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  description: string;
  image: string | string[];
  url: string;
  telephone: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string;
    opens: string; // HH:MM format
    closes: string; // HH:MM format
  }>;
  priceRange: string;
  servesCuisine: string;
  acceptsReservations: string;
  menu: string;
  hasOfferCatalog: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Tour";
        name: string;
        description: string;
      };
      priceSpecification: {
        "@type": "PriceSpecification";
        price: string;
        priceCurrency: string;
      };
    }>;
  };
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
  sameAs: string[];
}

/**
 * Creates a LocalBusiness schema object for Simply Enak
 * @param data - Content data from JSON snapshots
 * @returns LocalBusinessSchema object
 */
export function createLocalBusinessSchema(data: any): LocalBusinessSchema {
  // Get site settings for business info
  const siteSettings = data.siteSettings || {};
  const homePage = data.homePage || {};
  
  // Default values
  const businessName = siteSettings?.business_name || 'Simply Enak';
  const businessDescription = siteSettings?.business_description || 
    'Malaysian food tour operator offering authentic local food experiences';
  const businessImage = siteSettings?.logo || 
    'https://se-website-images.s3.nl-ams.scw.cloud/SimplyEnak_Logo_optimized_abc123.png';
  const businessUrl = 'https://simplyenak.com';
  const businessPhone = siteSettings?.phone_number || '+603-1234 5678';
  
  // Address (Kuala Lumpur headquarters)
  const address = {
    "@type": "PostalAddress",
    streetAddress: siteSettings?.address_street || '123 Jalan Tengkat Tong Shin',
    addressLocality: siteSettings?.address_city || 'Kuala Lumpur',
    postalCode: siteSettings?.address_postcode || '50200',
    addressCountry: siteSettings?.address_country || 'Malaysia'
  };
  
  // Geo coordinates (KLCC area)
  const geo = {
    "@type": "GeoCoordinates",
    latitude: siteSettings?.latitude || 3.1588,
    longitude: siteSettings?.longitude || 101.7123
  };
  
  // Opening hours (based on typical tour operation hours)
  const openingHoursSpecification = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      opens: "09:00",
      closes: "21:00"
    }
  ];
  
  // Price range based on tour prices (RM 285-359)
  const priceRange = "RM 285-359";
  
  // Cuisine served
  const servesCuisine = "Malaysian";
  
  // Reservations
  const acceptsReservations = "https://schema.org/Yes";
  
  // Menu (tours page)
  const menu = `${businessUrl}/tours/`;
  
  // Offer catalog for tours
  const hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Simply Enak Food Tours",
    itemListElement: []
  };
  
  // Aggregate rating (placeholder - would come from reviews)
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: siteSettings?.average_rating || 4.8,
    reviewCount: siteSettings?.review_count || 1250
  };
  
  // Social media profiles
  const sameAs = [
    siteSettings?.facebook_url || '',
    siteSettings?.instagram_url || '',
    siteSettings?.youtube_url || '',
    siteSettings?.tiktok_url || ''
  ].filter(Boolean);
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description: businessDescription,
    image: [
      businessImage,
      `${businessUrl}/assets/images/tour1.jpg`,
      `${businessUrl}/assets/images/tour2.jpg`
    ],
    url: businessUrl,
    telephone: businessPhone,
    address,
    geo,
    openingHoursSpecification,
    priceRange,
    servesCuisine,
    acceptsReservations,
    menu,
    hasOfferCatalog,
    aggregateRating,
    sameAs
  };
}

/**
 * Zod schema for validation
 */
export const localBusinessSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("LocalBusiness"),
  name: z.string(),
  description: z.string(),
  image: z.union([z.string(), z.array(z.string())]),
  url: z.string().url(),
  telephone: z.string(),
  address: z.object({
    "@type": z.literal("PostalAddress"),
    streetAddress: z.string(),
    addressLocality: z.string(),
    postalCode: z.string(),
    addressCountry: z.string()
  }),
  geo: z.object({
    "@type": z.literal("GeoCoordinates"),
    latitude: z.number(),
    longitude: z.number()
  }),
  openingHoursSpecification: z.array(
    z.object({
      "@type": z.literal("OpeningHoursSpecification"),
      dayOfWeek: z.union([
        z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])),
        z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
      ]),
      opens: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      closes: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    })
  ),
  priceRange: z.string(),
  servesCuisine: z.string(),
  acceptsReservations: z.string(),
  menu: z.string().url(),
  hasOfferCatalog: z.object({
    "@type": z.literal("OfferCatalog"),
    name: z.string(),
    itemListElement: z.array(
      z.object({
        "@type": z.literal("Offer"),
        itemOffered: z.object({
          "@type": z.literal("Tour"),
          name: z.string(),
          description: z.string()
        }),
        priceSpecification: z.object({
          "@type": z.literal("PriceSpecification"),
          price: z.string(),
          priceCurrency: z.string()
        })
      })
    )
  }),
  aggregateRating: z.object({
    "@type": z.literal("AggregateRating"),
    ratingValue: z.number().min(0).max(5),
    reviewCount: z.number().int().nonnegative()
  }),
  sameAs: z.array(z.string().url().optional()).refine(val => val.some(v => v), {
    message: "At least one social media URL must be provided"
  })
});

export type { LocalBusinessSchema };