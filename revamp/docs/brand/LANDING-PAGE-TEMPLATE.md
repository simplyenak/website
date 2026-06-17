# Landing Page Template: Location-Based Food Tours
**Master Template - Build Once, Replicate for All Locations**

---

## 📐 **Complete Page Structure Breakdown**

This is the EXACT structure to use for:
- `/kuala-lumpur-food-tours`
- `/penang-food-tours`
- `/georgetown-food-tours`
- And any future location pages

---

## 🎯 **URL & SEO Structure**

### **URL Pattern:**
```
https://simplyenak.com/{location}-food-tours
```

**Examples:**
- `/kuala-lumpur-food-tours`
- `/penang-food-tours`
- `/georgetown-food-tours`

**Why This Pattern:**
- ✅ Clean, readable
- ✅ Contains keyword
- ✅ Easy to remember
- ✅ Scalable (add more cities easily)

---

### **Page Metadata (SEO)**

```html
<head>
  <!-- Title Tag (55-60 characters) -->
  <title>{Location} Food Tours | Authentic Street Food with Local Guides - Simply Enak</title>

  <!-- Meta Description (150-160 characters) -->
  <meta name="description" content="Join our 5-star rated food tours in {Location}. {Review_Count}+ reviews. Small groups, expert local guides, unforgettable Malaysian cuisine. Book now!">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://simplyenak.com/{location}-food-tours">

  <!-- Open Graph -->
  <meta property="og:title" content="{Location} Food Tours | Authentic Street Food - Simply Enak">
  <meta property="og:description" content="Discover {Location}'s best food with local expert guides. {Review_Count}+ 5-star reviews.">
  <meta property="og:image" content="https://simplyenak.com/images/{location}-food-tour-og.jpg">
  <meta property="og:url" content="https://simplyenak.com/{location}-food-tours">
  <meta property="og:type" content="website">
</head>
```

**Variables to Replace:**
- `{Location}` = "Kuala Lumpur", "Penang", "Georgetown"
- `{location}` = "kuala-lumpur", "penang", "georgetown"
- `{Review_Count}` = "150", "379", etc.

---

## 📱 **Complete Page Layout**

### **Container Structure:**
```
<main class="landing-page">
  <section id="hero"></section>
  <section id="trust-bar"></section>
  <section id="social-proof-sticky"></section>
  <section id="tours"></section>
  <section id="why-us"></section>
  <section id="reviews"></section>
  <section id="what-to-expect"></section>
  <section id="faq"></section>
  <section id="guides"></section>
  <section id="location-context"></section>
  <section id="final-cta"></section>
  <footer id="location-footer"></footer>
</main>
```

**Total Sections:** 12
**Estimated Page Length:** 1,500-2,500 words
**Estimated Scroll Height:** 8,000-12,000px

---

## 📐 **SECTION 1: HERO (Above the Fold)**

### **Purpose:**
- Stop the scroll
- Communicate value instantly
- Provide clear CTA
- Establish trust immediately

### **Structure:**

```html
<section id="hero" class="hero-section">
  <!-- Background -->
  <div class="hero-background">
    <img
      src="/images/{location}-hero.jpg"
      alt="{Location} food tour with Simply Enak"
      loading="eager"
      fetchpriority="high"
    >
    <div class="hero-overlay"></div>
  </div>

  <!-- Content -->
  <div class="hero-content container">

    <!-- Breadcrumb (SEO) -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> ›
      <a href="/tours">Tours</a> ›
      <span>{Location} Food Tours</span>
    </nav>

    <!-- Main Headline -->
    <h1 class="hero-title">
      Authentic {Location} Food Tours
    </h1>

    <!-- Sub-headline -->
    <p class="hero-subtitle">
      {Unique_Value_Proposition}
    </p>

    <!-- Trust Signals -->
    <div class="hero-trust-signals">
      <div class="rating">
        <span class="stars">⭐⭐⭐⭐⭐</span>
        <span class="review-count">{Review_Count}+ Five-Star Reviews</span>
      </div>
      <div class="ranking">
        #{Ranking} of {Total} Food Experiences in {Location}
      </div>
    </div>

    <!-- Primary CTA -->
    <div class="hero-cta">
      <a href="#tours" class="btn btn-primary btn-lg">
        Book Your {Location} Food Tour
      </a>
      <p class="cta-subtext">
        ✓ Free cancellation up to 24 hours
      </p>
    </div>

    <!-- Quick Benefits -->
    <ul class="hero-benefits">
      <li>✓ Small groups (max 8)</li>
      <li>✓ Local expert guides</li>
      <li>✓ Authentic street food</li>
      <li>✓ {Hours} of culinary adventure</li>
    </ul>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      ↓ Scroll to explore tours ↓
    </div>

  </div>
</section>
```

