# Page Refactoring Todo List
**Goal**: Refactor all pages to use design system consistently
**Reference Design**: Homepage hero section (Strapi-driven, proper design system)
**Timeline**: 2-3 weeks
**Date**: October 27, 2025

---

## 🎯 PRIORITY ORDER

### Tier 1: Critical Pages (Week 1) - User-Facing & High Traffic
1. Homepage (verify & reference)
2. KL Food Tour Landing Page (biggest violator)
3. Vegetarian Food Tours Page
4. Contact Page

### Tier 2: Tour Pages (Week 2) - Core Product Pages
5. Tour Page Template (create once, apply to all)
6. Penang Heritage Food Trail
7. Melaka Cultural Food Journey
8. Secrets of Kuala Lumpur
9. Tours Index/Listing Page

### Tier 3: Supporting Pages (Week 2-3) - Conversion & Structure
10. About Page
11. Thank You Pages (6 variations)

### Tier 4: Documentation (Week 3) - Developer Handoff
12. Component Showcase Page
13. Developer Documentation

---

## 📐 REFERENCE DESIGN: Homepage Hero

### Current Homepage Hero Implementation:
**Component**: `components/Home/HeroSection.astro`
**Architecture**: Strapi CMS-driven (fetches from API)
**Design Elements**:
- Fixed height: `md:h-[640px] h-[742px]`
- Text center-aligned with vertical centering
- Background image with overlay
- Typography: Uses `.text-h1` and `.text-subheading`
- Buttons: Uses `<Button>` component with `buttonType` prop
- Spacing: Proper padding with `pt-[30px] md:pt-10 pb-[50px] md:pb-[70px]`
- Button group: `flex items-center gap-7 flex-wrap justify-center`

### Hero Design Pattern to Follow:
```astro
<section class="md:h-[640px] h-[742px] relative overflow-hidden">
  <!-- Background with image -->
  <div class="main-container flex items-center justify-center text-center relative z-20 h-full text-white">
    <div>
      <h1 class="text-h1">{title}</h1>
      <p class="text-subheading pt-[30px] md:pt-10 pb-[50px] md:pb-[70px]">
        {subtitle}
      </p>
      <div class="flex items-center gap-7 flex-wrap justify-center">
        <!-- Buttons using Button component -->
      </div>
    </div>
  </div>
  <!-- Background image -->
  <img src={backgroundImage} class="absolute inset-0 object-cover size-full" />
</section>
```

---

## 📋 DETAILED REFACTORING TASKS

---

## ✅ TIER 1: CRITICAL PAGES (Week 1)

### 1. Homepage - Verify & Polish (2 hours)
**Status**: Mostly good, needs verification
**File**: `src/pages/index.astro`

**Tasks**:
- [x] Already uses Strapi CMS ✅
- [ ] Verify all sections use design system classes
- [ ] Check HeroSection component compliance
- [ ] Verify AboutSection uses `.text-h2` for headings
- [ ] Check OurToursSection card styling
- [ ] Verify TestimonialsSection design system compliance
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Document hero pattern for other pages

**Acceptance Criteria**:
- All headings use `.text-h1` through `.text-h6`
- All buttons use design system button classes
- Spacing consistent with design system
- No custom Tailwind classes outside design system
- Works perfectly on mobile, tablet, desktop

---

### 2. KL Food Tour Page - Major Refactor (1-2 days)
**Status**: 🔴 CRITICAL - Biggest design violator
**File**: `src/pages/kuala-lumpur-food-tour.astro`
**Current Size**: 44KB of custom HTML

**Current Issues**:
- ❌ Custom hero HTML (gradient backgrounds, custom classes)
- ❌ Not using `HeroSection` component pattern
- ❌ Custom typography classes instead of `.text-h1`, `.text-h2`
- ❌ Custom button styles instead of `.primary-btn`
- ❌ Inline data arrays mixed with markup
- ❌ Custom spacing values throughout
- ❌ Doesn't follow homepage hero pattern

**Refactoring Strategy**:

