# Directus Architecture — Corrected

**Created:** 2026-03-30  
**Status:** Final (Corrected)  
**Instances:** 1 (Single Directus for both environments)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│              DIRECTUS (Single Instance)                           │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      cms.system.simplyenak.com                          │
│  Content:     All content + ALL images/assets                    │
│  Serves:      Both production and staging websites               │
└──────────────────────────────────────────────────────────────────┘
                          ↓
            ┌─────────────┴─────────────┐
            ↓                           ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   PRODUCTION WEBSITE     │  │    STAGING WEBSITE       │
│   simplyenak.com         │  │   staging.simplyenak.com │
│   (Cloudflare Pages)     │  │   (Cloudflare Pages)     │
└──────────────────────────┘  └──────────────────────────┘
```

---

## 🌐 Domain List

| Environment | Website | Directus CMS | Purpose |
|-------------|---------|--------------|---------|
| **Production** | simplyenak.com | `cms.system.simplyenak.com` | Live site |
| **Staging** | staging.simplyenak.com | `cms.system.simplyenak.com` | Testing (same instance) |
| **Local Dev** | localhost:4321 | localhost:8055 | Development |

**Key Point:** Single Directus instance serves both production and staging websites.

---

## 🔄 How It Works

### **Content Workflow**

```
1. Create/edit content in Directus (cms.system.simplyenak.com)
   ↓
2. Content is immediately available to both websites
   ↓
3. Test on staging.simplyenak.com
   ↓
4. When ready, deploy production frontend
   ↓
5. Production site (simplyenak.com) shows new content
```

### **Why This Works**

- **Static sites:** Both production and staging are static builds
- **Build-time fetch:** Content is fetched at build time, not runtime
- **Same content:** Both sites use same Directus instance
- **Different builds:** Production and staging can have different versions deployed

---

## 📊 Collections in Directus

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
- Builds static site from Directus content
- Deploys to simplyenak.com

### **Staging (`revamp` project)**

**Environment Variables:**
```
PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com
```

**Deploy:**
- Automatic on push to `main` branch
- Builds static site from Directus content
- Deploys to staging.simplyenak.com

---

## 📋 Setup Checklist

### **Directus (cms.system.simplyenak.com)**
- [ ] Verify all collections exist
- [ ] Verify all content is present
- [ ] Verify all images are uploaded
- [ ] Set up admin users (Pauline, Maarten)
- [ ] Create API tokens for scripts

### **Cloudflare Pages (Production)**
- [ ] Set `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Configure manual deploy (no auto-deploy)
- [ ] Test build
- [ ] Deploy to simplyenak.com

### **Cloudflare Pages (Staging)**
- [ ] Set `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Configure auto-deploy on push to `main`
- [ ] Test build
- [ ] Deploy to staging.simplyenak.com

### **Forms Worker**
- [ ] Set `DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Deploy worker
- [ ] Test form submissions

---

## ✅ Benefits of This Setup

| Benefit | Impact |
|---------|--------|
| **Simple architecture** | 1 Directus instance, easy to manage |
| **No migration needed** | Content is already in one place |
| **No sync complexity** | Both sites use same content source |
| **Clear naming** | `cms.system` = Directus instance |
| **Test before production deploy** | Staging site for testing |
| **Manual production deploys** | Full control over when to go live |

---

## 🔐 Access Control

### **Directus Admin**
```
URL: https://cms.system.simplyenak.com/admin
Email: admin@simplyenak.com
Password: admin123 (change this!)
```

### **Recommended User Setup**
1. **Change admin password** (from default)
2. **Create user accounts:**
   - Pauline (Admin role)
   - Maarten (Admin role)
3. **Create API tokens:**
   - For scripts (read-only)
   - For forms worker (read site_settings)

---

## 📝 Next Steps

1. **Login to Directus:**
   - URL: `https://cms.system.simplyenak.com/admin`
   - Email: `admin@simplyenak.com`
   - Password: `admin123`

2. **Verify content:**
   - All tours present
   - All images uploaded
   - All translations complete

3. **Update Cloudflare Pages:**
   - Production: `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
   - Staging: Same URL

4. **Deploy:**
   - Test staging build
   - Test production build
   - Verify both sites work

---

## ⚠️ Important Notes

### **No Migration Needed**

Since there's only one Directus instance, there's no migration needed. All content is already in `cms.system.simplyenak.com`.

### **Production vs. Staging**

The difference between production and staging is:
- **Same Directus:** Both use `cms.system.simplyenak.com`
- **Different builds:** Production is manually deployed, staging is auto-deployed
- **Different domains:** simplyenak.com vs. staging.simplyenak.com

### **Content Updates**

When you update content in Directus:
1. **Staging:** Auto-deploys on next push to `main`
2. **Production:** Manually trigger deploy when ready

---

**Architecture Owner:** Maarten  
**Instances:** 1 (cms.system.simplyenak.com)  
**Domains:** 3 total (1 Directus + 2 websites)  

---

*Directus Architecture — Corrected v2.0 — Simply Enak*
*Single Directus instance serving both environments*