### **Content Variables:**

**For Kuala Lumpur:**
```javascript
{
  Location: "Kuala Lumpur",
  location: "kuala-lumpur",
  Unique_Value_Proposition: "Discover Hidden Culinary Gems with Local Guides",
  Review_Count: "150",
  Ranking: "8",
  Total: "74",
  Hours: "3.5-4"
}
```

**For Penang:**
```javascript
{
  Location: "Penang",
  location: "penang",
  Unique_Value_Proposition: "Experience Georgetown's Heritage Through Food",
  Review_Count: "379",
  Ranking: "8",
  Total: "74",
  Hours: "3.5-4"
}
```

### **Design Specs:**

```css
.hero-section {
  height: 100vh;
  min-height: 600px;
  max-height: 900px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.3) 0%,
    rgba(0,0,0,0.6) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 24px;
  line-height: 1.4;
}

.hero-trust-signals {
  margin-bottom: 32px;
}

.stars {
  font-size: 24px;
  color: #FFD700;
}

.btn-primary {
  background: #FF6B35;
  color: white;
  padding: 18px 48px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
}

.btn-primary:hover {
  background: #E55A2B;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
}

/* Mobile */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .btn-primary {
    width: 100%;
    padding: 16px 32px;
  }
}
```

---

## 📐 **SECTION 2: TRUST BAR**

### **Purpose:**
- Social proof via logos
- Immediate credibility
- Reduce bounce rate

### **Structure:**

```html
<section id="trust-bar" class="trust-bar">
  <div class="container">
    <p class="trust-bar-label">As Featured On:</p>

    <div class="trust-bar-logos">
      <img src="/images/logos/tripadvisor.svg" alt="TripAdvisor">
      <img src="/images/logos/viator.svg" alt="Viator">
      <img src="/images/logos/getyourguide.svg" alt="GetYourGuide">
      <img src="/images/logos/tourism-malaysia.svg" alt="Tourism Malaysia">
      <img src="/images/logos/expedia.svg" alt="Expedia">
    </div>

    <div class="trust-bar-badge">
      🏆 TripAdvisor Certificate of Excellence 2021-2024
    </div>
  </div>
</section>
```

### **Design Specs:**

```css
.trust-bar {
  background: #F8F9FA;
  padding: 24px 0;
  border-bottom: 1px solid #E9ECEF;
}

.trust-bar-label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #6C757D;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.trust-bar-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.trust-bar-logos img {
  height: 32px;
  width: auto;
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.trust-bar-logos img:hover {
  opacity: 1;
  filter: grayscale(0%);
}

.trust-bar-badge {
  text-align: center;
  font-size: 14px;
  color: #28A745;
  font-weight: 600;
}
```

**Content Variables:**
- Logos: Same for all pages
- Badge: Same for all pages
- No customization needed per location

---

## 📐 **SECTION 3: SOCIAL PROOF STICKY BANNER**

### **Purpose:**
- Create urgency (FOMO)
- Show live activity
- Increase conversion via scarcity

### **Structure:**

```html
<section id="social-proof-sticky" class="social-proof-banner">
  <div class="container">
    <div class="proof-items">
      <!-- Item 1: Recent bookings -->
      <div class="proof-item">
        <span class="icon">🔥</span>
        <span class="text">
          <strong id="recent-bookings">{X}</strong> people booked a {Location} food tour in the last 24 hours
        </span>
      </div>

      <!-- Item 2: Spots remaining -->
      <div class="proof-item">
        <span class="icon">⏰</span>
        <span class="text">
          Only <strong id="spots-remaining">{Y}</strong> spots left for tomorrow's {Featured_Tour}
        </span>
      </div>
    </div>
  </div>
</section>
```