#### Step 1: Extract Data (1 hour)
```astro
---
// Extract all data to structured object at top
const pageData = {
  hero: {
    title: "Discover Kuala Lumpur's Food Heritage",
    subtitle: "Guided Food Tours Since 2011",
    backgroundImage: "/images/kl-food-tour-hero.jpg"
  },
  navigation: {
    segments: [
      { id: "planning", label: "Quick Planning", icon: "calendar" },
      { id: "dishes", label: "Food Guide", icon: "food" },
      { id: "booking", label: "Book Now", icon: "clock" }
    ]
  },
  dishes: [
    {
      name: "Nasi Lemak",
      description: "Malaysia's beloved breakfast...",
      image: "/images/nasi-lemak.jpg",
      locations: ["Kampung Baru", "Chow Kit"]
    }
    // ... all dishes
  ],
  dietaryOptions: [
    {
      type: "Vegetarian",
      emoji: "🥬",
      description: "Plant-based Malaysian delights",
      link: "/vegetarian-food-tours"
    }
    // ... all dietary options
  ],
  faqs: [
    {
      question: "What's included in the tour?",
      answer: "All food tastings, expert guide, transportation..."
    }
    // ... all FAQs
  ],
  tours: [
    {
      title: "KL Street Food Evening Tour",
      price: "RM 285",
      duration: "4 hours",
      image: "/images/kl-street-food.jpg"
    }
    // ... all tours
  ]
};
---
```

#### Step 2: Create Hero Section Following Homepage Pattern (2 hours)
```astro
<!-- Replace custom hero with homepage pattern -->
<section class="md:h-[640px] h-[742px] relative overflow-hidden">
  <div class="main-container flex items-center justify-center text-center relative z-20 h-full text-white">
    <div>
      <h1 class="text-h1">{pageData.hero.title}</h1>
      <p class="text-subheading pt-[30px] md:pt-10 pb-[50px] md:pb-[70px]">
        {pageData.hero.subtitle}
      </p>
      <div class="flex items-center gap-7 flex-wrap justify-center">
        <Button
          href="/contact"
          title="Book Your Tour"
          buttonType="primary-btn"
        />
        <Button
          href="/tours"
          title="View All Tours"
          buttonType="secondary-btn"
        />
      </div>
    </div>
  </div>
  <img
    src={pageData.hero.backgroundImage}
    alt="KL Food Tour"
    class="absolute inset-0 object-cover size-full"
  />
</section>
```

#### Step 3: Componentize Sections (3 hours)
- [ ] **Navigation/Segmentation Section**: Keep functional design but apply design system typography
- [ ] **Dishes Section**: Create reusable dish card component
- [ ] **Dietary Options**: Use Badge component + design system grid
- [ ] **Tours Grid**: Use existing `ToursGrid` component if available, or create card grid
- [ ] **FAQ Section**: Use `LandingPage/FAQ` component pattern

#### Step 4: Apply Design System Classes (2 hours)
- [ ] Replace all `text-4xl md:text-5xl font-bold` with `.text-h1`
- [ ] Replace all `text-3xl md:text-4xl` with `.text-h2`
- [ ] Replace all `text-xl md:text-2xl` with `.text-h3`
- [ ] Replace all custom button classes with `.primary-btn`, `.secondary-btn`
- [ ] Replace all section padding with `py-16 md:py-20`
- [ ] Replace all card gaps with `gap-6 md:gap-8`
- [ ] Use `main-container` for all content wrappers

#### Step 5: Test & Verify (1 hour)
- [ ] Mobile responsive (375px, 414px)
- [ ] Tablet responsive (768px, 1024px)
- [ ] Desktop responsive (1366px, 1920px)
- [ ] All interactions work
- [ ] Design system compliance 100%

**Acceptance Criteria**:
- Uses homepage hero pattern
- All design system classes applied
- Data separated from markup
- Fully responsive
- No custom styles outside design system
- Clear structure for developer to templatize

**Time Estimate**: 1-2 days

---

### 3. Vegetarian Food Tours Page - Componentize (1 day)
**Status**: 🟡 Good content, needs componentization
**File**: `src/pages/vegetarian-food-tours.astro`
**Current Size**: 56KB (excellent content)

**Current Strengths**:
- ✅ Great educational content
- ✅ Well-structured data
- ✅ Good brand voice
- ✅ Comprehensive information

**Issues to Fix**:
- ❌ Custom hero instead of homepage pattern
- ❌ Not using design system components
- ❌ Inline data mixed with markup
- ❌ Custom typography classes

**Refactoring Tasks**:

#### Step 1: Extract Data (30 min)
```astro
---
const pageData = {
  hero: {
    title: "Malaysia's Incredible Plant-Based Heritage",
    subtitle: "A 140-Year Journey of Culture, Faith, and Innovation",
    description: "From South Indian migrants...",
    backgroundImage: "/images/vegetarian-hero.jpg"
  },
  culturalOrigins: [
    {
      title: "South Indian Roots (1880s)",
      description: "...",
      keyContributions: [...],
      impact: "...",
      image: "/images/south-indian-heritage.jpg"
    }
    // ... all 4 origins
  ],
  whySpecial: {
    reasons: [...]
  },
  vegetarianTypes: [...],
  vendorStories: [...],
  tours: [...],
  faqs: [...]
};
---
```

