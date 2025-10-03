// Location landing page data for programmatic SEO
// Educational-first approach: teach about the location, then present tours
// This structure is replicable for modifiers (vegetarian, corporate, etc.)

export interface LocationLandingPage {
  // Core identity
  name: string;
  slug: string;
  region: string;

  // SEO metadata
  metaTitle: string;
  metaDescription: string;

  // Hero section - educational angle, not sales-heavy
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    backgroundImage: string;
  };

  // Educational content: City heritage and food culture introduction
  heritage: {
    title: string;
    introduction: string; // 2-3 paragraphs of rich, engaging content
    yearEstablished?: string;
    culturalInfluences: string[];
    keyFacts: Array<{
      label: string;
      value: string;
      description?: string;
    }>;
  };

  // Food cultures - the ethnic/cultural groups that shape the cuisine
  foodCultures: Array<{
    name: string; // e.g., "Malay", "Chinese", "Indian", "Peranakan"
    description: string;
    keyDishes: string[];
    culturalContext: string;
    image: string;
  }>;

  // Signature dishes - what makes this location unique
  signatureDishes: Array<{
    name: string;
    description: string;
    origin: string;
    whereToFind: string;
    image: string;
    vegetarian?: boolean;
    cultural: string; // Malay, Chinese, Indian, Fusion
  }>;

  // Neighborhoods/food districts - where the food culture lives
  neighborhoods: Array<{
    name: string;
    description: string;
    knownFor: string[];
    vibe: string;
    image: string;
    mapLink?: string;
  }>;

  // Transition from education to tours - why experience this with a guide
  whyTourWithUs: {
    title: string;
    subtitle: string;
    description: string;
    reasons: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };

  // Tour offerings - now positioned as the natural way to experience what we just taught
  featuredTours: Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    highlights: string[];
  }>;

  // Trust signals
  trustSignals: {
    reviewCount: number;
    rating: number;
    tripadvisorRanking: number;
    certificateOfExcellence: boolean;
  };

  // Trust bar - partner/platform logos
  trustLogos: Array<{
    name: string;
    logo: string;
    url: string;
  }>;

  // Customer reviews - real testimonials
  reviews: Array<{
    author: string;
    location: string;
    rating: number;
    date: string;
    text: string;
    source: "TripAdvisor" | "Google" | "Viator" | "GetYourGuide";
    verified: boolean;
  }>;

  // What to expect section
  expectations: {
    title: string;
    intro: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };

  // FAQ section
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Meet your guides
  guides: Array<{
    name: string;
    photo: string;
    bio: string;
    specialties: string[];
  }>;

  // Location context - educational content
  locationContext: {
    title: string;
    description: string;
    highlights: string[];
    mapEmbedUrl: string;
    culturalNotes: string;
  };

  // Geography for schema
  geo: {
    latitude: string;
    longitude: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };

  // Google My Business
  googleMyBusiness: {
    url: string;
    placeId: string;
  };
}

