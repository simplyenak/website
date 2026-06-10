import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
        {
          text: 'Tour Comparison',
          href: getPermalink('/tours/comparison'),
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
        { text: 'Tour Comparison', href: '/tours/comparison' },
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
