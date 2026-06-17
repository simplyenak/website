# 🎯 Payload CMS Plugins - Complete Guide

**Date**: April 2, 2026  
**Status**: ✅ **3 PLUGINS INSTALLED & CONFIGURED**

---

## ✅ Installed Plugins

### 1. SEO Plugin (@payloadcms/plugin-seo)

**Location in Admin**: SEO tab on supported collections

**What it does:**
- Adds complete SEO meta fields
- Open Graph tags for social media
- Twitter Card support
- Preview how pages look on Google/social media

**Enhanced Collections:**
- 🚌 Tours
- 📰 Stories  
- 🌱 Dietary Landing Pages
- ⭐ Specialty Landing Pages
- ✈️ Travel Type Landing Pages
- 📍 Location Landing Pages

**Fields Added:**
```
SEO Tab:
├── Meta Title
├── Meta Description
├── Social Preview Image
├── Open Graph Settings
│   ├── OG Title
│   ├── OG Description
│   └── OG Image
├── Twitter Card Settings
│   ├── Twitter Title
│   ├── Twitter Description
│   └── Twitter Image
└── Advanced
    ├── Canonical URL
    ├── No Index
    └── No Follow
```

---

### 2. Nested Docs Plugin (@payloadcms/plugin-nested-docs)

**Location in Admin**: Parent field on Pages

**What it does:**
- Hierarchical page organization
- Parent/child relationships
- Auto-generated breadcrumbs
- Clean URL structures

**Enhanced Collections:**
- 📄 About Page
- 📄 Contact Page

**Fields Added:**
```
├── Parent (dropdown to select parent page)
├── Breadcrumbs (auto-generated)
├── Full Path (auto-generated URL)
└── Path Depth (hierarchy level)
```

**Example Structure:**
```
Home
├── About
│   ├── Our Story
│   └── Our Team
└── Contact
    └── Partners
```

---

### 3. Redirects Plugin (@payloadcms/plugin-redirects)

**Location in Admin**: ⚙️ Settings & Config → Redirects

**What it does:**
- Manage 301/302 redirects
- Fix broken links
- Preserve SEO value
- Handle URL changes

**New Collection:**
- **Redirects** (under Settings & Config group)

**Fields:**
```
├── From (old URL path)
├── To (destination)
│   ├── Type: Reference or Custom URL
│   └── Reference: Select page/collection
└── Status Code
    ├── 301 (Permanent)
    └── 302 (Temporary)
```

**List View Shows:**
- From
- To
- Status Code
- Updated At

---

## 📋 How to Use Each Plugin

### Using SEO Plugin

**Step 1**: Go to Content → Tours (or Stories, Landing Pages)

**Step 2**: Edit or create a tour

**Step 3**: Click **SEO** tab

**Step 4**: Fill in the fields:
```
Meta Title: Flavours of Malaysia Food Tour | Simply Enak
Meta Description: 4-hour food tour through Chinatown KL. 
                  8-10 authentic dishes, small groups.
Social Preview Image: Upload 1200x630px image
```

**Step 5**: See live preview of how it looks on Google/Facebook/Twitter

**Step 6**: Save

---

### Using Redirects Plugin

**Scenario**: You renamed a tour URL from `/old-name` to `/new-name`

**Step 1**: Go to ⚙️ Settings & Config → Redirects

**Step 2**: Click **Create New Redirect**

**Step 3**: Fill in:
```
From: /tours/old-name
To: 
  - Type: Reference
  - Collection: Tours
  - Document: Select "New Tour Name"
Status Code: 301 (Permanent)
```

**Step 4**: Save

**Result**: Anyone visiting `/tours/old-name` is automatically redirected to the new tour!

---

### Using Nested Docs Plugin

**Scenario**: Create "Our Team" page under "About"

**Step 1**: Go to Pages → About Page

**Step 2**: Create New (child page)

**Step 3**: Fill in:
```
Parent: About Page
Title: Our Team
Content: Add team member bios
```

**Step 4**: Save

**Result**: 
- URL: `/about/our-team`
- Breadcrumbs auto-generated: Home > About > Our Team

---

