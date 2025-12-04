// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vue from "@astrojs/vue";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://simplyenak.com",

  output: "static",

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
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue'],
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    },
  },

  integrations: [vue(), react(), sitemap()],
  });