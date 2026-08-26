import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Full-text feed: body markdown rendered to HTML. Image references are
  // stripped; their hashed asset URLs only exist per build.
  const toHtml = (body: string) =>
    marked.parse(body.replace(/!\[[^\]]*\]\([^)]*\)/g, ''), { async: false }) as string;

  return rss({
    title: 'Alker — Writing',
    description: 'Essays on brands, players and company building in sport and culture.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.standfirst,
      pubDate: p.data.date,
      link: `/writing/${p.id}`,
      content: toHtml(p.body ?? ''),
    })),
  });
}
