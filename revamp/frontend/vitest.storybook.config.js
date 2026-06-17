import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';
import storybook from '@storybook/react-vite/entrypoints/vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    exclude: ['node_modules/**', 'dist/**'],
    setupFiles: ['./src/test/setup.ts'],
  },
  plugins: [storybook()],
});