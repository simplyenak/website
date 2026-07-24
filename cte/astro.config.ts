import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import compress from 'astro-compress';

import astrowind from './vendor/integration';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  site: 'https://culinarytravelexperts.com',

  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/404')) return false;
        if (page.includes('/thank-you')) return false;
        return true;
      },
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
    compress({
      CSS: true,
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind(),
  ],

  vite: {
    plugins: [],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