### **JavaScript for Dynamic Updates:**

```javascript
// Rotate messages every 5 seconds
const proofMessages = [
  {
    icon: '🔥',
    text: '{X} people booked a {Location} food tour in the last 24 hours'
  },
  {
    icon: '⏰',
    text: 'Only {Y} spots left for tomorrow\'s {Featured_Tour}'
  },
  {
    icon: '👥',
    text: '{Z} people are viewing this page right now'
  },
  {
    icon: '✈️',
    text: 'Last booking: {Name} from {Country}, {Minutes} minutes ago'
  }
];

let currentIndex = 0;

setInterval(() => {
  currentIndex = (currentIndex + 1) % proofMessages.length;
  updateProofBanner(proofMessages[currentIndex]);
}, 5000);
```

### **Content Variables:**

**For Kuala Lumpur:**
```javascript
{
  X: Math.floor(Math.random() * (15 - 8) + 8), // 8-15
  Y: Math.floor(Math.random() * (5 - 2) + 2),  // 2-5
  Z: Math.floor(Math.random() * (12 - 5) + 5), // 5-12
  Featured_Tour: "KL Street Food Tour",
  Name: "Sarah M.",
  Country: "Australia",
  Minutes: Math.floor(Math.random() * (45 - 5) + 5) // 5-45
}
```

### **Design Specs:**

```css
.social-proof-banner {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #FFF3CD;
  border-bottom: 2px solid #FFE69C;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.proof-items {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.proof-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #856404;
}

.proof-item .icon {
  font-size: 20px;
}

.proof-item strong {
  color: #DC3545;
  font-weight: 700;
}

@media (max-width: 768px) {
  .proof-items {
    flex-direction: column;
    gap: 8px;
  }
}
```

---

## 📐 **SECTION 4: TOUR OPTIONS**

### **Purpose:**
- Showcase available tours
- Enable quick comparison
- Provide multiple booking CTAs

### **Structure:**

```html
<section id="tours" class="tours-section">
  <div class="container">

    <!-- Section Header -->
    <div class="section-header">
      <h2>Choose Your {Location} Food Adventure</h2>
      <p class="section-subtitle">
        All tours include: Expert guide, 10+ tastings, small groups, and unforgettable stories
      </p>
    </div>

    <!-- Tours Grid -->
    <div class="tours-grid">

      <!-- Tour Card 1 -->
      <div class="tour-card">
        <div class="tour-image">
          <img src="/images/{location}-tour-1.jpg" alt="{Tour_1_Name}">
          <div class="tour-badge">{Badge_1}</div>
        </div>

        <div class="tour-content">
          <h3 class="tour-name">{Tour_1_Name}</h3>

          <div class="tour-rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="rating-count">{Rating_1} ({Review_Count_1})</span>
          </div>

          <p class="tour-description">
            {Tour_1_Description}
          </p>

          <ul class="tour-highlights">
            <li>{Highlight_1_1}</li>
            <li>{Highlight_1_2}</li>
            <li>{Highlight_1_3}</li>
          </ul>

          <div class="tour-meta">
            <span class="meta-item">
              <span class="icon">⏱️</span>
              {Duration_1}
            </span>
            <span class="meta-item">
              <span class="icon">👥</span>
              Max {Max_Group_1} guests
            </span>
          </div>

          <div class="tour-footer">
            <div class="tour-price">
              <span class="price-label">From</span>
              <span class="price-amount">RM {Price_1}</span>
              <span class="price-unit">per person</span>
            </div>

            <a href="/tours/{tour_1_slug}" class="btn btn-primary">
              Book Now
            </a>
          </div>
        </div>
      </div>

      <!-- Tour Card 2 -->
      <div class="tour-card">
        <!-- Same structure as Tour Card 1 -->
      </div>

      <!-- Tour Card 3 -->
      <div class="tour-card">
        <!-- Same structure as Tour Card 1 -->
      </div>

    </div>

    <!-- View All Link -->
    <div class="tours-footer">
      <a href="/tours?location={location}" class="btn btn-outline">
        View All {Location} Tours →
      </a>
    </div>

  </div>
</section>
```

### **Content Variables:**

**For Kuala Lumpur (3 tours):**

