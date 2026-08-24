// Durian seasonality data for Peninsular & East Malaysia.
//
// IMPORTANT: durian seasons shift year to year with rainfall and monsoon timing.
// These month ranges describe TYPICAL patterns based on published agricultural
// guidance (FAMA, MARDI, state agriculture dept reporting) and consistent
// travel-guide consensus. They are intentionally labeled "typical" everywhere
// user-facing. Update annually against FAMA/MARDI announcements.

export interface Region {
  id: string;
  name: string;
  /** 1-indexed months when the MAIN season typically runs */
  mainSeason: number[];
  /** Optional smaller secondary flush */
  secondarySeason?: number[];
  notes: string;
}

/** Peak-availability rating for a month in a region: 2 = peak, 1 = in season, 0 = off */
export type Availability = 0 | 1 | 2;

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const regions: Region[] = [
  {
    id: 'penang',
    name: 'Penang',
    mainSeason: [5, 6, 7],
    notes: 'Balik Pulau is the famous growing area. Hillside orchards produce Bawang, Black Thorn, and Musang King. The harvest runs May to July, starting earlier than most of the peninsula, and there is little fruit outside those months.',
  },
  {
    id: 'kl-selangor',
    name: 'Kuala Lumpur & Selangor',
    mainSeason: [6, 7, 8],
    secondarySeason: [12, 1, 2],
    notes: 'Urban supply comes from Pahang and Perak orchards. SS2 and Section 17 night markets run durian buffets during peak months.',
  },
  {
    id: 'pahang',
    name: 'Pahang (Raub & Bentong)',
    mainSeason: [6, 7, 8],
    secondarySeason: [12, 1],
    notes: 'Malaysia\u2019s Musang King heartland. Raub holds a durian festival around July or August when the harvest is at its height.',
  },
  {
    id: 'johor',
    name: 'Johor',
    mainSeason: [6, 7, 8],
    secondarySeason: [11, 12],
    notes: 'Southern supplier for Singapore demand. Seasons can start slightly earlier than the east coast.',
  },
  {
    id: 'perak',
    name: 'Perak',
    mainSeason: [6, 7, 8],
    secondarySeason: [12, 1],
    notes: 'Ipoh and surrounding kampungs supply much of the Klang Valley. Good value during peak.',
  },
  {
    id: 'east-coast',
    name: 'East Coast (Kelantan, Terengganu, Pahang coast)',
    mainSeason: [5, 6, 7, 8],
    secondarySeason: [12, 1],
    notes: 'The Northeast Monsoon (November to February) makes the coast wet; the harvest lands just after, from May onward.',
  },
  {
    id: 'sabah',
    name: 'Sabah',
    mainSeason: [7, 8, 9, 10],
    secondarySeason: [1, 2],
    notes: 'Borneo runs later than the peninsula. Native wild varieties (tabin, sukun) appear alongside planted D24 and local hybrids.',
  },
  {
    id: 'sarawak',
    name: 'Sarawak',
    mainSeason: [11, 12, 1],
    secondarySeason: [6, 7],
    notes: 'Kuching\u2019s season famously flips the peninsula pattern: the big flush lands at year end. Look for the prized local variety known as ubah hijau.',
  },
];

/**
 * Live status computed client-side so every visit answers
 * "is it durian season RIGHT NOW?" without a rebuild.
 * The static calendar still renders server-side for SEO.
 */
