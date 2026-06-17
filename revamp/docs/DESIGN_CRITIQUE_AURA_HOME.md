# Design Critique — Aura Home Reference

**Created:** 2026-03-30  
**Reference:** Aura Home (HTML provided)  
**Status:** ✅ Complete analysis  
**Constraint:** No color/font copying — only layout/flow principles

---

## 🎯 What Makes This Design Work

### 1. **Exceptional Visual Hierarchy**

**Pattern:**
```
Eyebrow (10px, tracked out, muted)
    ↓
Headline (4xl-7xl, tight leading, light weight)
    ↓
Body (lg-xl, soft color, relaxed leading)
    ↓
CTAs (Clear primary/secondary)
```

**Why It Works:**
- Each level has **distinct visual weight**
- Eye knows exactly where to go next
- No competition between elements

**Simply Enak Application:**
```astro
<!-- Current -->
<p class="text-[10px] uppercase tracking-[0.2em] text-orange">Our Tours</p>
<h2 class="text-3xl md:text-4xl font-bold">Find the Right Tour for You</h2>

<!-- Improved (Aura-inspired) -->
<p class="font-display font-300 text-xs tracking-[0.3em] text-muted mb-6">DISCOVER YOUR TOUR</p>
<h2 class="font-merriweather font-200 text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
    There's a tour for your<br>
    <span class="text-soft">kind of curious</span>
</h2>
```

---

### 2. **Generous Whitespace**

**Aura's Spacing Scale:**
- Section padding: `py-32 lg:py-48` (128-192px)
- Between sections: `space-y-24 lg:space-y-32` (96-128px)
- Within sections: `gap-12 lg:gap-24` (48-96px)

**Simply Enak Current:**
- Section padding: `py-16 md:py-24` (64-96px)
- Between sections: `space-y-12 md:space-y-16` (48-64px)
- Within sections: `gap-6 md:gap-8` (24-32px)

**Recommendation:**
```astro
<!-- Increase section padding by 50% -->
<section class="py-24 lg:py-36">  <!-- Was py-16 md:py-24 -->

<!-- Increase gap between major sections -->
<div class="space-y-20 lg:space-y-28">  <!-- Was space-y-12 md:space-y-16 -->

<!-- Keep internal spacing as-is (already good) -->
```

---

### 3. **Scroll-Triggered Reveals**

**Aura's Pattern:**
```javascript
// Elements start hidden
.reveal {
  opacity: 0;
  transform: translateY(40px);
}

// Reveal on scroll
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Simply Enak Application:**
```astro
<!-- Add to existing scroll-animate components -->
<style>
  .reveal-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .reveal-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
</style>

<!-- Apply to tour cards -->
<ToursCard class="reveal-up reveal-delay-1" />
<ToursCard class="reveal-up reveal-delay-2" />
<ToursCard class="reveal-up reveal-delay-3" />
```

---

### 4. **Content Grouping (Spec Cards Pattern)**

**Aura's Spec Cards:**
```html
<div class="spec-card">
  <div class="header">
    <h4>Title</h4>
    <p>Subtitle</p>
    <svg>chevron</svg>
  </div>
  <div class="details">
    <!-- Grid of specs -->
  </div>
</div>
```

**Simply Enak Application — Tour Details:**
```astro
<!-- Collapsible tour details -->
<div class="tour-detail-card bg-white rounded-2xl border border-border cursor-pointer">
  <div class="p-6 flex items-center justify-between">
    <div>
      <h4 class="font-merriweather font-semibold text-lg">What's Included</h4>
      <p class="text-muted text-sm mt-1">Everything you need for a great tour</p>
    </div>
    <svg class="w-5 h-5 text-muted transform transition-transform" viewBox="0 0 20 20">
      <path d="M5 8l5 5 5-5"/>
    </svg>
  </div>
  <div class="px-6 pb-6 pt-2 border-t border-border">
    <ul class="space-y-2 mt-4">
      <li class="flex items-center gap-2">
        <svg class="w-5 h-5 text-primary" />
        <span>All food tastings (8-10 dishes)</span>
      </li>
      <li class="flex items-center gap-2">
        <svg class="w-5 h-5 text-primary" />
        <span>Expert local guide</span>
      </li>
    </ul>
  </div>
