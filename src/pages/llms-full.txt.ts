import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../lib/posts';

/**
 * Companion to /llms.txt: the full text of every essay in one plain-text
 * file, so language models can ingest the writing without crawling 43
 * pages. Markdown image references are stripped; they carry no text.
 */
export async function GET(context: { site: URL }) {
  const site = context.site.href.replace(/\/$/, '');
  const posts = (await getPublishedPosts());

  const seriesDefs = await getCollection('series');
  const partCount = new Map<string, number>();
  for (const p of posts) {
    if (p.data.series) partCount.set(p.data.series, (partCount.get(p.data.series) ?? 0) + 1);
  }
  const seriesLine = (p: (typeof posts)[number]) => {
    if (!p.data.series) return null;
    const def = seriesDefs.find((s) => s.id === p.data.series);
    return `Series: ${def?.data.title ?? p.data.series}, part ${p.data.part} of ${partCount.get(p.data.series)}`;
  };

  const clean = (body: string) =>
    body
      .replace(/!\[[^\]]*\]\([^)]*\)(\s*\n\*[^*\n][^\n]*\*)?/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const sections = posts.map((p) => {
    const head = [
      `# ${p.data.title}`,
      '',
      `Source: ${site}/writing/${p.id}`,
      `Published: ${p.data.date.toISOString().slice(0, 10)}`,
      `Author: Jürgen Alker`,
      seriesLine(p),
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