// Kuala Lumpur Landing Page Data
export const kualaLumpurLandingPage: LocationLandingPage = {
  name: "Kuala Lumpur",
  slug: "kuala-lumpur",
  region: "Federal Territory",

  metaTitle: "Kuala Lumpur Food Tours – Award-Winning Culinary Experiences | Simply Enak",
  metaDescription: "Discover authentic Malaysian cuisine with our 5-star rated Kuala Lumpur food tours. Explore wet markets, street food, and hidden gems with local expert guides. Ranked #1 on TripAdvisor.",

  hero: {
    title: "The Food Story of Kuala Lumpur",
    subtitle: "Where Malay, Chinese, and Indian Cultures Created Something Extraordinary",
    description: "Kuala Lumpur isn't just Malaysia's capital—it's where three distinct food cultures collided, merged, and evolved into one of the world's most exciting culinary scenes. Let us show you why.",
    ctaText: "Discover KL's Food Heritage",
    ctaUrl: "#heritage",
    backgroundImage: "/images/kl-hero-background.jpg",
  },

  heritage: {
    title: "A City Built on Tin, Shaped by Food",
    introduction: `Kuala Lumpur started in the 1850s as a rough mining town where Chinese immigrants extracted tin from muddy rivers. The name literally means "muddy confluence"—not exactly romantic. But what happened next was extraordinary.

As tin brought wealth, people came from everywhere. Malay villagers moved from kampungs to the city. Indian Muslims arrived from South India. Chinese clans built temples and clan houses. Each group brought their food traditions, their cooking techniques, their mother's recipes.

But here's what makes KL special: instead of staying separate, these cuisines started talking to each other. Chinese wok techniques met Indian spices. Malay herbs flavored Chinese noodles. Indian breads became breakfast staples in Malay households. The result? A food culture that doesn't exist anywhere else in the world.`,
    yearEstablished: "1857",
    culturalInfluences: [
      "Malay (Indigenous & Islamic traditions)",
      "Chinese (Hokkien, Cantonese, Hakka communities)",
      "Indian (Tamil, Malayalam, North Indian)",
      "Peranakan (Chinese-Malay fusion culture)",
      "Mamak (Indian Muslim adaptation)",
    ],
    keyFacts: [
      {
        label: "Food Stalls",
        value: "10,000+",
        description: "From hawker centers to kopitiam to roadside stands",
      },
      {
        label: "Wet Markets",
        value: "100+",
        description: "Where locals shop for fresh ingredients daily",
      },
      {
        label: "Cuisines",
        value: "3 Major",
        description: "Malay, Chinese, and Indian—plus countless fusion variations",
      },
      {
        label: "Operating Hours",
        value: "24/7",
        description: "You can find great food at any hour in KL",
      },
    ],
  },

  foodCultures: [
    {
      name: "Malay Cuisine",
      description: "The foundation of Malaysian food culture, Malay cuisine is built on rice, coconut, aromatic herbs, and spices influenced by centuries of trade with Indonesia, Thailand, and the Middle East. It's the cuisine of nasi lemak, rendang, and satay—comfort food that tells the story of Islamic traditions meeting tropical abundance.",
      keyDishes: ["Nasi Lemak", "Satay", "Rendang", "Mee Rebus", "Kuih (traditional cakes)"],
      culturalContext: "Malay cooking is deeply connected to community and religion. Many dishes have roots in royal court cuisine, while others come from village traditions. Meals are often shared from a communal plate, and eating with your hands is traditional.",
      image: "/images/cultures/malay-cuisine.jpg",
    },
    {
      name: "Chinese Malaysian Cuisine",
      description: "When Chinese immigrants came to KL in the 1800s, they adapted their regional cuisines (Hokkien, Cantonese, Hakka) to local ingredients. The result? Dishes like char kway teow, Hokkien mee, and bak kut teh that you won't find in China. Kopitiam (coffee shop) culture became the heart of Chinese Malaysian food—where locals gather for breakfast, coffee, and conversation.",
      keyDishes: ["Char Kway Teow", "Hokkien Mee", "Bak Kut Teh", "Dim Sum", "Hainanese Chicken Rice"],
      culturalContext: "Chinese Malaysian food is all about wok hei (the breath of the wok) and precision. Hawker stalls specialize in single dishes perfected over generations. Kopitiam culture means eating is a social activity—you don't rush a meal.",
      image: "/images/cultures/chinese-cuisine.jpg",
    },
    {
      name: "Indian Malaysian Cuisine",
      description: "Indian food in KL is primarily South Indian (Tamil) and North Indian, brought by immigrants who came as laborers, traders, and entrepreneurs. But it evolved into something distinct: Mamak cuisine, created by Indian Muslims, became a uniquely Malaysian phenomenon. Roti canai, teh tarik, and banana leaf rice are now national favorites.",
      keyDishes: ["Roti Canai", "Banana Leaf Rice", "Murtabak", "Teh Tarik", "Nasi Kandar"],
      culturalContext: "Mamak restaurants are the soul of KL's late-night food scene. Open 24/7, they're where everyone—regardless of ethnicity—gathers for roti canai and teh tarik. Banana leaf meals, where rice and curries are served on a banana leaf, are a communal, hands-on eating experience.",
      image: "/images/cultures/indian-cuisine.jpg",
    },
    {
      name: "Peranakan (Nyonya) Cuisine",
      description: "Born from marriages between Chinese immigrants and local Malay women centuries ago, Peranakan culture created Nyonya cuisine—a fusion that uses Chinese cooking techniques with Malay spices and ingredients. It's elaborate, time-intensive, and deeply connected to family traditions passed down through generations.",
      keyDishes: ["Laksa", "Ayam Pongteh", "Kuih Pie Tee", "Otak-Otak", "Nyonya Kuih"],
      culturalContext: "Nyonya cooking is considered the most refined Malaysian cuisine. Recipes require dozens of ingredients, hand-pounded spice pastes, and techniques that take years to master. It's the cuisine of grandmothers and special occasions.",
      image: "/images/cultures/peranakan-cuisine.jpg",
    },
  },

  signatureDishes: [
    {
      name: "Nasi Lemak",
      description: "Malaysia's unofficial national dish. Fragrant coconut rice served with sambal (chili paste), fried anchovies, peanuts, boiled egg, and cucumber. For breakfast, locals add fried chicken, rendang, or squid sambal. It's comfort food, street food, and national identity all on one plate.",
      origin: "Malay - originally a farmer's breakfast, now eaten any time of day",
      whereToFind: "Everywhere—from roadside stalls to upscale cafes. The best are usually at hawker centers in the morning.",
      image: "/images/dishes/nasi-lemak.jpg",
      vegetarian: false,
      cultural: "Malay",
    },
    {
      name: "Char Kway Teow",
      description: "Flat rice noodles stir-fried in a screaming hot wok with soy sauce, chili, prawns, cockles, Chinese sausage, bean sprouts, and egg. The secret is wok hei—that smoky, slightly charred flavor you can only get from a well-seasoned wok over high heat. It's the dish hawkers are judged by.",
      origin: "Chinese (Teochew) - created by poor laborers using cheap ingredients",
      whereToFind: "Hawker centers, but only trust stalls with a queue. The best char kway teow cooks use pork lard and don't compromise.",
      image: "/images/dishes/char-kway-teow.jpg",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Roti Canai",
      description: "Flaky, buttery flatbread that's stretched paper-thin, folded, and griddled until crispy on the outside and soft inside. Served with dhal (lentil curry) and curry sauce. Watch a skilled roti maker and you'll see the dough flying through the air like pizza. It's edible theater.",
      origin: "Indian Muslim (Mamak) - adapted from Indian paratha",
      whereToFind: "Mamak restaurants, open 24/7. Best eaten hot off the griddle for breakfast or supper.",
      image: "/images/dishes/roti-canai.jpg",
      vegetarian: true,
      cultural: "Indian",
    },
    {
      name: "Bak Kut Teh",
      description: "Don't let the name fool you—this isn't tea. It's pork ribs simmered for hours in a complex herbal broth with garlic, star anise, and Chinese herbs. Eat it with rice, fried dough sticks (youtiao), and Chinese tea. It's what locals crave on rainy days.",
      origin: "Chinese (Hokkien/Teochew) - invented by port laborers needing hearty food",
      whereToFind: "Specialist bak kut teh shops, especially in areas like Klang or Kepong. Morning and lunch are peak times.",
      image: "/images/dishes/bak-kut-teh.jpg",
      vegetarian: false,
      cultural: "Chinese",
    },
    {
      name: "Laksa",
      description: "This is where it gets complicated. KL's laksa is usually curry laksa (lemak laksa)—rice noodles in a spicy coconut curry broth with chicken, prawns, tofu puffs, and bean sprouts. It's rich, spicy, and utterly addictive. Every family has their version.",
      origin: "Peranakan (Nyonya) - fusion of Chinese noodles and Malay spices",
      whereToFind: "Hawker centers, kopitiam, and specialist laksa shops. Curry laksa is everywhere, but ask locals for their favorite spot.",
      image: "/images/dishes/laksa.jpg",
      vegetarian: false,
      cultural: "Fusion (Peranakan)",
    },
    {
      name: "Satay",
      description: "Skewered, grilled meat (chicken, beef, or lamb) served with peanut sauce, cucumber, onions, and compressed rice cakes (ketupat). The meat is marinated in turmeric and spices, then grilled over charcoal. It's smoky, sweet, savory, and the perfect street food.",
      origin: "Malay - influenced by Indonesian satay, adapted with local spices",
      whereToFind: "Night markets, satay street stalls, and restaurants. Best eaten fresh off the grill.",
      image: "/images/dishes/satay.jpg",
      vegetarian: false,
      cultural: "Malay",
    },
  ],

  neighborhoods: [
    {
      name: "Chow Kit",
      description: "This is where KL eats breakfast. Chow Kit wet market is one of the city's largest and most chaotic—rows of vegetables, tropical fruits, fresh meat, and seafood. The surrounding streets are filled with Malay hawker stalls serving nasi lemak, mee rebus, and kuih. It's loud, crowded, and 100% authentic.",
      knownFor: ["Wet market experience", "Malay street food", "Nasi lemak stalls", "Little Indonesia food scene"],
      vibe: "Bustling, working-class, authentic. Not touristy, which is exactly the point.",
      image: "/images/neighborhoods/chow-kit.jpg",
      mapLink: "https://maps.app.goo.gl/ChowKit",
    },
    {
      name: "Petaling Street (Chinatown)",
      description: "Yes, it's touristy. Yes, there are knockoff handbags. But look past the souvenir stalls and you'll find century-old kopitiam, family-run dim sum shops, and some of the best Hokkien mee in the city. This is where Chinese clans built temples and clan houses in the 1800s, and the food traditions survived.",
      knownFor: ["Kopitiam culture", "Dim sum", "Chinese bakeries", "Pre-war architecture"],
      vibe: "Historic, chaotic, layered. Touristy on the surface, authentic if you know where to look.",
      image: "/images/neighborhoods/chinatown.jpg",
      mapLink: "https://maps.app.goo.gl/Chinatown",
    },
    {
      name: "Brickfields (Little India)",
      description: "The heart of KL's Indian community. Walk down any street and you'll smell curry leaves, see banana leaf rice restaurants, hear Bollywood music, and find Indian sweet shops stacked with colorful confections. This is where you go for authentic South Indian food and the best roti canai in the city.",
      knownFor: ["Banana leaf rice", "Roti canai specialists", "Indian sweets", "Tamil culture"],
      vibe: "Vibrant, colorful, sensory overload. Feels like stepping into Chennai.",
      image: "/images/neighborhoods/brickfields.jpg",
      mapLink: "https://maps.app.goo.gl/Brickfields",
    },
    {
      name: "Jalan Alor",
      description: "KL's most famous food street. When the sun sets, Jalan Alor transforms into an outdoor food court with dozens of stalls serving Chinese Malaysian food—char kway teow, BBQ chicken wings, claypot chicken rice, grilled seafood. It's touristy, but locals still eat here because the food is actually good.",
      knownFor: ["Street food scene", "Char kway teow", "BBQ seafood", "Night dining"],
      vibe: "Lively, neon-lit, energetic. Peak hours (7-10pm) are packed.",
      image: "/images/neighborhoods/jalan-alor.jpg",
      mapLink: "https://maps.app.goo.gl/JalanAlor",
    },
  ],

  whyTourWithUs: {
    title: "Now That You Know KL's Food Story—Let Us Show You Where to Find It",
    subtitle: "You could spend weeks researching where to eat. Or you could spend a few hours with someone who already knows.",
    description: "Reading about KL's food culture is one thing. Tasting it, understanding it, and experiencing it with a local guide who can explain why certain dishes matter to specific communities—that's something else entirely.",
    reasons: [
      {
        icon: "local-expert",
        title: "Guides Who Grew Up Here",
        description: "Our guides aren't reading from scripts—they're sharing their neighborhoods, their childhood food memories, and their families' stories. Aisha grew up in Kampung Baru watching her grandmother make traditional Malay kuih. Wei Chen's family has run a kopitiam in Chinatown for three generations. This is personal for them.",
      },
      {
        icon: "small-groups",
        title: "Small Groups, Real Conversations",
        description: "Maximum 8 people per tour. No megaphones, no shouting, no getting lost in a crowd. You can ask questions, have conversations, and actually form a connection with your guide. Food tours should feel like exploring with a knowledgeable friend, not being herded like cattle.",
      },
      {
        icon: "authentic",
        title: "No Tourist Traps, Ever",
        description: "We don't take you to restaurants that pay us commission. We take you to the wet market where our guide's mom still shops. The hawker stall her family has eaten at for 40 years. The Mamak restaurant where locals gather at 2am. You're eating where we eat.",
      },
      {
        icon: "beyond-food",
        title: "Cultural Context, Not Just Calories",
        description: "Yes, you'll eat amazing food. But you'll also learn why nasi lemak is considered a national symbol. Why kopitiam culture matters to Chinese Malaysians. How Mamak restaurants became the social fabric of KL. Food is the entry point; culture is what you'll remember.",
      },
    ],
  },

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

  featuredTours: [
    {
      name: "Flavours of Malaysia Market Tour",
      slug: "flavours-of-malaysia",
      description: "Dive into Chow Kit, one of KL's largest wet markets. Experience the sights, smells, and tastes of authentic Malaysian culture through its ingredients and street food.",
      price: 250,
      duration: "3.5 hours",
      image: "/images/tours/flavours-of-malaysia.jpg",
      highlights: [
        "Explore Chow Kit wet market",
        "Taste dishes from 3 Malaysian cultures",
        "Visit 'Little Indonesia' food scene",
        "Discover pre-war heritage architecture",
      ],
    },
    {
      name: "KL Street Food Night Tour",
      slug: "kl-street-food-night",
      description: "When the sun sets, Kuala Lumpur's food scene comes alive. Join us for an evening of char kway teow, satay, and desserts that locals queue for.",
      price: 280,
      duration: "4 hours",
      image: "/images/tours/kl-night-tour.jpg",
      highlights: [
        "Visit 5+ iconic street food spots",
        "Try 10+ authentic Malaysian dishes",
        "Learn about Malaysian food culture",
        "Experience KL like a local",
      ],
    },
    {
      name: "Chinatown Food Heritage Walk",
      slug: "chinatown-food-heritage",
      description: "Petaling Street isn't just souvenirs. Discover the century-old coffee shops, family-run dim sum stalls, and Chinese-Malay fusion dishes that tell KL's story.",
      price: 240,
      duration: "3 hours",
      image: "/images/tours/chinatown-heritage.jpg",
      highlights: [
        "Historic kopitiam culture",
        "Authentic dim sum breakfast",
        "Chinese-Malay fusion cuisine",
        "Stories of KL's Chinese community",
      ],
    },
  ],

  reviews: [
    {
      author: "Sarah M.",
      location: "Sydney, Australia",
      rating: 5,
      date: "2024-09-15",
      text: "This wasn't just a food tour—it was a cultural immersion. Our guide grew up in KL and shared stories about her grandmother's cooking, the history of the neighborhoods we visited, and why certain dishes are eaten at specific times. The food was phenomenal, but the context made it unforgettable.",
      source: "TripAdvisor",
      verified: true,
    },
    {
      author: "James P.",
      location: "London, UK",
      rating: 5,
      date: "2024-08-22",
      text: "I've done food tours in Bangkok, Hanoi, and Singapore. This was hands down the best. Small group, knowledgeable guide, and we ate at places I would NEVER have found on my own. The wet market experience alone was worth the price.",
      source: "Google",
      verified: true,
    },
    {
      author: "Maria L.",
      location: "Barcelona, Spain",
      rating: 5,
      date: "2024-09-01",
      text: "Absolutely loved it! Our guide was so passionate about Malaysian food and culture. We tried everything from satay to pan mee to fruits I'd never seen before. And the stories! Every dish had a story. Highly recommend.",
      source: "TripAdvisor",
      verified: true,
    },
    {
      author: "David K.",
      location: "San Francisco, USA",
      rating: 5,
      date: "2024-07-18",
      text: "Best food tour I've ever taken. Period. The guide's knowledge was encyclopedic, the food was incredible, and the group size was perfect for asking questions. If you're in KL, do this tour on your first day so you know where to come back to.",
      source: "Viator",
      verified: true,
    },
    {
      author: "Lisa W.",
      location: "Toronto, Canada",
      rating: 5,
      date: "2024-08-05",
      text: "I'm vegetarian and was worried about options, but the guide customized the experience beautifully. So many amazing vegetarian dishes I didn't even know existed. Plus I learned about the Indian Muslim community's influence on Malaysian cuisine. Fascinating!",
      source: "TripAdvisor",
      verified: true,
    },
    {
      author: "Tom R.",
      location: "Melbourne, Australia",
      rating: 5,
      date: "2024-09-10",
      text: "Went on the night food tour and it exceeded every expectation. 10+ dishes, all authentic, all delicious. Our guide knew the owners of every stall and you could tell these weren't tourist spots—we were eating alongside locals. The char kway teow was life-changing.",
      source: "Google",
      verified: true,
    },
  ],

  expectations: {
    title: "What to Expect on Your Kuala Lumpur Food Tour",
    intro: "Every tour is different, but here's what you can count on experiencing with us:",
    items: [
      {
        title: "Authentic Local Food",
        description: "We take you to the places where locals actually eat—wet markets, hawker stalls, family-run kopitiams. You'll taste traditional Malaysian dishes made the way they've been made for generations, not westernized versions created for tourists.",
        icon: "utensils",
      },
      {
        title: "Cultural Context",
        description: "Malaysia's food tells the story of its people—Malay, Chinese, Indian, and the unique fusion cultures that emerged. You'll learn why roti canai is an Indian Muslim dish, how Nyonya cuisine came to be, and what makes Malaysian Chinese food different from food in China.",
        icon: "book-open",
      },
      {
        title: "Small Group Experience",
        description: "With a maximum of 8 people per tour, you'll have plenty of opportunity to ask questions, chat with your guide, and actually hear the stories being shared. We believe in quality over quantity.",
        icon: "users",
      },
      {
        title: "Expert Local Guides",
        description: "Our guides were born and raised in Malaysia. They're sharing their culture, their neighborhoods, and often their family's food traditions. This personal connection transforms a tour into a genuine cultural exchange.",
        icon: "award",
      },
      {
        title: "Real Wet Market Experience",
        description: "Visiting Chow Kit or other wet markets means encountering sights, smells, and sounds that might be unfamiliar. It's bustling, it's authentic, and it's where you see the true heartbeat of Malaysian food culture. We'll guide you through it all.",
        icon: "shopping-basket",
      },
      {
        title: "More Than Just Eating",
        description: "You'll walk through heritage neighborhoods, see pre-war architecture, learn about how communities evolved, and understand the historical context that shaped Malaysian cuisine. It's food, history, and culture woven together.",
        icon: "map",
      },
    ],
  },

  faqs: [
    {
      question: "How much food is included? Will I be hungry afterwards?",
      answer: "You'll taste 8-12 different dishes depending on the tour. That's more than enough for a full meal—most guests say they're comfortably full by the end. We pace it well so you're not overstuffed, but you definitely won't leave hungry.",
    },
    {
      question: "I have dietary restrictions. Can you accommodate me?",
      answer: "Yes! We regularly accommodate vegetarians, vegans, and various food allergies. Just let us know when booking. Malaysia's multicultural cuisine means there are naturally many vegetarian and halal options. However, nut allergies can be challenging as peanuts are common in Malaysian cooking.",
    },
    {
      question: "What's the group size?",
      answer: "We keep groups small—maximum 8 people. This ensures everyone can hear the guide, ask questions, and have a more personal experience. Most tours have 4-6 people.",
    },
    {
      question: "What if it rains?",
      answer: "Many of our food stops are covered or indoors (hawker centers, kopitiams, markets with roofs). We provide umbrellas if needed. Malaysia's tropical rain showers are usually brief, and eating during a warm rain shower is part of the authentic experience!",
    },
    {
      question: "Is this tour suitable for children?",
      answer: "Absolutely! Malaysian food culture is very family-oriented. Kids often love the market experience and trying new fruits. Tours involve walking and standing, so children should be comfortable being on their feet for 3-4 hours.",
    },
    {
      question: "How much walking is involved?",
      answer: "Tours involve 2-3 km of walking at a leisurely pace with plenty of stops to eat and rest. We walk through markets, neighborhoods, and between food stops. Comfortable shoes are a must. The pace is relaxed—this isn't a fitness activity.",
    },
    {
      question: "Do I need to bring cash?",
      answer: "All food and drinks mentioned in the tour are included in your booking price. If you want to buy souvenirs at the market or additional snacks, bring some cash (MYR). Many hawker stalls don't accept cards.",
    },
    {
      question: "What's your cancellation policy?",
      answer: "Free cancellation up to 48 hours before the tour. Cancellations within 48 hours are non-refundable. If we cancel due to weather or insufficient bookings, you'll receive a full refund or can reschedule.",
    },
    {
      question: "I'm traveling solo. Can I join?",
      answer: "Yes! Many of our guests are solo travelers. We often pair solo bookings together so you'll meet other food lovers. There's a minimum of 2 people to run a tour, so contact us if you're booking alone and we'll try to match you with an existing booking.",
    },
    {
      question: "What makes Simply Enak different from other food tours?",
      answer: "Our guides are locals sharing their culture, not actors reading scripts. We take you to authentic spots where locals eat, not tourist traps paying commission. Small groups mean personal attention. And we focus on cultural context—you'll understand why the food matters, not just taste it.",
    },
  ],

  guides: [
    {
      name: "Aisha Rahman",
      photo: "/images/guides/aisha.jpg",
      bio: "Born and raised in Kampung Baru, Aisha grew up watching her grandmother cook traditional Malay dishes in a kitchen filled with the aroma of sambal belacan and rendang. After studying cultural anthropology, she combined her academic knowledge with her family's food traditions to become one of KL's most passionate food tour guides.",
      specialties: ["Malay cuisine", "Wet market culture", "Kampung Baru heritage"],
    },
    {
      name: "Wei Chen",
      photo: "/images/guides/wei-chen.jpg",
      bio: "Wei Chen's family has run a kopitiam in Petaling Street for three generations. He knows every alley in Chinatown and can tell you which hawker stall makes the best Hokkien mee. His tours are filled with stories about old KL and the Chinese immigrant community that shaped the city's food landscape.",
      specialties: ["Chinese Malaysian cuisine", "Chinatown history", "Kopitiam culture"],
    },
    {
      name: "Priya Krishnan",
      photo: "/images/guides/priya.jpg",
      bio: "Priya's passion for Malaysian Indian food started in her family's banana leaf restaurant in Brickfields. She loves explaining how Indian cuisine evolved in Malaysia and introducing guests to dishes they've never encountered. Her infectious enthusiasm makes every tour memorable.",
      specialties: ["Indian Malaysian cuisine", "Banana leaf culture", "Spice knowledge"],
    },
  ],

  locationContext: {
    title: "Why Kuala Lumpur is a Food Lover's Paradise",
    description: "Kuala Lumpur isn't just Malaysia's capital—it's a melting pot where Malay, Chinese, Indian, and hybrid cultures have created one of the world's most diverse food scenes. In a single day, you can eat nasi lemak for breakfast, dim sum for lunch, and banana leaf curry for dinner—all within a few kilometers.",
    highlights: [
      "Over 150 years of multicultural culinary evolution",
      "Home to UNESCO-recognized food heritage neighborhoods",
      "Birthplace of unique fusion cuisines like Nyonya and Mamak",
      "One of the few cities where halal, vegetarian, and non-halal cuisines coexist harmoniously",
      "Wet markets that have operated in the same locations for generations",
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127469.89219265082!2d101.61330679453124!3d3.1516964000000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1ff540d86c99!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2sus!4v1635959999999!5m2!1sen!2sus",
    culturalNotes: "Malaysian food etiquette is relaxed and inclusive. Don't worry about using chopsticks perfectly or knowing which hand to use—your guide will help. The key is to come with an open mind and appetite. Malaysians bond over food, and sharing a meal is how we welcome guests into our culture.",
  },

  geo: {
    latitude: "3.1570",
    longitude: "101.7123",
    addressLocality: "Kuala Lumpur",
    addressRegion: "Federal Territory of Kuala Lumpur",
    postalCode: "50088",
  },

  googleMyBusiness: {
    url: "https://www.google.com/search?kgmid=/g/11_rl_t5r&q=Kuala+Lumpur+Food+Tours+by+Simply+Enak",
    placeId: "ChIJd-fYrSo2zDERmWyNVP4f4iM",
  },
};

// Export array for programmatic page generation
export const locationLandingPages: LocationLandingPage[] = [
  kualaLumpurLandingPage,
  // Georgetown/Penang will be added after KL is approved
];