#### Step 2: Apply Homepage Hero Pattern (1 hour)
```astro
<section class="md:h-[640px] h-[742px] relative overflow-hidden">
  <div class="main-container flex items-center justify-center text-center relative z-20 h-full text-white">
    <div>
      <h1 class="text-h1">{pageData.hero.title}</h1>
      <p class="text-subheading pt-[30px] md:pt-10 pb-[50px] md:pb-[70px]">
        {pageData.hero.subtitle}
      </p>
      <p class="text-body mb-8 max-w-3xl mx-auto">
        {pageData.hero.description}
      </p>
      <div class="flex items-center gap-7 flex-wrap justify-center">
        <Button
          href="#tours"
          title="View Vegetarian Tours"
          buttonType="primary-btn"
        />
      </div>
    </div>
  </div>
  <img
    src={pageData.hero.backgroundImage}
    alt="Malaysian Vegetarian Heritage"
    class="absolute inset-0 object-cover size-full"
  />
</section>
```

#### Step 3: Create Cultural Origins Timeline Component (2 hours)
```astro
<!-- Cultural Origins Section -->
<section class="py-16 md:py-20 bg-white">
  <div class="main-container">
    <h2 class="text-h2 text-primary text-center mb-12">
      140 Years of Malaysian Vegetarian Evolution
    </h2>

    <div class="space-y-16">
      {pageData.culturalOrigins.map((origin, index) => (
        <ContentBlock
          title={origin.title}
          content={origin.description}
          image={origin.image}
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        >
          <!-- Key contributions list -->
          <ul class="space-y-3 mt-6">
            {origin.keyContributions.map(contribution => (
              <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-primary flex-shrink-0 mt-1" ...>
                  <!-- Check icon -->
                </svg>
                <span class="text-body">{contribution}</span>
              </li>
            ))}
          </ul>

          <!-- Impact callout -->
          <div class="bg-primary/5 border-l-4 border-primary p-4 mt-6">
            <p class="text-body font-semibold text-primary">
              {origin.impact}
            </p>
          </div>
        </ContentBlock>
      ))}
    </div>
  </div>
</section>
```

#### Step 4: Apply Design System Throughout (2 hours)
- [ ] All headings use `.text-h1`, `.text-h2`, `.text-h3`
- [ ] All body text uses `.text-body`
- [ ] All sections use `py-16 md:py-20`
- [ ] All containers use `main-container`
- [ ] Cards use consistent `gap-6 md:gap-8`
- [ ] Colors use brand utilities (`text-primary`, `bg-primary/10`)

#### Step 5: Create Vendor Stories Component (1 hour)
- [ ] Card-based layout
- [ ] Quote styling with brand colors
- [ ] Vendor images
- [ ] Consistent with design system

#### Step 6: Tours Section (30 min)
- [ ] Use tour card component
- [ ] Grid layout with design system spacing
- [ ] Pricing with PriceTag component

#### Step 7: FAQ Section (30 min)
- [ ] Use FAQ accordion component pattern
- [ ] Design system styling
- [ ] Proper spacing

**Acceptance Criteria**:
- Homepage hero pattern applied
- All content componentized
- Design system 100% compliant
- Data clearly separated
- Fully responsive
- Clear structure for developer

**Time Estimate**: 1 day

---

### 4. Contact Page - Verify (2 hours)
**Status**: ✅ Likely already good
**File**: `src/pages/contact.astro`
**Current Size**: 1.3KB

**Tasks**:
- [ ] Verify uses design system classes
- [ ] Check form styling
- [ ] Verify button styles (`.primary-btn`)
- [ ] Check spacing consistency
- [ ] Test mobile responsive
- [ ] Verify form validation styling

**Acceptance Criteria**:
- Design system compliant
- Mobile responsive
- Form works correctly
- Consistent with other pages

**Time Estimate**: 2 hours

---

## 🎯 TIER 2: TOUR PAGES (Week 2)

### 5. Create Tour Page Template (1 day)
**Purpose**: Single template structure for all tour pages
**File**: `src/pages/tours/_tour-template.astro` (reference)

