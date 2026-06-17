/**
 * Simply Enak — Cloudflare Pages Worker
 *
 * Implements "Markdown for Agents" content negotiation (free-plan alternative
 * to Cloudflare's Pro-only toggle). When an AI agent sends:
 *   Accept: text/markdown, text/html, * / *
 * ...this worker converts the HTML response to clean markdown before returning it.
 *
 * Agents that benefit: Claude Code, Cursor, OpenCode, and any future AI crawler
 * that adopts the Accept: text/markdown header standard.
 *
 * Reference: https://blog.cloudflare.com/markdown-for-agents/
 *            https://contentsignals.org/
 */

// File extensions that are never HTML pages — pass straight through
const ASSET_PATTERN = /\.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot|json|xml|txt|pdf|mp4|mp3|webm)$/i;

/**
 * Convert HTML to clean markdown. Handles the main elements found on
 * Astro-generated Simply Enak pages without any external dependencies.
 */
function htmlToMarkdown(html) {
  // 1. Extract only the <main> or <article> content if present, else full body
  let content = html;
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (mainMatch) content = mainMatch[1];
  else if (articleMatch) content = articleMatch[1];
  else {
    // Strip non-content blocks
    content = content
      .replace(/<head[\s\S]*?<\/head>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[\s\S]*?<\/aside>/gi, '');
  }

  // 2. Strip scripts, styles, and comments entirely
  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // 3. Structural block elements → markdown
  content = content
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${strip(t)}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${strip(t)}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${strip(t)}\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${strip(t)}\n`)
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n##### ${strip(t)}\n`)
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `\n###### ${strip(t)}\n`);

  // 4. Lists
  content = content
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${strip(t)}\n`)
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n');

  // 5. Inline formatting
  content = content
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${strip(t)}**`)
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${strip(t)}**`)
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${strip(t)}*`)
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${strip(t)}*`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => `\`${strip(t)}\``)
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
      const text = strip(t);
      if (!text || text === href) return href;
      return `[${text}](${href})`;
    });

  // 6. Block containers
  content = content
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
      const text = strip(t).trim();
      return text ? `\n${text}\n` : '';
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) =>
      strip(t).split('\n').map(l => `> ${l}`).join('\n') + '\n'
    );

  // 7. Images — keep alt text as description
  content = content.replace(/<img[^>]+alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi,
    (_, alt, src) => alt ? `![${alt}](${src})` : ''
  );
  content = content.replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    (_, src, alt) => alt ? `![${alt}](${src})` : ''
  );

  // 8. Strip all remaining HTML tags
  content = content.replace(/<[^>]+>/g, ' ');

  // 9. Decode common HTML entities
  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');

  // 10. Clean up whitespace
  content = content
    .replace(/\n{4,}/g, '\n\n\n')   // max 3 blank lines
    .replace(/[ \t]+\n/g, '\n')      // trailing spaces on lines
    .replace(/\n[ \t]+/g, '\n')      // leading spaces on lines
    .replace(/[ \t]{2,}/g, ' ')      // multiple spaces
    .trim();

  return content;
}

/** Strip all HTML tags from a string (for inline content) */
function strip(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/** Extract <title> from HTML for the markdown front matter */
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : '';
}

/** Extract meta description for front matter */
function extractDescription(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  return m ? m[1].trim() : '';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get('Accept') || '';

    // Pass through asset requests and non-markdown requests unchanged
    const wantsMarkdown = accept.includes('text/markdown');
    const isAsset = ASSET_PATTERN.test(url.pathname);

    if (!wantsMarkdown || isAsset) {
      return env.ASSETS.fetch(request);
    }

    // Fetch the HTML version from Pages assets
    const htmlRequest = new Request(request.url, {
      method: request.method,
      headers: (() => {
        const h = new Headers(request.headers);
        h.set('Accept', 'text/html');
        return h;
      })(),
    });

    const response = await env.ASSETS.fetch(htmlRequest);
    const contentType = response.headers.get('content-type') || '';

    // Only convert HTML responses — pass everything else through
    if (!response.ok || !contentType.includes('text/html')) {
      return response;
    }

    const html = await response.text();
    const title = extractTitle(html);
    const description = extractDescription(html);

    // Build front matter
    const frontMatter = [
      '---',
      title ? `title: "${title.replace(/"/g, '\\"')}"` : null,
      description ? `description: "${description.replace(/"/g, '\\"')}"` : null,
      `url: "${url.href}"`,
      '---',
    ].filter(Boolean).join('\n');

    const markdown = `${frontMatter}\n\n${htmlToMarkdown(html)}`;
    const tokenEstimate = markdown.split(/\s+/).length;

    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Signal': 'ai-train=yes, search',
        'Vary': 'Accept',
        'X-Markdown-Tokens': String(tokenEstimate),
        'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=3600',
      },
    });
  },
};
