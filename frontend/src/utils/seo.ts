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
    telephone: string;
    priceRange: string;
    openingHours: {
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];
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
  },
  businessInfo: {
    name: "Simply Enak",
    address: {
      streetAddress: "Kuala Lumpur City Centre",
      addressLocality: "Kuala Lumpur",
      addressCountry: "MY",
    },
    telephone: "+60-123-456-789",
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
  },
};

// Generate structured data for tours/products
export function generateTourStructuredData(tour: {
  name: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image?: string;
  url: string;
  availability?: string;
}) {
  return {
    "@type": "Product",
    name: tour.name,
    description: tour.description,
    image: tour.image || seoConfig.defaultImage,
    url: tour.url,
    brand: {
      "@type": "Brand",
      name: seoConfig.siteName,
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "MYR",
      availability: tour.availability || "https://schema.org/InStock",
      url: tour.url,
      seller: {
        "@type": "Organization",
        name: seoConfig.siteName,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "MYR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "MY",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "MY",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    category: "Food Tour",
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