```javascript
const tours = [
  {
    name: "KL Street Food Tour",
    slug: "kuala-lumpur-street-food",
    badge: "Most Popular",
    image: "kl-street-food.jpg",
    rating: "4.9",
    review_count: "87",
    description: "Explore Chinatown's hidden hawker stalls and taste authentic Malaysian favorites",
    highlights: [
      "Visit 7-8 local food stalls",
      "Try char kway teow, nasi lemak, satay",
      "Explore Petaling Street heritage area"
    ],
    duration: "3.5 hours",
    max_group: "8",
    price: "285"
  },
  {
    name: "Flavours of Malaysia",
    slug: "flavours-of-malaysia",
    badge: "Off the Beaten Track",
    image: "flavours-malaysia.jpg",
    rating: "4.9",
    review_count: "64",
    description: "Venture beyond tourist spots to discover where locals actually eat",
    highlights: [
      "Hidden neighborhood gems",
      "Traditional wet market visit",
      "Unique multi-ethnic flavors"
    ],
    duration: "4 hours",
    max_group: "8",
    price: "285"
  },
  {
    name: "Secrets of KL Nightlife",
    slug: "secrets-of-kl-nightlife",
    badge: "Evening Tour",
    image: "kl-nightlife.jpg",
    rating: "4.8",
    review_count: "53",
    description: "Experience KL's vibrant night food scene with street art and cocktails",
    highlights: [
      "Jalan Alor night food street",
      "Street art & cultural stories",
      "Craft cocktails at local bar"
    ],
    duration: "4 hours",
    max_group: "8",
    price: "315"
  }
];
```

**For Penang (3 tours):**

```javascript
const tours = [
  {
    name: "Penang Street Food Tour",
    slug: "penang-street-food",
    badge: "Best Seller",
    // ... similar structure
  },
  {
    name: "Harmony Food Trail",
    slug: "penang-harmony-food-trail",
    badge: "Cultural Experience",
    // ... similar structure
  },
  {
    name: "Eat Drink Georgetown",
    slug: "eat-drink-georgetown",
    badge: "Evening Tour",
    // ... similar structure
  }
];
```

### **Design Specs:**

```css
.tours-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #212529;
}

.section-subtitle {
  font-size: 18px;
  color: #6C757D;
  max-width: 600px;
  margin: 0 auto;
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.tour-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.tour-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.tour-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tour-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #FF6B35;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.tour-content {
  padding: 24px;
}

.tour-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #212529;
}

.tour-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  color: #FFD700;
  font-size: 16px;
}

.rating-count {
  font-size: 14px;
  color: #6C757D;
}

.tour-description {
  font-size: 15px;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 16px;
}

.tour-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.tour-highlights li {
  padding-left: 24px;
  position: relative;
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
}

.tour-highlights li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #28A745;
  font-weight: 700;
}

.tour-meta {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #E9ECEF;
  border-bottom: 1px solid #E9ECEF;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #495057;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tour-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 12px;
  color: #6C757D;
}

.price-amount {
  font-size: 28px;
  font-weight: 700;
  color: #FF6B35;
}

.price-unit {
  font-size: 12px;
  color: #6C757D;
}

/* Mobile */
@media (max-width: 768px) {
  .tours-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .tour-footer {
    flex-direction: column;
    gap: 16px;
  }

  .btn {
    width: 100%;
  }
}
```

---

## 📐 **SECTION 5: WHY CHOOSE US**

### **Purpose:**
- Differentiation from competitors
- Address objections
- Build unique value proposition

### **Structure:**

