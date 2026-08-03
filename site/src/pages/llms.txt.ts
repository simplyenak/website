export const prerender = true;

import type { APIRoute } from "astro";
import { SITE } from "astrowind:config";
import toursData from "~/data/content/tours.json";
import storiesData from "~/data/content/stories.json";
import faqsData from "~/data/content/faqs.json";

function parseField(val: any, fallback: any[] = []): any[] {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function extractText(content: any): string {
  if (typeof content === "string") return content;
  if (!content) return "";
  const root = content.root ?? content.en?.root;
  if (!root?.children) return "";
  return root.children
    .map((c: any) => c.children?.map((ch: any) => ch.text || "").join("") || c.text || "")
    .filter(Boolean)
    .join(" ");
}

export const GET: APIRoute = () => {
  const tours = (toursData as any[]).filter((t) => t._status === "published");
  const stories = (storiesData as any[]).filter(
    (s) => s._status === "published" && (s.content_markdown?.trim().length ?? 0) > 500
  );
  const faqs = (faqsData as any[]).filter((f) => f._status === "published");

  const toursBlock = tours
    .map((t) => {
      const dietary = parseField(t.dietary_options)
        .map((d: any) => (typeof d === "string" ? d : d?.name ?? ""))
        .filter(Boolean)
        .join(", ");
      const dietarySuffix = dietary ? ` (Dietary: ${dietary})` : "";
      return `- [${t.name}](https://simplyenak.com/tours/${t.slug}/): ${t.short_description || t.tagline || ""} — ${t.duration}, ${t.currency ?? "MYR"} ${t.price}/person${dietarySuffix}`;
    })
    .join("\n");

  const storiesBlock = stories
    .slice(0, 30)
    .map((s) => `- [${s.title}](https://simplyenak.com/stories/${s.slug}/): ${s.excerpt || ""}`)
    .join("\n");

  // Dedup: Payload has per-tour FAQ variants of the same question (e.g. 7x
  // "Can children join this tour?"). llms.txt should list unique questions.
  const faqBlock = [...new Set(
    faqs.map((f) => f.question).filter(Boolean)
  )]
    .slice(0, 10)
    .map((q) => `- ${q}`)
    .join("\n");

  const body = `# Simply Enak

> Malaysian food tours in Kuala Lumpur and Penang, led by locals who grew up eating here. Small groups (max 9), heritage vendors, no tourist restaurants — since 2011.

Simply Enak runs walking food tours through Kuala Lumpur and George Town, Penang. We visit family-run hawker stalls, wet markets, heritage shophouses, and street vendors — the places locals actually eat. Our guides explain the history, culture, and techniques behind every dish.

## Tours

${toursBlock}

## Stories

${storiesBlock}

## Frequently Asked Questions

${faqBlock}

## Key Pages

- [Home](https://simplyenak.com/)
- [All Tours](https://simplyenak.com/tours/)
- [Private Tours](https://simplyenak.com/tours/private-tours/)
- [How Our Tours Work](https://simplyenak.com/how-it-works/)
- [Stories & Guides](https://simplyenak.com/stories/)
- [About Us](https://simplyenak.com/about/)
- [Contact](https://simplyenak.com/contact/)
- [Media Coverage](https://simplyenak.com/media/)
- [FAQ](https://simplyenak.com/faq/)
- [Terms & Conditions](https://simplyenak.com/terms/)
- [Privacy Policy](https://simplyenak.com/privacy-policy/)

## Contact

- WhatsApp: +6 017 287 8929
- Email: booking@simplyenak.com
- Website: https://simplyenak.com
`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
