import { getPermalink } from '~/utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Services',
      href: '/dmc-services',
    },
    {
      text: 'Destinations',
      href: '#destinations',
    },
    {
      text: 'For Agents',
      href: '/for-agents',
    },
    {
      text: 'Resources',
      href: '/fam-trip-resources',
    },
    {
      text: 'About',
      href: '#about',
    },
  ],
  actions: [{ text: 'Contact', href: '#contact' }],
};

export const footerData = {
  links: [
    {
      title: 'Pages',
      links: [
        { text: 'Services', href: '#services' },
        { text: 'Destinations', href: '#destinations' },
        { text: 'Partner With Us', href: '#partner' },
        { text: 'About', href: '#about' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'Contact', href: '#contact' },
        { text: 'Trade Kit', href: '#trade-kit' },
      ],
    },
  ],
  secondaryLinks: [],
  footNote: `&copy; ${new Date().getFullYear()} Local Culinary Travel Experiences Sdn. Bhd. Part of <a class="text-accent hover:underline" href="https://simplyenak.com">Simply Enak</a>`,
};
