export interface QuizOption {
  value: string;
  label: string;
  icon: string;
}

export interface QuizStep {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface RecommendationItem {
  title: string;
  desc: string;
  link: string;
  badge?: string;
}

export interface RecommendationResult {
  headline: string;
  items: RecommendationItem[];
  showContactOption?: boolean;
}

export const quizSteps: QuizStep[] = [
  {
    id: "destination",
    question: "Where are you visiting?",
    options: [
      { value: "penang", label: "Penang", icon: "🏝️" },
      { value: "kuala-lumpur", label: "Kuala Lumpur", icon: "🏙️" },
      { value: "melaka", label: "Melaka", icon: "🏛️" },
      { value: "unsure", label: "Not sure yet", icon: "🤔" },
    ],
  },
  {
    id: "dietary",
    question: "Any dietary preferences?",
    options: [
      { value: "none", label: "No restrictions (I eat everything!)", icon: "🍖" },
      { value: "vegetarian", label: "Vegetarian / Vegan", icon: "🥬" },
      { value: "halal", label: "Halal / No Pork", icon: "🕌" },
    ],
  },
  {
    id: "group",
    question: "Who are you traveling with?",
    options: [
      { value: "small", label: "Solo / Couple", icon: "👫" },
      { value: "family", label: "Family (with kids)", icon: "👨‍👩‍👧‍👦" },
      { value: "group", label: "Large Group (6+)", icon: "🚌" },
      { value: "corporate", label: "Corporate Team", icon: "💼" },
    ],
  },
];

// Individual Tour Data (can be fetched from Strapi later)
const tours = {
  penangHeritage: {
    title: "Penang Heritage Food Trail",
    desc: "The ultimate street food experience in Georgetown.",
    link: "/tours/penang-segment",
    badge: "Best Seller",
  },
  klSecrets: {
    title: "Secrets of Kuala Lumpur",
    desc: "Hidden culinary gems beyond the twin towers.",
    link: "/tours/secrets-of-kuala-lumpur",
    badge: "Hidden Gem",
  },
  melakaCultural: {
    title: "Melaka Cultural Journey",
    desc: "Peranakan culture and Nyonya cuisine history.",
    link: "/tours/melaka-cultural-food-journey",
  },
  vegetarian: {
    title: "Vegetarian Heritage Tour",
    desc: "140-year plant-based history with meat-free tastings.",
    link: "/vegetarian-food-tours",
    badge: "Plant-Based",
  },
  klang: {
    title: "Klang Royal Town Food Tour",
    desc: "Authentic flavors in the royal town of Klang.",
    link: "/tours/klang-segment",
  },
  ipoh: {
    title: "Ipoh Old Town Food Tour",
    desc: "Limestone hills and legendary white coffee.",
    link: "/tours/ipoh-segment",
  },
};

export function getRecommendation(answers: Record<string, string>): RecommendationResult {
  const { destination, dietary, group } = answers;

  // 1. Large Groups / Corporate -> Contact Focus
  if (group === "corporate" || group === "group") {
    return {
      headline: "Let's Plan Your Group Event",
      items: [
        {
          title: "Private Group Experience",
          desc: "Custom itineraries for large groups and corporate teams.",
          link: "/contact?reason=group_booking",
          badge: "Customizable",
        },
      ],
      showContactOption: true,
    };
  }

  // 2. Vegetarian Preference
  if (dietary === "vegetarian") {
    return {
      headline: "Delicious Meat-Free Options",
      items: [tours.vegetarian],
      showContactOption: true,
    };
  }

  // 3. Destination Based Logic
  if (destination === "penang") {
    return {
      headline: "Best of Penang",
      items: [tours.penangHeritage],
      showContactOption: false,
    };
  }

  if (destination === "kuala-lumpur") {
    // Suggest KL and maybe Klang as an alternative
    return {
      headline: "Explore Kuala Lumpur & Surrounds",
      items: [tours.klSecrets, tours.klang],
      showContactOption: false,
    };
  }

  if (destination === "melaka") {
    return {
      headline: "Historical Melaka",
      items: [tours.melakaCultural],
      showContactOption: false,
    };
  }

  // 4. Unsure / General
  return {
    headline: "Our Top Picks for You",
    items: [tours.penangHeritage, tours.klSecrets, tours.melakaCultural],
    showContactOption: true,
  };
}
