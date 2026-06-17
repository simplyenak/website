# Complete Directus Architecture

**Created:** 2026-03-30  
**Status:** Planning  
**Instances:** 3 (Staging CMS, Production CMS, DAM)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         STAGING CMS                               │
├──────────────────────────────────────────────────────────────────┤
│  Domain:     cms-staging.simplyenak.com                          │
│  Website:    staging.simplyenak.com                              │
│  Purpose:    Test website content before publishing             │
│  Users:      Pauline, Maarten, Dev team                          │
│  Collections: tours, faqs, testimonials, stories, vendors       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                      Sync when ready
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                        PRODUCTION CMS                             │
├──────────────────────────────────────────────────────────────────┤
│  Domain:     cms.simplyenak.com                                  │
│  Website:    simplyenak.com                                      │
│  Purpose:    Live website content, real bookings                │
│  Users:      Pauline, Maarten                                    │
│  Collections: tours, faqs, testimonials, stories, vendors       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                      Static build
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     Cloudflare Pages                              │
├──────────────────────────────────────────────────────────────────┤
│  Domain:     simplyenak.com                                      │
│  Content:    Static HTML/CSS/JS                                  │
│  Images:     From CDN (Scaleway S3 + Cloudflare)                │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                          DAM (SEPARATE)                           │
├──────────────────────────────────────────────────────────────────┤
│  Domain:     dam.simplyenak.com                                  │
│  Purpose:    Central asset library                               │
│  Users:      Marketing, agencies, Pauline, Maarten               │
│  Collections: social_media, brand_assets, marketing, logos      │
│  CDN:        cdn.simplyenak.com                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Complete Domain List

| Instance | Domain | Purpose | Users |
|----------|--------|---------|-------|
| **Staging CMS** | `cms-staging.simplyenak.com` | Test website content | Pauline, Maarten, Dev |
| **Production CMS** | `cms.simplyenak.com` | Live website content | Pauline, Maarten |
| **DAM** | `dam.simplyenak.com` | All assets (social, brand, marketing) | Marketing, agencies, team |
| **Website Staging** | `staging.simplyenak.com` | Preview staging content | Pauline, Maarten, clients |
| **Website Production** | `simplyenak.com` | Live website | Public |
| **CDN** | `cdn.simplyenak.com` | Image/assets CDN | All sites |

---

## 🔄 Content Flow

### **Website Content (Tours, FAQs, etc.)**

```
Staging CMS (cms-staging.simplyenak.com)
    ↓
Test & Preview (staging.simplyenak.com)
    ↓
Review & Approve
    ↓
Sync to Production
    ↓
Production CMS (cms.simplyenak.com)
    ↓
Build & Deploy
    ↓
Live Site (simplyenak.com)
```

### **Assets (Images, Brand, etc.)**

```
DAM (dam.simplyenak.com)
    ↓
Upload & Organize
    ↓
CDN (cdn.simplyenak.com)
    ↓
Used by:
  - Website CMS (tours, stories)
  - Social media posts
  - Marketing materials
  - External agencies
```

---

## 📊 Instance Comparison

| Feature | Staging CMS | Production CMS | DAM |
|---------|-------------|----------------|-----|
| **Domain** | `cms-staging.simplyenak.com` | `cms.simplyenak.com` | `dam.simplyenak.com` |
| **Purpose** | Test content | Live content | Asset management |
| **Collections** | Website structure | Website structure | Asset categories |
| **Users** | Internal team | Internal team | Marketing + agencies |
| **Sync** | Source | Destination | Independent |
| **Builds** | Triggers staging build | Triggers production build | No builds |

---

## 🎯 Why 3 Instances?

