import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.alker.io',
  compressHTML: true,
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 1.0,
      lastmod: new Date(),
    }),
  ],
  image: {
    // Use Astro's built-in Sharp image service for optimisation
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    assets: '_astro',
  },
});
