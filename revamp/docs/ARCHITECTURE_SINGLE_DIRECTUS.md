# Simply Enak — Final Architecture

**Created:** 2026-03-30  
**Status:** Final  
**Architecture:** Single Directus Instance

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│              DIRECTUS (Single Instance)                           │
├──────────────────────────────────────────────────────────────────┤
│  Domain:      cms.system.simplyenak.com                          │
│  Content:     All content + ALL images                           │
│  Storage:     S3 bucket (se-website-images)                      │
│  Serves:      All environments (local, staging, production)      │
└──────────────────────────────────────────────────────────────────┘
                          ↓
            ┌─────────────┴─────────────┐
            ↓                           ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   LOCAL DEVELOPMENT      │  │    STAGING WEBSITE       │
│   localhost:4321         │  │   staging.simplyenak.com │
│   (code changes)         │  │   (auto-deploy)          │
└──────────────────────────┘  └──────────────────────────┘
                          ↓
                  ┌───────────────┐
                  ↓               
┌────────────────────────────────────────────────────────────────┐
│              PRODUCTION WEBSITE                                 │
├────────────────────────────────────────────────────────────────┤
│  Domain:      simplyenak.com                                   │
│  Deploy:      Manual (Cloudflare Dashboard)                    │
│  Content:     From Directus (same as staging)                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Principles

### **1. Single Source of Truth**

**One Directus instance** serves all environments:
- Local development
- Staging website
- Production website

**Benefits:**
- ✅ No content sync needed
- ✅ Images uploaded once, available everywhere
- ✅ No divergence between environments
- ✅ Simpler architecture

### **2. Different Deploy Strategies**

| Environment | Deploy Trigger | Purpose |
|-------------|----------------|---------|
| **Local** | Manual (`npm run dev`) | Code development |
| **Staging** | Auto (git push to `main`) | Preview code changes |
| **Production** | Manual (Cloudflare Dashboard) | Live website |

### **3. Content vs. Code Changes**

**Content Changes (no code):**
- Add/edit tours, FAQs, stories
- Upload images
- Update site settings

**Workflow:** Directus → Staging (immediate) → Production (manual deploy)

**Code Changes (design/system):**
- New components, layouts, CSS
- JavaScript functionality
- New pages

**Workflow:** Local → Staging (auto-deploy) → Production (manual deploy)

---

## 📊 Environment Configuration

### **Directus URLs**

All environments use the same Directus:

```
PUBLIC_DIRECTUS_URL = https://cms.system.simplyenak.com
```

### **Cloudflare Pages**

| Project | Domain | Env Var | Value |
|---------|--------|---------|-------|
| **website** | simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms.system.simplyenak.com` |
| **revamp** | staging.simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms.system.simplyenak.com` |

---

## 🔄 Workflows

### **Content Changes**

```
1. Login to Directus (cms.system.simplyenak.com/admin)
   ↓
2. Create/edit content (tours, FAQs, etc.)
   ↓
3. Upload images (stored in S3)
   ↓
4. Content immediately available to:
   - Local (refresh dev server)
   - Staging (auto-deploy on next git push)
   - Production (after manual deploy)
   ↓
5. Preview on staging.simplyenak.com
   ↓
6. When ready, deploy production:
   - Cloudflare Dashboard → website → Deployments
   - Click "Create deployment"
   ↓
7. Production shows new content
```

---

### **Code Changes**

```
1. Develop locally (localhost:4321)
   ↓
2. Test with production content (from Directus)
   ↓
3. Commit and push to git
   ↓
4. Staging auto-deploys (staging.simplyenak.com)
   ↓
5. Review on staging
   ↓
6. When ready, deploy production:
   - Cloudflare Dashboard → website → Deployments
   - Click "Create deployment"
   ↓
7. Production shows new code + existing content
```

---

## 📁 File Structure