</div>
```

---

### 5. **Interactive Elements (Subtle, Not Distracting)**

**Aura's Approach:**
- Room glow follows cursor (opacity transition)
- Spec cards expand on click (max-height transition)
- Scroll progress bar (2px, top of page)
- Mode indicator updates based on scroll

**Simply Enak Applications:**

#### A. Scroll Progress Bar (P2)
```astro
<!-- Add to Layout.astro -->
<div class="scroll-progress fixed top-0 left-0 h-0.5 bg-primary z-50" style="width: 0%" />

<script>
  window.addEventListener('scroll', () => {
    const progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.querySelector('.scroll-progress').style.width = `${progress}%`;
  });
</script>
```

#### B. Back to Top Button (P2)
```astro
<button 
  id="backToTop"
  class="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full opacity-0 pointer-events-none transition-opacity hover:bg-primary/90"
  onclick="window.scrollTo({top: 0, behavior: 'smooth'})"
>
  <svg class="w-5 h-5" viewBox="0 0 20 20">
    <path d="M5 8l5-5 5 5"/>
  </svg>
</button>

<script>
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 500) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
    }
  });
</script>
```

---

### 6. **Typography Hierarchy**

**Aura's Scale:**
```
H1: 5xl-8xl (48-96px), leading-[0.95], tracking-[-0.02em]
H2: 4xl-6xl (36-60px), leading-[1.1], tracking-[-0.02em]
H3: 3xl-4xl (28-36px), leading-[1.1]
H4: lg-xl (18-20px), font-300
Body: lg (18px), leading-relaxed
Small: sm-xs (14-12px), tracking-[0.1-0.3em]
```

**Simply Enak Current:**
```
H1: 3xl-5xl (30-48px), leading-tight
H2: 2xl-4xl (24-36px), leading-tight
H3: xl-3xl (20-28px), leading-tight
Body: base (16px), leading-relaxed
Small: sm (14px), tracking-wide
```

**Recommendation (Keep Your Fonts, Adjust Scale):**
```css
/* In global CSS */
.text-h1 {
  @apply font-merriweather font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.01em];
}

.text-h2 {
  @apply font-merriweather font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.1];
}

.text-h3 {
  @apply font-merriweather font-semibold text-2xl md:text-4xl leading-[1.15];
}

.text-body {
  @apply font-pt-sans text-lg leading-relaxed; /* Increased from 16px to 18px */
}

.text-eyebrow {
  @apply font-sans font-300 text-xs tracking-[0.3em] text-muted;
}
```

---

### 7. **Navigation Pattern**

**Aura's Nav:**
```
Fixed position with backdrop-blur
Logo left, nav links center, CTA right
h-16 lg:h-20 (64-80px height)
Gap-10 between links (40px)
Hover: soft color → fg color
```

**Simply Enak Current:**
```
Fixed position
Logo left, nav links center
Similar structure ✅
```

**Recommendation:**
- ✅ Keep current structure (already good)
- Consider: Add backdrop-blur for scroll depth
- Consider: Increase link spacing slightly (gap-8 → gap-10)

---

### 8. **Section Flow Patterns**

**Aura's Section Types:**

#### Type A: Two-Column (Text + Visual)
```
Grid: lg:grid-cols-2 gap-16 lg:gap-24
Content vertically centered
Visual: aspect-[4/5] or aspect-[16/9]
```

**Simply Enak Application (Tour Pages):**
```astro
<section class="py-24 lg:py-36">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <!-- Text -->
      <div class="reveal-up">
        <p class="text-eyebrow mb-6">TOUR HIGHLIGHTS</p>
        <h2 class="text-h2 mb-8">
          Discover flavors that<br>
          <span class="text-soft">tell a story</span>
        </h2>
        <p class="text-body text-muted leading-relaxed mb-6">
          Every dish has a history. Every vendor has a story.
        </p>
      </div>
      
      <!-- Visual -->
      <div class="reveal-up reveal-delay-2">
        <div class="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-accent to-accent-warm">
          <img src={tourImage} alt={tourName} class="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Type B: Centered Content
```
Max-w-3xl mx-auto
Text center
Staggered reveals
```

**Simply Enak Application (FAQ, About):**
```astro
<section class="py-24 lg:py-36">
  <div class="max-w-3xl mx-auto px-6 lg:px-12">
    <div class="text-center mb-16 reveal-up">
      <p class="text-eyebrow mb-6">QUESTIONS</p>
      <h2 class="text-h2 mb-8">
        We hear these<br>
        <span class="text-soft">often</span>
      </h2>
    </div>
    
    <!-- FAQ items -->
    <div class="space-y-4">
      <FAQItem class="reveal-up reveal-delay-1" />
      <FAQItem class="reveal-up reveal-delay-2" />
      <FAQItem class="reveal-up reveal-delay-3" />
    </div>
  </div>
</section>
```

