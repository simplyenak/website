// Which dish to eat where: state-by-state signature dishes of Malaysia.
//
// Content basis: Butterkicap article archive index (Klang Valley, Johor, Kelantan,
// Penang food-journeys series), Culture Dept (JKKN) pemetaanbudaya heritage-food
// listings, Putrajaya Corporation (PPJ) food-court listings, Simply Enak guide
// knowledge. Stall and restaurant names are the long-running ones; swap them out
// if they close. Halal labels: 'halal' (Muslim-run/certified), 'pork-free' (no
// pork but not certified), 'non-halal' (contains pork/lard), 'varies' (differs
// by stall, ask).

export type Region = 'north' | 'central' | 'south' | 'east-coast' | 'borneo';

export const REGION_LABELS: Record<Region, string> = {
  north: 'Northern Peninsula',
  central: 'Klang Valley & Central',
  south: 'Southern Peninsula',
  'east-coast': 'East Coast',
  borneo: 'Borneo (Sabah, Labuan, Sarawak)',
};

export type HalalStatus = 'halal' | 'pork-free' | 'non-halal' | 'varies';

export interface Dish {
  id: string;
  name: string;
  /** Culinary tradition the dish belongs to */
  origin?: string;
  /** One or two sentences on what it is */
  what: string;
  /** Where to eat it: town and neighbourhood level */
  where: string;
  /** Long-running famous stalls or markets, 0-2 */
  famousAt?: string[];
  bestTime?: string;
  halal: HalalStatus;
}

export interface StateEntry {
  id: string;
  name: string;
  region: Region;
  /** One-sentence framing of the state's food culture */
  intro: string;
  /** Optional tour CTA on this card */
  cta?: { label: string; url: string };
  dishes: Dish[];
}

export const dataVerified = {
  lastChecked: '2026-08-26',
  verifiedBy: 'Simply Enak',
  basis: 'long-running hawker consensus, Culture Dept (JKKN) heritage-food listings, Putrajaya Corporation food-court listings, and the Butterkicap article archive',
};