```html
<section id="why-us" class="why-us-section">
  <div class="container">

    <div class="section-header">
      <h2>Why Simply Enak is {Location}'s #1 Food Tour</h2>
    </div>

    <div class="benefits-grid">

      <!-- Benefit 1 -->
      <div class="benefit-card">
        <div class="benefit-icon">
          <span class="icon">🏅</span>
        </div>
        <h3 class="benefit-title">Local Expert Guides</h3>
        <p class="benefit-description">
          {Benefit_1_Description}
        </p>
      </div>

      <!-- Benefit 2 -->
      <div class="benefit-card">
        <div class="benefit-icon">
          <span class="icon">👥</span>
        </div>
        <h3 class="benefit-title">Small Group Sizes</h3>
        <p class="benefit-description">
          {Benefit_2_Description}
        </p>
      </div>

      <!-- Benefit 3 -->
      <div class="benefit-card">
        <div class="benefit-icon">
          <span class="icon">🍜</span>
        </div>
        <h3 class="benefit-title">Authentic Street Food</h3>
        <p class="benefit-description">
          {Benefit_3_Description}
        </p>
      </div>

      <!-- Benefit 4 -->
      <div class="benefit-card">
        <div class="benefit-icon">
          <span class="icon">🏛️</span>
        </div>
        <h3 class="benefit-title">Culture + History</h3>
        <p class="benefit-description">
          {Benefit_4_Description}
        </p>
      </div>

    </div>

    <div class="why-us-cta">
      <a href="#tours" class="btn btn-primary btn-lg">
        Book Your Spot Now
      </a>
    </div>

  </div>
</section>
```

### **Content Variables:**

**For Kuala Lumpur:**
```javascript
{
  Benefit_1_Description: "Our guides are born and raised in KL, sharing family food spots passed down for generations. You're not just getting a guide—you're exploring with a local friend.",

  Benefit_2_Description: "Maximum 8 guests per tour means personal attention and real conversations with your guide. We keep it intimate so you can actually ask questions and connect.",

  Benefit_3_Description: "No tourist traps. We take you where locals actually eat, from hawker centers to hidden gems that even most KL residents don't know about.",

  Benefit_4_Description: "It's not just food—you'll learn KL's heritage, the story of each dish, and why it matters. Understand the city through its cuisine."
}
```

**For Penang:**
```javascript
{
  Benefit_1_Description: "Georgetown-born guides who grew up eating at these same stalls. Their grandmothers taught them these recipes—now they're sharing them with you.",

  Benefit_2_Description: "Intimate groups of 8 or less mean you get personal stories, insider tips, and the chance to have meaningful conversations about Penang's food culture.",

  Benefit_3_Description: "We skip the tourist spots and take you to authentic hawker stalls where locals queue for lunch. These are the places only Penang locals know.",

  Benefit_4_Description: "Learn why Penang is Malaysia's food capital. Each dish has a story—heritage, immigration, fusion. We teach you the history behind every bite."
}
```

### **Design Specs:**

```css
.why-us-section {
  padding: 80px 0;
  background: #F8F9FA;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.benefit-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #FFF3E0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-icon .icon {
  font-size: 40px;
}

.benefit-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #212529;
}

.benefit-description {
  font-size: 15px;
  line-height: 1.6;
  color: #495057;
}

.why-us-cta {
  text-align: center;
}

@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📐 **SECTIONS 6-12 STRUCTURE**

### **Remaining Sections Follow Same Pattern:**

**Section 6: Customer Reviews**
- Pull from TripAdvisor API (filtered by location)
- 5-6 reviews with photos
- Star rating, customer name, location
- Link to "Read all reviews on TripAdvisor"

**Section 7: What to Expect**
- Where we go (neighborhood list + map)
- What you'll eat (10-12 dishes with photos)
- Timing & meeting point
- Group size details
- Accessibility & dietary info
- What's included/not included

**Section 8: FAQ (Accordion)**
- 8-10 questions with schema markup
- Expand/collapse functionality
- Location-specific FAQs

**Section 9: Meet Your Guides**
- 2-3 guide profiles with photos
- Name, bio, languages, years of experience
- Personal quotes

**Section 10: Location Context**
- Educational content about {Location}'s food scene
- Heritage, culture, neighborhoods
- Google Map embed with tour route
- Local keywords naturally included

**Section 11: Final CTA**
- Urgency messaging
- Clear booking CTA
- Phone number alternative
- Risk reversal (free cancellation)

**Section 12: Footer**
- NAP (Name, Address, Phone)
- Social media links
- Internal links (other locations, about, contact)
- Trust badges
- Copyright

---

## 🗂️ **File Structure (Astro Implementation)**

```
/src/pages/
  └── [location]-food-tours.astro    // Dynamic or static

