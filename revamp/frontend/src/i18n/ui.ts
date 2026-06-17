/**
 * UI string translations for Simply Enak
 *
 * Add new languages by:
 * 1. Adding the code to `languages`
 * 2. Adding the locale to `astro.config.mjs` i18n.locales
 * 3. Adding a translation object below matching all keys from `en`
 */

export const languages = {
  en: "English",
  ms: "Bahasa Malaysia",
  zh: "中文",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  nl: "Nederlands",
  ru: "Русский",
  ja: "日本語",
  pt: "Português",
} as const;

export type Language = keyof typeof languages;
export const defaultLang: Language = "en";

export const ui = {
  en: {
    // Navigation
    "nav.tours": "Tours",
    "nav.stories": "Stories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.bookNow": "Book Now",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "How It Works",
    "nav.privateTours": "Private Tours",
    "nav.joinInTours": "Join-In Tours",
    "nav.trackRecord": "Track Record",
    "nav.vegetarian": "Vegetarian Tours",
    "nav.cultural": "Cultural Tours",
    "nav.familyFriendly": "Family-Friendly",
    "nav.directions": "Directions",
    "nav.howToPrepare": "How to Prepare",
    "nav.faq": "FAQ",
    "nav.klGuide": "KL Eating Guide",
    "nav.penangGuide": "Penang Eating Guide",
    
    // Footer
    "footer.contactUs": "Contact Us",
    "footer.quickLinks": "Quick Links",
    "footer.partners": "Our Partners",
    "footer.paymentMethods": "Payment Methods",
    "footer.weAccept": "We Accept",
    "footer.allRightsReserved": "All rights reserved",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsConditions": "Terms & Conditions",

    // Hero
    "hero.cta.primary": "See Our Tours",
    "hero.cta.secondary": "Why Choose Us",
    "hero.since": "Since",
    "hero.rating": "Rating",
    "hero.travellersChoice": "Travellers' Choice",
    "hero.heritageVendors": "Heritage Vendors",
    "hero.lowWaste": "Low-Waste Tours",
    "hero.slowTravel": "Slow Travel Values",

    // Tours
    "tours.joinTour": "Join This Tour",
    "tours.price": "Price",
    "tours.duration": "Duration",
    "tours.bestseller": "Bestseller",
    "tours.seeAll": "See All Our Tours",
    "tours.findBest": "Find the Best Tour for You",
    "tours.relatedTours": "Related Tours",
    "tours.experienceProfiler": "Simply Enak Experience Profiler",

    // Vendors
    "vendors.meetOn": "Meet on the",
    "vendors.seeAll": "See All Vendor Stories",
    "vendors.bottomNote":
      "These are just three of the 40+ heritage vendors we visit regularly. When you tour with us, you'll meet the people behind the food, hear their stories, and taste why these recipes have survived generations.",

    // Testimonials
    "testimonials.title": "What Our Guests Say",

    // Stories
    "stories.title": "Malaysian Food Stories",
    "stories.readMore": "Read More",

    // FAQ
    "faq.title": "Questions We Often Hear",

    // CTA
    "cta.title": "Let's Eat Together",
    "cta.subtitle":
      "Join us for your next Malaysian adventure. Small groups, real neighborhoods, unforgettable stories.",
    "cta.bookExperience": "Book Your Experience",
    "cta.chatKenny": "Chat with Kenny",
    "cta.freeCancellation": "Free cancellation up to 24 hours",
    "cta.responseTime": "We respond within 3 hours",
    "cta.maxPeople": "Max 8 people per tour",

    // Partners
    "partners.featuredIn": "As Featured In",

    // Common
    "common.location": "Location",
    "common.duration": "Duration",
    "common.price": "Price",
    "common.from": "from",
    "common.since": "Since",
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
  },

  de: {
    // Navigation
    "nav.tours": "Touren",
    "nav.stories": "Geschichten",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.bookNow": "Jetzt buchen",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "So funktioniert es",
    "nav.privateTours": "Private Touren",
    "nav.joinInTours": "Gruppentouren",
    "nav.trackRecord": "Unsere Bilanz",
    "nav.vegetarian": "Vegetarische Touren",
    "nav.cultural": "Kulturtouren",
    "nav.familyFriendly": "Familienfreundlich",
    "nav.directions": "Anfahrt",
    "nav.howToPrepare": "Vorbereitung",
    "nav.faq": "FAQ",
    "nav.klGuide": "KL Essensführer",
    "nav.penangGuide": "Penang Essensführer",

    // Hero
    "hero.cta.primary": "Touren ansehen",
    "hero.cta.secondary": "Warum wir?",
    "hero.since": "Seit",
    "hero.rating": "Bewertung",
    "hero.travellersChoice": "Travellers' Choice",
    "hero.heritageVendors": "Traditionelle Händler",
    "hero.lowWaste": "Umweltschonende Touren",
    "hero.slowTravel": "Slow-Travel-Werte",

    // Tours
    "tours.joinTour": "Tour buchen",
    "tours.price": "Preis",
    "tours.duration": "Dauer",
    "tours.bestseller": "Bestseller",
    "tours.seeAll": "Alle Touren ansehen",
    "tours.findBest": "Finde die beste Tour für dich",
    "tours.relatedTours": "Ähnliche Touren",
    "tours.experienceProfiler": "Simply Enak Erlebnis-Profil",

    // Vendors
    "vendors.meetOn": "Treffe auf der",
    "vendors.seeAll": "Alle Händlergeschichten ansehen",
    "vendors.bottomNote":
      "Das sind nur drei der 40+ Traditionshändler, die wir regelmäßig besuchen. Auf unseren Touren lernst du die Menschen hinter dem Essen kennen, hörst ihre Geschichten und schmeckst, warum diese Rezepte Generationen überdauert haben.",

    // Testimonials
    "testimonials.title": "Was unsere Gäste sagen",

    // Stories
    "stories.title": "Malaysische Food-Geschichten",
    "stories.readMore": "Mehr lesen",

    // FAQ
    "faq.title": "Häufig gestellte Fragen",

    // CTA
    "cta.title": "Lass uns gemeinsam essen",
    "cta.subtitle":
      "Begleite uns auf deinem nächsten malaysischen Abenteuer. Kleine Gruppen, echte Viertel, unvergessliche Geschichten.",
    "cta.bookExperience": "Erlebnis buchen",
    "cta.chatKenny": "Mit Kenny chatten",
    "cta.freeCancellation": "Kostenlose Stornierung bis 24 Stunden vorher",
    "cta.responseTime": "Wir antworten innerhalb von 3 Stunden",
    "cta.maxPeople": "Maximal 8 Personen pro Tour",

    // Partners
    "partners.featuredIn": "Bekannt aus",

    // Footer
    "footer.contactUs": "Kontakt",
    "footer.quickLinks": "Schnelllinks",
    "footer.partners": "Unsere Partner",
    "footer.paymentMethods": "Zahlungsmethoden",
    "footer.weAccept": "Wir akzeptieren",
    "footer.allRightsReserved": "Alle Rechte vorbehalten",
    "footer.privacyPolicy": "Datenschutz",
    "footer.termsConditions": "AGB",

    // Common
    "common.location": "Ort",
    "common.duration": "Dauer",
    "common.price": "Preis",
    "common.from": "ab",
    "common.since": "Seit",
    "common.learnMore": "Mehr erfahren",
    "common.viewAll": "Alle anzeigen",
  },

  es: {
    // Navigation
    "nav.tours": "Tours",
    "nav.stories": "Historias",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.bookNow": "Reservar ahora",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Cómo funciona",
    "nav.privateTours": "Tours privados",
    "nav.joinInTours": "Tours en grupo",
    "nav.trackRecord": "Nuestra trayectoria",
    "nav.vegetarian": "Tours vegetarianos",
    "nav.cultural": "Tours culturales",
    "nav.familyFriendly": "Apto para familias",
    "nav.directions": "Cómo llegar",
    "nav.howToPrepare": "Cómo prepararse",
    "nav.faq": "Preguntas frecuentes",
    "nav.klGuide": "Guía gastronómica de KL",
    "nav.penangGuide": "Guía gastronómica de Penang",

    // Hero
    "hero.cta.primary": "Ver nuestros tours",
    "hero.cta.secondary": "¿Por qué elegirnos?",
    "hero.since": "Desde",
    "hero.rating": "Puntuación",
    "hero.travellersChoice": "Elección de los viajeros",
    "hero.heritageVendors": "Vendedores tradicionales",
    "hero.lowWaste": "Tours sostenibles",
    "hero.slowTravel": "Valores de viaje lento",

    // Tours
    "tours.joinTour": "Unirse al tour",
    "tours.price": "Precio",
    "tours.duration": "Duración",
    "tours.bestseller": "Más vendido",
    "tours.seeAll": "Ver todos los tours",
    "tours.findBest": "Encuentra el mejor tour para ti",
    "tours.relatedTours": "Tours relacionados",
    "tours.experienceProfiler": "Perfil de experiencia de Simply Enak",

    // Vendors
    "vendors.meetOn": "Conoce en el",
    "vendors.seeAll": "Ver todas las historias de vendedores",
    "vendors.bottomNote":
      "Estos son solo tres de los 40+ vendedores tradicionales que visitamos regularmente. En nuestros tours conocerás a las personas detrás de la comida, escucharás sus historias y probarás por qué estas recetas han sobrevivido generaciones.",

    // Testimonials
    "testimonials.title": "Lo que dicen nuestros huéspedes",

    // Stories
    "stories.title": "Historias de la comida malaya",
    "stories.readMore": "Leer más",

    // FAQ
    "faq.title": "Preguntas frecuentes",

    // CTA
    "cta.title": "Comamos juntos",
    "cta.subtitle":
      "Únete a nosotros en tu próxima aventura malaya. Grupos pequeños, barrios auténticos, historias inolvidables.",
    "cta.bookExperience": "Reservar tu experiencia",
    "cta.chatKenny": "Chatear con Kenny",
    "cta.freeCancellation": "Cancelación gratuita hasta 24 horas antes",
    "cta.responseTime": "Respondemos en menos de 3 horas",
    "cta.maxPeople": "Máximo 8 personas por tour",

    // Partners
    "partners.featuredIn": "Destacado en",

    // Footer
    "footer.contactUs": "Contáctenos",
    "footer.quickLinks": "Enlaces rápidos",
    "footer.partners": "Nuestros socios",
    "footer.paymentMethods": "Métodos de pago",
    "footer.weAccept": "Aceptamos",
    "footer.allRightsReserved": "Todos los derechos reservados",
    "footer.privacyPolicy": "Política de privacidad",
    "footer.termsConditions": "Términos y condiciones",

    // Common
    "common.location": "Ubicación",
    "common.duration": "Duración",
    "common.price": "Precio",
    "common.from": "desde",
    "common.since": "Desde",
    "common.learnMore": "Saber más",
    "common.viewAll": "Ver todos",
  },

  ms: {
    // Navigation
    "nav.tours": "Pusingan",
    "nav.stories": "Cerita",
    "nav.about": "Tentang",
    "nav.contact": "Hubungi",
    "nav.bookNow": "Tempah Sekarang",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Cara Ia Berfungsi",
    "nav.privateTours": "Pusingan Persendirian",
    "nav.joinInTours": "Pusingan Berkumpulan",
    "nav.trackRecord": "Rekod Prestasi",
    "nav.vegetarian": "Pusingan Vegetarian",
    "nav.cultural": "Pusingan Budaya",
    "nav.familyFriendly": "Mesra Keluarga",
    "nav.directions": "Arahan",
    "nav.howToPrepare": "Cara Bersedia",
    "nav.faq": "Soalan Lazim",
    "nav.klGuide": "Panduan Makan KL",
    "nav.penangGuide": "Panduan Makan Penang",

    // Hero
    "hero.cta.primary": "LIHAT PUSINGAN KAMI",
    "hero.cta.secondary": "MENGAPA PILIH KAMI",
    "hero.since": "Sejak",
    "hero.rating": "Penilaian",
    "hero.travellersChoice": "Pilihan Pelancong",
    "hero.heritageVendors": "Peniaga Warisan",
    "hero.lowWaste": "Pusingan Rendah Sisa",
    "hero.slowTravel": "Nilai Perjalanan Perlahan",

    // Tours
    "tours.joinTour": "Sertai Pusingan Ini",
    "tours.price": "Harga",
    "tours.duration": "Tempoh",
    "tours.bestseller": "Paling Laris",
    "tours.seeAll": "Lihat Semua Pusingan",
    "tours.findBest": "Cari Pusingan Terbaik untuk Anda",
    "tours.relatedTours": "Lawatan Berkaitan",
    "tours.experienceProfiler": "Pengalaman Simply Enak",

    // Vendors
    "vendors.meetOn": "Jumpa di",
    "vendors.seeAll": "Lihat Semua Cerita Peniaga",
    "vendors.bottomNote":
      "Ini hanya tiga daripada 40+ peniaga warisan yang kami lawati secara tetap. Apabila anda mengikuti pusingan kami, anda akan mengenali orang di sebalik makanan, mendengar cerita mereka, dan merasai mengapa resipi ini telah bertahan selama beberapa generasi.",

    // Testimonials
    "testimonials.title": "Apa Kata Tetamu Kami",

    // Stories
    "stories.title": "Cerita Makanan Malaysia",
    "stories.readMore": "Baca Selanjutnya",

    // FAQ
    "faq.title": "Soalan Yang Kami Sering Dengar",

    // CTA
    "cta.title": "Mari Makan Bersama",
    "cta.subtitle":
      "Sertai kami untuk pengembaraan Malaysia anda seterusnya. Kumpulan kecil, kejiranan sebenar, cerita yang tidak dapat dilupakan.",
    "cta.bookExperience": "Tempah Pengalaman Anda",
    "cta.chatKenny": "Sembang dengan Kenny",
    "cta.freeCancellation": "Pembatalan percuma sehingga 24 jam",
    "cta.responseTime": "Kami balas dalam masa 3 jam",
    "cta.maxPeople": "Maksimum 8 orang setiap pusingan",

    // Partners
    "partners.featuredIn": "Seperti Ditampilkan Dalam",

    // Footer
    "footer.contactUs": "Hubungi Kami",
    "footer.quickLinks": "Pautan Pantas",
    "footer.partners": "Rakan Kongsi Kami",
    "footer.paymentMethods": "Kaedah Pembayaran",
    "footer.weAccept": "Kami menerima",
    "footer.allRightsReserved": "Hak cipta terpelihara",
    "footer.privacyPolicy": "Dasar Privasi",
    "footer.termsConditions": "Terma & Syarat",

    // Common
    "common.location": "Lokasi",
    "common.duration": "Tempoh",
    "common.price": "Harga",
    "common.from": "dari",
    "common.since": "Sejak",
    "common.learnMore": "Ketahui Lebih Lanjut",
    "common.viewAll": "Lihat Semua",
  },

  zh: {
    // Navigation
    "nav.tours": "旅游",
    "nav.stories": "故事",
    "nav.about": "关于我们",
    "nav.contact": "联系我们",
    "nav.bookNow": "立即预订",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "如何运作",
    "nav.privateTours": "私人游览",
    "nav.joinInTours": "团体游览",
    "nav.trackRecord": "往绩记录",
    "nav.vegetarian": "素食游览",
    "nav.cultural": "文化游览",
    "nav.familyFriendly": "适合家庭",
    "nav.directions": "交通指引",
    "nav.howToPrepare": "如何准备",
    "nav.faq": "常见问题",
    "nav.klGuide": "吉隆坡美食指南",
    "nav.penangGuide": "槟城美食指南",

    // Hero
    "hero.cta.primary": "查看我们的旅游",
    "hero.cta.secondary": "为什么选择我们",
    "hero.since": "始于",
    "hero.rating": "评分",
    "hero.travellersChoice": "旅行者之选",
    "hero.heritageVendors": "传统摊贩",
    "hero.lowWaste": "低碳旅游",
    "hero.slowTravel": "慢游价值",

    // Tours
    "tours.joinTour": "参加这个旅游",
    "tours.price": "价格",
    "tours.duration": "时长",
    "tours.bestseller": "热门",
    "tours.seeAll": "查看所有旅游",
    "tours.findBest": "找到最适合您的旅游",
    "tours.relatedTours": "相关行程",
    "tours.experienceProfiler": "Simply Enak 体验分析",

    // Vendors
    "vendors.meetOn": "见面于",
    "vendors.seeAll": "查看所有摊贩故事",
    "vendors.bottomNote":
      "这只是我们定期拜访的 40 多个传统摊贩中的三个。当您和我们一起去旅游时，您将了解食物背后的人，听到他们的故事，品尝为什么这些食谱能够传承几代人。",

    // Testimonials
    "testimonials.title": "客人怎么说",

    // Stories
    "stories.title": "马来西亚美食故事",
    "stories.readMore": "阅读更多",

    // FAQ
    "faq.title": "常见问题",

    // CTA
    "cta.title": "一起品尝美食",
    "cta.subtitle":
      "加入我们的下一次马来西亚冒险。小团体、真实的社区、难忘的故事。",
    "cta.bookExperience": "预订您的体验",
    "cta.chatKenny": "与 Kenny 聊天",
    "cta.freeCancellation": "24 小时前免费取消",
    "cta.responseTime": "我们在 3 小时内回复",
    "cta.maxPeople": "每次旅游最多 8 人",

    // Partners
    "partners.featuredIn": "媒体报导",

    // Footer
    "footer.contactUs": "联系我们",
    "footer.quickLinks": "快速链接",
    "footer.partners": "我们的合作伙伴",
    "footer.paymentMethods": "付款方式",
    "footer.weAccept": "我们接受",
    "footer.allRightsReserved": "版权所有",
    "footer.privacyPolicy": "隐私政策",
    "footer.termsConditions": "条款与条件",

    // Common
    "common.location": "地点",
    "common.duration": "时长",
    "common.price": "价格",
    "common.from": "从",
    "common.since": "始于",
    "common.learnMore": "了解更多",
    "common.viewAll": "查看全部",
  },

  fr: {
    // Navigation
    "nav.tours": "Visites",
    "nav.stories": "Histoires",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.bookNow": "Réserver maintenant",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Comment ça marche",
    "nav.privateTours": "Visites privées",
    "nav.joinInTours": "Visites en groupe",
    "nav.trackRecord": "Notre expérience",
    "nav.vegetarian": "Visites végétariennes",
    "nav.cultural": "Visites culturelles",
    "nav.familyFriendly": "Adapté aux familles",
    "nav.directions": "Itinéraire",
    "nav.howToPrepare": "Comment se préparer",
    "nav.faq": "FAQ",
    "nav.klGuide": "Guide alimentaire KL",
    "nav.penangGuide": "Guide alimentaire Penang",

    // Hero
    "hero.cta.primary": "Voir nos visites",
    "hero.cta.secondary": "Pourquoi nous choisir",
    "hero.since": "Depuis",
    "hero.rating": "Note",
    "hero.travellersChoice": "Choix des voyageurs",
    "hero.heritageVendors": "Vendeurs patrimoniaux",
    "hero.lowWaste": "Visites à faible déchet",
    "hero.slowTravel": "Valeurs du voyage lent",

    // Tours
    "tours.joinTour": "Rejoindre cette visite",
    "tours.price": "Prix",
    "tours.duration": "Durée",
    "tours.bestseller": "Meilleure vente",
    "tours.seeAll": "Voir toutes nos visites",
    "tours.findBest": "Trouvez la meilleure visite pour vous",
    "tours.relatedTours": "Visites connexes",
    "tours.experienceProfiler": "Profil d'expérience Simply Enak",

    // Vendors
    "vendors.meetOn": "Rencontrez sur le",
    "vendors.seeAll": "Voir toutes les histoires des vendeurs",
    "vendors.bottomNote":
      "Ce ne sont que trois des 40+ vendeurs patrimoniaux que nous visitons régulièrement. Lorsque vous faites une visite avec nous, vous rencontrez les personnes derrière la nourriture, entendez leurs histoires et goûtez pourquoi ces recettes ont survécu aux générations.",

    // Testimonials
    "testimonials.title": "Ce que disent nos invités",

    // Stories
    "stories.title": "Histoires alimentaires malaisiennes",
    "stories.readMore": "Lire la suite",

    // FAQ
    "faq.title": "Questions fréquentes",

    // CTA
    "cta.title": "Mangeons ensemble",
    "cta.subtitle":
      "Rejoignez-nous pour votre prochaine aventure malaisienne. Petits groupes, vrais quartiers, histoires inoubliables.",
    "cta.bookExperience": "Réservez votre expérience",
    "cta.chatKenny": "Discuter avec Kenny",
    "cta.freeCancellation": "Annulation gratuite jusqu'à 24 heures",
    "cta.responseTime": "Nous répondons dans les 3 heures",
    "cta.maxPeople": "Maximum 8 personnes par visite",

    // Partners
    "partners.featuredIn": "Comme présenté dans",

    // Footer
    "footer.contactUs": "Contactez-nous",
    "footer.quickLinks": "Liens rapides",
    "footer.partners": "Nos partenaires",
    "footer.paymentMethods": "Moyens de paiement",
    "footer.weAccept": "Nous acceptons",
    "footer.allRightsReserved": "Tous droits réservés",
    "footer.privacyPolicy": "Politique de confidentialité",
    "footer.termsConditions": "Conditions générales",

    // Common
    "common.location": "Emplacement",
    "common.duration": "Durée",
    "common.price": "Prix",
    "common.from": "à partir de",
    "common.since": "Depuis",
    "common.learnMore": "En savoir plus",
    "common.viewAll": "Voir tout",
  },

  nl: {
    // Navigation
    "nav.tours": "Tours",
    "nav.stories": "Verhalen",
    "nav.about": "Over ons",
    "nav.contact": "Contact",
    "nav.bookNow": "Nu boeken",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Hoe het werkt",
    "nav.privateTours": "Privé tours",
    "nav.joinInTours": "Groepstours",
    "nav.trackRecord": "Onze ervaring",
    "nav.vegetarian": "Vegetarische tours",
    "nav.cultural": "Culturele tours",
    "nav.familyFriendly": "Gezinsvriendelijk",
    "nav.directions": "Routebeschrijving",
    "nav.howToPrepare": "Hoe voor te bereiden",
    "nav.faq": "Veelgestelde vragen",
    "nav.klGuide": "KL Eetgids",
    "nav.penangGuide": "Penang Eetgids",

    // Hero
    "hero.cta.primary": "Bekijk onze tours",
    "hero.cta.secondary": "Waarom kiezen voor ons",
    "hero.since": "Sinds",
    "hero.rating": "Beoordeling",
    "hero.travellersChoice": "Reizigerskeuze",
    "hero.heritageVendors": "Erfgoed verkopers",
    "hero.lowWaste": "Afvalarme tours",
    "hero.slowTravel": "Langzaam reizen waarden",

    // Tours
    "tours.joinTour": "Doe mee aan deze tour",
    "tours.price": "Prijs",
    "tours.duration": "Duur",
    "tours.bestseller": "Bestseller",
    "tours.seeAll": "Bekijk al onze tours",
    "tours.findBest": "Vind de beste tour voor jou",
    "tours.relatedTours": "Gerelateerde tours",
    "tours.experienceProfiler": "Simply Enak Ervaringsprofiel",

    // Vendors
    "vendors.meetOn": "Ontmoet op de",
    "vendors.seeAll": "Bekijk alle verkopersverhalen",
    "vendors.bottomNote":
      "Dit zijn slechts drie van de 40+ erfgoed verkopers die we regelmatig bezoeken. Wanneer je met ons meegaat op tour, ontmoet je de mensen achter het eten, hoor je hun verhalen en proef je waarom deze recepten generaties hebben overleefd.",

    // Testimonials
    "testimonials.title": "Wat onze gasten zeggen",

    // Stories
    "stories.title": "Maleisische voedselverhalen",
    "stories.readMore": "Lees meer",

    // FAQ
    "faq.title": "Veelgestelde vragen",

    // CTA
    "cta.title": "Laten we samen eten",
    "cta.subtitle":
      "Doe mee met je volgende Maleisische avontuur. Kleine groepen, echte buurten, onvergetelijke verhalen.",
    "cta.bookExperience": "Boek je ervaring",
    "cta.chatKenny": "Chat met Kenny",
    "cta.freeCancellation": "Gratis annuleren tot 24 uur van tevoren",
    "cta.responseTime": "We antwoorden binnen 3 uur",
    "cta.maxPeople": "Maximaal 8 personen per tour",

    // Partners
    "partners.featuredIn": "Zoals te zien in",

    // Footer
    "footer.contactUs": "Neem contact op",
    "footer.quickLinks": "Snelle links",
    "footer.partners": "Onze partners",
    "footer.paymentMethods": "Betaalmethoden",
    "footer.weAccept": "Wij accepteren",
    "footer.allRightsReserved": "Alle rechten voorbehouden",
    "footer.privacyPolicy": "Privacybeleid",
    "footer.termsConditions": "Algemene voorwaarden",

    // Common
    "common.location": "Locatie",
    "common.duration": "Duur",
    "common.price": "Prijs",
    "common.from": "vanaf",
    "common.since": "Sinds",
    "common.learnMore": "Meer informatie",
    "common.viewAll": "Alles bekijken",
  },

  ru: {
    // Navigation
    "nav.tours": "Туры",
    "nav.stories": "Истории",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "nav.bookNow": "Забронировать сейчас",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Как это работает",
    "nav.privateTours": "Частные туры",
    "nav.joinInTours": "Групповые туры",
    "nav.trackRecord": "Наш опыт",
    "nav.vegetarian": "Вегетарианские туры",
    "nav.cultural": "Культурные туры",
    "nav.familyFriendly": "Для семей",
    "nav.directions": "Как добраться",
    "nav.howToPrepare": "Как подготовиться",
    "nav.faq": "Часто задаваемые вопросы",
    "nav.klGuide": "Гид по еде KL",
    "nav.penangGuide": "Гид по еде Пенанга",

    // Hero
    "hero.cta.primary": "Посмотреть наши туры",
    "hero.cta.secondary": "Почему выбрать нас",
    "hero.since": "С",
    "hero.rating": "Рейтинг",
    "hero.travellersChoice": "Выбор путешественников",
    "hero.heritageVendors": "Традиционные продавцы",
    "hero.lowWaste": "Экологичные туры",
    "hero.slowTravel": "Ценности медленного путешествия",

    // Tours
    "tours.joinTour": "Присоединиться к туру",
    "tours.price": "Цена",
    "tours.duration": "Продолжительность",
    "tours.bestseller": "Бестселлер",
    "tours.seeAll": "Посмотреть все туры",
    "tours.findBest": "Найдите лучший тур для себя",
    "tours.relatedTours": "Похожие туры",
    "tours.experienceProfiler": "Профиль опыта Simply Enak",

    // Vendors
    "vendors.meetOn": "Встреча на",
    "vendors.seeAll": "Посмотреть все истории продавцов",
    "vendors.bottomNote":
      "Это только три из 40+ традиционных продавцов, которых мы регулярно посещаем. Когда вы путешествуете с нами, вы встречаетесь с людьми, стоящими за едой, слышите их истории и пробуете, почему эти рецепты пережили поколения.",

    // Testimonials
    "testimonials.title": "Что говорят наши гости",

    // Stories
    "stories.title": "Малайзийские истории о еде",
    "stories.readMore": "Читать далее",

    // FAQ
    "faq.title": "Часто задаваемые вопросы",

    // CTA
    "cta.title": "Давайте есть вместе",
    "cta.subtitle":
      "Присоединяйтесь к нам для вашего следующего малайзийского приключения. Маленькие группы, настоящие кварталы, незабываемые истории.",
    "cta.bookExperience": "Забронировать впечатление",
    "cta.chatKenny": "Чат с Kenny",
    "cta.freeCancellation": "Бесплатная отмена до 24 часов",
    "cta.responseTime": "Мы отвечаем в течение 3 часов",
    "cta.maxPeople": "Максимум 8 человек на тур",

    // Partners
    "partners.featuredIn": "Как показано в",

    // Footer
    "footer.contactUs": "Связаться с нами",
    "footer.quickLinks": "Быстрые ссылки",
    "footer.partners": "Наши партнёры",
    "footer.paymentMethods": "Способы оплаты",
    "footer.weAccept": "Мы принимаем",
    "footer.allRightsReserved": "Все права защищены",
    "footer.privacyPolicy": "Политика конфиденциальности",
    "footer.termsConditions": "Условия использования",

    // Common
    "common.location": "Местоположение",
    "common.duration": "Продолжительность",
    "common.price": "Цена",
    "common.from": "от",
    "common.since": "С",
    "common.learnMore": "Узнать больше",
    "common.viewAll": "Посмотреть все",
  },

  ja: {
    // Navigation
    "nav.tours": "ツアー",
    "nav.stories": "ストーリー",
    "nav.about": "私たちについて",
    "nav.contact": "お問い合わせ",
    "nav.bookNow": "今すぐ予約",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "仕組み",
    "nav.privateTours": "プライベートツアー",
    "nav.joinInTours": "グループツアー",
    "nav.trackRecord": "私たちの経験",
    "nav.vegetarian": "ベジタリアンツアー",
    "nav.cultural": "文化ツアー",
    "nav.familyFriendly": "ファミリーフレンドリー",
    "nav.directions": "行き方",
    "nav.howToPrepare": "準備方法",
    "nav.faq": "よくある質問",
    "nav.klGuide": "KL 食事ガイド",
    "nav.penangGuide": "ペナン食事ガイド",

    // Hero
    "hero.cta.primary": "ツアーを見る",
    "hero.cta.secondary": "なぜ私たちを選ぶのか",
    "hero.since": "設立",
    "hero.rating": "評価",
    "hero.travellersChoice": "旅行者が選ぶ",
    "hero.heritageVendors": "伝統的な屋台",
    "hero.lowWaste": "環境に優しいツアー",
    "hero.slowTravel": "スロー旅行の価値",

    // Tours
    "tours.joinTour": "このツアーに参加",
    "tours.price": "料金",
    "tours.duration": "所要時間",
    "tours.bestseller": "ベストセラー",
    "tours.seeAll": "すべてのツアーを見る",
    "tours.findBest": "あなたに最適なツアーを見つける",
    "tours.relatedTours": "関連ツアー",
    "tours.experienceProfiler": "Simply Enak エクスペリエンスプロファイラー",

    // Vendors
    "vendors.meetOn": "で会う",
    "vendors.seeAll": "すべての屋台ストーリーを見る",
    "vendors.bottomNote":
      "これらは定期的に訪問する 40 以上の伝統的な屋台のうちの 3 つです。ツアーに参加すると、食の背後にいる人々に出会い、彼らの話を聞き、なぜこれらのレシピが何世代にもわたって受け継がれてきたのかを味わうことができます。",

    // Testimonials
    "testimonials.title": "ゲストの声",

    // Stories
    "stories.title": "マレーシアのフードストーリー",
    "stories.readMore": "続きを読む",

    // FAQ
    "faq.title": "よくある質問",

    // CTA
    "cta.title": "一緒に食べましょう",
    "cta.subtitle":
      "次のマレーシアアドベンチャーに参加しましょう。少人数グループ、本物の地域、忘れられないストーリー。",
    "cta.bookExperience": "体験を予約",
    "cta.chatKenny": "Kenny とチャット",
    "cta.freeCancellation": "24 時間前まで無料キャンセル",
    "cta.responseTime": "3 時間以内に返信",
    "cta.maxPeople": "1 ツアー最大 8 名",

    // Partners
    "partners.featuredIn": "メディア掲載",

    // Footer
    "footer.contactUs": "お問い合わせ",
    "footer.quickLinks": "クイックリンク",
    "footer.partners": "パートナー",
    "footer.paymentMethods": "お支払い方法",
    "footer.weAccept": "お支払い可能",
    "footer.allRightsReserved": "全著作権所有",
    "footer.privacyPolicy": "プライバシーポリシー",
    "footer.termsConditions": "利用規約",

    // Common
    "common.location": "場所",
    "common.duration": "所要時間",
    "common.price": "料金",
    "common.from": "から",
    "common.since": "設立",
    "common.learnMore": "詳細を見る",
    "common.viewAll": "すべて見る",
  },

  pt: {
    // Navigation
    "nav.tours": "Passeios",
    "nav.stories": "Histórias",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.bookNow": "Reservar agora",
    "nav.whatsapp": "WhatsApp",
    "nav.howItWorks": "Como funciona",
    "nav.privateTours": "Passeios privados",
    "nav.joinInTours": "Passeios em grupo",
    "nav.trackRecord": "Nossa experiência",
    "nav.vegetarian": "Passeios vegetarianos",
    "nav.cultural": "Passeios culturais",
    "nav.familyFriendly": "Família-friendly",
    "nav.directions": "Direções",
    "nav.howToPrepare": "Como se preparar",
    "nav.faq": "Perguntas frequentes",
    "nav.klGuide": "Guia alimentar KL",
    "nav.penangGuide": "Guia alimentar Penang",

    // Hero
    "hero.cta.primary": "Ver nossos passeios",
    "hero.cta.secondary": "Por que nos escolher",
    "hero.since": "Desde",
    "hero.rating": "Avaliação",
    "hero.travellersChoice": "Escolha dos viajantes",
    "hero.heritageVendors": "Vendedores tradicionais",
    "hero.lowWaste": "Passeios com pouco desperdício",
    "hero.slowTravel": "Valores de viagem lenta",

    // Tours
    "tours.joinTour": "Participar deste passeio",
    "tours.price": "Preço",
    "tours.duration": "Duração",
    "tours.bestseller": "Mais vendido",
    "tours.seeAll": "Ver todos os nossos passeios",
    "tours.findBest": "Encontre o melhor passeio para você",
    "tours.relatedTours": "Tours relacionados",
    "tours.experienceProfiler": "Perfil de experiência Simply Enak",

    // Vendors
    "vendors.meetOn": "Encontre no",
    "vendors.seeAll": "Ver todas as histórias dos vendedores",
    "vendors.bottomNote":
      "Estes são apenas três dos 40+ vendedores tradicionais que visitamos regularmente. Quando você faz um passeio conosco, conhece as pessoas por trás da comida, ouve suas histórias e prova por que essas receitas sobreviveram por gerações.",

    // Testimonials
    "testimonials.title": "O que nossos hóspedes dizem",

    // Stories
    "stories.title": "Histórias de comida da Malásia",
    "stories.readMore": "Ler mais",

    // FAQ
    "faq.title": "Perguntas frequentes",

    // CTA
    "cta.title": "Vamos comer juntos",
    "cta.subtitle":
      "Junte-se a nós para sua próxima aventura malaia. Grupos pequenos, bairros reais, histórias inesquecíveis.",
    "cta.bookExperience": "Reserve sua experiência",
    "cta.chatKenny": "Conversar com Kenny",
    "cta.freeCancellation": "Cancelamento gratuito até 24 horas",
    "cta.responseTime": "Respondemos em até 3 horas",
    "cta.maxPeople": "Máximo de 8 pessoas por passeio",

    // Partners
    "partners.featuredIn": "Como destacado em",

    // Footer
    "footer.contactUs": "Contacte-nos",
    "footer.quickLinks": "Links rápidos",
    "footer.partners": "Os nossos parceiros",
    "footer.paymentMethods": "Métodos de pagamento",
    "footer.weAccept": "Aceitamos",
    "footer.allRightsReserved": "Todos os direitos reservados",
    "footer.privacyPolicy": "Política de privacidade",
    "footer.termsConditions": "Termos e condições",

    // Common
    "common.location": "Localização",
    "common.duration": "Duração",
    "common.price": "Preço",
    "common.from": "a partir de",
    "common.since": "Desde",
    "common.learnMore": "Saiba mais",
    "common.viewAll": "Ver tudo",
  },
} as const;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