export const liveStatusScript = `
(function() {
  var REGIONS = JSON.parse(document.getElementById('region-data').textContent);
  var now = new Date();
  var m = now.getMonth() + 1;

  function statusFor(r) {
    if (r.main.indexOf(m) !== -1) return { level: 'peak', label: 'Peak season' };
    if ((r.secondary || []).indexOf(m) !== -1) return { level: 'secondary', label: 'Secondary season' };
    // next main-season month
    var next = null;
    for (var i = 1; i <= 12; i++) {
      var check = ((m - 1 + i) % 12) + 1;
      if (r.main.indexOf(check) !== -1) { next = i; break; }
    }
    return { level: 'off', label: next === 1 ? 'Starts next month' : 'Off season \u00b7 back in ~' + next + ' months' };
  }

  var peakCount = 0, anyCount = 0;
  REGIONS.forEach(function(r) {
    var s = statusFor(r);
    if (s.level === 'peak') peakCount++;
    if (s.level === 'peak' || s.level === 'secondary') anyCount++;
    var el = document.querySelector('[data-region-status="' + r.id + '"]');
    if (!el) return;
    el.textContent = s.label;
    el.setAttribute('data-level', s.level);
    el.className = 'status-chip status-' + s.level;
  });

  var banner = document.getElementById('season-verdict');
  var verdict = document.getElementById('verdict-text');
  if (banner && verdict) {
    if (peakCount >= 3) {
      verdict.textContent = 'Yes \\u2014 durian season is ON across most of Malaysia right now.';
      banner.setAttribute('data-level', 'peak');
    } else if (peakCount > 0) {
      verdict.textContent = 'Yes \\u2014 it is peak season in ' + peakCount + ' of ' + REGIONS.length + ' regions right now.';
      banner.setAttribute('data-level', 'peak');
    } else if (anyCount > 0) {
      verdict.textContent = 'Partly \\u2014 some regions are in their secondary season right now.';
      banner.setAttribute('data-level', 'secondary');
    } else {
      verdict.textContent = 'Not quite \\u2014 main season has wound down. Sarawak may still have fruit.';
      banner.setAttribute('data-level', 'off');
    }
  }

  var stamp = document.getElementById('live-date');
  if (stamp) {
    stamp.textContent = now.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Variety chips: in season / months until next window
  var VARIETIES = [];
  var vData = document.getElementById('variety-data');
  if (vData) {
    VARIETIES = JSON.parse(vData.textContent);
    VARIETIES.forEach(function(v) {
      var el = document.querySelector('[data-variety-status="' + v.id + '"]');
      if (!el) return;
      var label, level;
      if (v.months.indexOf(m) !== -1) {
        label = 'In season now';
        level = 'peak';
      } else {
        var until = null;
        for (var i = 1; i <= 12; i++) {
          var check = ((m - 1 + i) % 12) + 1;
          if (v.months.indexOf(check) !== -1) { until = i; break; }
        }
        var backMonth = new Date(2000, (check - 1), 1).toLocaleDateString('en-MY', { month: 'short' });
        label = until === 1 ? 'Starts next month' : 'Back around ' + backMonth;
        level = 'off';
      }
      el.textContent = label;
      el.setAttribute('data-level', level);
      el.className = 'status-chip status-' + level;
    });
  }

  // Month planner: open the current month's panel and highlight its nav chip
  var planner = document.getElementById('month-planner');
  if (planner) {
    var openEl = document.getElementById('month-panel-' + m);
    if (openEl) {
      planner.querySelectorAll('details').forEach(function(d) { d.open = false; });
      openEl.open = true;
    }
    var chipEl = document.querySelector('[data-month-chip="' + m + '"]');
    if (chipEl) chipEl.classList.add('chip-current');
  }
})();
`;

export interface Variety {
  id: string;
  name: string;
  alsoKnownAs?: string;
  color: string;
  taste: string;
  peakNote: string;
  priceTier: 1 | 2 | 3;
  /** Months when this variety is typically at stalls (peninsula baseline) */
  months: number[];
  /** Typical stall price range in RM/kg during the season */
  typicalPrice?: { low: number; high: number };
}

export const varieties: Variety[] = [
  {
    id: 'musang-king',
    name: 'Musang King',
    alsoKnownAs: 'D197, Mao Shan Wang',
    color: 'Deep golden yellow',
    taste: 'Rich, bittersweet, custard-thick. The one people line up for.',
    peakNote: 'Best mid-season, June to August on the peninsula. Raub-grown fruit commands the top prices.',
    priceTier: 3,
    months: [6, 7, 8],
    typicalPrice: { low: 45, high: 100 },
  },
  {
    id: 'd24',
    name: 'D24',
    color: 'Creamy yellow',
    taste: 'Balanced sweet-bitter, very creamy. The classic premium durian before Musang King took the crown.',
    peakNote: 'Reliable through the whole main season; often the best value among premium types.',
    priceTier: 2,
    months: [6, 7, 8],
    typicalPrice: { low: 20, high: 45 },
  },
  {
    id: 'black-thorn',
    name: 'Black Thorn',
    alsoKnownAs: 'D200, Ochee',
    color: 'Deep orange, almost red',
    taste: 'Intensely sweet with a wine-like finish. Sticky, fine texture.',
    peakNote: 'Short window late in the season, usually July to September. Penang hillside fruit is the benchmark.',
    priceTier: 3,
    months: [7, 8, 9],
    typicalPrice: { low: 50, high: 110 },
  },
  {
    id: 'd101',
    name: 'D101',
    color: 'Pale yellow',
    taste: 'Mild and sweet with little bitterness. A common first durian for newcomers.',
    peakNote: 'Widely available early in the season.',
    priceTier: 1,
    months: [5, 6, 7],
    typicalPrice: { low: 12, high: 25 },
  },
  {
    id: 'tekka',
    name: 'Tekka',
    color: 'Bright yellow',
    taste: 'Small seed, strong bitter kick, fibrous. A connoisseur pick.',
    peakNote: 'Mid-season, often sold out early at specialist stalls.',
    priceTier: 2,
    months: [6, 7],
    typicalPrice: { low: 25, high: 50 },
  },
  {
    id: 'xdm',
    name: 'Red Prawn',
    alsoKnownAs: 'D175, Ang Heh',
    color: 'Orange-red tinted',
    taste: 'Sweet, soft, not too bitter. Penang favourite named for its flesh colour.',
    peakNote: 'Peaks in Penang around July to August alongside Balik Pulau festival events.',
    priceTier: 2,
    months: [6, 7, 8],
    typicalPrice: { low: 20, high: 45 },
  },
];

/**
 * Verification stamp shown user-facing. Update `lastChecked` whenever a guide
 * re-confirms prices/season windows; the date is rendered on the page.
 */