```
/var/home/maarten/website-optimization/revamp/
├── frontend/                    # Astro frontend
│   ├── src/
│   │   ├── pages/              # Routes
│   │   ├── components/         # Components
│   │   ├── layouts/            # Layouts
│   │   ├── lib/                # Utilities
│   │   │   └── directus.js     # Directus client
│   │   └── data/content/       # Local JSON fallback
│   ├── wrangler.toml           # Cloudflare config
│   └── .env.example            # Environment template
│
├── workers/                     # Cloudflare Workers
│   └── forms/                  # Contact form handler
│       ├── index.js
│       └── wrangler.toml
│
├── scripts/                     # Utility scripts
│   ├── update-cloudflare-env.sh
│   └── [other scripts]
│
└── docs/                        # Documentation
    ├── ARCHITECTURE_SINGLE_DIRECTUS.md
    ├── DIRECTUS_URLS_QUICK_REFERENCE.md
    └── [other docs]
```

---

## 🔐 Access Control

### **Directus Admin**

| Instance | URL | Email | Password |
|----------|-----|-------|----------|
| **Production** | `cms.system.simplyenak.com/admin` | `admin@simplyenak.com` | `admin123` |

⚠️ **Change the default password after login!**

### **Cloudflare Dashboard**

| Project | URL |
|---------|-----|
| **Production** | https://dash.cloudflare.com/?to=/:account/pages/view/website |
| **Staging** | https://dash.cloudflare.com/?to=/:account/pages/view/revamp |

---

## 📋 Checklist

### **Directus Setup**
- [ ] Login to `cms.system.simplyenak.com/admin`
- [ ] Change admin password
- [ ] Verify all collections exist
- [ ] Verify all content is present
- [ ] Verify all images are uploaded
- [ ] Create user accounts (Pauline, Maarten)

### **Cloudflare Pages Setup**
- [ ] Production: Set `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Staging: Set `PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com`
- [ ] Production: Configure manual deploy
- [ ] Staging: Configure auto-deploy on push to `main`

### **DNS Records**
```dns
# Directus
CNAME  cms.system  →  [your server/Dokploy]

# Websites (Cloudflare Pages - automatic)
simplyenak.com  →  Cloudflare Pages
staging.simplyenak.com  →  Cloudflare Pages
```

---

## ✅ Benefits

| Benefit | Impact |
|---------|--------|
| **Single Directus** | No content sync, no divergence |
| **Shared images** | Upload once, available everywhere |
| **Simple workflow** | Content in Directus, code via git |
| **Safe deploys** | Production is manual, you control when |
| **Fast iteration** | Develop locally, preview on staging |
| **Real content** | Local dev uses production content |

---

## ⚠️ Important Notes

### **Content is Immediate**

When you create/edit content in Directus:
- ✅ Immediately available on staging
- ✅ Immediately available locally
- ⚠️ Production shows it after manual deploy

**This is intentional!** You want content to be the same across environments.

### **Images in S3**

All images are stored in S3 (`se-website-images`):
- ✅ Uploaded once via Directus
- ✅ Available to all environments
- ✅ No sync needed

### **Production Deploys are Manual**

Production website (`simplyenak.com`) deploys manually:
- ✅ You control when changes go live
- ✅ No accidental production deploys
- ✅ Review on staging first

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Directus Admin | https://cms.system.simplyenak.com/admin |
| Production Website | https://simplyenak.com |
| Staging Website | https://staging.simplyenak.com |
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Production Project | https://dash.cloudflare.com/?to=/:account/pages/view/website |
| Staging Project | https://dash.cloudflare.com/?to=/:account/pages/view/revamp |

---

## 📞 Troubleshooting

### **Content not showing on staging**

1. Check Directus content is published (not draft)
2. Trigger staging deploy (push to `main` or manual)
3. Check Cloudflare Pages build logs

### **Images not loading**

1. Check image is uploaded to Directus
2. Check S3 bucket has the image
3. Check image URL in content is correct

### **Production not updating**

1. Manual deploy required (not auto)
2. Go to Cloudflare Dashboard → website → Deployments
3. Click "Create deployment"

---

**Architecture:** Single Directus Instance  
**Created:** 2026-03-30  
**Status:** Final  

---

*Simply Enak — Final Architecture v1.0*
*Single Directus serving all environments*
