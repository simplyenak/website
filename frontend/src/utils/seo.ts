// SEO utility functions for generating structured data and meta information

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  logo: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  businessInfo: {
    name: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressCountry: string;
    };
    geo?: {
      latitude: string;
      longitude: string;
    };
    telephone: string;
    priceRange: string;
    openingHours: {
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];
    aggregateRating?: {
      ratingValue: string;
      reviewCount: string;
      bestRating: string;
      worstRating: string;
    };
  };
}

export const seoConfig: SEOConfig = {
  siteName: "Simply Enak",
  siteUrl: "https://simplyenak.com",
  defaultTitle: "Simply Enak – Food Tours and more",
  defaultDescription:
    "Simply Enak offers premium Malaysian food tours in Kuala Lumpur, Penang and beyond. Authentic culinary, cultural and historical experiences guided by locals.",
  defaultImage: "https://simplyenak.com/og-image.jpg",
  logo: "https://simplyenak.com/logo.png",
  socialLinks: {
    facebook: "https://www.facebook.com/simplyenak",
    instagram: "https://www.instagram.com/simplyenak",
    linkedin: "https://www.linkedin.com/company/simply-enak",
    tripadvisorKL: "https://www.tripadvisor.com/Attraction_Review-g298570-d2328058-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html",
    tripadvisorPenang: "https://www.tripadvisor.com/Attraction_Review-g660694-d8400895-Reviews-Simply_Enak_Food_Experiences-Penang_Island_Penang.html",
    viator: "https://www.viator.com/tours/Penang-Island/Eat-Drink-Georgetown/d50882-17908P1",
    getyourguide: "https://www.getyourguide.com/simply-enak-food-experiences-s4050/",
    // Note: Klook listing not found - may need to be added manually if it exists
  },
  businessInfo: {
    name: "Simply Enak",
    address: {
      streetAddress: "Kuala Lumpur City Centre",
      addressLocality: "Kuala Lumpur",
      addressCountry: "MY",
    },
    geo: {
      latitude: "3.1570",
      longitude: "101.7123",
    },
    telephone: "+60 017 287 8929",
    priceRange: "$$",
    openingHours: [
      {
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "22:00",
      },
    ],
    // TripAdvisor 5-star rating with Certificate of Excellence
    aggregateRating: {
      ratingValue: "5",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  },
};

// Location-specific coordinates for multi-city operations
export const locations = {
  kualaLumpur: {
    name: "Kuala Lumpur",
    address: {
      streetAddress: "Kuala Lumpur City Centre",
      addressLocality: "Kuala Lumpur",
      addressRegion: "Federal Territory of Kuala Lumpur",
      addressCountry: "MY",
      postalCode: "50088",
    },
    geo: {
      latitude: "3.1570",
      longitude: "101.7123",
    },
    // Google My Business profile URL
    hasMap: "https://www.google.com/search?kgmid=/g/11_rl_t5r&q=Kuala+Lumpur+Food+Tours+by+Simply+Enak",
  },
  georgetown: {
    name: "Georgetown, Penang",
    address: {
      streetAddress: "Georgetown Heritage Area",
      addressLocality: "Georgetown",
      addressRegion: "Penang",
      addressCountry: "MY",
      postalCode: "10200",
    },
    geo: {
      latitude: "5.4141",
      longitude: "100.3288",
    },
    // Google My Business profile URL
    hasMap: "https://www.google.com/search?kgmid=/g/11f9xlvcb1&q=Penang+Food+Tours+by+Simply+Enak",
  },
};

// Generate structured data for tours/services
export function generateTourStructuredData(tour: {
  name: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image?: string;
  url: string;
  availability?: string;
  rating?: {
    ratingValue: string;
    reviewCount: string;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}) {
  const structuredData: any = {
    "@type": "Service",
    serviceType: "Food Tour",
    name: tour.name,
    description: tour.description,
    image: tour.image || seoConfig.defaultImage,
    url: tour.url,
    provider: {
      "@type": "LocalBusiness",
      name: seoConfig.siteName,
      "@id": "https://simplyenak.com/#localbusiness",
    },
    areaServed: {
      "@type": "City",
      name: tour.location,
      ...(tour.location.toLowerCase().includes("kuala lumpur") && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: locations.kualaLumpur.geo.latitude,
          longitude: locations.kualaLumpur.geo.longitude,
        },
      }),
      ...(tour.location.toLowerCase().includes("penang") ||
      tour.location.toLowerCase().includes("georgetown")
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: locations.georgetown.geo.latitude,
              longitude: locations.georgetown.geo.longitude,
            },
          }
        : {}),
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "MYR",
      availability: tour.availability || "https://schema.org/InStock",
      url: tour.url,
      validFrom: new Date().toISOString(),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Duration",
        value: tour.duration,
      },
      {
        "@type": "PropertyValue",
        name: "Location",
        value: tour.location,
      },
    ],
  };

  // Add aggregate rating if provided
  if (tour.rating) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      itemReviewed: {
        "@type": "Service",
        name: tour.name
      },
      ratingValue: tour.rating.ratingValue,
      reviewCount: tour.rating.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  // Add reviews if provided
  if (tour.reviews && tour.reviews.length > 0) {
    structuredData.review = tour.reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    }));
  }

  return structuredData;
}

