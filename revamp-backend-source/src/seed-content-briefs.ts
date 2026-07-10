/**
 * Content Briefs Seed Data — questions for each segment group.
 * These will be used to populate the ContentBriefs collection in Payload.
 * Each brief feeds both landing pages AND guide stories via the same questions.
 *
 * Grouping: 48 landing pages → 20 briefs (shared across city variants where content overlaps)
 */

export interface BriefQuestion {
  question: string;
  intendedFor: 'landing_page' | 'guide' | 'both';
}

export interface BriefSeed {
  title: string;
  slug: string;
  segmentType: 'dietary' | 'specialty' | 'location' | 'travel_type';
  landingPageSlugs: string;
  guideSlug: string;
  questions: BriefQuestion[];
  notes: string;
}

export const briefs: BriefSeed[] = [
  // ════════════════════════════════════════════════════════════════
  // 🥗 DIETARY BRIEFS
  // ════════════════════════════════════════════════════════════════

  {
    title: 'Halal Food Tours',
    slug: 'brief-halal',
    segmentType: 'dietary',
    landingPageSlugs: 'halal-food-tours, halal-food-tours-kuala-lumpur, halal-food-tours-penang',
    guideSlug: 'halal-guide-kuala-lumpur',
    questions: [
      { question: 'What specific halal dishes do guests most commonly discover on tour? Name 3-5 dishes they tell you were the highlight.', intendedFor: 'both' },
      { question: 'Which halal stalls in KL have the best personal stories behind them? Name specific stall owners, how long they have been operating, and what makes their food special.', intendedFor: 'both' },
      { question: 'What is the one thing guests are most surprised to learn about halal food in Malaysia?', intendedFor: 'both' },
      { question: 'Halal Chinese food is unique to Malaysia. What specific Chinese-Muslim dishes do you showcase, and which restaurant/stall does them best?', intendedFor: 'both' },
      { question: 'Describe a memorable moment where a halal-conscious guest realized they could eat everything on the tour without worry.', intendedFor: 'landing_page' },
      { question: 'What practical advice would you give a Muslim traveller visiting KL for the first time regarding halal street food?', intendedFor: 'guide' },
      { question: 'Which neighborhoods in KL and Penang have the highest concentration of must-visit halal food stalls? Name specific streets or markets.', intendedFor: 'guide' },
      { question: 'How does halal food in Penang differ from halal food in KL? Are there dishes unique to each city?', intendedFor: 'guide' },
      { question: 'What is the most common misconception travellers have about halal food in Malaysia, and what is the truth?', intendedFor: 'guide' },
    ],
    notes: 'Brief feeds halal landing pages at all scopes (MY, KL, Penang) + the halal guide story. The guide should stand alone as a complete resource.',
  },

  {
    title: 'Vegetarian Food Tours',
    slug: 'brief-vegetarian',
    segmentType: 'dietary',
    landingPageSlugs: 'vegetarian-food-tours, vegetarian-food-tours-kuala-lumpur, vegetarian-food-tours-penang',
    guideSlug: 'vegetarian-guide-kuala-lumpur',
    questions: [
      { question: 'What specific vegetarian dishes surprise guests the most (because they taste so substantial)? Name dishes and which stall makes them.', intendedFor: 'both' },
      { question: 'Brickfields is known for banana leaf rice. Which specific restaurants or stalls do you visit, and what is the story behind them?', intendedFor: 'both' },
      { question: 'What is the biggest challenge vegetarian travellers face in KL, and how do your tours solve it?', intendedFor: 'landing_page' },
      { question: 'What mock meat / vegetarian protein dishes do Buddhist temple kitchens serve that most tourists never discover?', intendedFor: 'both' },
      { question: 'How does Malaysian vegetarian food differ from Western vegetarian food? What ingredients and techniques are unique here?', intendedFor: 'guide' },
      { question: 'Name 3-5 stalls or restaurants in KL that are MUST-VISIT for vegetarians but are completely unknown to tourists.', intendedFor: 'guide' },
      { question: 'Describe the vegetarian scene in Penang compared to KL — what dishes or experiences are unique to each?', intendedFor: 'guide' },
      { question: 'What is the most common vegetarian food myth about Malaysia (e.g. "everything has shrimp paste"), and what is the real answer?', intendedFor: 'guide' },
    ],
    notes: 'Feeds vegetarian landing pages at all scopes + the vegetarian guide. Current guide slug in static data is "vegetarian-guide-kuala-lumpur".',
  },

  {
    title: 'Vegan Food Tours',
    slug: 'brief-vegan',
    segmentType: 'dietary',
    landingPageSlugs: 'vegan-food-tours, vegan-food-tours-kuala-lumpur, vegan-food-tours-penang',
    guideSlug: 'vegan-guide-kuala-lumpur',
    questions: [
      { question: 'What are the most naturally vegan dishes in Malaysian cuisine that guests are thrilled to discover?', intendedFor: 'both' },
      { question: 'Which specific KL stalls or restaurants serve excellent vegan versions of traditionally non-vegan dishes?', intendedFor: 'both' },
      { question: 'What hidden-ingredient pitfalls (shrimp paste, fish sauce, lard) do you help vegan guests avoid?', intendedFor: 'landing_page' },
      { question: 'How does Buddhist zhai (temple vegetarian/vegan) cooking differ from what most Western vegans expect?', intendedFor: 'guide' },
      { question: 'What is the best vegan-friendly dessert or sweet snack in KL that most tourists miss?', intendedFor: 'both' },
      { question: 'Which Penang-specific vegan dishes or stalls are worth a special trip?', intendedFor: 'guide' },
      { question: 'What would you tell a vegan traveller who is nervous about visiting Malaysia for food?', intendedFor: 'guide' },
    ],
    notes: 'Vegan is a new growth area. Guide slug does not yet exist in stories — needs to be created.',
  },

  {
    title: 'Gluten-Free Food Tours',
    slug: 'brief-gluten-free',
    segmentType: 'dietary',
    landingPageSlugs: 'gluten-free-food-tours, gluten-free-food-tours-kuala-lumpur, gluten-free-food-tours-penang',
    guideSlug: null as any, // no guide yet
    questions: [
      { question: 'Which Malaysian dishes are naturally gluten-free (rice-based) and make the best tour stops?', intendedFor: 'both' },
      { question: 'What hidden sources of gluten do guests need to watch out for in Malaysian cooking (soy sauce, certain marinades)?', intendedFor: 'both' },
      { question: 'Can you name specific stalls that clearly understand gluten-free requirements and accommodate them well?', intendedFor: 'both' },
      { question: 'What is the most common concern gluten-free guests have before the tour, and how does the experience change their mind?', intendedFor: 'landing_page' },
      { question: 'What gluten-free Malaysian dishes are hardest to find outside Malaysia?', intendedFor: 'guide' },
    ],
    notes: 'No guide story exists yet for gluten-free. Brief feeds landing pages only until guide is created.',
  },

  {
    title: 'Jain Food Tours',
    slug: 'brief-jain',
    segmentType: 'dietary',
    landingPageSlugs: 'jain-food-tours, jain-food-tours-kuala-lumpur, jain-food-tours-penang',
    guideSlug: null as any, // niche — guide may not be needed
    questions: [
      { question: 'What makes Jain dietary requirements different from vegetarian or vegan, and how do you accommodate them on tour?', intendedFor: 'both' },
      { question: 'Which specific KL stalls are able to prepare Jain-friendly versions of dishes?', intendedFor: 'both' },
      { question: 'What is the biggest surprise Jain guests experience on your tour?', intendedFor: 'landing_page' },
    ],
    notes: 'Niche segment. Consider whether a full guide is needed or if the landing page covers it sufficiently.',
  },

  // ════════════════════════════════════════════════════════════════
  // ⭐ SPECIALTY BRIEFS
  // ════════════════════════════════════════════════════════════════

  {
    title: 'Street Food Tours',
    slug: 'brief-street-food',
    segmentType: 'specialty',
    landingPageSlugs: 'street-food-tours, street-food-tours-kuala-lumpur, street-food-tours-penang',
    guideSlug: 'street-food-guide-kuala-lumpur',
    questions: [
      { question: 'What are the TOP 5 street food dishes every first-time visitor must try, and which specific stalls do you take them to?', intendedFor: 'both' },
      { question: 'What tells you a street food stall is good — what do you look for that a tourist would not know to look for?', intendedFor: 'both' },
      { question: 'Describe the sensory experience of a great street food spot — the sights, sounds, smells that make it unforgettable.', intendedFor: 'landing_page' },
      { question: 'How does KL street food culture differ from Penang? What is each city best known for?', intendedFor: 'guide' },
      { question: 'What street food stalls have the best personal stories — the hawker who has been there 40+ years, or the family recipe that traces back generations?', intendedFor: 'both' },
      { question: 'What is the one street food experience that consistently gets the strongest reaction from guests?', intendedFor: 'landing_page' },
      { question: 'What practical tips would you give someone nervous about eating street food for the first time?', intendedFor: 'guide' },
      { question: 'Which neighborhoods have the best street food scenes that tourists usually miss?', intendedFor: 'guide' },
    ],
    notes: 'Core specialty. Street food is the primary draw for most visitors. Guide slug "street-food-guide-kuala-lumpur" exists in Payload stories.',
  },

  {
    title: 'Night Food Tours',
    slug: 'brief-night-food',
    segmentType: 'specialty',
    landingPageSlugs: 'night-food-tours, night-food-tours-kuala-lumpur, night-food-tours-penang',
    guideSlug: null as any, // no guide yet
    questions: [
      { question: 'What makes KL\'s night food scene different from its daytime food? Which stalls only operate at night?', intendedFor: 'both' },
      { question: 'Describe the atmosphere of the best night market or supper spot you take guests to — what makes it magical?', intendedFor: 'landing_page' },
      { question: 'What are the must-try late-night dishes that are unique to the after-dark food scene?', intendedFor: 'both' },
      { question: 'How do night food tours in Penang differ from KL?', intendedFor: 'guide' },
      { question: 'What safety or logistics advice would you give someone doing a night food tour?', intendedFor: 'guide' },
    ],
    notes: 'Night food tour is the "Secrets of KL" tour focus. Could be paired with the existing nightlife content.',
  },

  {
    title: 'Market Food Tours',
    slug: 'brief-market-food',
    segmentType: 'specialty',
    landingPageSlugs: 'market-tours, market-tours-kuala-lumpur, market-tours-penang',
    guideSlug: null as any,
    questions: [
      { question: 'Which wet markets or morning markets do you visit, and what makes each one special?', intendedFor: 'both' },
      { question: 'What should a visitor look for, smell, and taste at a Malaysian wet market?', intendedFor: 'both' },
      { question: 'Describe a specific interaction between a guest and a market vendor that captures the experience.', intendedFor: 'landing_page' },
      { question: 'What is the best time to visit each market, and what should guests try there?', intendedFor: 'guide' },
    ],
    notes: 'Market tours combine food + culture. Links to the "Flavours of Malaysia" tour.',
  },

  {
    title: 'Heritage Food Tours',
    slug: 'brief-heritage-food',
    segmentType: 'specialty',
    landingPageSlugs: 'heritage-food-tours, heritage-food-tours-kuala-lumpur, heritage-food-tours-penang',
    guideSlug: null as any,
    questions: [
      { question: 'What is the connection between the food you serve and the history of the neighborhood you walk through? Give specific examples.', intendedFor: 'both' },
      { question: 'Which heritage buildings or areas do you visit, and what food stories are connected to them?', intendedFor: 'both' },
      { question: 'How do the colonial histories of KL and Penang show up in their respective food cultures?', intendedFor: 'guide' },
      { question: 'What specific dish tells the best "Malaysia migration story" on your tour?', intendedFor: 'landing_page' },
    ],
    notes: 'Heritage tours appeal to culture-focused travellers. Could pair with heritage-themed guide.',
  },

  // ════════════════════════════════════════════════════════════════
  // 📍 LOCATION BRIEFS
  // ════════════════════════════════════════════════════════════════

  {
    title: 'Kuala Lumpur Food Tours',
    slug: 'brief-kuala-lumpur',
    segmentType: 'location',
    landingPageSlugs: 'food-tours-kuala-lumpur, chinatown-food-tour-kuala-lumpur, little-india-food-tour-kuala-lumpur, kampung-baru-food-tour, chow-kit-market-food-tour',
    guideSlug: 'food-guide-kuala-lumpur',
    questions: [
      { question: 'What makes KL\'s food culture unique compared to other Southeast Asian capitals? Summarize in one compelling paragraph.', intendedFor: 'both' },
      { question: 'Which specific neighborhoods represent the best of KL\'s food diversity? Name stalls, dishes, and the stories behind each area.', intendedFor: 'both' },
      { question: 'Describe a guest\'s reaction that captures why KL food tours are different from just eating at restaurants.', intendedFor: 'landing_page' },
      { question: 'What hidden food gem in KL do most tourists walk right past, and what makes it special?', intendedFor: 'both' },
      { question: 'What is KL\'s most underrated dish — the one locals love but tourists rarely try?', intendedFor: 'guide' },
      { question: 'How has KL\'s food scene changed in the last decade, and what classic experiences are disappearing?', intendedFor: 'guide' },
      { question: 'What would you recommend for someone with only 24 hours in KL to eat?', intendedFor: 'guide' },
      { question: 'Chinatown vs Little India vs Kampung Baru — what is each best for?', intendedFor: 'guide' },
    ],
    notes: 'Core location brief. Feeds the main KL landing page + neighborhood-specific pages. Guide slug "food-guide-kuala-lumpur" exists.',
  },

  {
    title: 'Penang Food Tours',
    slug: 'brief-penang',
    segmentType: 'location',
    landingPageSlugs: 'food-tours-penang, chowrasta-market-food-tour, georgetown-heritage-food-tour, gurney-drive-food-tour, little-india-food-tour-penang',
    guideSlug: 'food-guide-penang',
    questions: [
      { question: 'Why is Penang considered the street food capital of Asia? What specific dishes earn it that reputation?', intendedFor: 'both' },
      { question: 'What makes Penang\'s Char Koay Teow different from versions elsewhere? Which specific stall makes it best?', intendedFor: 'both' },
      { question: 'Describe a specific guest reaction that shows why Penang food tours create lasting memories.', intendedFor: 'landing_page' },
      { question: 'What Penang-specific dish is hardest to find outside the island?', intendedFor: 'guide' },
      { question: 'Georgetown vs Gurney Drive vs Balik Pulau — what is each area known for food-wise?', intendedFor: 'guide' },
      { question: 'What is the best time of day to experience Penang\'s food scene, and why?', intendedFor: 'guide' },
      { question: 'What food memory from Penang do guests mention most in their reviews?', intendedFor: 'landing_page' },
    ],
    notes: 'Core location brief for Penang. Feeds the main Penang page + neighborhood pages. Guide slug "food-guide-penang" exists.',
  },

  {
    title: 'Melaka Food Tours',
    slug: 'brief-melaka',
    segmentType: 'location',
    landingPageSlugs: 'food-tours-melaka',
    guideSlug: null as any,
    questions: [
      { question: 'What makes Melaka\'s food unique — how does the Peranakan/Nyonya influence show up in specific dishes?', intendedFor: 'both' },
      { question: 'What is the one dish in Melaka that a visitor absolutely cannot miss, and where should they get it?', intendedFor: 'both' },
      { question: 'How does a food tour in Melaka differ from one in KL or Penang?', intendedFor: 'landing_page' },
    ],
    notes: 'Melaka is a smaller destination. Landing page exists but no dedicated guide story yet.',
  },

  {
    title: 'Ipoh Food Tours',
    slug: 'brief-ipoh',
    segmentType: 'location',
    landingPageSlugs: 'food-tours-ipoh',
    guideSlug: null as any,
    questions: [
      { question: 'What makes Ipoh\'s food scene distinct from other Malaysian cities? What dishes originated there?', intendedFor: 'both' },
      { question: 'White coffee is Ipoh\'s claim to fame — what is the story behind it, and which shop makes the best?', intendedFor: 'both' },
      { question: 'Why should someone choose Ipoh over better-known food destinations?', intendedFor: 'landing_page' },
    ],
    notes: 'Ipoh is an emerging destination. No guide exists yet.',
  },

  {
    title: 'Klang Food Tours',
    slug: 'brief-klang',
    segmentType: 'location',
    landingPageSlugs: 'food-tours-klang',
    guideSlug: null as any,
    questions: [
      { question: 'What is Klang best known for food-wise, and which specific stall or restaurant defines it?', intendedFor: 'both' },
      { question: 'How does Klang\'s food culture differ from Kuala Lumpur\'s, given they are so close geographically?', intendedFor: 'both' },
    ],
    notes: 'Klang is a niche location. Brief exists in Payload but may not need full content treatment.',
  },

  // ════════════════════════════════════════════════════════════════
  // 🧳 TRAVEL TYPE BRIEFS
  // ════════════════════════════════════════════════════════════════

  {
    title: 'Family Food Tours',
    slug: 'brief-families',
    segmentType: 'travel_type',
    landingPageSlugs: 'food-tours-for-families-kuala-lumpur, food-tours-for-families-penang',
    guideSlug: 'families-guide-kuala-lumpur',
    questions: [
      { question: 'What makes a food tour work well for families with kids? What specific things do you do differently?', intendedFor: 'both' },
      { question: 'Describe a specific family that had an amazing time on tour — what dishes did the kids love most?', intendedFor: 'landing_page' },
      { question: 'What ages work best for family food tours, and what do you do for picky eaters?', intendedFor: 'both' },
      { question: 'How does a family tour in KL differ from one in Penang in terms of pacing, stops, and kid-friendliness?', intendedFor: 'guide' },
    ],
    notes: 'Families are a key demographic. Guide slugs exist (families-guide-kuala-lumpur, families-guide-penang).',
  },

  {
    title: 'Couples Food Tours',
    slug: 'brief-couples',
    segmentType: 'travel_type',
    landingPageSlugs: 'food-tours-for-couples-kuala-lumpur, food-tours-for-couples-penang',
    guideSlug: 'couples-guide-kuala-lumpur',
    questions: [
      { question: 'What makes a food tour romantic or special for couples? What do you do to create that atmosphere?', intendedFor: 'both' },
      { question: 'Describe a couple who had a memorable experience — what made it special for them?', intendedFor: 'landing_page' },
      { question: 'What is the best time of day for a couples food tour, and why?', intendedFor: 'both' },
    ],
    notes: 'Couples are a growing segment. Guide slug exists.',
  },

  {
    title: 'Solo & Foodie Food Tours',
    slug: 'brief-solo-foodies',
    segmentType: 'travel_type',
    landingPageSlugs: 'food-tours-for-foodies-kuala-lumpur, food-tours-for-foodies-penang',
    guideSlug: null as any,
    questions: [
      { question: 'What makes a food tour great for solo travellers? How do you make them feel welcome?', intendedFor: 'both' },
      { question: 'What do "foodie" guests appreciate most that casual diners might not notice?', intendedFor: 'landing_page' },
      { question: 'Describe a solo traveller who joined a tour and ended up having a transformative experience.', intendedFor: 'landing_page' },
      { question: 'What deeper food knowledge do you share on tours that appeals to serious foodies?', intendedFor: 'guide' },
    ],
    notes: 'Solo + foodie travellers are overlapping segments. Could be one brief or split if content needs diverge.',
  },

  {
    title: 'Chefs & Wedding Group Food Tours',
    slug: 'brief-chefs-weddings',
    segmentType: 'travel_type',
    landingPageSlugs: 'food-tours-for-chefs, food-tours-for-wedding-groups',
    guideSlug: 'chefs-guide-kuala-lumpur',
    questions: [
      { question: 'What do you show chefs on a food tour that is different from a standard tour? What deeper access do they get?', intendedFor: 'both' },
      { question: 'Describe a chef guest who was particularly impressed by something they learned or tasted.', intendedFor: 'landing_page' },
      { question: 'For wedding groups: how do you handle larger groups while keeping the experience intimate and special?', intendedFor: 'landing_page' },
      { question: 'What dishes or techniques do chefs find most interesting or surprising?', intendedFor: 'guide' },
    ],
    notes: 'Chefs and wedding groups are distinct but niche. Chef guide slug exists.',
  },
];
