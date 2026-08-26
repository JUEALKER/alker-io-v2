import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Site URL: production and local builds use the canonical domain.
// On Vercel preview deployments the deployment's own URL is used so
// canonicals and feeds never claim www.alker.io from a preview domain.
// SITE_URL overrides everything when set explicitly.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
    ? `https://${process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL}`
    : 'https://www.alker.io');

export default defineConfig({
  site,
  compressHTML: true,
  integrations: [
    mdx(),
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
