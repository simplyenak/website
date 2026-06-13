import { type BlocksContent } from "@strapi/blocks-react-renderer";
export interface Media {
  url: string;
  name: string;
}
export interface Button {
  title: string;
  href: string;
  buttonType?:
    | "primary"
    | "secondary"
    | "primary-btn"
    | "secondary-btn"
    | "primary-btn-small"
    | "secondary-btn-small"
    | "tab-primary-btn"
    | "tab-secondary-btn";
  icon?: {
    name: string;
  };
}
export interface NavItem {
  href: string;
  name: string;
}
export interface Header {
  logo: Media;
  navItems: NavItem[];
}

export interface Footer {
  logo: Media;
  phoneNumber: string;
  email: string;
  partners: { url: string; image: Media }[];
  paymentMethods: Media[];
  quickLinks: NavItem[];
  copyrightText: string;
  informations: BlocksContent;
}

export interface HeroSection {
  title: string;
  subTitle: string;
  bgImage: Media;
  buttons: Button[];
}
export interface PartnersSection {
  partnersImages: Media[];
}
export interface AboutSection {
  title: string;
  subTitle: string;
  description: string;
  image: Media;
}
export interface OurToursSectionTypes {
  title: string;
  button: Button;
}
export interface OurValuesSection {
  title: string;
  items: {
    title: string;
    description: string;
    icon: { name: string };
  }[];
  bgImage: Media;
}
export interface TestimonialsSection {
  title: string;
  cards: {
    title: string;
    review: string;
    name: string;
    country: string;
    image: Media;
  }[];
}
export interface MediaSectionTypes {
  title: string;
  videoEmbedUrl: string;
}
export interface StoriesSection {
  title: string;
}
export interface GlobalHeroTypes {
  title: string;
  description?: string;
  image: Media;
  objectPosition?: string;
}
export interface TextWithLeftRightImageTypes {
  title: string;
  contents: string;
  imagePosition: "left" | "right";
  bgColor?: string;
  image: Media;
}
export interface GetInTouchSectionTypes {
  title: string;
  contents: string;
  formEmbedUrl: string;
}
export interface StoriesDetailsPageTypes {
  SEO: SEOTypes;
  title: string;
  slug: string;
  metaTitle: string;
  hero: { title: string; bgImage: Media };
  contents: Record<string, any>;
  categories: { name: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: {
    id: number;
    name: string;
    possition?: string | null;
    image?: Media;
  };
}
export interface AboutSimplyEnakSectionTypes {
  title: string;
  contents: BlocksContent;
  socialItems: {
    icon: {
      name: string;
    };
    href: string;
  }[];
}
export interface TourDetailsHeroTypes {
  title: string;
  price: string;
  duration: string;
  location: string;
  time?: string;
  maxParticipants?: number;
  experienceType?: string;
  image: Media;
}
export interface TourDetailsPageTypes {
  metaTitle: string;
  SEO: SEOTypes;
  slug: string;
  hero: TourDetailsHeroTypes;
  TicketingHubID: string;
  contents: BlocksContent;
  bookingUrl?: string;
  tags: { name: string }[];
}
export interface BookBespokeTourTypes {
  title: string;
  description: string;
  isBookingButton: boolean;
}
export interface TourPageTypes {
  metaTitle: string;
  SEO: SEOTypes;
  hero: GlobalHeroTypes;
  toursCardsSection: {
    text: string;
  };
  bookBespokeTour: BookBespokeTourTypes;
  knowTourSection: BookBespokeTourTypes;
}
export interface TermsConditionsPageTypes {
  metaTitle: string;
  headline: string;
  contents: BlocksContent;
}
export interface PrivacyPolicyPageTypes {
  metaTitle: string;
  headline: string;
  contents: BlocksContent;
}

export interface CustomToursMainPageTypes {
  SEO: SEOTypes;
  metaTitle: string;
  heroSection: GlobalHeroTypes;
}

export interface CustomToursPageType {
  SEO: SEOTypes;
  metaTitle: string;
  slug: string;
  heroSection: GlobalHeroTypes;
  getInTouchSection: GetInTouchSectionTypes;
}
export interface SEOTypes {
  title: string;
  description: string;
  image: Media;
  schema: any;
}

// Location landing page data for programmatic SEO
export interface LocationLandingPage {
  name: string;
  slug: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    backgroundImage: string;
  };
  heritage: {
    title: string;
    introduction: string;
    yearEstablished?: string;
    culturalInfluences: string[];
    keyFacts: Array<{ label: string; value: string; description?: string }>;
  };
  foodCultures: Array<{
    name: string;
    description: string;
    keyDishes: string[];
    culturalContext: string;
    image: string;
  }>;
  signatureDishes: Array<{
    name: string;
    description: string;
    origin: string;
    whereToFind: string;
    image: string;
    vegetarian?: boolean;
    cultural: string;
  }>;
  neighborhoods: Array<{
    name: string;
    description: string;
    knownFor: string[];
    vibe: string;
    image: string;
    mapLink?: string;
  }>;
  whyTourWithUs: {
    title: string;
    subtitle: string;
    description: string;
    reasons: Array<{ icon: string; title: string; description: string }>;
  };
  featuredTours: Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    highlights: string[];
  }>;
  trustSignals: {
    reviewCount: number;
    rating: number;
    tripadvisorRanking: number;
    certificateOfExcellence: boolean;
  };
  trustLogos: Array<{ name: string; logo: string; url: string }>;
  reviews: Array<{
    author: string;
    location: string;
    rating: number;
    date: string;
    text: string;
    source: "TripAdvisor" | "Google" | "Viator" | "GetYourGuide";
    verified: boolean;
  }>;
  expectations: {
    title: string;
    intro: string;
    items: Array<{ title: string; description: string; icon: string }>;
  };
  faqs: Array<{ question: string; answer: string }>;
  guides: Array<{ name: string; photo: string; bio: string; specialties: string[] }>;
  locationContext: {
    title: string;
    description: string;
    highlights: string[];
    mapEmbedUrl: string;
    culturalNotes: string;
  };
  geo: { latitude: string; longitude: string; addressLocality: string; addressRegion: string; postalCode: string };
  googleMyBusiness: { url: string; placeId: string };
}
