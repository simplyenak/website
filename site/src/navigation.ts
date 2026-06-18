import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { useTranslations } from './i18n/utils';
import type { Language } from './i18n/ui';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Tours',
      links: [
        {
          text: 'All Tours',
          href: getPermalink('/tours'),
        },
        {
          text: 'Flavours of Malaysia',
          href: getPermalink('/tours/flavours-of-malaysia'),
        },
        {
          text: 'KL Street Food',
          href: getPermalink('/tours/kuala-lumpur-street-food'),
        },
        {
          text: 'Eat Drink George Town',
          href: getPermalink('/tours/eat-drink-george-town'),
        },
        {
          text: 'Penang Street Food',
          href: getPermalink('/tours/penang-street-food'),
        },
        {
          text: 'Secrets of KL',
          href: getPermalink('/tours/secrets-of-kl-nightlife'),
        },
      ],
    },
    {
      text: 'Stories',
      href: getBlogPermalink(),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Book Now', href: getPermalink('/tours'), variant: 'primary' }],
};

export const footerData = {
  links: [
    {
      title: 'Tours',
      links: [
        { text: 'All Tours', href: '/tours' },
        { text: 'Flavours of Malaysia', href: '/tours/flavours-of-malaysia' },
        { text: 'KL Street Food', href: '/tours/kuala-lumpur-street-food' },
        { text: 'Eat Drink George Town', href: '/tours/eat-drink-george-town' },
        { text: 'Penang Street Food', href: '/tours/penang-street-food' },
        { text: 'Secrets of KL', href: '/tours/secrets-of-kl-nightlife' },
        { text: 'Tour Comparison', href: '/tours/why-simply-enak' },
      ],
    },
    {
      title: 'By City',
      links: [
        { text: 'Kuala Lumpur Tours', href: '/tours/locations/food-tours-kuala-lumpur' },
        { text: 'Penang Tours', href: '/tours/locations/food-tours-penang' },
        { text: 'Melaka Tours', href: '/tours/locations/food-tours-melaka' },
        { text: 'Ipoh Tours', href: '/tours/locations/food-tours-ipoh' },
      ],
    },
    {
      title: 'By Dietary',
      links: [
        { text: 'Vegetarian Tours', href: '/tours/dietary/vegetarian-food-tours-kuala-lumpur' },
        { text: 'Halal Tours', href: '/tours/dietary/halal-food-tours-kuala-lumpur' },
        { text: 'Vegan Tours', href: '/tours/dietary/vegan-food-tours-kuala-lumpur' },
        { text: 'Gluten-Free Tours', href: '/tours/dietary/gluten-free-food-tours-kuala-lumpur' },
      ],
    },
    {
      title: 'Groups & Events',
      links: [
        { text: 'Families', href: '/tours/segments/food-tours-for-families-kuala-lumpur' },
        { text: 'Couples', href: '/tours/segments/food-tours-for-couples-kuala-lumpur' },
        { text: 'Chefs', href: '/tours/segments/food-tours-for-chefs' },
        { text: 'Wedding Groups', href: '/tours/segments/food-tours-for-wedding-groups' },
        { text: 'Join-In Tours', href: '/tours' },
      ],
    },
  ],
  companyLinks: [
    { text: 'About Simply Enak', href: '/about' },
    { text: 'Stories & Blog', href: '/stories' },
    { text: 'Contact Us', href: '/contact' },
    { text: 'FAQ', href: '/faq' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms & Conditions', href: '/terms' },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms', href: '/terms' },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/SimplyEnak' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/simply.enak/' },
    { ariaLabel: 'TripAdvisor', icon: 'tabler:award', href: 'https://www.tripadvisor.com/Attraction_Review-g298570-d2414763-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html' },
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/60172878929' },
  ],
  footNote: `
    COPYRIGHT © 2026 SIMPLY ENAK FOOD EXPERIENCES. ALL RIGHTS RESERVED.
  `,
};

// ── Language-aware navigation factories ──
// These functions return translated navigation data for the given language.

const toMsPath = (path: string): string => `/ms${path}`;

