import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,mjs}'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.js'],
    },
  },
});
