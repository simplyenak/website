/**
 * Lightweight inline markdown renderer for FAQ answers.
 * Handles three patterns: [link text](/url), **bold**, *italic*
 * 
 * Security: Only relative URLs (starting with /) are rendered as links.
 * Absolute URLs are left as plain text to prevent XSS.
 */

const LINK_CLASS = 'text-orange-600 hover:underline';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderInlineMarkdown(text: string | null | undefined): string {
  if (!text) return '';

  // First escape HTML entities to prevent injection
  let result = escapeHtml(text);

  // Convert markdown links: [text](/url)
  // Only allow relative URLs starting with / but NOT protocol-relative //
  result = result.replace(
    /\[([^\]]+)\]\((\/[^/][^)]*)\)/g,
    `<a href="$2" class="${LINK_CLASS}">$1</a>`
  );

  // Convert bold: **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert italic: *text* (but not inside <strong> tags)
  result = result.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');

  return result;
}

export function stripMarkdown(text: string | null | undefined): string {
  if (!text) return '';

  // Strip markdown links: [text](url) → text
  let result = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Strip bold: **text** → text
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');

  // Strip italic: *text* → text
  result = result.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1');

  return result;
}