### **Staging CMS + Production CMS**
- ✅ Test content before publishing
- ✅ Safe preview for clients
- ✅ No risk of breaking live site
- ✅ Easy rollback (just don't sync)

### **Separate DAM**
- ✅ Centralized asset library
- ✅ Used by multiple teams (not just website)
- ✅ External agencies can access without seeing website CMS
- ✅ Optimized for asset management (tags, transformations, etc.)
- ✅ Independent scaling (assets grow faster than content)

---

## 🔧 DNS Records Needed

```dns
# Production CMS
CNAME  cms  →  [your server/Dokploy]

# Staging CMS
CNAME  cms-staging  →  [your server/Dokploy]

# DAM
CNAME  dam  →  [your server/Dokploy]

# CDN (if not already set up)
CNAME  cdn  →  [Scaleway S3 endpoint or Cloudflare]
```

---

## 📋 Setup Checklist

### **Staging CMS (`cms-staging.simplyenak.com`)**
- [ ] Add DNS record
- [ ] Configure Directus `PUBLIC_URL`
- [ ] Set CORS for `staging.simplyenak.com`
- [ ] Bootstrap schema (tours, FAQs, etc.)
- [ ] Test content creation

### **Production CMS (`cms.simplyenak.com`)**
- [ ] Add DNS record
- [ ] Configure Directus `PUBLIC_URL`
- [ ] Set CORS for `simplyenak.com`
- [ ] Bootstrap schema (empty, ready for sync)
- [ ] Test access

### **DAM (`dam.simplyenak.com`)**
- [ ] Add DNS record
- [ ] Configure Directus `PUBLIC_URL`
- [ ] Set up asset collections
- [ ] Configure CDN integration
- [ ] Set user permissions (marketing, agencies)
- [ ] Test upload/download

---

## 🔄 Ongoing Workflows

### **Website Content Update**
1. Login to `cms-staging.simplyenak.com`
2. Create/edit tour, FAQ, story, etc.
3. Preview on `staging.simplyenak.com`
4. Review with team
5. Sync to `cms.simplyenak.com`
6. Deploy production frontend
7. Verify on `simplyenak.com`

### **Asset Upload**
1. Login to `dam.simplyenak.com`
2. Upload to appropriate collection
3. Add tags, metadata, alt text
4. CDN URL auto-generated
5. Share URL with team/agencies
6. Use in website CMS (paste CDN URL)

### **Social Media Campaign**
1. Login to `dam.simplyenak.com`
2. Download assets from brand collection
3. Create social posts
4. Publish to social platforms
5. No website CMS involvement needed

---

## 💰 Hosting Costs

| Instance | Monthly Cost | Notes |
|----------|--------------|-------|
| Staging CMS | $X | Your server |
| Production CMS | $X | Your server |
| DAM | $X | Your server |
| **Total** | **3X** | All on same server |

**If merged (CMS only):**
| Instance | Monthly Cost | Notes |
|----------|--------------|-------|
| Unified CMS | $X | Your server |
| DAM | $X | Your server |
| **Total** | **2X** | 33% savings |

**But:** You lose staging environment benefits

---

## 🔐 Access Control

### **Staging CMS**
```
Role: Admin (Pauline, Maarten)
  - All collections: Read/Write

Role: Editor (Dev team)
  - All collections: Read/Write
  - No user management
```

### **Production CMS**
```
Role: Admin (Pauline, Maarten)
  - All collections: Read/Write

Role: Viewer (Optional)
  - All collections: Read-Only
```

### **DAM**
```
Role: Admin (Pauline, Maarten)
  - All collections: Read/Write

Role: Marketing
  - Asset collections: Read/Write
  - No user management

Role: External Agency
  - Asset collections: Read-Only
  - Can download, not upload
```

---

## 📊 Collections by Instance

### **Staging & Production CMS**
```
📁 Website Content
├── tours
├── tour_translations
├── faqs
├── faq_translations
├── testimonials
├── testimonial_translations
├── stories
├── story_translations
├── vendors
├── site_settings
└── authors
```

### **DAM**
```
📁 Assets
├── social_media_assets
├── brand_assets
├── marketing_materials
├── logos
├── templates
├── general_photos
├── video_assets
└── press_coverage
```

---

## ⚠️ Important Notes

### **Image Handling**
- Website CMS stores **references** to images (CDN URLs)
- DAM stores **actual image files**
- When syncing website content, image URLs stay the same
- Both CMS instances use same DAM for images

### **Sync Strategy**
- Sync **website content** from Staging → Production CMS
- **DAM is independent** — no sync needed
- DAM assets immediately available to both CMS instances

### **Backup Strategy**
- Backup all 3 instances separately
- DAM backups more frequent (assets are irreplaceable)
- Website CMS backups before each sync

---

## 📝 Next Steps

1. **Add DNS records** for all 3 domains
2. **Configure each Directus instance** with correct URLs
3. **Bootstrap schemas** for Staging & Production CMS
4. **Set up DAM collections** for assets
5. **Configure CDN** for DAM assets
6. **Test workflows** end-to-end
7. **Document access** for team/agencies

---

**Architecture Owner:** Maarten  
**Estimated Setup Time:** 3-4 hours total  
**Instances:** 3 (Staging CMS, Production CMS, DAM)  
**Domains:** 6 total (3 Directus + 2 websites + 1 CDN)  

---

*Complete Directus Architecture v1.0 — Simply Enak*