// Generate structured data for articles/stories
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  return {
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || seoConfig.defaultImage,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author || seoConfig.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: seoConfig.logo,
      },
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate review/rating structured data
export function generateReviewStructuredData(
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>
) {
  return reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }));
}

// Utility to clean and truncate descriptions for meta tags
export function cleanDescription(
  description: string,
  maxLength: number = 160
): string {
  return description
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
    .substring(0, maxLength)
    .replace(/\s+\S*$/, ""); // Remove incomplete word at the end
}

// Generate page title with site name
export function generatePageTitle(
  pageTitle: string,
  includeSiteName: boolean = true
): string {
  if (!includeSiteName) return pageTitle;
  return pageTitle === seoConfig.defaultTitle
    ? pageTitle
    : `${pageTitle} | ${seoConfig.siteName}`;
}

// Generate canonical URL
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${seoConfig.siteUrl}${cleanPath}`;
}

// Generate location-specific LocalBusiness schema
export function generateLocationSchema(
  location: "kualaLumpur" | "georgetown"
) {
  const locationData = locations[location];

  return {
    "@type": "LocalBusiness",
    "@id": `https://simplyenak.com/#localbusiness-${location}`,
    name: `${seoConfig.siteName} - ${locationData.name}`,
    url: seoConfig.siteUrl,
    logo: seoConfig.logo,
    image: seoConfig.defaultImage,
    description: `${seoConfig.siteName} offers authentic Malaysian food tours in ${locationData.name}. Experience local culture, heritage, and delicious cuisine with expert local guides.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: locationData.address.streetAddress,
      addressLocality: locationData.address.addressLocality,
      addressRegion: locationData.address.addressRegion,
      addressCountry: locationData.address.addressCountry,
      postalCode: locationData.address.postalCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: locationData.geo.latitude,
      longitude: locationData.geo.longitude,
    },
    // Link to Google My Business profile
    ...(locationData.hasMap && { hasMap: locationData.hasMap }),
    telephone: seoConfig.businessInfo.telephone,
    priceRange: seoConfig.businessInfo.priceRange,
    aggregateRating: seoConfig.businessInfo.aggregateRating,
    openingHoursSpecification: seoConfig.businessInfo.openingHours.map(
      (hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.dayOfWeek,
        opens: hours.opens,
        closes: hours.closes,
      })
    ),
    sameAs: [
      seoConfig.socialLinks.facebook,
      seoConfig.socialLinks.instagram,
      seoConfig.socialLinks.linkedin,
    ].filter(Boolean),
    areaServed: {
      "@type": "City",
      name: locationData.address.addressLocality,
      containedIn: {
        "@type": "State",
        name: locationData.address.addressRegion,
        containedIn: {
          "@type": "Country",
          name: "Malaysia",
        },
      },
    },
  };
}
