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
      text: 'For Creators',
      href: '/for-creators',
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
        { text: 'Services', href: '/dmc-services' },
        { text: 'Destinations', href: '/#destinations' },
        { text: 'For Agents', href: '/for-agents' },
        { text: 'For Creators', href: '/for-creators' },
        { text: 'Resources', href: '/fam-trip-resources' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/#about' },
        { text: 'Sustainability', href: '/sustainability' },
        { text: 'Trade Kit', href: '/fam-trip-resources#contact' },
      ],
    },
  ],
  secondaryLinks: [],
  footNote: `&copy; ${new Date().getFullYear()} Local Culinary Travel Experiences Sdn. Bhd. Part of <a class="text-accent hover:underline" href="https://simplyenak.com">Simply Enak</a>`,
};