export function getHeaderData(lang: Language) {
  const t = useTranslations(lang);

  // For non-English, prefix paths with language
  const p = (path: string) => lang === 'en' ? getPermalink(path) : getPermalink(`/ms${path}`);

  return {
    links: [
      {
        text: t('nav.home'),
        href: lang === 'en' ? getPermalink('/') : getPermalink('/ms'),
      },
      {
        text: t('nav.tours'),
        links: [
          { text: t('nav.allTours'), href: p('/tours') },
          { text: t('nav.flavours'), href: p('/tours/flavours-of-malaysia') },
          { text: t('nav.klStreetFood'), href: p('/tours/kuala-lumpur-street-food') },
          { text: t('nav.eatDrinkGeorgeTown'), href: p('/tours/eat-drink-george-town') },
          { text: t('nav.penangStreetFood'), href: p('/tours/penang-street-food') },
          { text: t('nav.secretsOfKl'), href: p('/tours/secrets-of-kl-nightlife') },
        ],
      },
      {
        text: t('nav.stories'),
        href: lang === 'en' ? getBlogPermalink() : getPermalink('/ms/stories'),
      },
      {
        text: t('nav.about'),
        href: p('/about'),
      },
      {
        text: t('nav.contact'),
        href: p('/contact'),
      },
    ],
    actions: [{ text: t('nav.bookNow'), href: p('/tours'), variant: 'primary' as const }],
  };
}

export function getFooterData(lang: Language) {
  const t = useTranslations(lang);

  const p = (path: string) => lang === 'en' ? path : `/ms${path}`;

  return {
    links: [
      {
        title: t('nav.tours'),
        links: [
          { text: t('nav.allTours'), href: p('/tours') },
          { text: t('nav.flavours'), href: p('/tours/flavours-of-malaysia') },
          { text: t('nav.klStreetFood'), href: p('/tours/kuala-lumpur-street-food') },
          { text: t('nav.eatDrinkGeorgeTown'), href: p('/tours/eat-drink-george-town') },
          { text: t('nav.penangStreetFood'), href: p('/tours/penang-street-food') },
          { text: t('nav.secretsOfKl'), href: p('/tours/secrets-of-kl-nightlife') },
          { text: t('nav.tourComparison'), href: p('/tours/why-simply-enak') },
        ],
      },
      {
        title: t('footer.byCity'),
        links: [
          { text: t('footer.klTours'), href: p('/tours/locations/food-tours-kuala-lumpur') },
          { text: t('footer.penangTours'), href: p('/tours/locations/food-tours-penang') },
          { text: t('footer.melakaTours'), href: p('/tours/locations/food-tours-melaka') },
          { text: t('footer.ipohTours'), href: p('/tours/locations/food-tours-ipoh') },
        ],
      },
      {
        title: t('footer.byDietary'),
        links: [
          { text: t('footer.vegetarian'), href: p('/tours/dietary/vegetarian-food-tours-kuala-lumpur') },
          { text: t('footer.halal'), href: p('/tours/dietary/halal-food-tours-kuala-lumpur') },
          { text: t('footer.vegan'), href: p('/tours/dietary/vegan-food-tours-kuala-lumpur') },
          { text: t('footer.glutenFree'), href: p('/tours/dietary/gluten-free-food-tours-kuala-lumpur') },
        ],
      },
      {
        title: t('footer.groupsEvents'),
        links: [
          { text: t('footer.families'), href: p('/tours/segments/food-tours-for-families-kuala-lumpur') },
          { text: t('footer.couples'), href: p('/tours/segments/food-tours-for-couples-kuala-lumpur') },
          { text: t('footer.chefs'), href: p('/tours/segments/food-tours-for-chefs') },
          { text: t('footer.weddingGroups'), href: p('/tours/segments/food-tours-for-wedding-groups') },
          { text: t('footer.joinInTours'), href: p('/tours') },
        ],
      },
    ],
    companyLinks: [
      { text: t('footer.about'), href: p('/about') },
      { text: t('footer.stories'), href: p('/stories') },
      { text: t('footer.contact'), href: p('/contact') },
      { text: t('footer.faq'), href: p('/faq') },
      { text: t('footer.privacy'), href: p('/privacy') },
      { text: t('footer.terms'), href: p('/terms') },
    ],
    secondaryLinks: [
      { text: t('footer.privacy'), href: p('/privacy') },
      { text: t('footer.terms'), href: p('/terms') },
    ],
    socialLinks: [
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/SimplyEnak' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/simply.enak/' },
      { ariaLabel: 'TripAdvisor', icon: 'tabler:award', href: 'https://www.tripadvisor.com/Attraction_Review-g298570-d2414763-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html' },
      { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/60172878929' },
    ],
    footNote: t('footer.copyright'),
  };
}
