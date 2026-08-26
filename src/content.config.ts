import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      standfirst: z.string().min(1),
      date: z.coerce.date(),
      series: z.string().optional(),
      part: z.number().int().positive().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      contents: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
    })
    .refine((d) => (d.series == null) === (d.part == null), {
      message: 'series and part must be set together.',
    })
    .refine((d) => !d.hero || !!d.heroAlt, {
      message: 'A hero image needs heroAlt.',
    }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    standfirst: z.string(),
    order: z.number().int().default(0),
  }),
});

export const collections = { writing, series };
