import { describe, it, expect } from 'vitest';
import { renderInlineMarkdown, stripMarkdown } from '../src/lib/render-inline-markdown.ts';

describe('renderInlineMarkdown', () => {
  it('returns empty string for null', () => {
    expect(renderInlineMarkdown(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(renderInlineMarkdown(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(renderInlineMarkdown('')).toBe('');
  });

  it('leaves plain text unchanged', () => {
    expect(renderInlineMarkdown('Hello world')).toBe('Hello world');
  });

  it('converts markdown links to anchor tags', () => {
    const result = renderInlineMarkdown('[Browse tours](/tours/)');
    expect(result).toBe('<a href="/tours/" class="text-orange-600 hover:underline">Browse tours</a>');
  });

  it('converts bold markdown to strong tags', () => {
    expect(renderInlineMarkdown('This is **bold** text')).toBe('This is <strong>bold</strong> text');
  });

  it('converts italic markdown to em tags', () => {
    expect(renderInlineMarkdown('This is *italic* text')).toBe('This is <em>italic</em> text');
  });

  it('handles link with longer path', () => {
    const result = renderInlineMarkdown('[vegetarian](/tours/dietary/vegetarian/)');
    expect(result).toContain('href="/tours/dietary/vegetarian/"');
    expect(result).toContain('vegetarian');
  });

  it('handles mixed markdown in one string', () => {
    const result = renderInlineMarkdown('Check [our tours](/tours/) for **great** food');
    expect(result).toContain('<a href="/tours/"');
    expect(result).toContain('<strong>great</strong>');
  });

  it('escapes HTML in text to prevent XSS', () => {
    const result = renderInlineMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('does not render absolute URLs as links', () => {
    const result = renderInlineMarkdown('[evil](https://evil.com)');
    expect(result).not.toContain('<a');
    expect(result).toContain('[evil](https://evil.com)');
  });

  it('does not render protocol-relative URLs as links', () => {
    const result = renderInlineMarkdown('[evil](//evil.com)');
    expect(result).not.toContain('<a');
  });

  it('leaves malformed markdown unchanged', () => {
    expect(renderInlineMarkdown('[unclosed')).toBe('[unclosed');
  });

  it('handles multiple links in one string', () => {
    const result = renderInlineMarkdown('[vegetarian](/tours/dietary/vegetarian/) and [gluten-free](/tours/dietary/gluten-free/)');
    expect(result).toContain('href="/tours/dietary/vegetarian/"');
    expect(result).toContain('href="/tours/dietary/gluten-free/"');
  });
});

describe('stripMarkdown', () => {
  it('returns empty string for null', () => {
    expect(stripMarkdown(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(stripMarkdown(undefined)).toBe('');
  });

  it('strips markdown links keeping text', () => {
    expect(stripMarkdown('[Browse tours](/tours/)')).toBe('Browse tours');
  });

  it('strips bold markers', () => {
    expect(stripMarkdown('This is **bold** text')).toBe('This is bold text');
  });

  it('strips italic markers', () => {
    expect(stripMarkdown('This is *italic* text')).toBe('This is italic text');
  });

  it('strips all patterns at once', () => {
    expect(stripMarkdown('Check [our tours](/tours/) for **great** *food*')).toBe('Check our tours for great food');
  });

  it('leaves plain text unchanged', () => {
    expect(stripMarkdown('Hello world')).toBe('Hello world');
  });
});