**Template Structure**:
```astro
---
import Layout from '@/layouts/Layout.astro';
import Button from '@/components/Button.astro';
import Section from '@/components/Design/Section.astro';
import Card from '@/components/Design/Card.astro';
import PriceTag from '@/components/Design/PriceTag.astro';
import Badge from '@/components/Design/Badge.astro';

// Tour data structure for developer reference
const tourData = {
  hero: {
    title: "Tour Name",
    subtitle: "Location | Duration",
    description: "Tour description",
    backgroundImage: "/images/tour-hero.jpg",
    price: "RM 285",
    duration: "4 hours",
    groupSize: "Max 8 people"
  },
  highlights: [
    "8-10 authentic food tastings",
    "Expert local guide",
    "Small group experience"
  ],
  itinerary: [
    {
      time: "9:00 AM",
      location: "Meeting Point",
      activity: "Welcome & Introduction",
      description: "Meet your guide at...",
      foods: ["Breakfast item", "Traditional coffee"]
    }
    // ... all stops
  ],
  included: [
    "All food and drinks mentioned",
    "Professional local guide",
    "Small group (max 8 people)"
  ],
  notIncluded: [
    "Hotel pickup/drop-off",
    "Personal expenses"
  ],
  meetingPoint: {
    name: "Pasar Seni MRT Station",
    address: "Jalan Hang Kasturi, Kuala Lumpur",
    mapUrl: "https://maps.google.com/...",
    instructions: "Exit A, turn left..."
  },
  bookingInfo: {
    cancellation: "Free cancellation up to 48 hours",
    confirmation: "Instant confirmation",
    languages: ["English", "Bahasa Malaysia"]
  },
  faqs: [...],
  relatedTours: [...]
};
---

<Layout>
  <!-- Hero Section - Homepage Pattern -->
  <section class="md:h-[640px] h-[742px] relative overflow-hidden">
    <div class="main-container flex items-center justify-center text-center relative z-20 h-full text-white">
      <div>
        <!-- Tour badges -->
        <div class="flex gap-3 justify-center mb-4">
          <Badge text={tourData.hero.duration} variant="warning" />
          <Badge text={tourData.hero.groupSize} variant="success" />
        </div>

        <h1 class="text-h1">{tourData.hero.title}</h1>
        <p class="text-subheading pt-[30px] md:pt-10 pb-[50px] md:pb-[70px]">
          {tourData.hero.subtitle}
        </p>
        <p class="text-body mb-8 max-w-3xl mx-auto">
          {tourData.hero.description}
        </p>

        <div class="flex items-center gap-7 flex-wrap justify-center mb-6">
          <Button
            href="#booking"
            title="Book This Tour"
            buttonType="primary-btn"
          />
          <Button
            href="#itinerary"
            title="View Full Itinerary"
            buttonType="secondary-btn"
          />
        </div>

        <!-- Price display -->
        <PriceTag price={tourData.hero.price} period="per person" size="large" />
      </div>
    </div>
    <img
      src={tourData.hero.backgroundImage}
      alt={tourData.hero.title}
      class="absolute inset-0 object-cover size-full"
    />
  </section>

  <!-- Highlights Section -->
  <Section background="gray">
    <h2 class="text-h2 text-primary text-center mb-12">Tour Highlights</h2>
    <div class="grid md:grid-cols-3 gap-6 md:gap-8">
      {tourData.highlights.map(highlight => (
        <Card title={highlight} />
      ))}
    </div>
  </Section>

  <!-- Itinerary Section -->
  <Section>
    <h2 class="text-h2 text-primary text-center mb-12" id="itinerary">
      What You'll Experience
    </h2>
    <div class="space-y-8 max-w-4xl mx-auto">
      {tourData.itinerary.map((stop, index) => (
        <div class="flex gap-6">
          <!-- Time badge -->
          <div class="flex-shrink-0">
            <Badge text={stop.time} variant="primary" />
          </div>

          <!-- Stop content -->
          <div class="flex-1">
            <h3 class="text-h4 mb-2">{stop.location}</h3>
            <p class="text-h5 text-secondary mb-3">{stop.activity}</p>
            <p class="text-body mb-4">{stop.description}</p>

            {stop.foods && stop.foods.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {stop.foods.map(food => (
                  <Badge text={food} variant="warning" size="small" />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </Section>

  <!-- What's Included/Not Included -->
  <Section background="gray">
    <div class="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
      <!-- Included -->
      <div>
        <h3 class="text-h3 text-primary mb-6">What's Included</h3>
        <ul class="space-y-3">
          {tourData.included.map(item => (
            <li class="flex items-start gap-3">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1">
                <!-- Check icon -->
              </svg>
              <span class="text-body">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <!-- Not Included -->
      <div>
        <h3 class="text-h3 text-secondary mb-6">Not Included</h3>
        <ul class="space-y-3">
          {tourData.notIncluded.map(item => (
            <li class="flex items-start gap-3">
              <svg class="w-6 h-6 text-gray-400 flex-shrink-0 mt-1">
                <!-- X icon -->
              </svg>
              <span class="text-body">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>

  <!-- Meeting Point -->
  <Section>
    <h2 class="text-h2 text-primary text-center mb-12">Meeting Point</h2>
    <div class="max-w-2xl mx-auto">
      <Card
        title={tourData.meetingPoint.name}
        description={tourData.meetingPoint.address}
      >
        <p class="text-body mt-4">{tourData.meetingPoint.instructions}</p>
        <a
          href={tourData.meetingPoint.mapUrl}
          target="_blank"
          class="primary-btn-small mt-6"
        >
          View on Google Maps
        </a>
      </Card>
    </div>
  </Section>

  <!-- Booking Information -->
  <Section background="primary-light">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-h2 text-primary mb-8">Booking Information</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {Object.entries(tourData.bookingInfo).map(([key, value]) => (
          <div>
            <h4 class="text-h5 mb-2 capitalize">{key}</h4>
            <p class="text-body">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>

  <!-- FAQ Section -->
  <Section>
    <!-- Use FAQ component -->
  </Section>

  <!-- Related Tours -->
  <Section background="gray">
    <h2 class="text-h2 text-primary text-center mb-12">You Might Also Like</h2>
    <div class="grid md:grid-cols-3 gap-6 md:gap-8">
      {tourData.relatedTours.map(tour => (
        <Card
          title={tour.title}
          description={tour.description}
          image={tour.image}
          href={tour.url}
        />
      ))}
    </div>
  </Section>

  <!-- Final CTA -->
  <Section>
    <div class="text-center max-w-2xl mx-auto">
      <h2 class="text-h2 text-primary mb-6">Ready to Book?</h2>
      <p class="text-body mb-8">
        Join us for an unforgettable Malaysian food experience
      </p>
      <div class="flex gap-6 justify-center">
        <Button
          href="/contact"
          title="Book This Tour"
          buttonType="primary-btn"
        />
        <Button
          href="https://wa.me/60172878929"
          title="WhatsApp Us"
          buttonType="secondary-btn"
        />
      </div>
    </div>
  </Section>
</Layout>
```

