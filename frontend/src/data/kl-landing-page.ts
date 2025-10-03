// Kuala Lumpur Food Tour Landing Page
// Educational-first approach: teach about KL's food culture, then present tours

import type { LocationLandingPage } from './locations';

export const kualaLumpurLandingPage: LocationLandingPage = {
  name: "Kuala Lumpur",
  slug: "kuala-lumpur-food-tour",
  region: "Federal Territory",

  metaTitle: "Kuala Lumpur Food & Heritage Guide – Discover Authentic Malaysian Cuisine",
  metaDescription: "Explore Kuala Lumpur's multicultural food scene—from nasi lemak to char kway teow. Learn about Malay, Chinese, and Indian culinary traditions, iconic dishes, and the best neighborhoods to experience authentic Malaysian cuisine.",

  hero: {
    title: "Kuala Lumpur: Where Three Cultures Meet on a Plate",
    subtitle: "A Food Lover's Guide to Malaysia's Capital",
    description: "Kuala Lumpur isn't just a city—it's a living museum of Malaysian food culture. Here, Malay, Chinese, and Indian traditions have mixed for over 150 years, creating one of the world's most diverse and delicious food scenes.",
    ctaText: "Explore KL's Food Heritage",
    ctaUrl: "#heritage",
    backgroundImage: "/images/kl-chow-kit-market.jpg",
  },

  // Educational Section 1: Heritage & Context
  heritage: {
    title: "Understanding Kuala Lumpur's Food Culture",
    introduction: "In 1857, Chinese tin miners established a settlement at the muddy confluence ('kuala lumpur' in Malay) of the Klang and Gombak rivers. They brought their cooking traditions. Malay traders arrived with their spice knowledge. Indian Muslims set up food stalls serving roti canai and teh tarik. Over 150 years, these cultures didn't just coexist—they influenced each other, borrowed techniques, shared ingredients, and created entirely new fusion cuisines.\n\nToday, Kuala Lumpur is one of the few cities in the world where you can eat nasi lemak (Malay) for breakfast, dim sum (Chinese) for lunch, and banana leaf curry (Indian) for dinner—all within a few kilometers. The wet markets still operate as they did generations ago. Hawker stalls pass recipes down through families. And the food tells the story of Malaysia better than any history book.\n\nWhat makes KL's food scene unique isn't just the diversity—it's how these cultures evolved together. Nyonya cuisine blends Chinese cooking with Malay spices. Mamak food combines Indian recipes with local ingredients. Chinese hawkers use Malay sambal. This constant cross-pollination created a food culture that exists nowhere else on Earth.",
    yearEstablished: "1857",
    culturalInfluences: [
      "Malay indigenous traditions",
      "Chinese (Hokkien, Cantonese, Hakka) immigrant communities",
      "South Indian Tamil and North Indian Muslim cultures",
      "Peranakan/Nyonya fusion heritage",
      "Portuguese, British colonial influences",
    ],
    keyFacts: [
      {
        label: "UNESCO Recognition",
        value: "Heritage Food Districts",
        description: "Chinatown and surrounding areas recognized for cultural significance"
      },
      {
        label: "Hawker Stalls",
        value: "6,000+",
        description: "From wet markets to kopitiam to mamak stalls"
      },
      {
        label: "Cooking Cultures",
        value: "3 Main + Fusions",
        description: "Malay, Chinese, Indian, plus Nyonya, Mamak, Eurasian"
      },
      {
        label: "Operating Hours",
        value: "24/7 Food Scene",
        description: "Breakfast markets, lunch kopitiams, night mamak stalls"
      },
    ],
  },

  // Educational Section 2: The Three Main Food Cultures
  foodCultures: [
    {
      name: "Malay Cuisine",
      description: "Malay food is the heart of Malaysian cooking—rich, aromatic, and built on a foundation of coconut, chili, and aromatics like lemongrass, galangal, and kaffir lime. Cooking techniques passed down through generations involve slow-cooked curries, sambal made fresh daily, and the art of balancing sweet, sour, salty, and spicy in every dish.",
      keyDishes: [
        "Nasi Lemak (coconut rice with sambal, anchovies, peanuts, egg)",
        "Rendang (slow-cooked spiced meat curry)",
        "Satay (grilled meat skewers with peanut sauce)",
        "Laksa (spicy coconut noodle soup)",
      ],
      culturalContext: "Malay cuisine reflects kampung (village) traditions where communal cooking and sharing meals strengthened community bonds. The use of rice, coconut, and seafood comes from Malaysia's coastal geography, while spices reveal centuries of trade with Indonesia, Thailand, and the Middle East.",
      image: "/images/culture/malay-nasi-lemak.jpg",
    },
    {
      name: "Chinese Malaysian Cuisine",
      description: "Chinese immigrants—primarily Hokkien, Cantonese, and Hakka—didn't just bring their regional cuisines to Malaysia; they adapted them. Local ingredients like pandan leaves, belacan (shrimp paste), and tropical fruits merged with traditional Chinese cooking techniques. The result is Chinese Malaysian food: familiar yet distinctly local.",
      keyDishes: [
        "Char Kway Teow (wok-fried flat rice noodles)",
        "Hokkien Mee (prawn noodles in rich broth)",
        "Bak Kut Teh (pork rib soup with herbs)",
        "Dim Sum (served in traditional kopitiams)",
      ],
      culturalContext: "Kopitiam (coffee shop) culture is central to Chinese Malaysian life. These family-run establishments serve as community hubs where regulars have their 'usual' orders and conversations flow as freely as the kopi (coffee). The food is unpretentious, portions generous, and recipes closely guarded family secrets.",
      image: "/images/culture/chinese-char-kway-teow.jpg",
    },
    {
      name: "Indian Malaysian Cuisine",
      description: "Indian Malaysians—both Hindu Tamils from South India and Muslim immigrants from North India—brought vastly different cooking traditions. Tamil cuisine features vegetarian dishes, rice-based meals, and dosai. North Indian Muslim (Mamak) food centers on roti, tandoori breads, and rich curries. Both evolved with local ingredients and Malaysian tastes.",
      keyDishes: [
        "Roti Canai (flaky flatbread with curry)",
        "Banana Leaf Rice (South Indian thali-style meal)",
        "Murtabak (stuffed savory pancake)",
        "Teh Tarik ('pulled' milk tea)",
      ],
      culturalContext: "Mamak stalls are Malaysia's 24-hour community centers. Open late into the night, they're where friends gather after work, families celebrate football victories, and strangers become friends over roti canai and teh tarik. The food is meant to be shared, conversations are loud and animated, and everyone is welcome.",
      image: "/images/culture/indian-roti-canai.jpg",
    },
  ],

  // Educational Section 3: Signature Dishes of KL
  signatureDishes: [
    {
      name: "Nasi Lemak",
      description: "Malaysia's unofficial national dish. Fragrant rice cooked in coconut milk and pandan, served with sambal (chili paste), crispy anchovies, roasted peanuts, cucumber, and a hard-boiled egg. Vendors add their own twist—fried chicken, rendang, sambal squid.",
      origin: "Malay kampung (village) breakfast food, now eaten 24/7 across all cultures",
      whereToFind: "Everywhere from street stalls to high-end restaurants. Best at morning wet markets and roadside stalls",
      image: "/images/dishes/nasi-lemak.jpg",
      vegetarian: false,
      cultural: "Malay",
    },
    {
      name: "Char Kway Teow",
      description: "Flat rice noodles stir-fried over intense heat (wok hei) with prawns, cockles, Chinese sausage, bean sprouts, egg, and dark soy sauce. The key is the smoky, slightly charred flavor from a scorching hot wok.",
      origin: "Chinese (Hokkien/Teochew) working-class food, historically cooked by fishermen",
      whereToFind: "Hawker centers, especially in Chinatown. Look for stalls with long queues and older cooks",
      image: "/images/dishes/char-kway-teow.jpg",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Roti Canai",
      description: "Impossibly flaky, crispy-on-the-outside, soft-on-the-inside flatbread served with curry (dhal or chicken). Watching a mamak chef spin and flip the dough is half the experience.",
      origin: "Indian Muslim (Mamak) adaptation of Indian paratha, made lighter and flakier for Malaysian tastes",
      whereToFind: "Mamak stalls (Indian Muslim restaurants) open 24/7 across KL",
      image: "/images/dishes/roti-canai.jpg",
      vegetarian: true,
      cultural: "Indian (Mamak)",
    },
    {
      name: "Hokkien Mee",
      description: "Thick yellow noodles braised in a rich, dark broth made from prawn heads, pork bones, and soy sauce. Topped with prawns, pork, squid, crispy pork lard, and sambal on the side.",
      origin: "Hokkien Chinese immigrants; KL's version is distinct from Penang's (which is stir-fried)",
      whereToFind: "Hawker stalls, especially Jalan Alor night market",
      image: "/images/dishes/hokkien-mee.jpg",
      vegetarian: false,
      cultural: "Chinese (Hokkien)",
    },
    {
      name: "Banana Leaf Rice",
      description: "South Indian vegetarian or mixed rice meal served on a banana leaf. Unlimited white rice, various vegetable curries, rasam, papadum, and pickles. Add fried fish or chicken if desired.",
      origin: "South Indian Tamil tradition adapted with Malaysian vegetables and serving style",
      whereToFind: "Brickfields (Little India) district, especially on Jalan Tun Sambanthan",
      image: "/images/dishes/banana-leaf.jpg",
      vegetarian: true,
      cultural: "Indian (Tamil)",
    },
    {
      name: "Bak Kut Teh",
      description: "Pork rib soup simmered for hours with garlic, star anise, cinnamon, and Chinese herbs. Served with rice, youtiao (fried dough), and Chinese tea. Controversial name means 'meat bone tea' despite having no tea in the soup.",
      origin: "Hokkien/Teochew Chinese; invented in Klang (near KL) by port workers needing hearty meals",
      whereToFind: "Klang area (original), but many excellent shops in KL Chinatown and suburbs",
      image: "/images/dishes/bak-kut-teh.jpg",
      vegetarian: false,
      cultural: "Chinese",
    },
  ],

  // Educational Section 4: Neighborhoods & Food Districts
  neighborhoods: [
    {
      name: "Chow Kit",
      description: "KL's largest and most authentic wet market. This is where locals shop for fresh produce, spices, meat, and seafood. The surrounding area is filled with Malay and Indonesian food stalls, kopitiams, and the energy of a working-class neighborhood that hasn't been gentrified.",
      knownFor: [
        "Wet market experience (vegetables, fruits, spices, fresh meat/seafood)",
        "Malay breakfast stalls (nasi lemak, lontong)",
        "'Little Indonesia' - Indonesian immigrant food culture",
        "Pre-war shophouse architecture",
      ],
      vibe: "Gritty, authentic, 100% local. Not touristy. Real wet market sights/smells.",
      image: "/images/neighborhoods/chow-kit.jpg",
      mapLink: "https://goo.gl/maps/chowkit",
    },
    {
      name: "Petaling Street (Chinatown)",
      description: "Beyond the tourist souvenir shops, Chinatown is where KL's Chinese food heritage lives. Century-old kopitiams serve traditional breakfast, family-run dim sum shops open before dawn, and hawker stalls cook recipes passed down through four generations.",
      knownFor: [
        "Traditional kopitiam culture (coffee shops)",
        "Dim sum and Cantonese roast meats",
        "Night market street food (Jalan Petaling)",
        "Heritage Chinese temples and clan associations",
      ],
      vibe: "Historic, bustling, mix of old-timers and tourists. Best early morning for authentic experience.",
      image: "/images/neighborhoods/petaling-street.jpg",
      mapLink: "https://goo.gl/maps/petalingstreet",
    },
    {
      name: "Brickfields (Little India)",
      description: "KL's Indian quarter is a sensory overload in the best way—vibrant sari shops, the smell of curry spices, Tamil music playing, and banana leaf restaurants serving unlimited rice. This is where the South Indian Tamil community has created a slice of India in Malaysia.",
      knownFor: [
        "Banana leaf rice restaurants",
        "South Indian vegetarian food",
        "Sweets shops (gulab jamun, jalebi, barfi)",
        "Indian grocery shops with spices from India",
      ],
      vibe: "Colorful, aromatic, vegetarian-friendly. Feels like Chennai transplanted to KL.",
      image: "/images/neighborhoods/brickfields.jpg",
      mapLink: "https://goo.gl/maps/brickfields",
    },
    {
      name: "Jalan Alor",
      description: "When the sun sets, Jalan Alor transforms into KL's most famous street food strip. Hundreds of plastic tables spill onto the street, hawkers grill satay over charcoal, and the air fills with the aroma of char kway teow, hokkien mee, and BBQ seafood.",
      knownFor: [
        "Night market atmosphere (open 5pm-4am)",
        "Chinese hawker food (char kway teow, hokkien mee, BBQ)",
        "Seafood restaurants with live tanks",
        "Tourist-friendly but still authentic",
      ],
      vibe: "Lively, touristy but genuine food, sensory overload, Instagram-worthy chaos.",
      image: "/images/neighborhoods/jalan-alor.jpg",
      mapLink: "https://goo.gl/maps/jalanalor",
    },
  ],

  // Transition: Now that you understand KL, here's why you need a guide
  whyTourWithUs: {
    title: "Why Experience This with a Local Guide?",
    subtitle: "Because knowing about the food and actually experiencing it are two different things",
    description: "You could try to explore KL's food scene alone. But you'd miss the context—the stories behind the dishes, the family histories, the cultural nuances that make the food meaningful. Our guides were born and raised here. They're sharing their culture, their neighborhoods, often their own family recipes.",
    reasons: [
      {
        icon: "local-expert",
        title: "Born & Raised Locals",
        description: "Our guides grew up eating this food. They know which stall makes the best char kway teow because their grandmother took them there. They speak the languages, understand the customs, and can explain why certain dishes matter to specific communities. This isn't scripted—it's personal.",
      },
      {
        icon: "hidden-gems",
        title: "Beyond the Tourist Trail",
        description: "We don't take you to restaurants paying commissions. We take you to the wet market where our guide's family shops. The kopitiam where locals have breakfast. The hawker stall run by a third-generation cook. These places don't advertise—locals just know.",
      },
      {
        icon: "cultural-context",
        title: "Stories, Not Just Snacks",
        description: "Every dish has a history. Nasi lemak was kampung breakfast food. Char kway teow was working-class fuel. Roti canai shows Indian Muslim adaptation to Malaysian tastes. We don't just feed you—we help you understand why the food matters.",
      },
      {
        icon: "safe-exploration",
        title: "Navigate with Confidence",
        description: "Wet markets can be overwhelming if you don't know what you're looking at. Ordering at hawker stalls requires knowing the system. Our guides make it easy—you get the authentic experience without the anxiety of navigating alone.",
      },
    ],
  },

  // Now present the tours as the solution
  featuredTours: [
    {
      name: "Flavours of Malaysia Market Tour",
      slug: "flavours-of-malaysia",
      description: "Experience Chow Kit wet market and Little Indonesia's food scene. Taste Malay, Chinese, and Indonesian dishes while learning about ingredients, cooking techniques, and the cultural stories behind the food.",
      price: 250,
      duration: "3.5 hours",
      image: "/images/tours/flavours-of-malaysia.jpg",
      highlights: [
        "Chow Kit wet market immersion",
        "Taste 8-10 dishes from Malay & Indonesian cuisines",
        "Learn about Malaysian ingredients and spices",
        "Explore pre-war heritage architecture",
      ],
    },
    {
      name: "Chinatown Food Heritage Walk",
      slug: "chinatown-heritage",
      description: "Start your day the Chinese Malaysian way—kopitiam breakfast, dim sum, and a walk through Petaling Street's century-old shops. Learn how Chinese cuisine evolved in Malaysia and why kopitiam culture defines local life.",
      price: 240,
      duration: "3 hours",
      image: "/images/tours/chinatown-heritage.jpg",
      highlights: [
        "Traditional kopitiam breakfast experience",
        "Family-run dim sum and roast meats",
        "Stories of Chinese immigrant communities",
        "Hidden temples and clan houses",
      ],
    },
    {
      name: "KL Street Food Night Tour",
      slug: "kl-night-tour",
      description: "Experience KL's food scene after dark—mamak stalls, hawker centers, and Jalan Alor's night market chaos. Taste char kway teow, satay, hokkien mee, and desserts while the city buzzes with energy.",
      price: 280,
      duration: "4 hours",
      image: "/images/tours/kl-night-tour.jpg",
      highlights: [
        "Visit 5+ hawker stalls and food spots",
        "Taste 10+ dishes across cultures",
        "Mamak stall experience (roti canai, teh tarik)",
        "Night market atmosphere at Jalan Alor",
      ],
    },
  ],

  // Trust signals
  trustSignals: {
    reviewCount: 150,
    rating: 5.0,
    tripadvisorRanking: 1,
    certificateOfExcellence: true,
  },

  trustLogos: [
    {
      name: "TripAdvisor Certificate of Excellence",
      logo: "/images/logos/tripadvisor-excellence.svg",
      url: "https://www.tripadvisor.com/Attraction_Review-g298570-d2328058-Reviews-Simply_Enak_Food_Experiences-Kuala_Lumpur_Wilayah_Persekutuan.html",
    },
    {
      name: "Viator",
      logo: "/images/logos/viator.svg",
      url: "https://www.viator.com/tours/Penang-Island/Eat-Drink-Georgetown/d50882-17908P1",
    },
    {
      name: "GetYourGuide",
      logo: "/images/logos/getyourguide.svg",
      url: "https://www.getyourguide.com/simply-enak-food-experiences-s4050/",
    },
  ],

  // Customer reviews
  reviews: [
    {
      author: "Sarah M.",
      location: "Sydney, Australia",
      rating: 5,
      date: "2024-09-15",
      text: "This wasn't just a food tour—it was a cultural education. Our guide explained the history behind every dish, took us to her family's favorite market stalls, and helped us understand why Malaysian food culture is so special. The food was phenomenal, but the context made it unforgettable.",
      source: "TripAdvisor",
      verified: true,
    },
    {
      author: "James P.",
      location: "London, UK",
      rating: 5,
      date: "2024-08-22",
      text: "Best food tour I've ever taken. The wet market experience was eye-opening—I finally understood where all those ingredients I see in Malaysian restaurants come from. And we ate at places I never would have found on my own. Worth every ringgit.",
      source: "Google",
      verified: true,
    },
    {
      author: "Maria L.",
      location: "Barcelona, Spain",
      rating: 5,
      date: "2024-09-01",
      text: "Our guide was incredible. She grew up in KL and shared stories about her childhood, her grandmother's recipes, and why certain foods are important to Malay culture. The char kway teow we had was the best I've ever tasted. This tour made me fall in love with KL.",
      source: "TripAdvisor",
      verified: true,
    },
  ],

  // What to expect
  expectations: {
    title: "What to Expect on Your KL Food Tour",
    intro: "Every tour is an adventure, but here's what you can count on:",
    items: [
      {
        title: "Authentic Local Food",
        description: "We take you to the places where locals actually eat—wet markets, hawker stalls, family-run kopitiams. You'll taste traditional Malaysian dishes made the way they've been made for generations.",
        icon: "utensils",
      },
      {
        title: "Cultural Context",
        description: "You'll learn why roti canai is an Indian Muslim dish, how Nyonya cuisine came to be, and what makes Malaysian Chinese food different from food in China. Every dish has a story.",
        icon: "book-open",
      },
      {
        title: "Small Groups (Max 8 People)",
        description: "You'll have plenty of opportunity to ask questions, chat with your guide, and actually hear the stories being shared.",
        icon: "users",
      },
      {
        title: "Born & Raised Local Guides",
        description: "Our guides are sharing their culture, their neighborhoods, and often their family's food traditions. This personal connection transforms a tour into a genuine cultural exchange.",
        icon: "award",
      },
      {
        title: "Real Wet Market Experience",
        description: "Visiting wet markets means encountering sights, smells, and sounds that might be unfamiliar. It's bustling, authentic, and where you see the true heartbeat of Malaysian food culture.",
        icon: "shopping-basket",
      },
      {
        title: "Plenty of Food",
        description: "You'll taste 8-12 different dishes depending on the tour. Most guests say they're comfortably full by the end. We pace it well so you're satisfied but not overstuffed.",
        icon: "map",
      },
    ],
  },

  // FAQ
  faqs: [
    {
      question: "How much food is included? Will I be hungry afterwards?",
      answer: "You'll taste 8-12 different dishes depending on the tour—more than enough for a full meal. Most guests say they're comfortably full by the end.",
    },
    {
      question: "I'm vegetarian. Can you accommodate me?",
      answer: "Absolutely! Malaysia has excellent vegetarian options across all three cultures. Just let us know when booking. (Note: nut allergies are challenging as peanuts are common in Malaysian cooking.)",
    },
    {
      question: "What's the group size?",
      answer: "Maximum 8 people. Most tours have 4-6 guests. We keep groups small so everyone can interact with the guide and ask questions.",
    },
    {
      question: "What if it rains?",
      answer: "Many of our stops are covered or indoors. We provide umbrellas if needed. Brief tropical showers are part of the authentic KL experience!",
    },
    {
      question: "Is this suitable for children?",
      answer: "Yes! Malaysian food culture is very family-oriented. Children should be comfortable walking and standing for 3-4 hours.",
    },
    {
      question: "How much walking?",
      answer: "2-3 km at a leisurely pace with plenty of food stops. Comfortable shoes recommended. This isn't a fitness activity—it's a relaxed food exploration.",
    },
    {
      question: "Do I need cash?",
      answer: "All food and drinks are included in your booking price. Bring cash (MYR) if you want to buy souvenirs at markets or extra snacks.",
    },
    {
      question: "What makes Simply Enak different?",
      answer: "Our guides are locals sharing their culture, not actors reading scripts. We go to authentic spots where locals eat, not tourist traps. Small groups mean personal attention. And we focus on cultural context—you'll understand why the food matters, not just taste it.",
    },
  ],

  // Guides
  guides: [
    {
      name: "Aisha Rahman",
      photo: "/images/guides/aisha.jpg",
      bio: "Born in Kampung Baru, Aisha grew up watching her grandmother cook traditional Malay dishes. After studying cultural anthropology, she combined academic knowledge with family food traditions to share KL's Malay culinary heritage.",
      specialties: ["Malay cuisine", "Wet market culture", "Kampung heritage"],
    },
    {
      name: "Wei Chen",
      photo: "/images/guides/wei-chen.jpg",
      bio: "Wei Chen's family has run a kopitiam in Petaling Street for three generations. He knows every alley in Chinatown and can tell you the story behind every hawker stall's recipe.",
      specialties: ["Chinese Malaysian cuisine", "Chinatown history", "Kopitiam culture"],
    },
    {
      name: "Priya Krishnan",
      photo: "/images/guides/priya.jpg",
      bio: "Growing up in her family's banana leaf restaurant in Brickfields, Priya learned to love Indian Malaysian food's evolution—how South Indian cuisine adapted with Malaysian ingredients and tastes.",
      specialties: ["Indian Malaysian cuisine", "Vegetarian options", "Spice knowledge"],
    },
  ],

  // Location context (for schema, not displayed separately as we integrated it above)
  locationContext: {
    title: "Why Kuala Lumpur is a Food Lover's Paradise",
    description: "Kuala Lumpur's multicultural food scene is the result of 150+ years of cultural mixing. Malay, Chinese, and Indian communities didn't just coexist—they influenced each other, creating fusion cuisines that exist nowhere else.",
    highlights: [
      "Over 150 years of multicultural culinary evolution",
      "UNESCO-recognized heritage food districts",
      "Birthplace of Nyonya and Mamak fusion cuisines",
      "24/7 food scene from morning markets to late-night mamak stalls",
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127469.89219265082!2d101.61330679453124!3d3.1516964000000007",
    culturalNotes: "Malaysian food etiquette is relaxed and inclusive. Come with an open mind and appetite—sharing food is how Malaysians welcome guests.",
  },

  // Geography
  geo: {
    latitude: "3.1570",
    longitude: "101.7123",
    addressLocality: "Kuala Lumpur",
    addressRegion: "Federal Territory of Kuala Lumpur",
    postalCode: "50088",
  },

  // Google My Business
  googleMyBusiness: {
    url: "https://www.google.com/search?kgmid=/g/11_rl_t5r&q=Kuala+Lumpur+Food+Tours+by+Simply+Enak",
    placeId: "ChIJd-fYrSo2zDERmWyNVP4f4iM",
  },
};
