// Mock data for local development when Strapi/Directus isn't available
// This allows you to preview the frontend design

export const mockHomeData = {
  ourToursSection: {
    title: "Our Popular Tours",
    button: {
      title: "View All Tours",
      href: "/tours",
      buttonType: "primary"
    }
  },
  experienceTodaySection: {
    title: "Experience Today",
    button: {
      title: "Explore More",
      href: "/tours",
      buttonType: "secondary"
    }
  },
  mediaSection: {
    title: "See Us in Action",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  testimonialsSection: {
    title: "What Our Clients Say"
  },
  SEO: {
    title: "Simply Enak - Premium Malaysian Food Tours",
    description: "Experience authentic Malaysian cuisine with Simply Enak's premium food tours in Kuala Lumpur.",
    image: null,
    schema: null
  }
};

export const mockTours = [
  {
    id: 1,
    slug: "flavours-of-malaysia",
    metaTitle: "Flavours of Malaysia - Kuala Lumpur Food Tour",
    hero: {
      title: "Flavours of Malaysia",
      price: "RM 299",
      duration: "4 hours",
      location: "Kuala Lumpur",
      time: "10:00 AM",
      maxParticipants: 8,
      experienceType: "Street Food",
      image: {
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
        name: "Malaysian Food Market"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Experience the vibrant flavours of Malaysia on this exciting food tour through Kuala Lumpur's bustling markets." }]
      }
    ],
    TicketingHubID: "demo-tour-1",
    tags: ["street-food", "cultural", "market"],
    SEO: {
      title: "Flavours of Malaysia Tour",
      description: "Join us for an unforgettable food journey",
      image: null,
      schema: null
    }
  },
  {
    id: 2,
    slug: "kl-street-food-adventure",
    metaTitle: "KL Street Food Adventure - Night Market Tour",
    hero: {
      title: "KL Street Food Adventure",
      price: "RM 249",
      duration: "3.5 hours",
      location: "Chinatown, KL",
      time: "6:00 PM",
      maxParticipants: 10,
      experienceType: "Night Market",
      image: {
        url: "https://images.unsplash.com/photo-1563245372-f21abb23d04f?w=800",
        name: "KL Street Food"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Discover the best street food Kuala Lumpur has to offer on this evening food adventure." }]
      }
    ],
    TicketingHubID: "demo-tour-2",
    tags: ["street-food", "night-market", "chinese"],
    SEO: {
      title: "KL Street Food Adventure",
      description: "Experience KL's vibrant night food scene",
      image: null,
      schema: null
    }
  },
  {
    id: 3,
    slug: "penang-food-heritage",
    metaTitle: "Penang Food Heritage Tour - George Town Culinary Experience",
    hero: {
      title: "Penang Food Heritage",
      price: "RM 349",
      duration: "5 hours",
      location: "George Town, Penang",
      time: "9:00 AM",
      maxParticipants: 8,
      experienceType: "Heritage",
      image: {
        url: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800",
        name: "Penang Food"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Explore the UNESCO World Heritage site of George Town through its incredible food culture." }]
      }
    ],
    TicketingHubID: "demo-tour-3",
    tags: ["heritage", "penang", "cultural"],
    SEO: {
      title: "Penang Food Heritage Tour",
      description: "Discover Penang's legendary food scene",
      image: null,
      schema: null
    }
  },
  {
    id: 4,
    slug: "malaysian-cooking-class",
    metaTitle: "Malaysian Cooking Class - Learn to Cook Local Dishes",
    hero: {
      title: "Malaysian Cooking Class",
      price: "RM 399",
      duration: "4 hours",
      location: "Kuala Lumpur",
      time: "9:00 AM",
      maxParticipants: 6,
      experienceType: "Cooking Class",
      image: {
        url: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800",
        name: "Cooking Class"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Learn to cook authentic Malaysian dishes with our expert chefs." }]
      }
    ],
    TicketingHubID: "demo-tour-4",
    tags: ["cooking", "hands-on", "cultural"],
    SEO: {
      title: "Malaysian Cooking Class",
      description: "Master Malaysian cooking techniques",
      image: null,
      schema: null
    }
  },
  {
    id: 5,
    slug: "breakfast-of-kuala-lumpur",
    metaTitle: "Breakfast of Kuala Lumpur - Morning Food Tour",
    hero: {
      title: "Breakfast of Kuala Lumpur",
      price: "RM 199",
      duration: "3 hours",
      location: "Kuala Lumpur",
      time: "8:00 AM",
      maxParticipants: 8,
      experienceType: "Breakfast",
      image: {
        url: "https://images.unsplash.com/photo-1594970426665-d16302a6e703?w=800",
        name: "Malaysian Breakfast"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Start your day like a local with this delicious breakfast food tour." }]
      }
    ],
    TicketingHubID: "demo-tour-5",
    tags: ["breakfast", "morning", "local"],
    SEO: {
      title: "Breakfast of Kuala Lumpur",
      description: "Experience KL's breakfast culture",
      image: null,
      schema: null
    }
  },
  {
    id: 6,
    slug: "desserts-of-malaysia",
    metaTitle: "Desserts of Malaysia - Sweet Treats Tour",
    hero: {
      title: "Desserts of Malaysia",
      price: "RM 179",
      duration: "2.5 hours",
      location: "Kuala Lumpur",
      time: "3:00 PM",
      maxParticipants: 8,
      experienceType: "Desserts",
      image: {
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800",
        name: "Malaysian Desserts"
      }
    },
    contents: [
      {
        type: "paragraph",
        children: [{ text: "Satisfy your sweet tooth with Malaysia's most delicious desserts." }]
      }
    ],
    TicketingHubID: "demo-tour-6",
    tags: ["desserts", "sweets", "afternoon"],
    SEO: {
      title: "Desserts of Malaysia",
      description: "Discover Malaysian sweet treats",
      image: null,
      schema: null
    }
  }
];

export const mockTestimonials = [
  {
    name: "Sarah Johnson",
    country: "Australia",
    title: "Amazing experience!",
    review: "The Flavours of Malaysia tour was the highlight of our trip. Our guide was knowledgeable and the food was incredible!",
    image: { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" }
  },
  {
    name: "Michael Chen",
    country: "Singapore",
    title: "Highly recommended",
    review: "Great way to experience local culture. The market visit was eye-opening and all the food stops were fantastic.",
    image: { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }
  },
  {
    name: "Emma Williams",
    country: "United Kingdom",
    title: "Best food tour ever",
    review: "We've done food tours around the world, and this one tops them all. Authentic, delicious, and great value.",
    image: { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
  }
];

export const mockPartners = [
  { name: "Tourism Malaysia", url: "#", logo: { url: "https://via.placeholder.com/120x60?text=Partner+1" } },
  { name: "Kuala Lumpur Tourism", url: "#", logo: { url: "https://via.placeholder.com/120x60?text=Partner+2" } },
  { name: "Malaysia Airlines", url: "#", logo: { url: "https://via.placeholder.com/120x60?text=Partner+3" } },
  { name: "TripAdvisor", url: "#", logo: { url: "https://via.placeholder.com/120x60?text=Partner+4" } }
];