**Tasks**:
- [ ] Create complete template structure
- [ ] Use homepage hero pattern
- [ ] Apply all design system components
- [ ] Create clear itinerary layout
- [ ] Add booking information section
- [ ] Include FAQ section
- [ ] Add related tours section
- [ ] Test fully responsive

**Time Estimate**: 1 day

---

### 6-8. Apply Template to Individual Tour Pages (2 days)

#### 6. Penang Heritage Food Trail (4 hours)
**File**: `src/pages/tours/penang-heritage-food-trail.astro`
**Size**: 31KB

**Tasks**:
- [ ] Copy tour template structure
- [ ] Extract all Penang tour data to `tourData` object
- [ ] Replace content with Penang-specific information
- [ ] Use placeholder images (update later)
- [ ] Test responsive design
- [ ] Verify design system compliance 100%

---

#### 7. Melaka Cultural Food Journey (4 hours)
**File**: `src/pages/tours/melaka-cultural-food-journey.astro`
**Size**: 31KB

**Tasks**:
- [ ] Copy tour template structure
- [ ] Extract all Melaka tour data to `tourData` object
- [ ] Replace content with Melaka-specific information
- [ ] Use placeholder images
- [ ] Test responsive design
- [ ] Verify design system compliance 100%

---

#### 8. Secrets of Kuala Lumpur (4 hours)
**File**: `src/pages/tours/secrets-of-kuala-lumpur.astro`
**Size**: 31KB

**Tasks**:
- [ ] Copy tour template structure
- [ ] Extract all Secrets of KL tour data to `tourData` object
- [ ] Replace content with tour-specific information
- [ ] Use placeholder images
- [ ] Test responsive design
- [ ] Verify design system compliance 100%

---

### 9. Tours Index/Listing Page (4 hours)
**File**: `src/pages/tours/index.astro`

**Tasks**:
- [ ] Apply homepage hero pattern
- [ ] Create tours grid using Card component
- [ ] Add filters/categories (dietary, location, time)
- [ ] Use PriceTag component for pricing
- [ ] Use Badge component for tour features
- [ ] Apply design system spacing and typography
- [ ] Test responsive grid layout

