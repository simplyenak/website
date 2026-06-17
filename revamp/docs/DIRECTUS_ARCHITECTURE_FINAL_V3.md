# Directus Architecture — Final (Two Instances)

**Created:** 2026-03-30  
**Status:** Final  
**Instances:** 2 (Production + Staging)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   PRODUCTION DIRECTUS                             │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      cms.system.simplyenak.com                          │
│  Content:     All live content + ALL images/assets               │
│  Serves:      Production website (simplyenak.com)                │
└──────────────────────────────────────────────────────────────────┘
                          ↓
                  Static Build
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│              PRODUCTION WEBSITE (Cloudflare Pages)                │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      simplyenak.com                                     │
│  Content:     Static HTML/CSS/JS                                 │
│  Images:      From cms.system.simplyenak.com                     │
└──────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                    STAGING DIRECTUS                               │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      cms-staging.system.simplyenak.com                  │
│  Content:     Test content + test images                         │
│  Serves:      Staging website (staging.simplyenak.com)           │
└──────────────────────────────────────────────────────────────────┘
                          ↓
                  Static Build
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│               STAGING WEBSITE (Cloudflare Pages)                  │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      staging.simplyenak.com                             │
│  Content:     Static HTML/CSS/JS                                 │
│  Images:      From cms-staging.system.simplyenak.com             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Domain List

| Environment | Website | Directus CMS | Purpose |
|-------------|---------|--------------|---------|
| **Production** | simplyenak.com | `cms.system.simplyenak.com` | Live site |
| **Staging** | staging.simplyenak.com | `cms-staging.system.simplyenak.com` | Testing |
| **Local Dev** | localhost:4321 | localhost:8055 | Development |

**Naming Convention:**
- Production: `cms.system.simplyenak.com` (live content)
- Staging: `cms-staging.system.simplyenak.com` (test content)

---

## 🔄 Workflow

### **Content Creation**
```
1. Create/edit content in Staging Directus
   (cms-staging.system.simplyenak.com)
   ↓
2. Test on staging.simplyenak.com
   ↓
3. Review with team
   ↓
4. When ready, sync to Production Directus
   (cms.system.simplyenak.com)
   ↓
5. Deploy production frontend
   ↓
6. Verify on simplyenak.com
```

---

## 📊 Collections (In Both Instances)

### **Content Collections**
- `tours` — Tour information
- `tour_translations` — Tour translations (9 languages)
- `faqs` — FAQ content
- `faq_translations` — FAQ translations
- `testimonials` — Customer reviews
- `testimonial_translations` — Testimonial translations
- `stories` — Blog/story content
- `story_translations` — Story translations
- `vendors` — Vendor information
- `site_settings` — Global site settings
- `authors` — Blog post authors

### **Asset Collections**
- `files` — Directus default (all uploads)
  - Images (tour photos, vendor photos, blog heroes)
  - Documents (PDFs, brochures)
  - Videos (embedded or uploaded)

---

## 🔧 Cloudflare Pages Configuration

### **Production (`website` project)**

**Environment Variables:**
```
PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com
```

**Deploy:**
- Manual trigger (not automatic)
- Builds from production Directus
- Deploys to simplyenak.com

### **Staging (`revamp` project)**

**Environment Variables:**
```
PUBLIC_DIRECTUS_URL=https://cms-staging.system.simplyenak.com
```

**Deploy:**
- Automatic on push to `main` branch
- Builds from staging Directus
- Deploys to staging.simplyenak.com

---

## 📋 Setup Checklist

### **Production Directus (`cms.system.simplyenak.com`)**
- [ ] Verify all collections exist
- [ ] Verify all content is present
- [ ] Verify all images are uploaded
- [ ] Set up admin users (Pauline, Maarten)
- [ ] Create API tokens for scripts

### **Staging Directus (`cms-staging.system.simplyenak.com`)**
- [ ] Verify all collections exist
- [ ] Set up admin users
- [ ] Create API tokens for testing
- [ ] Test content creation

### **Cloudflare Pages (Production)**
- [ ] Set `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Configure manual deploy
- [ ] Test build
- [ ] Deploy to simplyenak.com

### **Cloudflare Pages (Staging)**
- [ ] Set `PUBLIC_DIRECTUS_URL=https://cms-staging.system.simplyenak.com`
- [ ] Configure auto-deploy on push to `main`
- [ ] Test build
- [ ] Deploy to staging.simplyenak.com

### **Forms Worker**
- [ ] Set `DIRECTUS_URL=https://cms.system.simplyenak.com` (production)
- [ ] Deploy worker
- [ ] Test form submissions

---

## 🔄 Content Sync (Staging → Production)

### **Option 1: Manual Export/Import**
1. Export collections from staging Directus
2. Import to production Directus
3. Verify content

### **Option 2: Script (When Ready)**
```bash
# Migration script (to be created)
STAGING_URL=https://cms-staging.system.simplyenak.com \
STAGING_TOKEN=<token> \
PROD_URL=https://cms.system.simplyenak.com \
PROD_TOKEN=<token> \
node scripts/sync-staging-to-production.js
```

---

## 🔐 Access Control

### **Production Directus**
```
URL: https://cms.system.simplyenak.com/admin
Email: admin@simplyenak.com
Password: admin123 (change this!)

Role: Admin (Pauline, Maarten)
  - All collections: Read/Write
  - User management: Yes
```

### **Staging Directus**
```
URL: https://cms-staging.system.simplyenak.com/admin
Email: admin@simplyenak.com
Password: admin123

Role: Admin (Pauline, Maarten)
  - All collections: Read/Write
  - User management: Yes

Role: Editor (Dev team)
  - All collections: Read/Write
  - User management: No
```

---

## ✅ Benefits of This Setup

| Benefit | Impact |
|---------|--------|
| **Two separate instances** | Production content protected |
| **Test before publish** | No mistakes on live site |
| **Clear naming** | `cms.system` = prod, `cms-staging.system` = staging |
| **Safe experimentation** | Try new content structures in staging |
| **Easy rollback** | Just don't sync to production |
| **Independent scaling** | Each instance can scale independently |

---

## 📝 Next Steps

1. **Verify both Directus instances:**
   - Production: `https://cms.system.simplyenak.com/admin`
   - Staging: `https://cms-staging.system.simplyenak.com/admin`
   - Login: `admin@simplyenak.com` / `admin123`

2. **Set up Cloudflare Pages:**
   - Production: `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
   - Staging: `PUBLIC_DIRECTUS_URL=https://cms-staging.system.simplyenak.com`

3. **Test workflow:**
   - Create test content in staging
   - Verify on staging.simplyenak.com
   - Sync to production (manual for now)
   - Deploy production
   - Verify on simplyenak.com

---

## ⚠️ Important Notes

### **DNS Records Needed**

```dns
# Production Directus
CNAME  cms.system  →  [your server/Dokploy]

# Staging Directus
CNAME  cms-staging.system  →  [your server/Dokploy]
```

### **Content Sync**

Since there are two separate instances, you need to sync content from staging to production when ready. This can be:
- Manual export/import via Directus admin
- Automated script (to be created)

### **Images**

Images uploaded to staging stay in staging. When syncing content to production, you need to:
- Copy images from staging to production
- Or re-upload images in production
- Or use same S3 bucket for both (recommended)

---

**Architecture Owner:** Maarten  
**Instances:** 2 (Production + Staging)  
**Domains:** 5 total (2 Directus + 2 websites + 1 local)  

---

*Directus Architecture — Final (Two Instances) v3.0 — Simply Enak*
*Separate Directus instances for production and staging*
