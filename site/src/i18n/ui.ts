/**
 * UI string translations for Simply Enak (AstroWind site)
 *
 * Add new languages by:
 * 1. Adding the code to `languages`
 * 2. Adding the locale to `astro.config.mjs` i18n.locales
 * 3. Adding a translation object below matching all keys from `en`
 */

export const languages = {
  en: "English",
  ms: "Bahasa Malaysia",
} as const;

export type Language = keyof typeof languages;
export const defaultLang: Language = "en";

export const ui = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.tours": "Tours",
    "nav.stories": "Stories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.bookNow": "Book Now",
    "nav.allTours": "All Tours",
    "nav.tourComparison": "Why Simply Enak",
    "nav.privateTours": "Private Tours",
    "nav.flavours": "Flavours of Malaysia",
    "nav.klStreetFood": "KL Street Food",
    "nav.eatDrinkGeorgeTown": "Eat Drink George Town",
    "nav.penangStreetFood": "Penang Street Food",
    "nav.secretsOfKl": "Secrets of KL",

    // Footer
    "footer.byCity": "By City",
    "footer.klTours": "Kuala Lumpur Tours",
    "footer.penangTours": "Penang Tours",
    "footer.melakaTours": "Melaka Tours",
    "footer.ipohTours": "Ipoh Tours",
    "footer.byDietary": "By Dietary",
    "footer.vegetarian": "Vegetarian Tours",
    "footer.halal": "Halal Tours",
    "footer.vegan": "Vegan Tours",
    "footer.glutenFree": "Gluten-Free Tours",
    "footer.groupsEvents": "Groups & Events",
    "footer.families": "Families",
    "footer.couples": "Couples",
    "footer.chefs": "Chefs",
    "footer.weddingGroups": "Wedding Groups",
    "footer.joinInTours": "Join-In Tours",
    "footer.company": "Company",
    "footer.about": "About Simply Enak",
    "footer.stories": "Stories & Blog",
    "footer.contact": "Contact Us",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.copyright": "COPYRIGHT © 2026 SIMPLY ENAK FOOD EXPERIENCES. ALL RIGHTS RESERVED.",

    // Hero
    "hero.est": "EST",
    "hero.seeOurTours": "See Our Tours",
    "hero.whyChooseUs": "Why Choose Us",

    // Tours page
    "tours.pageTitle": "All Tours",
    "tours.pageDesc": "Explore our Malaysian food tours in Kuala Lumpur and Penang. Small groups, local guides, authentic experiences.",
    "tours.filterLabel": "Filter by",
    "tours.sortLabel": "Sort by",

    // About page
    "about.pageTitle": "About Simply Enak",
    "about.pageDesc": "Learn about our story, our values, and why we're passionate about sharing Malaysian food culture.",
    "about.pageTitleSuffix": "Malaysia Since 2011",

    // Contact page
    "contact.pageTitle": "Contact Us",
    "contact.pageDesc": "Get in touch with Simply Enak. We'd love to hear from you.",
    "contact.pageTitleSuffix": "in KL or Penang",
    "contact.ctaDesc": "We're here to help. Reach out anytime.",
    "contact.ctaHeading": "Still Have Questions?",
    "contact.chatOnWhatsApp": "Chat on WhatsApp",
    "contact.callNow": "Call Now",
    "contact.openWhatsApp": "Open WhatsApp",
    "contact.copyEmail": "Copy Email",
    "contact.copied": "Copied!",
    "contact.sending": "Sending...",
    "contact.privacyNotice": "By submitting, you agree to our",
    "contact.leaveBlank": "Leave this blank",
    "contact.yourMessage": "Your Message",
    "contact.inquiryType": "Inquiry Type",
    "contact.country": "Country",
    "contact.company": "Company",
    "contact.phoneWhatsApp": "Phone / WhatsApp",
    "contact.fullName": "Full Name",
    "contact.sendMessage": "Send Us a Message",
    "contact.heroDescription": "We'd love to hear from you. Tell us about your plans and we'll make it happen.",
    "contact.heroHeadingHighlight": "Looking For",
    "contact.heroHeading": "Tell Us What You're Looking For",
    "contact.heroEyebrow": "Get In Touch",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.orWhatsapp": "Or WhatsApp us directly",

    // FAQ page
    "faq.pageTitle": "Frequently Asked Questions",
    "faq.pageDesc": "Everything you need to know before booking a food tour with Simply Enak.",
    "faq.pageTitleSuffix": "Malaysia",
    "common.selectOption": "Select an option",
    "common.optional": "(optional)",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.readMore": "Read More",
    "common.viewAll": "View All",
    "common.learnMore": "Learn More",
    "common.from": "from",
    "common.duration": "Duration",
    "common.price": "Price",
    "common.location": "Location",
    "common.share": "Share",
    "common.backToTop": "Back to top",
  },

  ms: {
    // Navigation
    "nav.home": "Laman Utama",
    "nav.tours": "Pusingan",
    "nav.stories": "Cerita",
    "nav.about": "Tentang",
    "nav.contact": "Hubungi",
    "nav.bookNow": "Tempah Sekarang",
    "nav.allTours": "Semua Pusingan",
    "nav.tourComparison": "Mengapa Simply Enak",
    "nav.privateTours": "Pusingan Persendirian",
    "nav.flavours": "Rasa Malaysia",
    "nav.klStreetFood": "Makanan Jalanan KL",
    "nav.eatDrinkGeorgeTown": "Makan Minum George Town",
    "nav.penangStreetFood": "Makanan Jalanan Penang",
    "nav.secretsOfKl": "Rahsia KL",

    // Footer
    "footer.byCity": "Mengikut Bandar",
    "footer.klTours": "Pusingan Kuala Lumpur",
    "footer.penangTours": "Pusingan Penang",
    "footer.melakaTours": "Pusingan Melaka",
    "footer.ipohTours": "Pusingan Ipoh",
    "footer.byDietary": "Mengikut Diet",
    "footer.vegetarian": "Pusingan Vegetarian",
    "footer.halal": "Pusingan Halal",
    "footer.vegan": "Pusingan Vegan",
    "footer.glutenFree": "Pusingan Bebas Gluten",
    "footer.groupsEvents": "Kumpulan & Acara",
    "footer.families": "Keluarga",
    "footer.couples": "Pasangan",
    "footer.chefs": "Tukang Masak",
    "footer.weddingGroups": "Kumpulan Perkahwinan",
    "footer.joinInTours": "Pusingan Berkumpulan",
    "footer.company": "Syarikat",
    "footer.about": "Tentang Simply Enak",
    "footer.stories": "Cerita & Blog",
    "footer.contact": "Hubungi Kami",
    "footer.faq": "Soalan Lazim",
    "footer.privacy": "Dasar Privasi",
    "footer.terms": "Terma & Syarat",
    "footer.copyright": "HAK CIPTA © 2026 SIMPLY ENAK FOOD EXPERIENCES. HAK CIPTA TERPELIHARA.",

    // Hero
    "hero.est": "EST",
    "hero.seeOurTours": "Lihat Pusingan Kami",
    "hero.whyChooseUs": "Mengapa Pilih Kami",

    // Tours page
    "tours.pageTitle": "Semua Pusingan",
    "tours.pageDesc": "Terokai pusingan makanan Malaysia kami di Kuala Lumpur dan Penang. Kumpulan kecil, panduan tempatan, pengalaman asli.",
    "tours.filterLabel": "Tapisan",
    "tours.sortLabel": "Susunan",

    // About page
    "about.pageTitle": "Tentang Simply Enak",
    "about.pageDesc": "Ketahui tentang kisah kami, nilai kami, dan mengapa kami bersemangat untuk berkongsi budaya makanan Malaysia.",
    "about.pageTitleSuffix": "Malaysia Sejak 2011",

    // Contact page
    "contact.pageTitle": "Hubungi Kami",
    "contact.pageDesc": "Hubungi Simply Enak. Kami ingin mendengar daripada anda.",
    "contact.pageTitleSuffix": "di KL atau Pulau Pinang",
    "contact.ctaDesc": "Kami sedia membantu. Hubungi kami bila-bila masa.",
    "contact.ctaHeading": "Masih Ada Soalan?",
    "contact.chatOnWhatsApp": "Sembang di WhatsApp",
    "contact.callNow": "Panggil Sekarang",
    "contact.openWhatsApp": "Buka WhatsApp",
    "contact.copyEmail": "Salin E-mel",
    "contact.copied": "Disalin!",
    "contact.sending": "Menghantar...",
    "contact.privacyNotice": "Dengan menghantar, anda bersetuju dengan",
    "contact.leaveBlank": "Biarkan kosong",
    "contact.yourMessage": "Mesej Anda",
    "contact.inquiryType": "Jenis Pertanyaan",
    "contact.country": "Negara",
    "contact.company": "Syarikat",
    "contact.phoneWhatsApp": "Telefon / WhatsApp",
    "contact.fullName": "Nama Penuh",
    "contact.sendMessage": "Hantar Mesej kepada Kami",
    "contact.heroDescription": "Kami ingin mendengar daripada anda. Beritahu kami tentang rancangan anda dan kami akan merealisasikannya.",
    "contact.heroHeadingHighlight": "Anda Cari",
    "contact.heroHeading": "Beritahu Kami Apa Yang Anda Cari",
    "contact.heroEyebrow": "Hubungi Kami",
    "contact.name": "Nama",
    "contact.email": "E-mel",
    "contact.message": "Mesej",
    "contact.send": "Hantar Mesej",
    "contact.orWhatsapp": "Atau WhatsApp kami terus",

    // FAQ page
    "faq.pageTitle": "Soalan Lazim",
    "faq.pageDesc": "Segala yang perlu anda tahu sebelum menempah pusingan makanan dengan Simply Enak.",
    "faq.pageTitleSuffix": "Malaysia",
    "common.selectOption": "Pilih satu pilihan",
    "common.optional": "(pilihan)",

    // Common
    "common.loading": "Memuatkan...",
    "common.error": "Ada masalah",
    "common.readMore": "Baca Selanjutnya",
    "common.viewAll": "Lihat Semua",
    "common.learnMore": "Ketahui Lebih Lanjut",
    "common.from": "dari",
    "common.duration": "Tempoh",
    "common.price": "Harga",
    "common.location": "Lokasi",
    "common.share": "Kongsi",
    "common.backToTop": "Kembali ke atas",
  },
};

export type UiKey = keyof typeof ui.en;
