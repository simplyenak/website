# Design Prototype Plan
**Purpose**: Create design-perfect hardcoded pages that serve as templates for Strapi integration
**Timeline**: 2-3 weeks focused design work
**Date**: October 27, 2025

---

## 🎯 CLARIFIED OBJECTIVE

### Current Phase: Design Prototyping
You are creating **design templates** with hardcoded content.
The developer will later convert these to Strapi CMS templates.

### Focus Areas:
1. ✅ **Visual design perfection**
2. ✅ **Design system consistency**
3. ✅ **Component reusability**
4. ✅ **Responsive design**
5. ✅ **Clear patterns for developer to follow**

### NOT Focus Right Now:
- ❌ CMS integration (developer handles later)
- ❌ Production images (placeholders are fine)
- ❌ Backend architecture decisions
- ❌ Content management workflows

---

## 🏗️ DESIGN PROTOTYPING APPROACH

### Your Role: Design Reference Implementation
Create pages that show:
- How components should look
- How spacing should work
- How colors should be used
- How typography should scale
- How interactions should feel

### Developer's Role (Later): Template Creation
Will convert your pages to:
- Dynamic Strapi components
- CMS-editable content blocks
- Flexible template system
- Content type definitions

---

## 📐 CURRENT STATE ANALYSIS

### What's Working:
✅ **Component library exists** (51 components)
- `LandingPage/Hero.astro` - Professional hero sections
- `LandingPage/FAQ.astro` - Accordion FAQs
- `LandingPage/TrustBar.astro` - Social proof
- `LandingPage/SignatureDishes.astro` - Product showcase
- Full component set ready to use

