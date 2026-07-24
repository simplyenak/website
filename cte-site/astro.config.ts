import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import compress from 'astro-compress';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  site: 'https://culinarytravelexperts.com',

  integrations: [
    sitemap(),
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
