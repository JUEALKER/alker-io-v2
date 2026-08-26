import rss from '@astrojs/rss';
import { getPublishedPosts } from '../../lib/posts';
import { marked } from 'marked';

export async function GET(context: { site: URL }) {
  const posts = (await getPublishedPosts());

  // Full-text feed: body markdown rendered to HTML. Image references are
  // stripped; their hashed asset URLs only exist per build.
  const toHtml = (body: string) =>
    marked.parse(body.replace(/!\[[^\]]*\]\([^)]*\)(\s*\n\*[^*\n][^\n]*\*)?/g, ''), { async: false }) as string;

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
