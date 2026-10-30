import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    // Lets tests read stylesheets with ?raw (the skin tests check them); otherwise they load empty.
    css: true,
  },
});