#### Type C: Alternating Grid (Scenarios)
```
Space-y-24 lg:space-y-32
Alternating: Text-Visual / Visual-Text
Flow line SVG between
```

**Simply Enak Application (Tour Itinerary):**
```astro
<section class="py-24 lg:py-36 bg-cream">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="text-center mb-20 reveal-up">
      <p class="text-eyebrow mb-6">YOUR JOURNEY</p>
      <h2 class="text-h2">A day of flavors</h2>
    </div>
    
    <div class="space-y-24 lg:space-y-32">
      <!-- Stop 1 -->
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative">
        <!-- SVG flow line (decorative) -->
        <svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-64 hidden lg:block">
          <path class="flow-line" d="M64 0V100Q64 128 40 140T16 180V256" stroke="var(--halo)" stroke-width="2"/>
        </svg>
        
        <!-- Image -->
        <div class="reveal-up">
          <div class="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={stop1Image} alt={stop1Name} />
          </div>
        </div>
        
        <!-- Content -->
        <div class="lg:pl-8 reveal-up reveal-delay-2">
          <p class="text-eyebrow mb-4">STOP 1</p>
          <h3 class="text-h3 mb-6">{stop1Name}</h3>
          <p class="text-body text-muted">{stop1Description}</p>
        </div>
      </div>
      
      <!-- Stop 2 (reverse) -->
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative">
        <!-- Content (right on desktop) -->
        <div class="lg:order-2 reveal-up">
          <div class="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={stop2Image} alt={stop2Name} />
          </div>
        </div>
        
        <!-- Image (left on desktop) -->
        <div class="lg:order-1 lg:pr-8 reveal-up reveal-delay-2">
          <p class="text-eyebrow mb-4">STOP 2</p>
          <h3 class="text-h3 mb-6">{stop2Name}</h3>
          <p class="text-body text-muted">{stop2Description}</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 9. **Button Styles**

**Aura's Buttons:**
```
Primary: bg-fg text-bg, rounded-full, px-8 py-4
Hover: bg slides up from bottom
Secondary: border border-border, hover:border-fg
Font: font-display, text-sm, tracking-[0.1em]
```

**Simply Enak Current:**
```
Primary: bg-primary text-white, rounded, px-6 py-3
Secondary: border border-primary, hover:bg-primary
```

**Recommendation (Keep Your Colors, Improve Style):**
```css
/* Primary button */
.cta-primary {
  @apply font-sans font-medium text-sm tracking-[0.1em] px-8 py-4 bg-primary text-white rounded-full;
  position: relative;
  overflow: hidden;
}

.cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary-dark);
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-primary:hover::before {
  transform: translateY(0);
}

