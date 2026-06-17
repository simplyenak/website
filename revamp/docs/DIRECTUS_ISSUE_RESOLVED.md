# Directus Issue — RESOLVED

**Created:** 2026-03-30  
**Status:** ✅ Resolved  

---

## 🔍 The Problem

We were trying to access Directus at `https://cms.system.simplyenak.com` which returned **404**.

**Root cause:** Directus is actually running at `https://cms.simplyenak.com` (without the `system` subdomain).

---

## ✅ The Solution

**Correct Directus URL:** `https://cms.simplyenak.com`

**Verified:**
- ✅ DNS resolves correctly
- ✅ Admin UI loads (`/admin`)
- ✅ Directus is running and accessible

---

## 📋 Updated Configuration

All files have been updated to use the correct URL:

| File | Updated |
|------|---------|
| `.ruflo/ENVIRONMENT_CONFIG.md` | ✅ |
| `frontend/wrangler.toml` | ✅ |
| `scripts/upload-images-to-directus.sh` | ✅ |
| `scripts/get-directus-token.sh` | ✅ |

---

## 🔑 How to Get Admin Token

### **Option 1: Via Admin UI**

1. **Go to:** https://cms.simplyenak.com/admin
2. **Login:**
   - Email: `admin@simplyenak.com`
   - Password: `admin123` (or your custom password)
3. **Go to:** Settings → API → Create Token
4. **Copy the token**

### **Option 2: Via Script**

```bash
cd /var/home/maarten/website-optimization/revamp
./scripts/get-directus-token.sh
# Enter password when prompted
```

---

## 🖼️ Upload Images to Directus

### **Optimized Images Ready**

- **Location:** `/var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/`
- **Total:** 515 images
- **Size:** 243 MB (optimized from 1.2GB)

### **Upload Command**

```bash
cd /var/home/maarten/website-optimization/revamp

# Get token first
./scripts/get-directus-token.sh
# Enter password, copy the token

# Set environment variables
export DIRECTUS_URL="https://cms.simplyenak.com"
export DIRECTUS_TOKEN="your-token-here"

# Upload images
./scripts/upload-images-to-directus.sh /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/
```

**Upload time:** ~5-10 minutes

---

## ☁️ Cloudflare Pages Configuration

Both production and staging should use the same Directus:

| Project | Domain | Env Var | Value |
|---------|--------|---------|-------|
| **website** | simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms.simplyenak.com` |
| **revamp** | staging.simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms.simplyenak.com` |

### **Update via Dashboard**

1. **Production:**
   - Go to: https://dash.cloudflare.com/?to=/:account/pages/view/website/settings/environment-variables
   - Set: `PUBLIC_DIRECTUS_URL = https://cms.simplyenak.com`

2. **Staging:**
   - Go to: https://dash.cloudflare.com/?to=/:account/pages/view/revamp/settings/environment-variables
   - Set: `PUBLIC_DIRECTUS_URL = https://cms.simplyenak.com`

---

## 📊 Architecture Summary

```
┌──────────────────────────────────────────────────────────────────┐
│              DIRECTUS (Single Instance)                           │
│              https://cms.simplyenak.com                           │
│              All content + ALL images (S3 bucket)                 │
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

## ✅ Next Steps

1. **Get admin token** (via UI or script)
2. **Upload 515 optimized images** to Directus
3. **Update Cloudflare Pages** environment variables
4. **Verify** both staging and production work

---

**Issue Resolved:** Directus URL corrected from `cms.system.simplyenak.com` to `cms.simplyenak.com`  
**Status:** Ready to upload images  

---

*Directus Issue Resolution v1.0 — Simply Enak*