**Template Structure**:
```astro
<!-- Hero -->
<section class="md:h-[640px] h-[742px] relative overflow-hidden">
  <!-- Homepage pattern -->
</section>

<!-- Tour Categories Filter -->
<Section>
  <div class="flex flex-wrap gap-4 justify-center mb-12">
    <button class="tab-primary-btn">All Tours</button>
    <button class="tab-secondary-btn">Street Food</button>
    <button class="tab-secondary-btn">Heritage Tours</button>
    <button class="tab-secondary-btn">Vegetarian</button>
  </div>
</Section>

<!-- Tours Grid -->
<Section background="gray">
  <div class="grid md:grid-cols-3 gap-6 md:gap-8">
    {tours.map(tour => (
      <Card
        title={tour.title}
        description={tour.description}
        image={tour.image}
        href={`/tours/${tour.slug}`}
        badge={tour.featured ? "Featured" : null}
      >
        <div class="mt-4 flex items-center justify-between">
          <PriceTag price={tour.price} period="per person" />
          <Badge text={tour.duration} variant="warning" size="small" />
        </div>
      </Card>
    ))}
  </div>
</Section>
```

---

## 📄 TIER 3: SUPPORTING PAGES (Week 2-3)

### 10. About Page (4 hours)
**File**: `src/pages/about.astro`
**Status**: Structure ready, awaiting content

**Tasks**:
- [ ] Complete Strapi content population (or hardcode for now)
- [ ] Apply homepage hero pattern
- [ ] Use ContentBlock component for story sections
- [ ] Apply design system to all sections
- [ ] Add team photos/bios if available
- [ ] Include values/mission section
- [ ] Add CTA to book tour
- [ ] Test responsive design

---

### 11. Thank You Pages Template (1 day)

#### Create Single Thank You Template (4 hours)
**Purpose**: Reusable template for all thank you variations

**Template Structure**:
```astro
---
interface ThankYouProps {
  type: 'booking' | 'contact' | 'inquiry';
  tour?: string;
  nextSteps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  relatedContent?: Array<any>;
}

const thankYouData = {
  booking: {
    headline: "Your Booking is Confirmed!",
    message: "Get ready for an amazing Malaysian food experience",
    nextSteps: [...]
  },
  contact: {
    headline: "Message Received!",
    message: "We'll get back to you within 24 hours",
    nextSteps: [...]
  },
  inquiry: {
    headline: "Thanks for Your Interest!",
    message: "Check your email for tour details",
    nextSteps: [...]
  }
};
---

<Layout>
  <!-- Success Message Section -->
  <Section>
    <div class="text-center max-w-2xl mx-auto">
      <!-- Success icon -->
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-600"><!-- Check icon --></svg>
      </div>

      <h1 class="text-h1 text-primary mb-4">{headline}</h1>
      <p class="text-subheading mb-8">{message}</p>
    </div>
  </Section>

  <!-- Next Steps -->
  <Section background="gray">
    <h2 class="text-h2 text-center mb-12">What Happens Next</h2>
    <div class="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
      {nextSteps.map((step, index) => (
        <Card>
          <div class="text-5xl mb-4">{index + 1}</div>
          <h3 class="text-h4 mb-3">{step.title}</h3>
          <p class="text-body">{step.description}</p>
        </Card>
      ))}
    </div>
  </Section>

  <!-- Related Content / Tours -->
  {relatedContent && (
    <Section>
      <h2 class="text-h2 text-center mb-12">Explore More</h2>
      <div class="grid md:grid-cols-3 gap-6 md:gap-8">
        {relatedContent.map(content => (
          <Card {...content} />
        ))}
      </div>
    </Section>
  )}

  <!-- Final CTA -->
  <Section background="primary-light">
    <div class="text-center">
      <h3 class="text-h3 mb-6">Questions?</h3>
      <p class="text-body mb-8">We're here to help!</p>
      <Button
        href="https://wa.me/60172878929"
        title="Chat on WhatsApp"
        buttonType="primary-btn"
      />
    </div>
  </Section>
</Layout>
```

#### Apply to All 6 Thank You Pages (2 hours)
- [ ] thank-you-booking.astro
- [ ] thank-you-booking-kuala-lumpur.astro
- [ ] thank-you-booking-penang.astro
- [ ] thank-you-contact.astro
- [ ] thank-you-inquiry.astro
- [ ] thank-you.astro

