import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site URL: production and local builds use the canonical domain.
// On Vercel preview deployments the deployment's own URL is used so
// canonicals and feeds never claim www.alker.io from a preview domain.
// SITE_URL overrides everything when set explicitly.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
    ? `https://${process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL}`
    : 'https://www.alker.io');

const articleDates = {};
try {
  for (const slug of readdirSync('src/content/writing')) {
    const f = `src/content/writing/${slug}/index.md`;
    if (!existsSync(f)) continue;
    const m = readFileSync(f, 'utf8').match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    if (m) articleDates[slug] = m[1];
  }
} catch { /* content dir missing: no article lastmod */ }

export default defineConfig({
  site,
  compressHTML: true,
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 1.0,
      // lastmod per article from its frontmatter date; pages without a
      // known date carry none instead of a meaningless build timestamp
      serialize(item) {
        const m = item.url.match(/\/writing\/([^/]+)\/?$/);
        const date = m ? articleDates[m[1]] : undefined;
        if (date) item.lastmod = date;
        else delete item.lastmod;
        return item;
      },
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
    inlineStylesheets: 'always',
  },
});
