import path from 'path';
import { fileURLToPath } from 'url';

// Load .env at build time — without this, process.env.PAYLOAD_URL etc.
// are undefined during `astro build`, causing every live API fetch to hang
// against http://localhost:3000 and exhausting memory (OOM) before most
// pages are rendered. Astro doesn't auto-load .env into process.env for
// build-time module code (only for runtime server code).
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env') });

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        // Cut 2026-09-14 (GSC demand gate): fr/nl/pt/ru/zh had ~zero target-language
        // queries → removed from sitemap/hreflang + 301'd to EN in the Worker.
        locales: {
          en: 'en',
          ms: 'ms',
          de: 'de',
          es: 'es',
          ja: 'ja',
        },
      },
      filter: (page) => {
        // Exclude non-SEO pages from sitemap to focus crawl budget on real content
        if (page.includes('/404')) return false;
        if (page.includes('/category/') || page.includes('/tag/')) return false;
        // Post-conversion thank-you pages — no SEO value, already noindex
        if (page.includes('/thank-you')) return false;
        // Pagination pages (/stories/2, /de/stories/3, etc.) — thin content
        // (\d+ alone missed trailing-slash URLs: /stories/2/ passed the filter)
        if (/\/stories\/\d+\/?$/.test(page)) return false;
        // Duplicate slug from content system
        if (page.includes('%20-%20Copy')) return false;
        return true;
      },
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect, like Pixabay).
    // Listed entries are authorized to be processed by Sharp.
    domains: ['cdn.pixabay.com'],
  },

  site: 'https://simplyenak.com',

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