---

## 📚 TIER 4: DOCUMENTATION (Week 3)

### 12. Component Showcase Page (4 hours)
**File**: `src/pages/components-showcase.astro`
**Purpose**: Visual reference of all components

```astro
<Layout>
  <Section>
    <h1 class="text-h1 text-center mb-12">Design System Components</h1>
  </Section>

  <!-- Typography Section -->
  <Section background="gray">
    <h2 class="text-h2 mb-8">Typography</h2>
    <h1 class="text-h1">Heading 1 - Main Page Titles</h1>
    <h2 class="text-h2">Heading 2 - Section Titles</h2>
    <h3 class="text-h3">Heading 3 - Subsection Titles</h3>
    <h4 class="text-h4">Heading 4 - Card Titles</h4>
    <h5 class="text-h5">Heading 5 - Small Headings</h5>
    <h6 class="text-h6">Heading 6 - Labels</h6>
    <p class="text-subheading">Subheading - Lead Paragraphs</p>
    <p class="text-body">Body Text - Regular Paragraphs</p>
  </Section>

  <!-- Colors Section -->
  <Section>
    <h2 class="text-h2 mb-8">Brand Colors</h2>
    <div class="grid grid-cols-3 gap-6">
      <div>
        <div class="h-32 bg-primary rounded-lg mb-4"></div>
        <p class="text-body font-semibold">Primary - Maroon</p>
        <code class="text-sm">#b52d38</code>
      </div>
      <div>
        <div class="h-32 bg-secondary rounded-lg mb-4"></div>
        <p class="text-body font-semibold">Secondary - Brown</p>
        <code class="text-sm">#885e40</code>
      </div>
      <div>
        <div class="h-32 bg-orange rounded-lg mb-4"></div>
        <p class="text-body font-semibold">Accent - Yellow</p>
        <code class="text-sm">#ffa333</code>
      </div>
    </div>
  </Section>

  <!-- Buttons Section -->
  <Section background="gray">
    <h2 class="text-h2 mb-8">Buttons</h2>
    <div class="flex flex-wrap gap-4">
      <a class="primary-btn">Primary Button</a>
      <a class="secondary-btn">Secondary Button</a>
      <a class="primary-btn-small">Primary Small</a>
      <a class="secondary-btn-small">Secondary Small</a>
      <button class="tab-primary-btn">Tab Active</button>
      <button class="tab-secondary-btn">Tab Inactive</button>
    </div>
  </Section>

  <!-- Components Section -->
  <Section>
    <h2 class="text-h2 mb-8">Components</h2>

    <!-- Cards -->
    <h3 class="text-h3 mb-6">Cards</h3>
    <div class="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
      <Card
        title="Basic Card"
        description="Simple card with title and description"
      />
      <Card
        title="Card with Image"
        description="Card with image and content"
        image="/images/placeholder.jpg"
      />
      <Card
        title="Card with Badge"
        description="Card with badge indicator"
        badge="Featured"
      />
    </div>

    <!-- Badges -->
    <h3 class="text-h3 mb-6">Badges</h3>
    <div class="flex flex-wrap gap-4 mb-12">
      <Badge text="Primary Badge" variant="primary" />
      <Badge text="Secondary Badge" variant="secondary" />
      <Badge text="Success Badge" variant="success" />
      <Badge text="Warning Badge" variant="warning" />
      <Badge text="Small Badge" size="small" />
    </div>

    <!-- Price Tags -->
    <h3 class="text-h3 mb-6">Price Tags</h3>
    <div class="flex gap-8 mb-12">
      <PriceTag price="RM 285" period="per person" size="small" />
      <PriceTag price="RM 285" period="per person" size="medium" />
      <PriceTag price="RM 285" period="per person" size="large" />
    </div>
  </Section>

  <!-- Spacing Section -->
  <Section background="gray">
    <h2 class="text-h2 mb-8">Spacing System</h2>
    <div class="space-y-4">
      <div class="bg-white p-4 rounded">
        <code>py-16 md:py-20</code> - Section Padding
      </div>
      <div class="bg-white p-4 rounded">
        <code>gap-6 md:gap-8</code> - Card Grids
      </div>
      <div class="bg-white p-4 rounded">
        <code>gap-4 md:gap-6</code> - Content Spacing
      </div>
      <div class="bg-white p-4 rounded">
        <code>main-container</code> - Content Wrapper (max-w-7xl with padding)
      </div>
    </div>
  </Section>
</Layout>
```

---

