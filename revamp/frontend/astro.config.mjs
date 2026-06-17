// @ts-check
import { defineConfig } from "astro/config";
import { readFileSync } from "fs";

const tours = JSON.parse(readFileSync(new URL("./src/data/content/tours.json", import.meta.url), "utf8"));
const noindexTourSlugs = new Set(
  tours.filter((/** @type {any} */ t) => t.noindex).map((/** @type {any} */ t) => t.slug)
);

import tailwindcss from "@tailwindcss/vite";

import vue from "@astrojs/vue";

import react from "@astrojs/react";

// sitemap import removed — custom sitemap.xml.ts handles generation

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://simplyenak.com",

  output: "static",
  trailingSlash: "always",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ms", "zh", "de", "es", "fr", "nl", "ru", "ja", "pt"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Performance: Enable HTML compression
  compressHTML: true,

  // Performance: Enable image optimization for remote S3 images
  image: {
    domains: ['se-website-images.s3.nl-ams.scw.cloud', 'cdn.simplyenak.com', 'api.system.simplyenak.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'se-website-images.s3.nl-ams.scw.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simplyenak.com',
      },
    ],
    // Optimize images: convert to WebP, resize for responsive display
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // Allow large S3 images
      },
    },
  },

  // Performance: Optimize CSS delivery
  build: {
    inlineStylesheets: 'auto', // Inline small CSS (<4kb)
  },

  // Performance: Enable prefetch for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
        // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
        ...(import.meta.env.PROD
          ? { "react-dom/server": "react-dom/server.edge" }
          : {}),
      },
    },
    // Performance: Optimize build output
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    },
  },

  integrations: [
    vue(),
    react(),
    // Note: custom sitemap.xml.ts handles sitemap generation with
    // dynamic Payload content, priorities, and changefreq.
    // Disabled to avoid duplicate/conflicting sitemaps.
    // sitemap({
    //   filter: (page) => { ... },
    // }),
  ],
  });