export const dataVerified = {
  lastChecked: '2026-08-24',
  verifiedBy: 'Simply Enak guides (KL & Penang stalls)',
  basis: 'typical patterns from published FAMA/MARDI guidance plus our own market visits',
};

/** One hand-written practical note per month. This is the unique content layer. */
export const monthNotes: string[] = [
  // Jan
  'Secondary flush in KL, Pahang, Perak and the east coast; Sarawak is at PEAK. Peninsula fruit is limited and pricier, so Kuching is the place to be.',
  // Feb
  'Tail end of the secondary flush on the peninsula while Sarawak keeps going. Expect slimmer pickings and higher prices outside Borneo.',
  // Mar
  'The quietest month nationwide. A few farm-gate fruit appear, but most stalls run imported fruit. Not the month to plan a durian trip around.',
  // Apr
  'Transition month. If the monsoon ended early, Penang can open with first flushes; otherwise stalls still lean on imports. Watch FAMA announcements.',
  // May
  'Season opener. Penang and the east coast start first, with Balik Pulau hillside fruit leading. Early fruit is exciting but pricey and quality is uneven.',
  // Jun
  'Peak builds across the peninsula. Supply thickens week by week and prices fall from early-season highs. Musang King and D24 arrive in volume.',
  // Jul
  'Heart of the season everywhere on the peninsula. Raub hits its festival window and Black Thorn starts appearing at specialist stalls.',
  // Aug
  'Last big peninsula month. Black Thorn is at its best and end-of-season deals appear as supply thins. Go now if you want volume and value.',
  // Sep
  'The peninsula winds down; Sabah takes over at full peak. Penang Black Thorn stragglers are worth hunting, but the epicentre moves to Borneo.',
  // Oct
  'Sabah closing month. Peninsula off-season begins in earnest, with only scattered farm-gate fruit and imports.',
  // Nov
  'Transition month. Johor starts its secondary flush and Sarawak opens its big season. Still thin on the peninsula.',
  // Dec
  'Secondary flush in KL, Pahang, Perak and the east coast, while Sarawak peaks. A genuinely good month if you are heading to Kuching.',
];

export const pickingTips = [
  {
    title: 'Smell at the seams',
    text: 'A ripe durian smells strong but sweet along the seams of the husk. No smell means under-ripe; a sour, alcoholic edge means fermented past its best.',
  },
  {
    title: 'Listen when you shake',
    text: 'A gentle shake should give a faint thud of flesh moving. Loud sloshing means the flesh has pulled away from an over-mature husk.',
  },
  {
    title: 'Read the thorns',
    text: 'Plump, rounded thorns with some space between them usually signal thick flesh. Sharp, dense, crowded thorns often mean thin flesh inside.',
  },
  {
    title: 'Check the stem',
    text: 'A fresh, green-cut stem means recently harvested. Dry, cracked stems mean the fruit sat around losing aroma.',
  },
  {
    title: 'Let the seller open it',
    text: 'Stalls open the fruit for you on the spot. If the flesh looks watery or the husk rattles loose, they will swap it. This is normal, ask for it.',
  },
];

export const faqs = [
  {
    q: 'When exactly is durian season in Malaysia?',
    a: 'Most of peninsular Malaysia gets one main durian season from June to August, with a smaller secondary flush from December to February. Sabah peaks July to October, and Sarawak flips the pattern with its biggest harvest from November to January. Exact weeks shift each year with rainfall, which is why this page shows a live answer instead of fixed dates.',
  },
  {
    q: 'Is there really a "durian season" at all, or is it available all year?',
    a: 'You can find some durian in most months somewhere in Malaysia, but supply swings hard. In peak months stalls overflow and prices drop; in off months good fruit is scarce and expensive. If eating durian is the point of your trip, time it to the season.',
  },
  {
    q: 'Which month is best for Musang King?',
    a: 'June to August on the peninsula, when Raub and Pahang orchards harvest in volume. Prices ease as supply peaks, usually July. Sarawak and Sabah windows differ, so check the region table above.',
  },
  {
    q: 'Why does the season change every year?',
    a: 'Durian flowering follows rainfall patterns tied to the monsoons. A wetter or drier than usual monsoon shifts flowering by weeks, which shifts the harvest. Agricultural agencies announce expected seasons shortly before they begin; treat any fixed calendar as a guide, not a guarantee.',
  },
  {
    q: 'Where is the best place to eat durian in season?',
    a: 'Balik Pulau in Penang and Raub in Pahang are the famous orchard regions. In cities, night markets such as SS2 in Petaling Jaya run dedicated durian stalls through peak season. On a Simply Enak food tour in Georgetown, durian tasting is part of the route during season.',
  },
  {
    q: 'How do I pick a good durian?',
    a: 'Smell for sweetness at the seams, listen for a soft thud when shaken, look for plump spaced-out thorns, and check that the stem looks freshly cut. Our picking guide above walks through each sign. And let the stall open the fruit in front of you so a bad one gets swapped.',
  },
];