### 13. Developer Handoff Documentation (1 day)

#### Create 3 Documentation Files:

**A. DEVELOPER_STRAPI_GUIDE.md** (4 hours)
- How pages are structured (data at top, components below)
- Component to Strapi mapping
- Data structure examples for each content type
- Design system rules to preserve
- Step-by-step conversion guide

**B. COMPONENT_USAGE_GUIDE.md** (2 hours)
- How to use each component
- Props and variants
- Code examples
- When to use which component

**C. DESIGN_SYSTEM_RULES.md** (1 hour)
- Typography rules
- Color usage
- Spacing system
- Button styles
- Do's and don'ts

---

## 📊 PROGRESS TRACKING

### Completion Percentage by Week:

**End of Week 1** (Tier 1 Complete):
- [ ] Homepage: Verified
- [ ] KL Food Tour: Refactored
- [ ] Vegetarian Tours: Refactored
- [ ] Contact: Verified
- [ ] 5 Components Created
- **Progress: ~35% complete**

**End of Week 2** (Tier 1-2 Complete):
- [ ] All Tier 1 pages done
- [ ] Tour template created
- [ ] 3 tour pages refactored
- [ ] Tours index refactored
- [ ] About page complete
- [ ] Thank you pages complete
- **Progress: ~75% complete**

**End of Week 3** (All Complete):
- [ ] All pages refactored
- [ ] All responsive testing done
- [ ] Component showcase created
- [ ] Developer documentation complete
- **Progress: 100% complete**

---

## ✅ DEFINITION OF DONE (Per Page)

A page is complete when:

### Design
- [ ] Uses homepage hero pattern (if hero needed)
- [ ] All headings use `.text-h1` through `.text-h6`
- [ ] All body text uses `.text-body`
- [ ] All buttons use design system classes
- [ ] Spacing uses design system (py-16 md:py-20, etc.)
- [ ] Colors use brand utilities
- [ ] No custom Tailwind outside design system
- [ ] No arbitrary values (e.g., py-[37px])

### Code Quality
- [ ] Data separated at top of file
- [ ] Uses existing components where possible
- [ ] Clean, readable code
- [ ] TypeScript interfaces for data
- [ ] Clear comments for complex sections
- [ ] Obvious Strapi integration points

### Responsive
- [ ] Tested on mobile (375px, 414px)
- [ ] Tested on tablet (768px, 1024px)
- [ ] Tested on desktop (1366px, 1920px)
- [ ] Touch targets 44px minimum
- [ ] All content readable at all sizes
- [ ] No horizontal scroll

### Functionality
- [ ] All links work
- [ ] All buttons work
- [ ] All interactions smooth
- [ ] No console errors
- [ ] Images load (placeholder OK)

---

## 🎯 SUCCESS METRICS

### Design System Compliance:
- Current: 24% (7/29 pages)
- Target: 100%

### Component Reuse:
- Current: Low (pages reinvent components)
- Target: 100% (use existing components)

### Code Quality:
- Current: Mixed (some good, some custom)
- Target: All pages follow same pattern

### Developer Readiness:
- Current: Medium (needs structure)
- Target: Excellent (clear patterns, full docs)

---

## 📅 ESTIMATED TIMELINE

### Week 1: Foundation + Critical Pages
- **Monday**: Create 5 components + Homepage verification (6 hours)
- **Tuesday-Wednesday**: KL Food Tour refactor (2 days)
- **Thursday**: Vegetarian page refactor (1 day)
- **Friday**: Contact page + testing (3 hours)

### Week 2: Tour Pages + Supporting
- **Monday**: Tour template creation (1 day)
- **Tuesday**: Penang + Melaka tour pages (1 day)
- **Wednesday**: Secrets of KL + Tours index (1 day)
- **Thursday**: About page (4 hours)
- **Friday**: Thank you pages (4 hours)

### Week 3: Polish + Documentation
- **Monday-Tuesday**: Responsive testing all pages (2 days)
- **Wednesday**: Component showcase page (4 hours)
- **Thursday-Friday**: Developer documentation (1.5 days)

**Total Time**: ~15 working days (3 weeks)

---

## 🚀 READY TO START

**First Task**: Create 5 missing design system components
**Files to Create**:
1. `src/components/Design/Section.astro`
2. `src/components/Design/Card.astro`
3. `src/components/Design/ContentBlock.astro`
4. `src/components/Design/PriceTag.astro`
5. `src/components/Design/Badge.astro`

**Estimated Time**: 4-6 hours

Would you like me to start creating these components now?
