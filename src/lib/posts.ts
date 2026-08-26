import { getCollection } from 'astro:content';

/** All published writing posts, newest first. The single source of the
 *  publish rule: draft entries never leave this function. */
export const getPublishedPosts = async () =>
  (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