/src/components/LandingPage/
  ├── Hero.astro
  ├── TrustBar.astro
  ├── SocialProofBanner.astro
  ├── ToursGrid.astro
  ├── TourCard.astro
  ├── WhyUs.astro
  ├── BenefitCard.astro
  ├── Reviews.astro
  ├── ReviewCard.astro
  ├── WhatToExpect.astro
  ├── FAQ.astro
  ├── FAQItem.astro
  ├── Guides.astro
  ├── GuideCard.astro
  ├── LocationContext.astro
  ├── FinalCTA.astro
  └── LocationFooter.astro

/src/data/
  ├── locations.ts         // All location data
  └── tours.ts            // Tour data by location

/public/images/
  ├── kuala-lumpur/
  │   ├── hero.jpg
  │   ├── tour-1.jpg
  │   ├── tour-2.jpg
  │   └── ...
  └── penang/
      ├── hero.jpg
      ├── tour-1.jpg
      └── ...
```

---

## 📊 **Data Structure (locations.ts)**

```typescript
// /src/data/locations.ts

export interface LocationData {
  // Basic Info
  name: string;
  slug: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;

  // Stats
  reviewCount: number;
  ranking: number;
  rankingTotal: number;

  // Schema.org
  geo: {
    latitude: string;
    longitude: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };

  // Content
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  faqs: Array<{
    question: string;
    answer: string;
  }>;

  guides: Array<{
    name: string;
    photo: string;
    bio: string;
    languages: string[];
    yearsExperience: number;
  }>;

  locationContext: {
    intro: string;
    neighborhoods: Array<{
      name: string;
      description: string;
    }>;
  };

  // Images
  images: {
    hero: string;
    og: string;
  };
}

export const locations: Record<string, LocationData> = {
  'kuala-lumpur': {
    name: 'Kuala Lumpur',
    slug: 'kuala-lumpur',
    metaTitle: 'Kuala Lumpur Food Tours | Authentic Street Food with Local Guides - Simply Enak',
    metaDescription: 'Join our 5-star rated food tours in Kuala Lumpur. 150+ reviews. Small groups, expert local guides, unforgettable Malaysian cuisine. Book now!',
    heroTitle: 'Authentic Kuala Lumpur Food Tours',
    heroSubtitle: 'Discover Hidden Culinary Gems with Local Guides',
    reviewCount: 150,
    ranking: 8,
    rankingTotal: 74,
    geo: {
      latitude: '3.1570',
      longitude: '101.7123'
    },
    address: {
      streetAddress: 'Pasar Seni MRT Station',
      addressLocality: 'Kuala Lumpur',
      addressRegion: 'Federal Territory of Kuala Lumpur',
      postalCode: '50050'
    },
    benefits: [
      {
        icon: '🏅',
        title: 'Local Expert Guides',
        description: 'Our guides are born and raised in KL, sharing family food spots passed down for generations.'
      },
      // ... 3 more benefits
    ],
    faqs: [
      {
        question: 'How much walking is involved?',
        answer: 'Approximately 2-3 km over 3.5-4 hours, with plenty of sitting and eating breaks.'
      },
      // ... 7-9 more FAQs
    ],
    guides: [
      {
        name: 'Mark Ng',
        photo: '/images/guides/mark.jpg',
        bio: 'I grew up in Chinatown eating at these same stalls. Sharing my city\'s food story is my passion.',
        languages: ['English', 'Cantonese', 'Malay'],
        yearsExperience: 8
      },
      // ... more guides
    ],
    locationContext: {
      intro: 'Kuala Lumpur\'s food scene reflects its multicultural heritage...',
      neighborhoods: [
        {
          name: 'Chinatown (Petaling Street)',
          description: 'Historic Chinese quarter, UNESCO heritage zone'
        },
        // ... more neighborhoods
      ]
    },
    images: {
      hero: '/images/kuala-lumpur/hero.jpg',
      og: '/images/kuala-lumpur/og-image.jpg'
    }
  },

  'penang': {
    // Same structure, different values
  },

  'georgetown': {
    // Same structure, different values
  }
};
```

---

## 📄 **Page Implementation (Astro)**

```astro
---
// /src/pages/kuala-lumpur-food-tours.astro

