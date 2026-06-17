/**
 * Markdown to HTML converter for editorial content.
 * Used at build time to convert markdown strings (stored in JSON) to HTML.
 *
 * Uses unified/remark/rehype — all already installed as Astro internal deps.
 * No additional packages needed.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/**
 * Convert a markdown string to HTML.
 */
export async function markdownToHtml(markdown) {
  if (!markdown) return '';
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}