✅ **Design system defined**
- Colors: primary (#b52d38), secondary (#885e40), accent (#ffa333)
- Typography: `.text-h1` through `.text-h6`, `.text-body`, `.text-subheading`
- Buttons: `.primary-btn`, `.secondary-btn`, `.primary-btn-small`
- Spacing: Consistent utility classes

### What's Broken:
❌ **Pages not using components**
- KL Tour page: Custom HTML instead of `LandingPage/Hero`
- Vegetarian page: Reinventing components
- Tour pages: Inconsistent patterns

❌ **Design system violations**
- Custom Tailwind classes instead of design system utilities
- Inconsistent spacing (py-16 vs py-20 vs custom)
- Typography not using `.text-h*` classes
- Buttons with custom styles

❌ **Pattern inconsistency**
- Each page solves the same problem differently
- No clear template for developer to follow
- Hard to maintain visual consistency

---

## 🎨 DESIGN SYSTEM ENFORCEMENT

### Core Principle:
**Every page should be an example of design system usage for the developer.**

### Component Usage Rules:

#### 1. Hero Sections
**Always use**: `components/LandingPage/Hero.astro`

```astro
---
import Hero from '@/components/LandingPage/Hero.astro';
---

<Hero
  title="Your Main Headline"
  subtitle="EYEBROW TEXT"
  description="Compelling description text"
  ctaText="Book Your Tour"
  ctaUrl="/contact"
  backgroundImage="/images/hero-bg.jpg"
  trustSignals={{
    reviewCount: 500,
    rating: 5.0,
    tripadvisorRanking: 1,
    certificateOfExcellence: true
  }}
/>
```

**Don't**: Create custom hero HTML in each page

---

#### 2. FAQ Sections
**Always use**: `components/LandingPage/FAQ.astro`

```astro
---
import FAQ from '@/components/LandingPage/FAQ.astro';

const faqs = [
  {
    question: "What's included in the tour?",
    answer: "All food tastings, expert guide, and transportation between stops."
  },
  // ... more FAQs
];
---

<FAQ faqs={faqs} />
```

**Don't**: Manually code accordion markup

---

#### 3. Typography
**Always use design system classes**:

```astro
<h1 class="text-h1">Main Heading</h1>
<h2 class="text-h2">Section Heading</h2>
<h3 class="text-h3">Subsection Heading</h3>
<p class="text-body">Body text content</p>
<p class="text-subheading">Lead paragraph or subtitle</p>
```

**Don't use**:
```astro
<!-- ❌ WRONG -->
<h1 class="text-4xl md:text-5xl font-bold text-gray-900">
<h2 class="text-3xl md:text-4xl font-semibold">
```

---

#### 4. Buttons
**Always use design system buttons**:

```astro
<a href="/contact" class="primary-btn">Book Now</a>
<a href="/tours" class="secondary-btn">View Tours</a>
<a href="/about" class="primary-btn-small">Learn More</a>
```

**Don't create custom button styles**:
```astro
<!-- ❌ WRONG -->
<a class="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg">
```

---

#### 5. Spacing
**Use design system spacing**:

```astro
<!-- Section padding -->
<section class="py-16 md:py-20">

  <!-- Content container -->
  <div class="main-container">

    <!-- Card grid -->
    <div class="grid md:grid-cols-3 gap-6 md:gap-8">
      <!-- Cards -->
    </div>
  </div>
</section>
```

**Standard spacing values**:
- Section padding: `py-16 md:py-20`
- Container: `main-container` (max-w-7xl with responsive padding)
- Card gaps: `gap-6 md:gap-8`
- Content gaps: `gap-4 md:gap-6`

---

#### 6. Colors
**Use brand color utilities**:

```astro
<!-- Text colors -->
<h2 class="text-primary">Heading in brand maroon</h2>
<p class="text-secondary">Supporting text in brown</p>
<span class="text-orange">Accent highlights in yellow</span>

<!-- Backgrounds -->
<div class="bg-primary/10">Light maroon background</div>
<div class="bg-secondary/5">Very light brown background</div>

<!-- Borders -->
<div class="border border-primary">Maroon border</div>
```

**Brand colors**:
- Primary: `#b52d38` (maroon) - Main actions, headlines
- Secondary: `#885e40` (brown) - Supporting elements
- Accent: `#ffa333` (yellow/orange) - Highlights, CTAs

---

## 📋 PAGE-BY-PAGE DESIGN CHECKLIST

### For Each Page You Create:

#### Visual Design ✓
- [ ] Uses `LandingPage/Hero` component (if hero needed)
- [ ] All headings use `.text-h1` through `.text-h6`
- [ ] Body text uses `.text-body`
- [ ] All buttons use design system button classes
- [ ] Spacing follows design system (py-16 md:py-20 for sections)
- [ ] Colors use brand utilities (text-primary, text-secondary, etc.)
- [ ] No arbitrary spacing values (e.g., py-[37px])
- [ ] No custom color values outside design system

#### Component Usage ✓
- [ ] Reuses existing components from `components/` directory
- [ ] Doesn't reinvent hero sections
- [ ] Doesn't reinvent FAQ accordions
- [ ] Doesn't reinvent card layouts
- [ ] Follows established patterns from working pages

#### Responsive Design ✓
- [ ] Tested on mobile (375px, 414px)
- [ ] Tested on tablet (768px, 1024px)
- [ ] Tested on desktop (1366px, 1920px)
- [ ] Touch targets 44px minimum
- [ ] Text readable at all sizes
- [ ] Images scale properly
- [ ] Navigation works on mobile

#### Code Quality ✓
- [ ] Clean, readable code
- [ ] Proper TypeScript interfaces for data
- [ ] Comments explaining complex sections
- [ ] Clear data structures for developer to templatize
- [ ] No hardcoded values that should be CMS fields

---

## 🚀 IMPLEMENTATION PRIORITY

### Week 1: Core Pages (Foundation)

#### Day 1: Homepage Polish
**Status**: Already mostly good (uses Strapi components)
**Tasks**:
- [ ] Verify all sections use design system
- [ ] Check responsive design
- [ ] Ensure consistent spacing
- [ ] Test on multiple devices

**Time**: 2-3 hours

---

#### Day 2-3: KL Tour Page Refactor
**Status**: NEEDS MAJOR WORK (biggest design violator)
**Current issues**:
- Custom hero instead of `LandingPage/Hero`
- Custom spacing throughout
- Inconsistent button styles
- Custom color values

**Refactor plan**:
```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/LandingPage/Hero.astro';
import FAQ from '@/components/LandingPage/FAQ.astro';
import SignatureDishes from '@/components/LandingPage/SignatureDishes.astro';
import TrustBar from '@/components/LandingPage/TrustBar.astro';
import ToursGrid from '@/components/LandingPage/ToursGrid.astro';

// All data in structured format for developer to templatize
const pageData = {
  hero: {
    title: "Kuala Lumpur's Ultimate Food Experience",
    subtitle: "GUIDED FOOD TOURS",
    description: "...",
    // ... hero data
  },
  dishes: [
    { name: "Nasi Lemak", description: "...", image: "..." },
    // ... more dishes
  ],
  faqs: [
    { question: "...", answer: "..." },
    // ... more FAQs
  ],
  tours: [
    { title: "...", price: "RM 285", duration: "4 hours" },
    // ... more tours
  ]
};
---

<Layout>
  <Hero {...pageData.hero} />
  <SignatureDishes dishes={pageData.dishes} />
  <TrustBar />
  <ToursGrid tours={pageData.tours} />
  <FAQ faqs={pageData.faqs} />
</Layout>
```

**Time**: 1 full day

---

#### Day 4-5: Vegetarian Page Refactor
**Status**: Good content, needs componentization
**Tasks**:
- [ ] Use `LandingPage/Hero` for hero section
- [ ] Extract cultural origins to reusable component
- [ ] Use FAQ component
- [ ] Apply consistent spacing
- [ ] Use design system typography

**Time**: 1 day

---

### Week 2: Tour Pages

#### Day 1: Tour Page Template
**Create**: Single reusable template structure
**Components needed**:
- Tour hero with booking widget
- "What's Included" section
- Itinerary timeline component
- Pricing table
- FAQ section
- Related tours carousel

**File**: `src/pages/tours/[template-example].astro`

**Time**: 1 day

---

#### Day 2-3: Apply Template to All Tours
**Tours to refactor**:
- [ ] Penang Heritage Food Trail
- [ ] Melaka Cultural Food Journey
- [ ] Secrets of Kuala Lumpur
- [ ] Any other tour pages

**Process**:
1. Copy template structure
2. Replace with tour-specific data
3. Adjust images
4. Test responsive design

**Time**: 2 days

---

#### Day 4-5: Thank You Pages
**Pages**: 6 variations
- thank-you-booking.astro
- thank-you-booking-kuala-lumpur.astro
- thank-you-booking-penang.astro
- thank-you-contact.astro
- thank-you-inquiry.astro
- thank-you.astro

**Tasks**:
- [ ] Create single thank-you component
- [ ] Add next steps section
- [ ] Add related content links
- [ ] Conversion tracking verification

**Time**: 1 day

---

### Week 3: Polish & Documentation

#### Day 1-2: Responsive Testing
- [ ] Test all pages on iPhone (Safari)
- [ ] Test all pages on Android (Chrome)
- [ ] Test all pages on iPad
- [ ] Test all pages on desktop (multiple sizes)
- [ ] Fix any responsive issues

**Time**: 2 days

---

#### Day 3-4: Design Consistency Audit
- [ ] Verify all pages use design system classes
- [ ] Check spacing consistency
- [ ] Verify color usage
- [ ] Check typography hierarchy
- [ ] Test all interactions/animations

**Time**: 2 days

---

#### Day 5: Developer Handoff Documentation
**Create**: `DEVELOPER_STRAPI_GUIDE.md`

**Contents**:
```markdown
# Strapi Template Creation Guide

## Page Structure Reference
Each page follows this pattern:
- Data object at top (shows CMS content structure)
- Component imports
- Component usage with props

## Components to Templatize
1. Hero sections → Dynamic hero component
2. FAQ sections → CMS collection
3. Tour grids → Relation to tours collection
4. etc.

## Design System Integration
- All `.text-h*` classes must remain
- All `.primary-btn` styles must remain
- Spacing utilities must not change
- Color utilities must not change

## Data Structure Examples
[Show actual data structures from pages]
```

**Time**: 1 day

---

## 🛠️ MISSING COMPONENTS TO CREATE

### 1. Section Wrapper Component
**File**: `src/components/Design/Section.astro`

```astro
---
interface Props {
  background?: 'white' | 'gray' | 'primary-light';
  spacing?: 'normal' | 'large' | 'small';
}

const { background = 'white', spacing = 'normal' } = Astro.props;

const bgClasses = {
  'white': 'bg-white',
  'gray': 'bg-gray-50',
  'primary-light': 'bg-primary/5'
};

const spacingClasses = {
  'normal': 'py-16 md:py-20',
  'large': 'py-20 md:py-28',
  'small': 'py-12 md:py-16'
};
---

<section class={`${bgClasses[background]} ${spacingClasses[spacing]}`}>
  <div class="main-container">
    <slot />
  </div>
</section>
```

---

### 2. Card Component
**File**: `src/components/Design/Card.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  badge?: string;
}

const { title, description, image, href, badge } = Astro.props;
const Tag = href ? 'a' : 'div';
---

<Tag
  href={href}
  class="group block bg-white rounded-lg overflow-hidden shadow-custom-1 hover:shadow-custom transition-all duration-300"
>
  {image && (
    <div class="aspect-video overflow-hidden">
      <img
        src={image}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  )}

  <div class="p-6">
    {badge && (
      <span class="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-3">
        {badge}
      </span>
    )}

    <h3 class="text-h4 mb-2">{title}</h3>

    {description && (
      <p class="text-body text-gray-600">{description}</p>
    )}
  </div>
</Tag>
```

---

### 3. ContentBlock Component
**File**: `src/components/Design/ContentBlock.astro`

```astro
---
interface Props {
  title: string;
  content: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaUrl?: string;
}

const {
  title,
  content,
  image,
  imagePosition = 'right',
  ctaText,
  ctaUrl
} = Astro.props;

const flexOrder = imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row';
---

<div class={`flex flex-col ${flexOrder} gap-8 md:gap-12 items-center`}>
  <!-- Text Content -->
  <div class="flex-1">
    <h2 class="text-h2 text-primary mb-4">{title}</h2>
    <p class="text-body mb-6">{content}</p>

    {ctaText && ctaUrl && (
      <a href={ctaUrl} class="primary-btn">
        {ctaText}
      </a>
    )}
  </div>

  <!-- Image -->
  {image && (
    <div class="flex-1">
      <img
        src={image}
        alt={title}
        class="w-full rounded-lg shadow-custom"
      />
    </div>
  )}
</div>
```

---

### 4. PriceTag Component
**File**: `src/components/Design/PriceTag.astro`

```astro
---
interface Props {
  price: string; // e.g., "RM 285"
  period?: string; // e.g., "per person"
  size?: 'small' | 'medium' | 'large';
}

const { price, period, size = 'medium' } = Astro.props;

const sizeClasses = {
  'small': 'text-xl',
  'medium': 'text-2xl md:text-3xl',
  'large': 'text-3xl md:text-4xl'
};
---

<div class="inline-flex flex-col items-start">
  <span class={`font-bold text-primary ${sizeClasses[size]}`}>
    {price}
  </span>
  {period && (
    <span class="text-sm text-gray-600">
      {period}
    </span>
  )}
</div>
```

---

### 5. Badge Component
**File**: `src/components/Design/Badge.astro`

```astro
---
interface Props {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'small' | 'medium';
}

const { text, variant = 'primary', size = 'medium' } = Astro.props;

const variantClasses = {
  'primary': 'bg-primary/10 text-primary',
  'secondary': 'bg-secondary/10 text-secondary',
  'success': 'bg-green-100 text-green-700',
  'warning': 'bg-orange/20 text-orange'
};

const sizeClasses = {
  'small': 'px-2 py-1 text-xs',
  'medium': 'px-3 py-1.5 text-sm'
};
---

<span class={`inline-block font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
  {text}
</span>
```

---

## 📚 DEVELOPER HANDOFF PREPARATION

### What to Document:

#### 1. Component Mapping Document
**File**: `STRAPI_COMPONENT_MAPPING.md`

```markdown
# Component to Strapi Mapping

## Hero Sections
Current: `<Hero title="..." subtitle="..." />`
Strapi: Dynamic zone with Hero component
Fields: title (text), subtitle (text), description (richtext), backgroundImage (media), trustSignals (component)

## FAQ Sections
Current: `<FAQ faqs={[...]} />`
Strapi: Relation to FAQ collection
Collection: question (text), answer (richtext), category (enum)

## Tour Grids
Current: `<ToursGrid tours={[...]} />`
Strapi: Relation to Tours collection
Collection: title, description, price, duration, location, featuredImage
```

---

#### 2. Data Structure Examples
**File**: `DATA_STRUCTURES.md`

Show the exact data structures you're using:
```typescript
const tourData = {
  title: "KL Street Food Tour",
  price: "RM 285",
  duration: "4 hours",
  description: "...",
  includes: [
    "8-10 food tastings",
    "Expert local guide",
    "Small group (max 8 people)"
  ],
  itinerary: [
    {
      time: "9:00 AM",
      activity: "Meet at Pasar Seni",
      description: "..."
    }
  ]
};
```

---

#### 3. Design System Do's and Don'ts
**File**: `DESIGN_SYSTEM_RULES.md`

Clear rules for developer:
```markdown
## Typography
✅ DO: Use .text-h1 through .text-h6
❌ DON'T: Create custom heading styles

## Spacing
✅ DO: Use py-16 md:py-20 for sections
❌ DON'T: Use arbitrary values like py-[37px]

## Colors
✅ DO: Use text-primary, bg-primary/10
❌ DON'T: Use custom color values
```

---

## ✅ DEFINITION OF DONE

### A Page is "Design Complete" When:

1. **Visual Design** ✓
   - Looks professional
   - Follows brand guidelines
   - Uses design system consistently
   - Responsive on all devices

2. **Code Quality** ✓
   - Uses existing components
   - Clean, readable code
   - Proper data structures
   - TypeScript interfaces
   - Clear comments

3. **Developer Ready** ✓
   - Clear data separation from markup
   - Obvious CMS integration points
   - Consistent patterns
   - Well documented

4. **Tested** ✓
   - Works on mobile
   - Works on tablet
   - Works on desktop
   - All interactions work
   - No console errors

---

## 🎯 SUCCESS METRICS

### Design System Compliance: Target 100%
- Current: 24% (7/29 pages)
- Week 1 goal: 50% (core pages)
- Week 2 goal: 85% (tour pages done)
- Week 3 goal: 100% (all pages)

### Component Reuse: Target 100%
- No custom heroes (use LandingPage/Hero)
- No custom FAQs (use LandingPage/FAQ)
- No custom buttons (use design system)
- No custom spacing (use utilities)

### Developer Readiness: Target 100%
- Clear data structures
- Consistent patterns
- Full documentation
- Migration guide complete

---

## 🚀 NEXT STEPS

### This Week:
1. **Monday**: Create missing components (Section, Card, ContentBlock, PriceTag, Badge) - 4 hours
2. **Tuesday-Wednesday**: Refactor KL Tour page using components - 1.5 days
3. **Thursday-Friday**: Refactor Vegetarian page - 1 day

### Next Week:
4. Create tour page template
5. Apply to all tour pages
6. Refactor thank you pages

### Week After:
7. Responsive testing
8. Design consistency audit
9. Developer documentation

---

**Your goal**: Create beautiful, consistent hardcoded pages that the developer can easily convert to Strapi templates.

**Focus on**: Design system compliance, component reuse, clear patterns, great documentation.

**Don't worry about**: CMS integration (developer handles), production images (placeholders fine), backend architecture.

---

**Ready to start? I recommend beginning with creating the 5 missing components this week.**