/* Secondary button */
.cta-secondary {
  @apply font-sans font-medium text-sm tracking-[0.1em] px-8 py-4 border border-border rounded-full;
  @apply hover:border-primary transition-colors;
}
```

---

### 10. **Footer Pattern**

**Aura's Footer:**
```
py-16 (64px)
Grid: md:grid-cols-4 gap-12
Logo + tagline in first column
Link columns with eyebrow + links
Border top, copyright + legal below
```

**Simply Enak Application:**
```astro
<footer class="py-16 bg-cream">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="grid md:grid-cols-4 gap-12">
      <!-- Brand -->
      <div>
        <p class="font-sans font-bold text-lg tracking-[0.2em] mb-4">SIMPLY ENAK</p>
        <p class="text-muted text-sm">Come as a guest, leave as family.</p>
      </div>
      
      <!-- Tours -->
      <div>
        <p class="font-sans font-300 text-xs tracking-[0.2em] text-muted mb-4">TOURS</p>
        <div class="space-y-3 text-sm">
          <a href="/tours/" class="block text-muted hover:text-fg transition-colors">All Tours</a>
          <a href="/tours/locations/kuala-lumpur/" class="block text-muted hover:text-fg transition-colors">Kuala Lumpur</a>
          <a href="/tours/locations/penang/" class="block text-muted hover:text-fg transition-colors">Penang</a>
        </div>
      </div>
      
      <!-- Dietary -->
      <div>
        <p class="font-sans font-300 text-xs tracking-[0.2em] text-muted mb-4">DIETARY</p>
        <div class="space-y-3 text-sm">
          <a href="/tours/dietary/vegetarian/" class="block text-muted hover:text-fg transition-colors">Vegetarian</a>
          <a href="/tours/dietary/halal/" class="block text-muted hover:text-fg transition-colors">Halal</a>
          <a href="/tours/dietary/gluten-free/" class="block text-muted hover:text-fg transition-colors">Gluten-Free</a>
        </div>
      </div>
      
      <!-- Company -->
      <div>
        <p class="font-sans font-300 text-xs tracking-[0.2em] text-muted mb-4">COMPANY</p>
        <div class="space-y-3 text-sm">
          <a href="/about/" class="block text-muted hover:text-fg transition-colors">About</a>
          <a href="/contact/" class="block text-muted hover:text-fg transition-colors">Contact</a>
          <a href="/media/" class="block text-muted hover:text-fg transition-colors">Press</a>
        </div>
      </div>
    </div>
    
    <!-- Bottom bar -->
    <div class="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-muted">© Simply Enak. All rights reserved.</p>
      <div class="flex gap-6 text-xs text-muted">
        <a href="/privacy-policy/" class="hover:text-fg transition-colors">Privacy</a>
        <a href="/terms-conditions/" class="hover:text-fg transition-colors">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

---

## 📋 Priority Recommendations

### P0 — Quick Wins (This Week)

| Change | File | Impact | Time |
|--------|------|--------|------|
| Increase section padding | All pages | Better breathing room | 1 hour |
| Add reveal animations | Component library | More polished feel | 2 hours |
| Improve typography scale | Global CSS | Better hierarchy | 1 hour |
| Add eyebrow text to sections | All pages | Clearer context | 2 hours |

### P1 — Medium Effort (Next 2 Weeks)

| Change | File | Impact | Time |
|--------|------|--------|------|
| Collapsible spec cards | Tour pages | Better info organization | 3 hours |
| Alternating itinerary layout | Tour pages | Better visual flow | 3 hours |
| Improved button hover | Global | More polished interactions | 1 hour |
| Footer redesign | Layout component | Better organization | 2 hours |

### P2 — Nice to Have (Post-Launch)

| Change | File | Impact | Time |
|--------|------|--------|------|
| Scroll progress bar | Layout | Subtle polish | 1 hour |
| Back to top button | Layout | UX improvement | 1 hour |
| Interactive room glow | Homepage | "Wow" factor | 4 hours |
| Canvas dust particles | Hero sections | Atmospheric | 3 hours |

---

## 🎯 What NOT to Copy

**Aura's design is for a premium tech product ($5,000+ home systems).**

**Simply Enak is for accessible food experiences (RM 285-359 tours).**

**Don't Copy:**
- ❌ Ultra-minimal aesthetic (too cold for food)
- ❌ Abstract visuals (food needs to be shown)
- ❌ Complex animations (distracts from booking)
- ❌ Muted color palette (food should be vibrant)
- ❌ Tech-focused language (keep it warm, human)

**Do Adapt:**
- ✅ Spacing and hierarchy principles
- ✅ Reveal animation patterns
- ✅ Content organization patterns
- ✅ Button/interaction polish
- ✅ Typography scale (with your fonts)

---

## 📝 Implementation Checklist

### Before Launch

- [ ] Increase section padding (py-16 → py-24)
- [ ] Add reveal animations to components
- [ ] Update typography scale in global CSS
- [ ] Add eyebrow text to all major sections
- [ ] Improve button hover states

### Within 2 Weeks

- [ ] Implement collapsible spec cards for tour details
- [ ] Redesign itinerary with alternating layout
- [ ] Redesign footer with 4-column layout
- [ ] Add scroll progress indicator

### Post-Launch

- [ ] Add back to top button
- [ ] Consider subtle canvas animations for hero
- [ ] A/B test new vs. old layouts

---

**Document Created:** 2026-03-30  
**Based on:** Aura Home HTML reference  
**Constraint:** No color/font copying — layout/flow principles only  
**Status:** ✅ Ready for implementation  

---

*Design Critique — Aura Home Reference v1.0 — Simply Enak*
*Based on: Provided HTML code, design best practices, Simply Enak brand guidelines*
