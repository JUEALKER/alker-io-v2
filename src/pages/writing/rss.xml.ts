import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Alker — Writing',
    description: 'Essays on brands, players and company building in sport and culture.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.standfirst,
      pubDate: p.data.date,
      link: `/writing/${p.id}`,
    })),
  });
}
