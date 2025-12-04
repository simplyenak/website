# CLAUDE.md - Simply Enak Website Optimization Project

## 🎯 Project Overview

Premium Malaysian tour operator website with full-stack architecture:
- **Frontend**: Astro 5 + React/Vue + TailwindCSS 4 on Cloudflare Pages
- **Backend**: Strapi 5 + PostgreSQL + AWS S3 headless CMS
- **Business Focus**: Direct booking conversion, CTR optimization, brand storytelling

## 🏗️ Technical Architecture

### Frontend (frontend/)
- **Framework**: Astro 5 with multi-framework support
- **Styling**: TailwindCSS 4 with Vite plugin
- **Components**: Mixed React (interactive) and Vue (presentational)
- **Deployment**: Cloudflare Pages with edge functions
- **API Integration**: Custom `fetchApi()` utility for Strapi communication

### Backend (backend/)
- **CMS**: Strapi 5 with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Storage**: AWS S3 for media files
- **API**: Auto-generated REST endpoints with population queries
- **Admin**: Custom React-based admin interface

## 🚀 Development Workflows

### Environment Setup
```bash
# Frontend development
cd frontend && npm run dev    # Port 4321

# Backend development  
cd backend && npm run develop  # Port 1337
```

### Key Commands
- **Build**: `npm run build` (both frontend and backend)
- **Preview**: `npm run preview` (frontend only)
- **Deploy**: CI/CD via GitHub workflows
- **Console**: `npm run console` (Strapi admin)

## 🎨 Brand Guidelines

### Brand Archetype: "The Passionate Friend"
- **Success Filter**: WELCOMED, FASCINATED, CONNECTED
- **Voice**: Warm, knowledgeable, enthusiastic
- **Content Pillars**: Tailored Experiences, Malaysia's Beauty, Sustainable Impact
- **Core Principle**: "Show, don't tell" friendship through actions

### Design System
- **Color Palette**: Malaysian heritage inspired
- **Typography**: Cultural heritage meets modern readability
- **Imagery**: Authentic food experiences, local culture
- **Layout**: Mobile-first, responsive design

## 📊 Business Intelligence

### Analytics Integration
- **Google Analytics**: Property ID 262711985
- **Search Console**: SEO performance tracking
- **Conversion Tracking**: Contact form and booking funnels
- **User Behavior**: Page engagement and CTR analysis

### Content Strategy
- **Tours**: 4 core packages (RM 285-359)
- **Destinations**: Kuala Lumpur, Penang, Melaka
- **Specialties**: Vegetarian, cultural, heritage experiences
- **Storytelling**: Local guides, authentic narratives

## 🔧 Technical Patterns

### Strapi Data Fetching
```typescript
const data = await fetchApi<HomePage>({
  endpoint: "home-page",
  query: { populate: "*" }, // Always populate relations
});
```

### Component Architecture
- **Pages**: Astro components with SEO meta tags
- **Sections**: Reusable React components for interactive content
- **Utilities**: TypeScript helpers for media URLs and formatting
- **Types**: Comprehensive interfaces for all content types

### Performance Optimization
- **Islands Architecture**: Selective client-side hydration
- **Image Optimization**: WebP format, lazy loading
- **CDN Integration**: Cloudflare edge caching
- **Database Optimization**: Connection pooling, query optimization

## 🎯 Development Priorities

1. **Conversion Rate Optimization**
   - Improve booking funnel conversion
   - Enhance contact form completion rates
   - Optimize call-to-action placement

2. **SEO Performance**
   - Core Web Vitals optimization
   - Structured data implementation
   - Local search visibility

3. **Content Enhancement**
   - Video integration (YouTube API)
   - Interactive tour maps
   - Customer testimonial showcase

4. **Technical Excellence**
   - TypeScript strict mode completion
   - Automated testing implementation
   - Performance monitoring

## 📱 Responsive Design

- **Mobile First**: Progressive enhancement
- **Tablet**: Adaptive layouts for touch interactions
- **Desktop**: Full-featured experience with rich interactions
- **Performance**: Optimized for all network conditions

## 🔐 Security & Compliance

- **Bot Protection**: Cloudflare Turnstile
- **Data Privacy**: GDPR compliant contact forms
- **API Security**: Environment-based authentication
- **Content Security**: CSP headers, XSS protection

## 🚀 Deployment Strategy

- **Frontend**: Cloudflare Pages with preview deployments
- **Backend**: Docker containerized Strapi with CI/CD
- **Staging**: Automated testing environments
- **Production**: Zero-downtime deployments

---
*This project represents Simply Enak's digital presence, combining technical excellence with authentic Malaysian hospitality storytelling.*