import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/LandingPage/Hero.astro';
import TrustBar from '@/components/LandingPage/TrustBar.astro';
import SocialProofBanner from '@/components/LandingPage/SocialProofBanner.astro';
import ToursGrid from '@/components/LandingPage/ToursGrid.astro';
import WhyUs from '@/components/LandingPage/WhyUs.astro';
import Reviews from '@/components/LandingPage/Reviews.astro';
import WhatToExpect from '@/components/LandingPage/WhatToExpect.astro';
import FAQ from '@/components/LandingPage/FAQ.astro';
import Guides from '@/components/LandingPage/Guides.astro';
import LocationContext from '@/components/LandingPage/LocationContext.astro';
import FinalCTA from '@/components/LandingPage/FinalCTA.astro';
import LocationFooter from '@/components/LandingPage/LocationFooter.astro';

import { locations } from '@/data/locations';
import { getToursByLocation } from '@/data/tours';
import { generateLocationSchema } from '@/utils/seo';

// Get location data
const locationSlug = 'kuala-lumpur';
const location = locations[locationSlug];
const tours = getToursByLocation(locationSlug);

// Generate schema
const schema = generateLocationSchema(locationSlug);
---

<Layout
  title={location.metaTitle}
  description={location.metaDescription}
  image={location.images.og}
  type="website"
  canonicalURL={`https://simplyenak.com/${locationSlug}-food-tours`}
  structuredData={schema}
>
  <Hero location={location} />
  <TrustBar />
  <SocialProofBanner location={location} />
  <ToursGrid location={location} tours={tours} />
  <WhyUs location={location} />
  <Reviews location={location} />
  <WhatToExpect location={location} />
  <FAQ location={location} />
  <Guides location={location} />
  <LocationContext location={location} />
  <FinalCTA location={location} />
  <LocationFooter location={location} />
</Layout>
```

---

## 🔁 **Replication Process**

### **To Create a New Location Page:**

1. **Add location data** to `/src/data/locations.ts`
   ```typescript
   'georgetown': {
     name: 'Georgetown',
     slug: 'georgetown',
     // ... fill in all fields
   }
   ```

2. **Create page file** `/src/pages/georgetown-food-tours.astro`
   ```astro
   const locationSlug = 'georgetown'; // <-- Only line that changes
   const location = locations[locationSlug];
   // ... rest is identical
   ```

3. **Add images** to `/public/images/georgetown/`
   - hero.jpg
   - og-image.jpg
   - tour-1.jpg, tour-2.jpg, etc.

4. **Add tours** to `/src/data/tours.ts`
   ```typescript
   georgetown: [
     { name: 'Georgetown Heritage Food Tour', ... },
     { name: 'Penang Street Food Tour', ... },
   ]
   ```

5. **Deploy** - Done!

---

## ⏱️ **Time Estimate to Build**

### **First Page (Kuala Lumpur):**
- Component development: 16-20 hours
- Content writing: 8-12 hours
- Image sourcing/editing: 4-6 hours
- Testing & refinement: 4-6 hours
- **Total: 32-44 hours (4-5 days)**

### **Second Page (Penang):**
- Components: 0 hours (reuse)
- Content writing: 6-8 hours (faster with template)
- Images: 3-4 hours
- Testing: 2-3 hours
- **Total: 11-15 hours (1-2 days)**

### **Third+ Pages:**
- Content: 4-6 hours
- Images: 2-3 hours
- Testing: 1-2 hours
- **Total: 7-11 hours (<1 day each)**

---

## 📊 **Success Metrics**

Track for each location page:

```javascript
const metrics = {
  seo: {
    keywordRanking: {
      '{location} food tour': 'Position #X',
      '{location} food tours': 'Position #Y',
      'food tour {location}': 'Position #Z'
    },
    organicClicks: 'X/month',
    impressions: 'Y/month',
    averagePosition: 'Z'
  },

  conversion: {
    conversionRate: 'X%',
    bounceRate: 'Y%',
    avgTimeOnPage: 'Z minutes',
    pagesPerSession: 'N'
  },

  revenue: {
    organicBookings: 'X/month',
    revenue: 'RM Y/month',
    avgBookingValue: 'RM Z'
  }
};
```

---

**This is your complete, replicable template. Build the first one perfectly, then scaling to 10+ pages becomes a matter of days, not weeks.**

Want me to start building the actual Astro components next?
