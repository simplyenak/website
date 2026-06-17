import { z } from 'zod';

/**
 * FAQ schema for Simply Enak
 * Based on schema.org/FAQPage
 * Optimized for food tour FAQ content
 */
export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string; // The question
    acceptedAnswer: {
      "@type": "Answer";
      text: string; // The answer
    };
  }[];
}

/**
 * Creates a FAQ schema object from FAQ data
 * @param faqsArray - Array of FAQ objects from JSON snapshots
 * @returns FAQSchema object
 */
export function createFAQSchema(faqsArray: any[]): FAQSchema {
  // Filter out draft/inactive FAQs and only use published ones
  const publishedFaqs = faqsArray
    .filter(faq => faq.workflowStatus !== 'draft' && faq.page_visibility?.includes('all'))
    .map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer?.en?.root?.children?.[0]?.children?.[0]?.text || 
              faq.answer?.en?.root?.children?.[0]?.children?.[0]?.mode === 'normal' ?
                faq.answer?.en?.root?.children?.[0]?.children?.[0]?.text : 
                JSON.stringify(faq.answer?.en) || 
                'Answer not available'
      }
    }));
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishedFaqs
  };
}

/**
 * Zod schema for validation
 */
export const faqSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("FAQPage"),
  mainEntity: z.array(
    z.object({
      "@type": z.literal("Question"),
      name: z.string(),
      acceptedAnswer: z.object({
        "@type": z.literal("Answer"),
        text: z.string()
      })
    })
  ).nonempty()
});

export type { FAQSchema };