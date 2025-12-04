// Klang Landing Page Data - Simplified version
// Following the LocationLandingPage interface from locations.ts

export const klangLandingPage = {
  name: "Klang",
  slug: "klang",
  region: "Selangor",

  metaTitle: "Klang Food Tours – Bak Kut Teh Capital of Malaysia | Simply Enak",
  metaDescription: "Experience Klang's legendary bak kut teh and royal Malay cuisine with our expert-led food tours. Discover the birthplace of Malaysia's most famous herbal pork soup.",

  hero: {
    title: "The Food Story of Klang",
    subtitle: "Bak Kut Teh Capital and Royal Malay Heritage",
    description: "Klang is where bak kut teh was born. This port town's Chinese laborers created the herbal pork rib soup that became a Malaysian obsession. But there's more—Klang is also home to royal Malay cuisine and a thriving Indian food scene.",
  },

  heritage: {
    title: "A Port Town's Culinary Legacy",
    introduction: `Klang's food story begins at the port. In the early 1900s, Chinese laborers working at Port Klang needed hearty, nourishing food to fuel their grueling days. They created bak kut teh—pork ribs simmered in a complex herbal broth with garlic, star anise, and Chinese medicinal herbs. It was cheap, filling, and restorative.

What started as working-class sustenance became a Malaysian obsession. Today, Klang is the bak kut teh capital of Malaysia, with dozens of specialist shops serving different styles—some with dark, herbal broths, others with clear, peppery versions. Locals debate which shop is best with the passion usually reserved for football.

But Klang isn't just about bak kut teh. As the royal town of Selangor, it's home to traditional Malay palace cuisine. And the Indian community brought banana leaf rice and roti canai that locals queue for. Klang may not be as famous as Penang or KL, but for food lovers, it's a hidden gem.`,
  },

  foodCultures: [
    {
      name: "Hokkien & Teochew Cuisine",
      description: "Klang's Chinese community, primarily Hokkien and Teochew, created bak kut teh and other port town classics. Their cooking emphasizes pork, seafood, and bold, comforting flavors.",
      keyDishes: ["Bak Kut Teh", "Pork Noodles", "Seafood", "Teochew Porridge"],
      culturalContext: "Bak kut teh is eaten for breakfast or lunch, often with youtiao (fried dough sticks) dipped in the broth. It's comfort food and hangover cure rolled into one.",
    },
    {
      name: "Royal Malay Cuisine",
      description: "As Selangor's royal town, Klang has a tradition of refined Malay cooking. Palace-style dishes use premium ingredients and complex spice blends, representing the height of Malay culinary art.",
      keyDishes: ["Nasi Hujan Panas", "Rendang Tok", "Gulai Kawah", "Royal Kuih"],
      culturalContext: "Royal Malay cuisine is reserved for special occasions and celebrations. It's more elaborate than everyday Malay cooking.",
    },
    {
      name: "Indian Malaysian Cuisine",
      description: "Klang's Indian community, primarily Tamil, runs some of the best banana leaf rice restaurants in Malaysia. The food is bold, spicy, and unapologetically flavorful.",
      keyDishes: ["Banana Leaf Rice", "Fish Head Curry", "Roti Canai", "Mutton Varuval"],
      culturalContext: "Banana leaf meals are communal and hands-on. You eat with your right hand, mixing rice with curries directly on the leaf.",
    },
  ],

  signatureDishes: [
    {
      name: "Bak Kut Teh",
      description: "Pork ribs simmered for hours in a complex herbal broth with garlic, star anise, and Chinese medicinal herbs. Served with rice, youtiao (fried dough sticks), and Chinese tea. Klang is the birthplace and still the best place to eat it.",
      origin: "Hokkien/Teochew - created by port laborers in Klang",
      whereToFind: "Specialist bak kut teh shops across Klang, especially in Teluk Pulai",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Banana Leaf Rice",
      description: "White rice served on a banana leaf with an array of curries, vegetables, papadum, and pickles. You choose your proteins (fish, chicken, mutton) and the vendor pours different gravies over your rice. Messy, delicious, and utterly satisfying.",
      origin: "South Indian - adapted in Malaysia",
      whereToFind: "Indian restaurants in Klang, especially Little India area",
      vegetarian: false,
      cultural: "Indian",
    },
    {
      name: "Nasi Hujan Panas",
      description: "A Klang specialty—rice cooked with coconut milk and spices, served with beef rendang, chicken curry, and sambal. The name means 'hot rain rice' because it's traditionally eaten during rainy weather.",
      origin: "Malay - Klang/Selangor specialty",
      whereToFind: "Malay restaurants and nasi campur stalls",
      vegetarian: false,
      cultural: "Malay",
    },
  ],

  neighborhoods: [
    {
      name: "Teluk Pulai",
      description: "The bak kut teh heartland. This area is lined with bak kut teh shops, each with their loyal following. Locals will drive from KL just to eat here.",
      knownFor: ["Bak kut teh", "Pork noodles", "Chinese hawker food"],
      vibe: "Working-class, authentic, no-frills. All about the food.",
    },
    {
      name: "Little India Klang",
      description: "Klang's Indian quarter, filled with banana leaf rice restaurants, Indian sweet shops, and Tamil culture. The food is bold, spicy, and unapologetically authentic.",
      knownFor: ["Banana leaf rice", "Fish head curry", "Indian sweets", "Roti canai"],
      vibe: "Vibrant, colorful, aromatic. Feels like South India.",
    },
  ],

  guides: [
    {
      name: "Seng Huat",
      bio: "Seng Huat grew up in Klang's Chinese community and knows every bak kut teh shop in town. His family has been eating at the same stalls for three generations.",
      specialties: ["Bak kut teh", "Chinese hawker food", "Port town history"],
    },
  ],

  reviews: [
    {
      author: "David L.",
      location: "Kuala Lumpur",
      rating: 5,
      date: "2024-09-15",
      text: "Best bak kut teh I've ever had! Our guide took us to three different shops and explained the differences. Klang is the real deal for this dish.",
      source: "Google",
      verified: true,
    },
  ],

  expectations: {
    title: "What to Expect on Your Klang Food Tour",
    intro: "Klang is all about bold flavors and authentic, no-frills cooking:",
    items: [
      {
        title: "Bak Kut Teh Experience",
        description: "Taste the legendary herbal pork rib soup at its birthplace, with expert guidance on different styles.",
        icon: "utensils",
      },
      {
        title: "Authentic Port Town Food",
        description: "Eat at working-class hawker stalls that have been serving the same dishes for decades.",
        icon: "award",
      },
      {
        title: "Multicultural Cuisine",
        description: "Experience Chinese, Malay, and Indian food in one tour.",
        icon: "users",
      },
      {
        title: "Local Expert Guide",
        description: "Guides who grew up in Klang and know the food scene intimately.",
        icon: "map",
      },
    ],
  },

  faqs: [
    {
      question: "What makes Klang's bak kut teh special?",
      answer: "Klang is where bak kut teh was invented by port laborers. The town has perfected it over generations, and locals are passionate about which shop makes it best. You'll taste the difference.",
    },
    {
      question: "Is Klang worth visiting from KL?",
      answer: "Yes! Klang is only 30-40 minutes from KL and offers a completely different food experience. It's less touristy and more authentic than the capital.",
    },
  ],
};
