#!/usr/bin/env node
/**
 * Update FAQs in Payload CMS with:
 * - Rewritten English answers with internal markdown links
 * - page_visibility assignments
 * - category and sort_order
 * - 4 new FAQs (dietary options, mobility, private tours, hotel pickup)
 */

const API = 'http://localhost:3001';
const EMAIL = 'admin@simplyenak.com';
const PASSWORD = 'admin123';

async function login() {
  const res = await fetch(`${API}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  return data.token;
}

async function patchFAQ(token, id, fields) {
  const res = await fetch(`${API}/api/faqs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ❌ PATCH /api/faqs/${id} failed: ${res.status} ${text}`);
    return null;
  }
  return res.json();
}

async function createFAQ(token, fields) {
  const res = await fetch(`${API}/api/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ❌ POST /api/faqs failed: ${res.status} ${text}`);
    return null;
  }
  return res.json();
}

async function updateTranslation(token, faqId, langCode, answer) {
  // Get existing translations for this FAQ
  const faq = await fetch(`${API}/api/faqs/${faqId}?depth=1`, {
    headers: { 'Authorization': `JWT ${token}` },
  }).then(r => r.json());
  
  const translation = (faq.translations || []).find(t => t.languages_code === langCode);
  if (!translation) {
    console.log(`  ⚠️ No ${langCode} translation found for FAQ ${faqId}, skipping`);
    return;
  }
  
  const res = await fetch(`${API}/api/faqs-translations/${translation.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ❌ PATCH translation ${translation.id} failed: ${res.status} ${text}`);
  }
}

const existingFAQs = [
  {
    id: 1,
    question: 'How much does a food tour in KL cost?',
    category: 'booking',
    sort_order: 1,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "Join-in tours are RM 285 to RM 359 per person, depending on which tour you choose. Private tours are quoted on request, usually for groups of four or more. [Browse all tours](/tours/) to compare prices and itineraries, or message us on WhatsApp and we'll put together something that works for your group.",
  },
  {
    id: 2,
    question: 'How do I book?',
    category: 'booking',
    sort_order: 2,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "Book directly on any [tour page](/tours/) or message us on WhatsApp. We confirm within a few hours, often sooner. No third-party platforms, no booking fees — we keep it direct.",
  },
  {
    id: 3,
    question: 'What if I need to cancel?',
    category: 'booking',
    sort_order: 3,
    page_visibility: ['tours', 'faq', 'private-tours'],
    en_answer: "Free cancellation up to 48 hours before most tours, and 24 hours for some. We'll confirm the policy when you book. Life happens — we're flexible. [Get in touch](/contact/) if you have questions about a specific situation.",
  },
  {
    id: 4,
    question: 'How long are the tours?',
    category: 'general',
    sort_order: 4,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "Most tours run 4 to 5 hours. We pace based on your group's energy and curiosity — we're not watching a clock. If a vendor has a story worth hearing, we stop and hear it. Check [each tour page](/tours/) for specific durations.",
  },
  {
    id: 5,
    question: 'What can I expect on a food tour?',
    category: 'general',
    sort_order: 5,
    page_visibility: ['all', 'home', 'faq'],
    en_answer: "You'll visit 8-10 food stalls over 4-5 hours, tasting a variety of dishes. Your guide will share stories about the food, culture, and history. Small groups (max 9 people), local prices, no tourist traps. See what a [KL Street Food tour](/tours/kl-street-food/) looks like for a concrete idea.",
  },
  {
    id: 6,
    question: 'Can I take photos during the tour?',
    category: 'general',
    sort_order: 6,
    page_visibility: ['tours', 'faq'],
    en_answer: null, // unchanged
  },
  {
    id: 7,
    question: 'How much walking is involved?',
    category: 'general',
    sort_order: 7,
    page_visibility: ['tours', 'faq', 'how-to-prepare'],
    en_answer: "Approximately 3km over 4-5 hours, at a leisurely pace. We stop frequently to eat and listen to stories. If you have mobility concerns, let us know — we can adjust the route. Check our [preparation tips](/how-to-prepare/) for what to wear and bring.",
  },
  {
    id: 8,
    question: 'What happens if it rains?',
    category: 'general',
    sort_order: 8,
    page_visibility: ['tours', 'faq', 'how-to-prepare'],
    en_answer: "Tours run rain or shine! Malaysia's rain is intense but brief (usually 15-20 minutes). We have covered areas at most stops and will adjust the route if needed. Bring a light rain jacket — see our [what to prepare guide](/how-to-prepare/) for the full packing list.",
  },
  {
    id: 9,
    question: 'When will I receive confirmation?',
    category: 'booking',
    sort_order: 9,
    page_visibility: ['tours', 'faq'],
    en_answer: "We typically confirm within 3 hours during business hours (9am-8pm). For last-minute bookings (within 24 hours), we'll do our best to accommodate — [WhatsApp us directly](/contact/).",
  },
  {
    id: 10,
    question: "What's the minimum group size for private tours?",
    category: 'private_tours',
    sort_order: 10,
    page_visibility: ['tours', 'faq', 'private-tours'],
    en_answer: "Private tours are available for groups of 4 or more. For couples or solo travelers, [join-in tours](/tours/join-in-tours/) are a great option. See our [private tours page](/tours/private-tours/) for custom group arrangements.",
  },
  {
    id: 11,
    question: 'I have food allergies. Is it safe?',
    category: 'dietary',
    sort_order: 11,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "We take allergies seriously. Let us know when booking, and we'll brief all vendors. However, hawker stalls handle multiple ingredients, so we can't guarantee 100% allergen-free. Those with severe allergies should consult us first. We have dedicated pages for [vegetarian](/tours/dietary/vegetarian/), [gluten-free](/tours/dietary/gluten-free/), and other dietary needs. Read our [food safety guide](/stories/food-safety/) for more details.",
  },
  {
    id: 12,
    question: 'Is the food spicy?',
    category: 'general',
    sort_order: 12,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "Malaysian food can be spicy, but we adjust for your group. Most dishes have complex flavors beyond just heat. Let us know your spice tolerance, and we'll guide you accordingly. Check our [Malaysian street food checklist](/stories/must-try-malaysian-street-food/) to see what dishes await.",
  },
  {
    id: 13,
    question: 'Are there toilet breaks during the tour?',
    category: 'general',
    sort_order: 13,
    page_visibility: ['tours', 'faq'],
    en_answer: null, // unchanged
  },
  {
    id: 14,
    question: 'Is there parking near the meeting point?',
    category: 'general',
    sort_order: 14,
    page_visibility: ['tours', 'faq', 'how-to-prepare'],
    en_answer: "Yes, there's parking near all our meeting points. We'll send you detailed directions with parking information after booking. In KL and Penang, Grab (ride-sharing) is also very convenient and affordable. See our [preparation guide](/how-to-prepare/) for transportation tips.",
  },
];

const newFAQs = [
  {
    question: 'What dietary options do you accommodate?',
    category: 'dietary',
    sort_order: 15,
    page_visibility: ['all', 'home', 'tours', 'faq'],
    en_answer: "We handle vegetarian, halal, gluten-free, and most other dietary needs on our regular tours. Just tell us when booking and we'll brief every vendor on your route. We have detailed guides for [vegetarian](/tours/dietary/vegetarian/), [halal](/tours/dietary/halal/), and [gluten-free](/tours/dietary/gluten-free/) guests. A few exceptions: [vegan tours](/tours/dietary/vegan/) and certified halal require a [private or tailored tour](/tours/private-tours/) because the routes are more complex. [Message us](/contact/) and we'll figure out what works for you.",
  },
  {
    question: 'I have mobility issues. Can I still join?',
    category: 'general',
    sort_order: 16,
    page_visibility: ['tours', 'faq', 'how-to-prepare'],
    en_answer: "Yes. We walk about 3km at a relaxed pace with frequent stops, and most food stalls are at ground level. If you have specific mobility concerns, [let us know](/contact/) when booking. We can shorten the route or choose stalls with easier access. Our [private tours](/tours/private-tours/) offer the most flexibility for adapting the pace and route.",
  },
  {
    question: 'Can I book a tour as a private experience?',
    category: 'private_tours',
    sort_order: 17,
    page_visibility: ['tours', 'faq', 'tour-detail', 'join-in-tours'],
    en_answer: "Every tour can be run privately for your group. Private tours mean your own guide, flexible start time, and a route tailored to your interests and dietary needs. Groups of 4 or more. [See private tour options](/tours/private-tours/) or [message us](/contact/) to plan your tour.",
  },
  {
    question: 'Do you offer hotel pickup?',
    category: 'booking',
    sort_order: 18,
    page_visibility: ['tours', 'faq', 'private-tours'],
    en_answer: "Hotel pickup is available as an add-on for [private and tailored tours](/tours/private-tours/). For join-in tours, we meet at a central location that's easy to reach by Grab or public transport. We send detailed directions after booking, including [how to get there](/how-to-prepare/).",
  },
];

async function main() {
  console.log('🔑 Logging in...');
  const token = await login();
  console.log('✅ Logged in');

  // Update existing FAQs
  console.log('\n📝 Updating existing 14 FAQs...');
  for (const faq of existingFAQs) {
    const { id, en_answer, ...fields } = faq;
    console.log(`  FAQ ${id}: ${faq.question}`);
    
    // Update FAQ fields
    await patchFAQ(token, id, fields);
    
    // Update English translation if answer provided
    if (en_answer) {
      await updateTranslation(token, id, 'en', en_answer);
      console.log(`    ✅ English answer updated`);
    } else {
      console.log(`    ⏭️ Answer unchanged`);
    }
  }

  // Create new FAQs
  console.log('\n🆕 Creating 4 new FAQs...');
  for (const faq of newFAQs) {
    const { en_answer, ...fields } = faq;
    console.log(`  Creating: ${faq.question}`);
    
    const created = await createFAQ(token, fields);
    if (created) {
      console.log(`    ✅ Created with ID ${created.id}`);
      
      // Create English translation
      if (en_answer) {
        // For new FAQs, we need to create the translation
        const transRes = await fetch(`${API}/api/faqs-translations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
          },
          body: JSON.stringify({
            faq_id: created.id,
            languages_code: 'en',
            question: faq.question,
            answer: en_answer,
          }),
        });
        if (transRes.ok) {
          console.log(`    ✅ English translation created`);
        } else {
          const text = await transRes.text();
          console.error(`    ❌ Translation failed: ${transRes.status} ${text}`);
        }
      }
    }
  }

  // Verify
  console.log('\n📊 Verifying...');
  const verifyRes = await fetch(`${API}/api/faqs?limit=30&depth=0`, {
    headers: { 'Authorization': `JWT ${token}` },
  });
  const verifyData = await verifyRes.json();
  console.log(`  Total FAQs: ${verifyData.totalDocs}`);
  for (const faq of verifyData.docs) {
    const vis = (faq.page_visibility || []).join(', ') || '(none)';
    console.log(`  #${faq.id} [${faq.category || 'none'}] vis=${vis} — ${faq.question}`);
  }
}

main().catch(console.error);