export const states: StateEntry[] = [
  // ── Northern Peninsula ────────────────────────────────────────────────
  {
    id: 'perlis',
    name: 'Perlis',
    region: 'north',
    intro: "Malaysia’s smallest state leans on its fishing port Kuala Perlis and northern Malay cooking that runs sour, peppery and generous.",
    dishes: [
      {
        id: 'laksa-kuala-perlis',
        name: 'Laksa Kuala Perlis',
        origin: 'Malay',
        what: 'Thick round rice noodles in a dark mackerel gravy. Perlis laksa is more robust and less sweet than Penang asam laksa, heavy on flaked fish.',
        where: 'The jetty-side laksa stalls of Kuala Perlis, the port town for the Langkawi ferry.',
        famousAt: ['Kuala Perlis jetty row'],
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'ikan-bakar-kuala-perlis',
        name: 'Ikan bakar & seafood',
        origin: 'Malay',
        what: 'Whole fish and shellfish grilled over charcoal and lacquered with sambal or soy-butter glaze.',
        where: 'Stilt restaurants standing over the water in Kuala Perlis.',
        bestTime: 'Dinner',
        halal: 'halal',
      },
      {
        id: 'harumanis',
        name: 'Harumanis mango',
        what: "Perlis’ protected fragrant mango, prized for dense sweet flesh. Season runs roughly April to June and queues form at the farms.",
        where: 'Orchards around Utan Aji and Sanglang; buy at farm gates or the Arau morning market.',
        bestTime: 'April to June season',
        halal: 'halal',
      },
      {
        id: 'air-nira',
        name: 'Air nira (nipah palm sap)',
        what: 'Fresh sap tapped from nipah palms, served ice-cold. A proper Kuala Perlis stop between laksa and grilled fish. Keep it fresh: once the sap ferments into tuak it is alcohol.',
        where: 'Ladang Nipah Kipli, a nipah grove restaurant near Kuala Perlis.',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'kedah',
    name: 'Kedah',
    region: 'north',
    intro: 'The rice bowl of Malaysia. Padi-field cooking: sour fish gravies, preserved fish, herbs and sticky rice for breakfast.',
    dishes: [
      {
        id: 'laksa-teluk-kechai',
        name: 'Laksa Kedah (Teluk Kechai)',
        origin: 'Malay',
        what: 'Thick wheat noodles in a tamarind-sour fish broth that is spicier and sharper than southern laksa. Listed as Kedah heritage food by the national Culture Department.',
        where: 'Laksa stalls around Teluk Kechai and Kuala Kedah, north of Alor Setar.',
        famousAt: ['Teluk Kechai laksa stalls'],
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'pekasam',
        name: 'Pekasam',
        origin: 'Malay',
        what: 'Freshwater fish fermented with rice and salt, then deep-fried until crisp. A padi-field preservation tradition turned breakfast protein.',
        where: 'Wet markets in Alor Setar and Kuala Ketil; served in northern Malay home-cooking stalls.',
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'nasi-ulam-kedah',
        name: 'Nasi ulam',
        origin: 'Malay',
        what: 'Rice folded with a dozen shredded herbs, salted fish, toasted coconut and budu (fermented fish sauce). Kedah versions are the herb-heaviest in the peninsula.',
        where: 'Morning markets and nasi campur stalls in Alor Setar.',
        bestTime: 'Lunch',
        halal: 'halal',
      },
      {
        id: 'pulut-sambal',
        name: 'Pulut sambal',
        origin: 'Malay',
        what: 'Steamed glutinous rice with a dry stir-fried chili sambal, often wrapped in banana leaf. The northern states\u2019 answer to the breakfast sandwich.',
        where: 'Roadside morning stalls across Kedah, especially Alor Setar and Sungai Petani.',
        bestTime: 'Breakfast',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'penang',
    name: 'Penang',
    region: 'north',
    intro: "The hawker capital. George Town’s street food is order-by-dish, so knowing what to order where matters more than any restaurant list.",
    cta: { label: 'Eat George Town with a guide', url: 'https://simplyenak.com/tours/penang-street-food' },
    dishes: [
      {
        id: 'asam-laksa-air-itam',
        name: 'Asam laksa',
        origin: 'Malay-Peranakan',
        what: 'Rice noodles in a sour tamarind-and-mackerel broth with mint, pineapple and prawn paste. A regular on international best-foods lists.',
        where: 'Air Itam market, at the foot of Kek Lok Si temple; also strong in Balik Pulau.',
        famousAt: ['Pasar Air Itam'],
        bestTime: 'Lunch',
        halal: 'halal',
      },
      {
        id: 'char-kway-teow',
        name: 'Char kway teow',
        origin: 'Chinese (Teochew)',
        what: 'Flat rice noodles stir-fried over fierce charcoal heat with prawns, cockles, Chinese sausage and egg. The version most other states copy.',
        where: 'George Town: the Siam Street stall cluster and Lorong Selamat (expect a queue).',
        famousAt: ['Siam Street', 'Lorong Selamat'],
        bestTime: 'Lunch, dinner',
        halal: 'varies',
      },
      {
        id: 'cendol-penang-road',
        name: 'Penang cendol',
        what: 'Shaved ice, coconut milk, palm-sugar syrup and pandan jelly noodles. Penang\u2019s version is defined by the island\u2019s dark gula melaka.',
        where: 'Lebuh Keng Kwee off Jalan Penang, where the queue spills onto the street.',
        famousAt: ['Penang Road famous Teochew chendul'],
        bestTime: 'Afternoon',
        halal: 'pork-free',
      },
      {
        id: 'nasi-kandar',
        name: 'Nasi kandar',
        origin: 'Indian-Muslim',
        what: "Steamed rice flooded with a mix of curries (\"banjir\") and sides from fish head to fried chicken. Penang is where the genre was born.",
        where: 'Jalan Penang and Chulia Street institutions, open past midnight.',
        famousAt: ['Line Clear, Jalan Penang'],
        bestTime: 'Any time, late night included',
        halal: 'halal',
      },
      {
        id: 'hokkien-mee-penang',
        name: 'Hokkien mee (prawn mee)',
        origin: 'Chinese (Hokkien)',
        what: 'Egg noodles in a long-simmered pork-and-prawn shell broth, topped with pork slices and sambal. Called Hokkien mee here, prawn mee elsewhere.',
        where: 'Coffee shops across George Town; New Lane hawker stalls at night.',
        famousAt: ['New Lane hawker stalls'],
        bestTime: 'Breakfast',
        halal: 'non-halal',
      },
      {
        id: 'oh-chien',
        name: 'Oh chien (oyster omelette)',
        origin: 'Chinese (Teochew)',
        what: 'Fresh oysters folded into a crisp-edged starch-and-egg omelette with chili sauce on the side.',
        where: 'Gurney Drive hawker centre and night markets island-wide.',
        bestTime: 'Dinner',
        halal: 'varies',
      },
    ],
  },
  {
    id: 'perak',
    name: 'Perak',
    region: 'north',
    intro: "Ipoh’s old town runs on coffee-shop classics built around beansprouts, chicken and rice noodles; the rest of Perak adds fishing towns and biscuit shops.",
    dishes: [
      {
        id: 'nga-choy-kai',
        name: 'Nga choy kai (beansprouts chicken)',
        origin: 'Chinese',
        what: 'Poached chicken, blanched Ipoh beansprouts (fat and crunchy from local spring water), rice and a fierce chili sauce.',
        where: 'Jalan Yau Tet Shin at the edge of Ipoh old town, where two famous rivals face off.',
        famousAt: ['Lou Wong', 'Onn Kee'],
        bestTime: 'Lunch, dinner',
        halal: 'non-halal',
      },
      {
        id: 'kai-see-hor-fun',
        name: 'Kai see hor fun',
        origin: 'Chinese (Cantonese)',
        what: 'Silky hand-cut rice noodles in a clear prawn-and-chicken broth, topped with shredded chicken and spring onion.',
        where: 'Ipoh old town coffee shops; several of the best surround Concubine Lane.',
        bestTime: 'Breakfast, lunch',
        halal: 'varies',
      },
      {
        id: 'yim-gai',
        name: 'Salt-baked chicken',
        origin: 'Chinese',
        what: 'Whole chicken rubbed with salt and spices, wrapped in paper and buried in hot salt. Juicy, herbal, takeaway-only.',
        where: 'Shops ringing Ipoh old town; look for the boxes stacked by the till.',
        famousAt: ['Aun Kheng Lim'],
        bestTime: 'Any time, takeaway',
        halal: 'varies',
      },
      {
        id: 'heong-peng',
        name: 'Heong peng',
        origin: 'Chinese',
        what: "Flaky \"fragrant biscuits\" filled with sticky malt and shallot paste. The snack everyone carries home from Ipoh.",
        where: 'Biscuit bakeries in Gunung Rapat, on Ipoh\u2019s southern edge.',
        famousAt: ['Gunung Rapat biscuit shops'],
        halal: 'varies',
      },
      {
        id: 'teluk-intan-ccf',
        name: 'Teluk Intan chee cheong fun',
        origin: 'Chinese',
        what: 'Rice-noodle rolls with a sweet dark sauce, fried shallots and sesame. In Teluk Intan, the Leaning Tower town, this is the breakfast classic.',
        where: 'Stalls around the Leaning Tower in Teluk Intan, at breakfast.',
        bestTime: 'Breakfast',
        halal: 'varies',
      },
    ],
  },

  // ── Klang Valley & Central ────────────────────────────────────────────
  {
    id: 'selangor',
    name: 'Selangor',
    region: 'central',
    intro: "Klang Valley sprawl with three anchor pilgrimages: Klang for bak kut teh, Kajang for satay, and a nasi lemak queue in Petaling Jaya.",
    dishes: [
      {
        id: 'bak-kut-teh-klang',
        name: 'Bak kut teh',
        origin: 'Chinese (Hokkien)',
        what: 'Pork ribs simmered in a dark herbal pepper broth, eaten with rice, youtiao and tea. Klang is its birthplace and still its capital.',
        where: "Klang old town (Jalan Besar) and the restaurant rows of Taman Berkeley.",
        famousAt: ['Klang under-bridge shops', 'Taman Berkeley row'],
        bestTime: 'Breakfast is the local ritual',
        halal: 'non-halal',
      },
      {
        id: 'satay-kajang',
        name: 'Satay Kajang',
        origin: 'Malay',
        what: 'Charcoal-grilled meat skewers with peanut sauce, ketupat and cucumber. Kajang has been the satay town since the 1920s.',
        where: 'Kajang town centre; the long-running stalls cluster near the stadium.',
        famousAt: ['Haji Samuri, Kajang'],
        bestTime: 'Dinner',
        halal: 'halal',
      },
      {
        id: 'ikan-bakar-pasir-penambang',
        name: 'Ikan bakar, Kuala Selangor',
        origin: 'Malay',
        what: 'Grilled fish and squid by the river, washed down with air nira tapped from the surrounding nipah groves.',
        where: 'Pasir Penambang fishing jetty, Kuala Selangor, an hour northwest of KL.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'nasi-lemak-village-park',
        name: 'Nasi lemak, Petaling Jaya',
        what: "The Klang Valley’s most famous single plate of coconut rice: crispy fried chicken over sambal, egg, anchovies and cucumber.",
        where: 'Damansara Uptown, Petaling Jaya; the breakfast queue moves fast.',
        famousAt: ['Village Park, Damansara Uptown'],
        bestTime: 'Breakfast',
        halal: 'pork-free',
      },
    ],
  },
  {
    id: 'kuala-lumpur',
    name: 'Kuala Lumpur',
    region: 'central',
    intro: 'The capital collects every regional kitchen plus its own: Malay morning markets in Kampung Baru, Chinese night streets, Indian-Muslim griddles around the clock.',
    cta: { label: 'Taste 15+ KL dishes on foot', url: 'https://simplyenak.com/tours/kuala-lumpur-street-food' },
    dishes: [
      {
        id: 'nasi-lemak-kampung-baru',
        name: 'Nasi lemak, Kampung Baru',
        origin: 'Malay',
        what: "Malaysia’s national dish done the village way: coconut rice, sambal, fried chicken or rendang, eaten on banana leaf at a streetside table.",
        where: 'Kampung Baru, the Malay village enclave under the KL towers.',
        famousAt: ['Nasi Lemak Wanjo', 'Nasi Lemak Antarabangsa'],
        bestTime: 'Breakfast through late night',
        halal: 'halal',
      },
      {
        id: 'chili-pan-mee',
        name: 'Chili pan mee',
        origin: 'Chinese',
        what: 'Dry hand-pulled noodles tossed with dark chili paste, minced pork and a soft egg you stir through. A KL invention, not a regional import.',
        where: 'Jalan Dewan Sultan Sulaiman in Kampung Baru, where the original sits.',
        famousAt: ['Kin Kin pan mee'],
        bestTime: 'Lunch',
        halal: 'non-halal',
      },
      {
        id: 'hokkien-mee-kl',
        name: 'Hokkien mee (KL style)',
        origin: 'Chinese (Hokkien)',
        what: 'Thick yellow noodles braised in dark soy with pork, squid and crispy pork lard. KL-Hokkien mee is a different dish from both Penang and Kuching versions.',
        where: 'Jalan Alor and the Petaling Street fringes after dark.',
        bestTime: 'Dinner, late night',
        halal: 'non-halal',
      },
      {
        id: 'murtabak-tar',
        name: 'Murtabak, Jalan TAR',
        origin: 'Indian-Muslim',
        what: 'Flaky folded bread stuffed with spiced mutton or chicken, pan-fried on a griddle and cut into squares with onion pickle.',
        where: 'Night stalls on Jalan Tuanku Abdul Rahman; the whole street turns into a food bazaar during Ramadan.',
        bestTime: 'Night',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'putrajaya',
    name: 'Putrajaya',
    region: 'central',
    intro: 'A planned government city with no heritage dish of its own; the precinct food courts and pasar tani carry the cooking load, and they do it better than a planned city needs to.',
    dishes: [
      {
        id: 'nasi-lemak-berlauk-p8',
        name: 'Nasi lemak berlauk',
        what: 'Coconut rice with your choice of curries and fried sides; the P8 food-court version is a running local favourite for its sambal.',
        where: 'Medan Selera Presint 8, the neighbourhood food court at Jalan P8.',
        famousAt: ['Medan Selera Presint 8'],
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'nasi-kukus',
        name: 'Nasi kukus',
        origin: 'Malay (northern)',
        what: 'Freshly steamed rice soaked in gravy, with fried chicken and chili sauce. East-coast and northern Malay comfort food that Putrajaya stalls do well.',
        where: 'Precinct food courts and pasar tani (farmers markets) around the city.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'curry-fish-head-p8',
        name: 'Curry fish head',
        what: 'Whole fish head in curry with okra and eggplant, shared family-style with rice.',
        where: 'Medan Selera Presint 8 and the precinct night markets.',
        bestTime: 'Lunch',
        halal: 'halal',
      },
    ],
  },

  // ── Southern Peninsula ────────────────────────────────────────────────
  {
    id: 'negeri-sembilan',
    name: 'Negeri Sembilan',
    region: 'south',
    intro: 'Minangkabau country. The cooking runs on turmeric, chili and coconut: masak lemak cili api in everything, plus Seremban bakery classics.',
    dishes: [
      {
        id: 'masak-lemak-cili-api',
        name: 'Masak lemak cili api',
        origin: 'Minangkabau',
        what: "The state’s signature gravy: turmeric and bird’s-eye chili simmered in coconut milk around chicken, fish or pucuk paku (fern shoots). Fiery and gold.",
        where: 'Warung and rumah makan across the state, Seremban to Nilai.',
        bestTime: 'Lunch',
        halal: 'halal',
      },
      {
        id: 'daging-salai-lemak',
        name: 'Daging salai masak lemak',
        origin: 'Minangkabau',
        what: 'Smoked beef in the same cili api gravy; the smoke turns a home dish into the reason you drive down.',
        where: 'Minangkabau restaurants in Seremban and Kuala Pilah.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'siew-pau-seremban',
        name: 'Siew pau, Seremban',
        origin: 'Chinese',
        what: 'Flaky baked buns with juicy pork or chicken filling. Seremban is the siew pau town; boxes travel the whole country.',
        where: 'Seremban town centre, near the Pasar Besar.',
        famousAt: ['Empayar Siew Pau'],
        bestTime: 'Morning, afternoon snack',
        halal: 'varies',
      },
      {
        id: 'beef-noodles-seremban',
        name: 'Seremban beef noodles',
        origin: 'Chinese',
        what: 'Springy noodles with braised beef chunks, a dark peanut-chili sauce and broth on the side. An old-school Seremban coffee-shop dish.',
        where: "Old town coffee shops within walking distance of Seremban’s Pasar Besar.",
        bestTime: 'Breakfast, lunch',
        halal: 'non-halal',
      },
    ],
  },
  {
    id: 'melaka',
    name: 'Melaka',
    region: 'south',
    intro: 'Peranakan heartland. Nyonya kitchens, Dutch Square tourists, and a river of cendol down Jonker Street.',
    dishes: [
      {
        id: 'chicken-rice-balls',
        name: 'Chicken rice balls',
        origin: 'Chinese-Hainanese',
        what: 'Hainanese poached chicken with rice rolled into warm golf-sized balls, the Melaka twist on the classic.',
        where: 'Jonker Street corner shops, where the queue is the landmark.',
        famousAt: ['Chung Wah', 'Hoe Kee'],
        bestTime: 'Lunch',
        halal: 'varies',
      },
      {
        id: 'cendol-jonker',
        name: 'Cendol, Jonker Street',
        what: 'The Melaka original leans hard on gula melaka (palm sugar made in the state) over shaved ice and coconut milk.',
        where: 'Jonker Street; the shop at the top of the street doubles as a Nyonya museum.',
        famousAt: ['Jonker 88'],
        bestTime: 'Afternoon',
        halal: 'varies',
      },
      {
        id: 'satay-celup',
        name: 'Satay celup',
        what: "Raw skewers you cook yourself in a communal pot of boiling peanut satay sauce. Melaka’s social dinner.",
        where: 'Jalan Laksamana, minutes from Dutch Square.',
        famousAt: ['Capitol Satay'],
        bestTime: 'Dinner, expect a queue',
        halal: 'varies',
      },
      {
        id: 'nyonya-laksa',
        name: 'Nyonya laksa',
        origin: 'Peranakan',
        what: 'Coconut-and-tamarind noodle soup, rich and sour in the same spoon, with prawn and cucumber ribbons.',
        where: 'Nyonya restaurants around Jonker and Heeren streets.',
        bestTime: 'Lunch',
        halal: 'varies',
      },
      {
        id: 'asam-pedas-melaka',
        name: 'Asam pedas',
        origin: 'Malay-Peranakan',
        what: 'Fish stewed in a sour chili gravy until the broth turns rust-red. Every Melaka family argues about who makes it best.',
        where: 'Asam pedas shops across Melaka city and Alor Gajah.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'johor',
    name: 'Johor',
    region: 'south',
    intro: "Malaysia’s deep south runs on Muar: laksa Johor, mee bandung and otak-otak, with Batu Pahat’s sealed-pot briyani and JB’s midnight kacang pool.",
    dishes: [
      {
        id: 'laksa-johor',
        name: 'Laksa Johor',
        origin: 'Malay',
        what: "Thick coconut-fish gravy over spaghetti-length noodles, traditionally eaten by hand with ulam on the side. Johor serves it on festive days.",
        where: 'Muar and Batu Pahat Malay restaurants; JB warung for breakfast.',
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'mee-bandung-muar',
        name: 'Mee bandung, Muar',
        origin: 'Malay',
        what: 'Yellow noodles in a thick prawn-and-meat gravy with egg, lime and chili. Born in Muar, imitated everywhere.',
        where: 'Jalan Maharani and the riverside of Muar town.',
        famousAt: ['Mee Bandung Abu Bakar Hanipah, Muar'],
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'otak-otak-muar',
        name: 'Otak-otak, Muar',
        origin: 'Malay',
        what: "Fish paste mixed with chili and coconut milk, wrapped in banana leaf and grilled in sheets. Muar’s is the style the rest of Malaysia measures against.",
        where: 'Otak-otak stalls across Muar town; buy it by the bundle.',
        bestTime: 'Any time, snack',
        halal: 'halal',
      },
      {
        id: 'briyani-gam-batu-pahat',
        name: 'Nasi briyani gam',
        origin: 'Indian-Muslim',
        what: "Sealed-pot briyani where rice and chicken are \"glued\" (gam) into one cake and flipped onto the plate. Batu Pahat is its Malaysian home.",
        where: 'Batu Pahat town centre restaurants.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'kacang-pool-jb',
        name: 'Kacang pool',
        origin: 'Arab-Malay',
        what: 'Ful medames by way of Johor: mashed beans in garlic-chili oil with lime, bread for dipping, egg optional. A JB midnight institution.',
        where: 'Larkin and downtown JB stalls, several open to dawn.',
        bestTime: 'Late night',
        halal: 'halal',
      },
    ],
  },

  // ── East Coast ────────────────────────────────────────────────────────
  {
    id: 'pahang',
    name: 'Pahang',
    region: 'east-coast',
    intro: "Malaysia’s largest state by land: river fish in Temerloh, grilled seafood at Kuantan’s Tanjung Lumpur, and highland produce in Cameron Highlands.",
    dishes: [
      {
        id: 'patin-tempoyak-temerloh',
        name: 'Ikan patin masak tempoyak',
        origin: 'Malay',
        what: "River catfish from the Pahang river stewed with tempoyak (fermented durian paste) into a sour, electric gravy. Pahang’s signature dish.",
        where: 'Riverside patin restaurants in Temerloh, the patin capital.',
        famousAt: ['Temerloh riverside patin row'],
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'ikan-bakar-tanjung-lumpur',
        name: 'Ikan bakar, Tanjung Lumpur',
        what: 'Charcoal-grilled fish and squid in a fishing village on the edge of Kuantan city.',
        where: 'The stilt restaurant cluster at Tanjung Lumpur fishing village, Kuantan.',
        bestTime: 'Dinner',
        halal: 'halal',
      },
      {
        id: 'sambal-hitam',
        name: 'Sambal hitam',
        origin: 'Malay (Pahang)',
        what: 'A dark, slow-caramelised chili and anchovy sambal cooked down almost to jam; a Pahang pantry staple eaten with rice and river fish.',
        where: 'Home kitchens and rumah makan across Pahang; often sold in jars at state markets.',
        bestTime: 'Any time',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'terengganu',
    name: 'Terengganu',
    region: 'east-coast',
    intro: 'Fishing-state cooking: morning rice meals built on fish, fish snacks, and more fish, all within walking distance of the South China Sea.',
    dishes: [
      {
        id: 'nasi-dagang-terengganu',
        name: 'Nasi dagang',
        origin: 'Malay',
        what: "Glutinous rice cooked in coconut milk and fenugreek, served with tuna curry. Terengganu’s defining breakfast.",
        where: "Kuala Terengganu morning markets and stall rows; get there before 10am.",
        famousAt: ['Nasi dagang Atas Tol, KT'],
        bestTime: 'Breakfast',
        halal: 'halal',
      },
      {
        id: 'keropok-lekor',
        name: 'Keropok lekor',
        origin: 'Malay',
        what: "Sausage-shaped fish crackers, boiled (soft and chewy) or fried (crisp). A fisherman’s snack turned state obsession.",
        where: 'Kuala Terengganu; the Losong neighbourhood is the keropok heartland.',
        famousAt: ['Keropok Losong stalls'],
        bestTime: 'Any time, snack',
        halal: 'halal',
      },
      {
        id: 'sata',
        name: 'Sata',
        origin: 'Malay',
        what: 'Spiced fish paste wrapped in banana leaf with grated coconut and chili, grilled over coals until smoky-sweet.',
        where: 'Night markets and beachside stalls around Kuala Terengganu and Kemaman.',
        bestTime: 'Evening',
        halal: 'halal',
      },
      {
        id: 'laksam',
        name: 'Laksam',
        origin: 'Malay',
        what: "Wide flat rice noodles in a white fish-and-coconut gravy, eaten cool with sambal on the side. Terengganu’s gentler laksa.",
        where: 'Pasar malam and morning stalls in Kuala Terengganu.',
        bestTime: 'Breakfast, evening',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'kelantan',
    name: 'Kelantan',
    region: 'east-coast',
    intro: "Malaysia’s Malay kitchen at full volume: blue rice at the Kota Bharu market, ayam percik everywhere, and snack stalls that outshine bakeries.",
    dishes: [
      {
        id: 'nasi-kerabu',
        name: 'Nasi kerabu',
        origin: 'Malay',
        what: 'Rice naturally tinted blue with butterfly-pea flowers, ringed by raw herbs, salted egg, fish crackers and budu sauce.',
        where: "Pasar Siti Khadijah, Kota Bharu’s central market, at breakfast.",
        famousAt: ['Pasar Siti Khadijah'],
        bestTime: 'Breakfast, lunch',
        halal: 'halal',
      },
      {
        id: 'ayam-percik',
        name: 'Ayam percik',
        origin: 'Malay',
        what: "Chicken grilled over charcoal and basted with coconut-chili gravy (\"percik\" means to splash) until it glazes.",
        where: 'Stalls across Kota Bharu, especially around the market quarter.',
        bestTime: 'Any time',
        halal: 'halal',
      },
      {
        id: 'nasi-tumpang',
        name: 'Nasi tumpang',
        origin: 'Malay',
        what: 'Cone-shaped compressed rice layered with serunding (fried shredded meat) and egg curry; a travel ration turned icon.',
        where: 'Kota Bharu markets and bus stations, wrapped in banana leaf and paper.',
        bestTime: 'Any time',
        halal: 'halal',
      },
      {
        id: 'nasi-dagang-kelantan',
        name: 'Nasi dagang (Kelantan style)',
        origin: 'Malay',
        what: "Kelantan’s version runs its fish curry sweeter and thicker than the Terengganu original.",
        where: 'Kota Bharu and Pasir Mas breakfast stalls.',
        bestTime: 'Breakfast',
        halal: 'halal',
      },
      {
        id: 'cek-mek-molek',
        name: "Cek mek molek",
        origin: 'Malay',
        what: 'Banana stuffed with palm sugar, battered and fried. The name means "pretty lady"; the snack disappears first.',
        where: 'Snack stalls and pasar malam across Kota Bharu.',
        bestTime: 'Snack',
        halal: 'halal',
      },
    ],
  },

  // ── Borneo ───────────────────────────────────────────────────────────
  {
    id: 'sabah',
    name: 'Sabah',
    region: 'borneo',
    intro: "Borneo’s melting pot: Kadazan-Dusun native dishes, Tuaran noodles, and a KK waterfront that runs on fresh-off-the-boat seafood.",
    dishes: [
      {
        id: 'hinava',
        name: 'Hinava',
        origin: 'Kadazan-Dusun',
        what: "Raw mackerel \"cured\" in lime with shaved bambangan (wild mango), chili and ginger; Sabah’s signature starter.",
        where: 'Native restaurants in and around Kota Kinabalu and Penampang; a Kaamatan festival (May) staple.',
        bestTime: 'Lunch',
        halal: 'halal',
      },
      {
        id: 'tuhau',
        name: 'Tuhau',
        origin: 'Kadazan-Dusun',
        what: 'Wild ginger stem pounded with chili, salt and dried shrimp into a pungent relish; appears beside almost every native meal.',
        where: 'Tamu (native markets) in Kota Kinabalu, Penampang and Tuaran.',
        bestTime: 'Any time, condiment',
        halal: 'halal',
      },
      {
        id: 'tuaran-mee',
        name: 'Tuaran mee',
        origin: 'Chinese',
        what: 'Springy egg noodles fried in a distinctive dark sauce with egg, char siu and vegetables, twisted into a disc; born in Tuaran town.',
        where: 'Tuaran town, 45 minutes north of Kota Kinabalu; also on KK kopitiam menus.',
        bestTime: 'Breakfast, lunch',
        halal: 'non-halal',
      },
      {
        id: 'fish-head-noodles-kk',
        name: 'Fish head noodles',
        origin: 'Chinese',
        what: "Deep-fried fish head in a milky, tomato-soured broth with thick noodles; KK’s favourite restorative bowl.",
        where: 'Downtown Kota Kinabalu coffee shops around Asia City and the old town.',
        bestTime: 'Lunch, dinner',
        halal: 'non-halal',
      },
      {
        id: 'seafood-waterfront-kk',
        name: 'Waterfront seafood, Kota Kinabalu',
        what: 'Tiger prawns, lobsters and grouper priced by the kilo at restaurants overlooking the South China Sea islands.',
        where: 'Kampung Angin and the waterfront rows of central Kota Kinabalu.',
        bestTime: 'Dinner',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'labuan',
    name: 'Labuan',
    region: 'borneo',
    intro: "A duty-free island off Sabah’s coast; the kitchen runs on the day’s catch, crab especially, with Bruneian-Malay home cooking underneath.",
    dishes: [
      {
        id: 'crab-labuan',
        name: 'Chili & butter crab',
        what: "Live tanks and by-the-kilo pricing; the island’s signature splurge, in chili, kam heong or butter-salted-egg sauce.",
        where: "The crab restaurants around the old town and waterfront, Labuan’s de facto food street.",
        famousAt: ['Anjung Ketam, old town'],
        bestTime: 'Dinner',
        halal: 'halal',
      },
      {
        id: 'fish-soup-labuan',
        name: 'Fish soup & fresh catch',
        what: 'Clear or milky fish-head soup, plus whatever the boats brought in, at prices mainland Sabah cannot match.',
        where: 'Kopitiam in Labuan town around the market.',
        bestTime: 'Breakfast, lunch',
        halal: 'varies',
      },
      {
        id: 'ikan-bakar-labuan',
        name: 'Ikan bakar & satay, Pasar Ahad',
        what: 'Grilled fish and skewers at Labuan\u2019s famous Sunday market, with duty-free soft drinks nobody admits to buying.',
        where: 'The Sunday pasar tamu (Pasar Ahad) and the waterfront market stalls.',
        bestTime: 'Sunday morning, early',
        halal: 'halal',
      },
    ],
  },
  {
    id: 'sarawak',
    name: 'Sarawak',
    region: 'borneo',
    intro: "A food nation of its own: Kuching’s breakfast laksa, bamboo chicken and jungle ferns from the interior, and Melanau raw-fish craft on the coast.",
    dishes: [
      {
        id: 'sarawak-laksa',
        name: 'Sarawak laksa',
        origin: 'Chinese-Sarawakian',
        what: "A paste of some twenty spices (no curry powder) into a prawn-chicken broth with vermicelli, prawns, omelette strips and lime. Put on the world map when Anthony Bourdain came to Kuching for it.",
        where: "Kuching’s morning coffee shops; it sells out by 11am.",
        famousAt: ['Choon Hui cafe, Kuching'],
        bestTime: 'Breakfast',
        halal: 'varies',
      },
      {
        id: 'kolok-mee',
        name: 'Kolok mee',
        origin: 'Chinese-Sarawakian',
        what: "Springy hand-tossed egg noodles in pork lard and vinegar, topped with char siu or minced pork. Kuching’s other breakfast institution.",
        where: 'Every Kuching kopitiam; each family has its stall.',
        bestTime: 'Breakfast',
        halal: 'non-halal',
      },
      {
        id: 'manok-pansoh',
        name: 'Manok pansoh',
        origin: 'Iban',
        what: 'Chicken stuffed into bamboo sections with tapioca leaves, ginger and lemongrass, leaned into the fire until the broth steams out.',
        where: 'Iban longhouse kitchens and native restaurants around Kuching and Sri Aman.',
        bestTime: 'Dinner',
        halal: 'halal',
      },
      {
        id: 'midin',
        name: 'Midin belacan',
        origin: 'Sarawakian',
        what: "Wild jungle fern, crunchy and curly, flash-fried with belacan and garlic; Sarawak’s everyday green.",
        where: 'Restaurants across Kuching and Sibu; best at the start of the dry season harvest.',
        bestTime: 'Lunch, dinner',
        halal: 'halal',
      },
      {
        id: 'umai',
        name: 'Umai',
        origin: 'Melanau',
        what: "Raw mackerel or prawn \"cooked\" in lime with chili, shallots and salt; Melanau fishermen’s lunch from the Mukah coast.",
        where: 'Melanau restaurants in Mukah, Dalat and Kuching.',
        bestTime: 'Lunch',
        halal: 'halal',
      },
    ],
  },
];

export const totalDishes = states.reduce((n, s) => n + s.dishes.length, 0);

/** National staples every traveller meets, regardless of state. Not counted in state cards. */
export interface ClassicItem {
  id: string;
  name: string;
  what: string;
  halal: HalalStatus;
}

export const nationalClassics: ClassicItem[] = [
  {
    id: 'roti-canai',
    name: 'Roti canai',
    what: 'Flaky griddled flatbread with dhal and curry, the national breakfast of mamak stalls.',
    halal: 'halal',
  },
  {
    id: 'teh-tarik',
    name: 'Teh tarik',
    what: '"Pulled" milky tea, poured long between two mugs until it foams. Breakfast order, midnight order.',
    halal: 'halal',
  },
  {
    id: 'nasi-goreng-kampung',
    name: 'Nasi goreng kampung',
    what: 'Village fried rice with anchovies, kangkung and chili, ideally from a wok at dawn.',
    halal: 'halal',
  },
  {
    id: 'apam-balik',
    name: 'Apam balik',
    what: 'Thick peanut pancake folded over crushed peanut and sugar; crisp or soft depending on region.',
    halal: 'halal',
  },
  {
    id: 'banana-leaf-rice',
    name: 'Banana leaf rice',
    what: 'Rice on a banana leaf with vegetable sides, curries and papadum, refilled until you surrender.',
    halal: 'varies',
  },
  {
    id: 'kaya-toast',
    name: 'Kaya toast & half-boiled eggs',
    what: 'Coconut-egg jam toast with soft eggs and white pepper. The kopitiam breakfast order, unchanged for generations.',
    halal: 'varies',
  },
  {
    id: 'maggi-goreng',
    name: 'Maggi goreng',
    what: 'Instant noodles fried mamak-style with egg and chili sauce. Midnight institution.',
    halal: 'halal',
  },
  {
    id: 'ais-kacang',
    name: 'Ais kacang (ABC)',
    what: 'Shaved ice mountain over sweet corn, red bean, grass jelly and syrups. Malaysia in a heatwave is why this exists.',
    halal: 'halal',
  },
  {
    id: 'nyonya-kuih',
    name: 'Nyonya kuih',
    what: 'Steamed and griddled sweets in pandan, coconut and gula melaka; two-bite pieces sold by the box.',
    halal: 'varies',
  },
  {
    id: 'durian',
    name: 'Fresh durian',
    what: 'The king of fruit, eaten fresh at a roadside stall. Timing help: whenisdurianseason.com.',
    halal: 'halal',
  },
  {
    id: 'milo-dinosaur',
    name: 'Milo dinosaur',
    what: 'Iced Milo with an unmixed heap of powder on top. A Malaysian childhood in a cup.',
    halal: 'halal',
  },
  {
    id: 'rojak-buah',
    name: 'Rojak buah',
    what: 'Fruit salad the Malaysian way: jicama, pineapple, cucumber, fritters, shrimp paste and crushed peanut.',
    halal: 'varies',
  },
];

export const checklistTotal = totalDishes + nationalClassics.length;

export type PackageStatus = 'free' | 'coming';

export interface PackageCard {
  id: string;
  name: string;
  status: PackageStatus;
  price: string;
  blurb: string;
  includes: string[];
}

export const packages: PackageCard[] = [
  {
    id: 'basic-malaysia',
    name: 'Malaysia Basics',
    status: 'free',
    price: 'Free',
    blurb: 'The 81-dish national checklist you are on right now.',
    includes: [
      '69 state signatures + 12 national classics',
      'The exact town or street for each dish',
      'Halal notes and best time of day',
      'Tick, track and share your score',
    ],
  },
  {
    id: 'nyonya',
    name: 'Nyonya Kitchen',
    status: 'coming',
    price: 'One-time, per package',
    blurb: 'The Peranakan canon from Melaka and Penang kitchens, beyond the greatest hits.',
    includes: [
      'Expanded Nyonya dish checklist',
      'Ingredients and allergen notes per dish',
      'Where each dish is done right',
    ],
  },
  {
    id: 'state-deep',
    name: 'State Deep Dives',
    status: 'coming',
    price: 'One-time, per state',
    blurb: 'One state at a time, with the detail that decides what you can eat.',
    includes: [
      'Expanded per-state checklists',
      'Full ingredient breakdowns',
      'Diet safety flags: halal, vegetarian, gluten, nuts',
    ],
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'Which Malaysian state has the best food?',
    a: "There is no settled answer, which is the point. Penang is the hawker capital for Chinese-Peranakan street food, Kelantan for deep Malay cooking, Kuching for Sarawak laksa and indigenous Borneo dishes, and Ipoh for coffee-shop classics. Eat what the state you are in is famous for rather than hunting one \"best\".",
  },
  {
    q: 'What is the most famous dish in Malaysia overall?',
    a: 'Nasi lemak, the coconut-rice breakfast eaten everywhere. But it is a national dish, not a regional one; the dishes worth travelling for are the state-specific ones on this page, like asam laksa in Penang, nasi kerabu in Kelantan and Sarawak laksa in Kuching.',
  },
  {
    q: 'Is Malaysian street food halal?',
    a: 'It varies by dish and stall. Malay-run stalls and nasi kandar shops are halal. Chinese hawker dishes often contain pork or lard (bak kut teh, kolok mee, KL Hokkien mee). Every dish on this page carries a halal note; when in doubt at a stall, ask.',
  },
  {
    q: 'Should I plan food around breakfast or dinner?',
    a: 'Both, but breakfast is the unsung slot: nasi dagang, Sarawak laksa, laksa Kuala Perlis and Klang bak kut teh are all morning rituals that sell out by 11am. Night markets take over from sunset, especially on the east coast and in Kota Kinabalu.',
  },
  {
    q: 'Do these dishes really change from neighbourhood to neighbourhood?',
    a: "Yes. Many signature dishes are tied to one town or even one street: asam laksa to Air Itam, satay to Kajang, mee bandung to Muar, keropok lekor to Losong. The \"where\" in each card is the shortest route to the good version.",
  },
  {
    q: 'How does this food checklist work?',
    a: 'Tick a dish when you try it. Your progress is saved in your own browser, no account and no tracking, and the counter in the header keeps score out of the full list. Hit "Share score" to copy or share how many you have tried; Reset clears everything.',
    },
  {
    q: 'Is the checklist free? What is coming next?',
    a: 'The Malaysia Basics checklist on this page is free and stays free. A free account to sync your ticks across devices is next. Deeper packages, a Nyonya checklist and per-state deep dives with ingredient and diet-safety detail, will be paid, one-time per package. Join the list at the bottom of this page to hear first.',
    },
  {
    q: 'Can I try these dishes with a guide instead of self-driving?',
    a: 'Yes. Simply Enak runs guided food tours in Kuala Lumpur and George Town that cover many of these dishes in one walk, and its guides eat their way through every state listed here. See simplyenak.com.',
  },
];
