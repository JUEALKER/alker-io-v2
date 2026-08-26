import { getPublishedPosts } from '../lib/posts';

/** Plain-text map of the site for language models. */
export async function GET(context: { site: URL }) {
  const site = context.site.href.replace(/\/$/, '');
  const posts = (await getPublishedPosts());

  const body = `# Alker

Jürgen Alker. The first version of what you can almost see.
See it. Build it. Back it.

## Site
- ${site}/ — about, principles, contact
- ${site}/writing — all essays
- ${site}/writing/rss.xml — RSS feed (full text)
- ${site}/llms-full.txt — full text of all essays in one file

## Writing
${posts
  .map((p) => `- [${p.data.title}](${site}/writing/${p.id}): ${p.data.standfirst}`)
  .join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
