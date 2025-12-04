// Penang Landing Page Data - Simplified version
// Following the LocationLandingPage interface from locations.ts

export const penangLandingPage = {
  name: "Penang (Georgetown)",
  slug: "penang",
  region: "Penang",

  metaTitle: "Penang Food Tours – UNESCO Heritage Street Food | Simply Enak",
  metaDescription: "Explore Georgetown's UNESCO-recognized food scene with our expert-led Penang food tours. Discover Hokkien, Teochew, and Peranakan cuisine in Malaysia's street food capital.",

  hero: {
    title: "The Food Story of Penang",
    subtitle: "UNESCO World Heritage Street Food Capital",
    description: "Georgetown's food scene earned UNESCO recognition not by accident, but through generations of families perfecting their recipes. Hokkien, Teochew, and Peranakan communities created dishes you can't find anywhere else.",
  },

  heritage: {
    title: "A UNESCO-Recognized Food Heritage",
    introduction: `Penang's Georgetown is more than just a pretty colonial town—it's a living museum of Malaysian food culture. When UNESCO granted it World Heritage status in 2008, they weren't just recognizing the architecture. They were acknowledging centuries of culinary traditions preserved by families who've been cooking the same dishes for generations.

The island's food story begins with Chinese immigrants who arrived in the 18th and 19th centuries. Hokkien, Teochew, Hakka, and Cantonese communities each brought their regional cuisines, then adapted them to local ingredients and tastes. The result? Dishes like char kway teow, Hokkien mee, and assam laksa that exist nowhere else in the world.

But Penang's magic is in how these traditions survived. While other cities modernized and homogenized, Georgetown's hawker families kept cooking the old way. Fourth-generation char kway teow cooks still use the same wok their great-grandfather used. Laksa vendors still make their paste by hand every morning. This isn't nostalgia—it's living heritage.`,
  },

  foodCultures: [
    {
      name: "Hokkien Cuisine",
      description: "The dominant Chinese dialect group in Penang, Hokkien immigrants created some of the island's most iconic dishes. Their cooking emphasizes seafood, pork, and the art of wok hei—that smoky, charred flavor from high-heat cooking.",
      keyDishes: ["Char Kway Teow", "Hokkien Mee", "Lor Bak", "Oh Chien (Oyster Omelette)"],
      culturalContext: "Hokkien food in Penang is all about the wok. The best hawkers have been using the same seasoned wok for decades, and you can taste the difference.",
    },
    {
      name: "Peranakan (Nyonya) Cuisine",
      description: "Born from marriages between Chinese men and Malay women, Peranakan culture created Nyonya cuisine—a unique fusion that uses Chinese techniques with Malay spices. It's elaborate, time-intensive, and deeply connected to family traditions.",
      keyDishes: ["Assam Laksa", "Nyonya Laksa", "Pie Tee", "Kuih Pie Tee"],
      culturalContext: "Nyonya cooking requires hand-pounded spice pastes and recipes passed down through generations. It's considered the most refined Malaysian cuisine.",
    },
    {
      name: "Indian Malaysian Cuisine",
      description: "Penang's Indian community, primarily Tamil, brought South Indian flavors that evolved into something distinctly Penang. Banana leaf rice, nasi kandar, and roti canai are daily staples.",
      keyDishes: ["Nasi Kandar", "Roti Canai", "Murtabak", "Banana Leaf Rice"],
      culturalContext: "Nasi kandar originated in Penang, created by Indian Muslim vendors who carried rice and curry on shoulder poles (kandar).",
    },
  ],

  signatureDishes: [
    {
      name: "Char Kway Teow",
      description: "Flat rice noodles stir-fried over intense heat with prawns, cockles, Chinese sausage, bean sprouts, and egg. The secret is wok hei—that smoky flavor you can only get from a well-seasoned wok over charcoal.",
      origin: "Hokkien - created by poor laborers using cheap ingredients",
      whereToFind: "Hawker centers across Georgetown, especially Lorong Selamat",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Assam Laksa",
      description: "Penang's most famous dish. Rice noodles in a sour, spicy fish broth made with tamarind, lemongrass, and torch ginger. Topped with mint, pineapple, onions, and shrimp paste. It's an acquired taste that becomes an obsession.",
      origin: "Peranakan (Nyonya) - unique to Penang",
      whereToFind: "Air Itam, Balik Pulau, and hawker centers",
      vegetarian: false,
      cultural: "Fusion (Peranakan)",
    },
    {
      name: "Hokkien Mee",
      description: "Prawn noodle soup with a rich, sweet broth made from prawn heads and pork bones. Served with yellow noodles, rice noodles, prawns, pork, and kangkung. Penang's version is completely different from KL's.",
      origin: "Hokkien - Penang specialty",
      whereToFind: "Specialist Hokkien mee stalls, best in the morning",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Nasi Kandar",
      description: "Steamed rice served with a variety of curries and side dishes. You choose what you want, and the vendor mixes the gravies over your rice. It's messy, flavorful, and utterly addictive.",
      origin: "Indian Muslim - originated in Penang",
      whereToFind: "Nasi kandar restaurants, open 24/7",
      vegetarian: false,
      cultural: "Indian",
    },
  ],

  neighborhoods: [
    {
      name: "Georgetown Heritage Zone",
      description: "The heart of Penang's food culture. Pre-war shophouses hide family-run kopitiams, hawker stalls that have been in the same spot for 70 years, and street food vendors who start cooking at dawn.",
      knownFor: ["Char kway teow", "Hokkien mee", "Kopitiam culture", "Street art"],
      vibe: "Historic, bustling, authentic. UNESCO heritage meets daily life.",
    },
    {
      name: "Gurney Drive",
      description: "Penang's most famous hawker center strip. Dozens of stalls serving everything from satay to cendol, all facing the sea. It's touristy, but locals still eat here because the food is good.",
      knownFor: ["Hawker food variety", "Seafood", "Sunset dining", "Cendol"],
      vibe: "Lively, social, beachfront. Peak hours are packed.",
    },
    {
      name: "Air Itam",
      description: "A local neighborhood known for the best assam laksa on the island. Less touristy, more residential, and home to some of Penang's most beloved hawker stalls.",
      knownFor: ["Assam laksa", "Local hawker food", "Kek Lok Si Temple"],
      vibe: "Residential, authentic, local favorite.",
    },
  ],

  guides: [
    {
      name: "Mei Ling Tan",
      bio: "Born and raised in Georgetown, Mei Ling grew up in her family's kopitiam and knows every hawker stall in the heritage zone. She's passionate about preserving Penang's food traditions.",
      specialties: ["Hokkien cuisine", "Hawker culture", "Georgetown heritage"],
    },
    {
      name: "Kumar Suppiah",
      bio: "Kumar's family has run a banana leaf rice restaurant in Little India for three generations. He loves sharing the story of how Indian cuisine evolved in Penang.",
      specialties: ["Indian Malaysian food", "Nasi kandar", "Spice knowledge"],
    },
  ],

  reviews: [
    {
      author: "Jennifer K.",
      location: "Singapore",
      rating: 5,
      date: "2024-10-15",
      text: "Best food tour I've ever taken! Our guide knew every vendor personally and the stories behind each dish. The char kway teow was life-changing.",
      source: "TripAdvisor",
      verified: true,
    },
    {
      author: "Michael T.",
      location: "Australia",
      rating: 5,
      date: "2024-09-20",
      text: "Penang's food scene is incredible, and this tour showed us the best of it. Small group, knowledgeable guide, amazing food. Highly recommend!",
      source: "Google",
      verified: true,
    },
  ],

  expectations: {
    title: "What to Expect on Your Penang Food Tour",
    intro: "Every tour is different, but here's what you can count on:",
    items: [
      {
        title: "UNESCO Heritage Experience",
        description: "Walk through Georgetown's heritage zone and understand why UNESCO recognized this food culture.",
        icon: "award",
      },
      {
        title: "Authentic Hawker Food",
        description: "Eat at family-run stalls that have been cooking the same dishes for generations.",
        icon: "utensils",
      },
      {
        title: "Small Group Tours",
        description: "Maximum 8 people for personal attention and real conversations.",
        icon: "users",
      },
      {
        title: "Local Expert Guides",
        description: "Guides who grew up in Penang and know the food scene intimately.",
        icon: "map",
      },
    ],
  },

  faqs: [
    {
      question: "What makes Penang's food different from KL?",
      answer: "Penang has a stronger Hokkien and Peranakan influence, and the food tends to be more intense in flavor. Dishes like char kway teow and assam laksa are Penang specialties that taste different (or don't exist) in KL.",
    },
    {
      question: "How much walking is involved?",
      answer: "Tours involve 2-3 km of walking at a leisurely pace through Georgetown's heritage zone. Comfortable shoes are essential.",
    },
    {
      question: "Can you accommodate dietary restrictions?",
      answer: "Yes! We regularly accommodate vegetarians, vegans, and food allergies. Penang has excellent vegetarian options due to the Buddhist community.",
    },
  ],
};
