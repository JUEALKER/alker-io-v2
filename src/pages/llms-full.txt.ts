import { getCollection } from 'astro:content';

/**
 * Companion to /llms.txt: the full text of every essay in one plain-text
 * file, so language models can ingest the writing without crawling 43
 * pages. Markdown image references are stripped; they carry no text.
 */
export async function GET(context: { site: URL }) {
  const site = context.site.href.replace(/\/$/, '');
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const clean = (body: string) =>
    body
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const sections = posts.map((p) => {
    const head = [
      `# ${p.data.title}`,
      '',
      `Source: ${site}/writing/${p.id}`,
      `Published: ${p.data.date.toISOString().slice(0, 10)}`,
      `Author: Jürgen Alker`,
      p.data.series ? `Series: Beyond ninety minutes, part ${p.data.part} of 10` : null,
      '',
      p.data.standfirst,
    ]
      .filter((l) => l !== null)
      .join('\n');
    return `${head}\n\n${clean(p.body ?? '')}`;
  });

  const body = `Alker — Writing. Essays by Jürgen Alker, ${site}/writing

${sections.join('\n\n---\n\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
