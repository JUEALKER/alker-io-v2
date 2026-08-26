import { getCollection } from 'astro:content';

/** Plain-text map of the site for language models. */
export async function GET(context: { site: URL }) {
  const site = context.site.href.replace(/\/$/, '');
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const body = `# Alker

Jürgen Alker. The first version of what you can almost see.
See it. Build it. Back it.

## Site
- ${site}/ — about, principles, contact
- ${site}/writing — all essays
- ${site}/writing/rss.xml — RSS feed

## Writing
${posts
  .map((p) => `- [${p.data.title}](${site}/writing/${p.id}): ${p.data.standfirst}`)
  .join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
