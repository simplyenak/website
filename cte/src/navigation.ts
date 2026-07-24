import { getPermalink } from '~/utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'What We Do',
      href: getPermalink('/what-we-do'),
    },
    {
      text: 'Itineraries',
      href: getPermalink('/itineraries'),
    },
    {
      text: 'Partner With Us',
      href: getPermalink('/partner-with-us'),
    },
    {
      text: 'Destinations',
      href: getPermalink('/destinations'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Trade Kit',
      href: getPermalink('/trade-kit'),
    },
  ],
  actions: [{ text: 'Contact', href: getPermalink('/contact'), variant: 'primary' }],
};

export const footerData = {
  links: [
    {
      title: 'Pages',
      links: [
        { text: 'What We Do', href: getPermalink('/what-we-do') },
        { text: 'Itineraries', href: getPermalink('/itineraries') },
        { text: 'Partner With Us', href: getPermalink('/partner-with-us') },
        { text: 'Destinations', href: getPermalink('/destinations') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy', href: getPermalink('/privacy') },
  ],
  footNote: `&copy; ${new Date().getFullYear()} Local Culinary Travel Experiences Sdn. Bhd. Part of <a class="text-accent hover:underline" href="https://simplyenak.com">Simply Enak</a>`,
};
