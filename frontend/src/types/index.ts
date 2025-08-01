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
export interface YoutubeVideosTypes {
  youtubeChannelUrl: string;
  videosIds: { youtubeVideoId: string }[];
}
export interface StoriesDetailsPageTypes {
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
  youtubeVideos: YoutubeVideosTypes;
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
  hero: GlobalHeroTypes;
  toursCardsSection: {
    text: string;
  };
  bookBespokeTour: BookBespokeTourTypes;
  knowTourSection: BookBespokeTourTypes;
}
