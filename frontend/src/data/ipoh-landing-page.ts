// Ipoh Landing Page Data - Simplified version
// Following the LocationLandingPage interface from locations.ts

export const ipohLandingPage = {
  name: "Ipoh",
  slug: "ipoh",
  region: "Perak",

  metaTitle: "Ipoh Food Tours – Old Town Hawker Culture & White Coffee | Simply Enak",
  metaDescription: "Discover Ipoh's legendary food scene with our expert-led food tours. Experience old town hawker culture, white coffee heritage, and Hakka cuisine in Malaysia's hidden gem.",

  hero: {
    title: "The Food Story of Ipoh",
    subtitle: "Old Town Hawker Culture and White Coffee Heritage",
    description: "Ipoh's old town hasn't changed much since the tin mining boom. Family-run kopitiam serve Hainanese chicken rice the way it was meant to be, and the white coffee is legendary.",
  },

  heritage: {
    title: "A City Built on Tin, Preserved by Food",
    introduction: `Ipoh was Malaysia's richest city during the tin mining boom of the early 1900s. When the tin ran out, the city went quiet—but the food culture stayed. While other cities modernized, Ipoh's hawker families kept cooking the old way.

The result? A food scene frozen in time, in the best possible way. Fourth-generation kopitiam still serve breakfast the same way they did in 1920. White coffee is still roasted over charcoal. Chicken rice vendors still use recipes brought from Hainan Island a century ago.

Ipoh's food is defined by simplicity and quality. No fancy fusion, no Instagram-worthy presentations—just perfectly executed classics. The water from Ipoh's limestone hills is famously pure, and locals swear it makes the food taste better. Whether that's true or not, there's something special about eating in a city that refuses to change.`,
  },

  foodCultures: [
    {
      name: "Hakka Cuisine",
      description: "Ipoh has a strong Hakka Chinese community, and their cuisine emphasizes preserved ingredients, simple preparations, and bold flavors. Hakka food is comfort food—hearty, unpretentious, and deeply satisfying.",
      keyDishes: ["Hakka Mee", "Yong Tau Foo", "Salt-Baked Chicken", "Lui Cha (Thunder Tea Rice)"],
      culturalContext: "Hakka cooking uses preserved vegetables, tofu, and simple stir-fries. It's peasant food elevated to an art form.",
    },
    {
      name: "Hainanese Kopitiam Culture",
      description: "Ipoh's kopitiam (coffee shop) culture is legendary. Hainanese immigrants opened these coffee shops in the early 1900s, serving white coffee, kaya toast, and soft-boiled eggs. Many are still family-run.",
      keyDishes: ["Ipoh White Coffee", "Hainanese Chicken Rice", "Kaya Toast", "Soft-Boiled Eggs"],
      culturalContext: "Kopitiam culture is about slowing down. You don't rush breakfast in Ipoh—you sit, sip coffee, and chat.",
    },
    {
      name: "Cantonese Cuisine",
      description: "Cantonese immigrants brought dim sum, roast meats, and noodle dishes that became Ipoh staples. The city's Cantonese food is known for its freshness and delicate flavors.",
      keyDishes: ["Dim Sum", "Roast Duck", "Hor Fun (Flat Rice Noodles)", "Kai See Hor Fun"],
      culturalContext: "Ipoh's smooth, flat rice noodles (hor fun) are famous across Malaysia. The limestone water makes them silkier.",
    },
  ],

  signatureDishes: [
    {
      name: "Ipoh White Coffee",
      description: "Coffee beans roasted with palm oil margarine until golden (not dark), then ground and brewed strong. Served with condensed milk. It's smoother and less bitter than regular Malaysian coffee, with a distinctive caramel flavor.",
      origin: "Hainanese - created in Ipoh's kopitiams in the 1950s",
      whereToFind: "Old town kopitiams, especially Sin Yoon Loong and Nam Heong",
      vegetarian: true,
      cultural: "Chinese",
    },
    {
      name: "Ipoh Hor Fun",
      description: "Silky smooth flat rice noodles in chicken broth with shredded chicken, prawns, and spring onions. The noodles are what make it special—Ipoh's limestone water creates a texture you can't replicate elsewhere.",
      origin: "Cantonese - Ipoh specialty",
      whereToFind: "Hawker centers and kopitiam across old town",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Hainanese Chicken Rice",
      description: "Poached chicken served with rice cooked in chicken stock, accompanied by chili sauce, ginger paste, and dark soy sauce. Simple, but when done right, it's perfection. Ipoh's versions are considered among Malaysia's best.",
      origin: "Hainanese - brought by immigrants from Hainan Island",
      whereToFind: "Specialist chicken rice shops in old town",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Tauge Ayam (Bean Sprouts Chicken)",
      description: "Poached chicken served with crunchy bean sprouts, hor fun noodles, and soy sauce. The bean sprouts are grown in Ipoh's limestone water, making them fatter and crunchier than anywhere else.",
      origin: "Ipoh specialty - unique to this city",
      whereToFind: "Specialist tauge ayam restaurants",
      vegetarian: false,
      cultural: "Chinese",
    },
  ],

  neighborhoods: [
    {
      name: "Old Town",
      description: "Ipoh's historic center, filled with pre-war shophouses, colonial architecture, and family-run kopitiams that have been serving the same breakfast for 70+ years. This is where Ipoh's food culture lives.",
      knownFor: ["White coffee", "Kopitiam culture", "Hainanese chicken rice", "Colonial architecture"],
      vibe: "Nostalgic, slow-paced, authentic. Feels like stepping back in time.",
    },
    {
      name: "Concubine Lane (Lorong Panglima)",
      description: "A narrow alley in old town that's become a mix of heritage and hipster. Old kopitiams sit next to new cafes, and you can find both traditional snacks and modern fusion food.",
      knownFor: ["Street snacks", "Cafes", "Heritage shops", "Pomelo skin candy"],
      vibe: "Touristy but charming. Mix of old and new.",
    },
  ],

  guides: [
    {
      name: "Ah Kow Lim",
      bio: "Ah Kow's family has run a kopitiam in Ipoh's old town for three generations. He knows every hawker stall, every coffee shop, and every secret food spot in the city.",
      specialties: ["Kopitiam culture", "White coffee", "Hakka cuisine"],
    },
  ],

  reviews: [
    {
      author: "Rachel W.",
      location: "Kuala Lumpur",
      rating: 5,
      date: "2024-10-01",
      text: "Ipoh's food scene is underrated! This tour showed us the best old town kopitiams and hawker stalls. The white coffee alone was worth the trip.",
      source: "Google",
      verified: true,
    },
  ],

  expectations: {
    title: "What to Expect on Your Ipoh Food Tour",
    intro: "Ipoh is about slowing down and savoring simple, perfectly executed classics:",
    items: [
      {
        title: "Old Town Kopitiam Experience",
        description: "Visit family-run coffee shops that have been serving the same breakfast for generations.",
        icon: "coffee",
      },
      {
        title: "Legendary White Coffee",
        description: "Taste the real Ipoh white coffee at its source, roasted the traditional way.",
        icon: "award",
      },
      {
        title: "Authentic Hawker Food",
        description: "Eat at stalls that locals have been visiting for decades.",
        icon: "utensils",
      },
      {
        title: "Heritage Architecture",
        description: "Walk through old town's colonial-era streets and pre-war shophouses.",
        icon: "map",
      },
    ],
  },

  faqs: [
    {
      question: "What makes Ipoh's food special?",
      answer: "Ipoh's food culture is preserved in time. The city's hawker families have been cooking the same dishes the same way for generations. Plus, the limestone water is famously pure and locals believe it makes the food taste better.",
    },
    {
      question: "Is Ipoh worth visiting just for food?",
      answer: "Absolutely! Ipoh is a food lover's paradise. The old town kopitiam culture, white coffee, and hawker food are reason enough to visit. It's also much less touristy than Penang or KL.",
    },
  ],
};