## 🎨 Admin Navigation

Your admin now has these sections:

```
📁 Content
├── 🚌 Tours (with SEO tab)
├── 📰 Stories (with SEO tab)
├── ⭐ Testimonials
├── 📰 Media Coverage
├── ❓ FAQs
└── 🖼️ Media

🎯 Landing Pages
├── 🌱 Dietary Landing Pages (with SEO tab)
├── ⭐ Specialty Landing Pages (with SEO tab)
├── ✈️ Travel Type Landing Pages (with SEO tab)
└── 📍 Location Landing Pages (with SEO tab)

📄 Pages
├── 📄 About Page (with parent/child)
└── 📄 Contact Page (with parent/child)

⚙️ Settings & Config
├── 👤 Users
├── ⚙️ Site Settings
└── 🔄 Redirects ⭐ NEW
```

---

## 📊 Benefits for Simply Enak

### SEO Plugin Benefits
✅ Better Google rankings with optimized meta tags  
✅ Rich snippets in search results  
✅ Beautiful social media previews when sharing tours  
✅ Control which pages are indexed  
✅ Open Graph images for Facebook/LinkedIn shares  

### Redirects Plugin Benefits
✅ No broken links when content moves or URLs change  
✅ Preserve SEO value from old URLs  
✅ Easy migration of legacy URLs  
✅ Fix typos in URLs  
✅ Handle seasonal tour changes  

### Nested Docs Plugin Benefits
✅ Organize pages hierarchically  
✅ Automatic breadcrumb navigation  
✅ Clean, logical URL structures  
✅ Easy to find related pages  

---

## 🔧 Testing Your Plugins

### Test SEO Plugin

1. Go to **Content** → **Tours**
2. Edit "Flavours of Malaysia"
3. Click **SEO** tab
4. Fill in meta title and description
5. Upload an OG image
6. Save
7. Visit the tour on the frontend (when connected)
8. View page source - see meta tags!

### Test Redirects Plugin

1. Go to **Settings & Config** → **Redirects**
2. Create New
3. From: `/test-redirect`
4. To: Reference → Tours → Any tour
5. Status: 301
6. Save
7. Visit `/test-redirect` on frontend - should redirect!

### Test Nested Docs Plugin

1. Go to **Pages** → **About Page**
2. Create New
3. Select Parent: "About Page"
4. Title: "Test Child Page"
5. Save
6. Check the path - should be `/about/test-child-page`

---

## 🚀 Next Steps

### Recommended Actions

1. **Add SEO to all tours** (30 min)
   - Go through each tour
   - Add compelling meta titles/descriptions
   - Upload OG images

2. **Set up common redirects** (15 min)
   - List any old URLs that need redirecting
   - Create redirects for each

3. **Organize pages hierarchically** (10 min)
   - Decide page structure
   - Set parent/child relationships

### Optional Enhancements

4. **Install Form Builder Plugin**
   - Create contact forms
   - Booking inquiry forms
   - Custom lead capture

5. **Install Search Plugin**
   - Better content search in admin
   - Frontend search functionality

---

## 📚 Plugin Resources

**Official Documentation:**
- [SEO Plugin](https://payloadcms.com/docs/plugins/seo)
- [Nested Docs Plugin](https://payloadcms.com/docs/plugins/nested-docs)
- [Redirects Plugin](https://payloadcms.com/docs/plugins/redirects)

**Best Practices:**
- Meta titles: 50-60 characters
- Meta descriptions: 150-160 characters
- OG images: 1200x630px (1.91:1 ratio)
- Use 301 for permanent moves, 302 for temporary
- Test redirects before deploying to production

---

## ✅ Verification Checklist

- [ ] Admin panel loads without errors
- [ ] SEO tab appears on Tours
- [ ] SEO tab appears on Stories
- [ ] SEO tab appears on Landing Pages
- [ ] Redirects appears under Settings & Config
- [ ] Can create a new redirect
- [ ] Parent field appears on Pages
- [ ] All plugins working together

---

**Installed by**: Qwen Code Assistant  
**Date**: 2026-04-02  
**For**: Simply Enak CMS Team
