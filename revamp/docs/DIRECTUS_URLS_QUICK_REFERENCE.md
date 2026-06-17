# Directus URLs — Quick Reference

**Created:** 2026-03-30  
**Status:** Final  

---

## ✅ Correct URLs (Use These)

| Environment | Directus URL | Website | Purpose |
|-------------|--------------|---------|---------|
| **Production** | `https://cms.system.simplyenak.com` | `simplyenak.com` | Live site |
| **Staging** | `https://cms-staging.system.simplyenak.com` | `staging.simplyenak.com` | Testing |
| **Local Dev** | `http://localhost:8055` | `localhost:4321` | Development |

---

## 🔐 Login Credentials

| Instance | URL | Email | Password |
|----------|-----|-------|----------|
| **Production** | `cms.system.simplyenak.com/admin` | `admin@simplyenak.com` | `admin123` |
| **Staging** | `cms-staging.system.simplyenak.com/admin` | `admin@simplyenak.com` | `admin123` |

⚠️ **Change the default password after login!**

---

## 🔧 Application Configuration

### **Cloudflare Pages (Production)**
```
PUBLIC_DIRECTUS_URL=https://cms.system.simplyenak.com
```

### **Cloudflare Pages (Staging)**
```
PUBLIC_DIRECTUS_URL=https://cms-staging.system.simplyenak.com
```

### **Forms Worker**
```
DIRECTUS_URL=https://cms.system.simplyenak.com
```

### **Local Development**
```
PUBLIC_DIRECTUS_URL=http://localhost:8055
```

---

## 📁 Files Updated

| File | Status |
|------|--------|
| `frontend/.env.example` | ✅ Updated |
| `workers/forms/wrangler.toml` | ✅ Updated |
| `workers/forms/index.js` | ✅ Updated |
| `directus/bootstrap-schema.js` | ✅ Updated |
| `.ruflo/ENVIRONMENT_CONFIG.md` | ✅ Updated |
| `RUFLO_SETUP_COMPLETE.md` | ✅ Updated |
| `docs/DIRECTUS_ARCHITECTURE_FINAL_V3.md` | ✅ Created |

---

## 🗑️ Outdated URLs (Do NOT Use)

| URL | Why Wrong |
|-----|-----------|
| `cms.simplyenak.com` | Doesn't exist |
| `dam.system.simplyenak.com` | Doesn't exist |
| `dam.simplyenak.com` | Doesn't exist |
| `cms-staging.simplyenak.com` | Wrong subdomain |

---

## 🔄 Content Workflow

```
1. Create/edit in Staging Directus
   (cms-staging.system.simplyenak.com)
   ↓
2. Test on staging.simplyenak.com
   ↓
3. When ready, sync to Production Directus
   (cms.system.simplyenak.com)
   ↓
4. Deploy production frontend
   ↓
5. Verify on simplyenak.com
```

---

## 📋 DNS Records Needed

```dns
# Production Directus
CNAME  cms.system  →  [your server/Dokploy]

# Staging Directus
CNAME  cms-staging.system  →  [your server/Dokploy]
```

---

## ✅ Quick Test

```bash
# Test Production Directus
curl -I https://cms.system.simplyenak.com
# Should return: HTTP/2 200 or 302

# Test Staging Directus
curl -I https://cms-staging.system.simplyenak.com
# Should return: HTTP/2 200 or 302
```

---

**Last Updated:** 2026-03-30  
**Architecture:** Two Directus instances (Production + Staging)  

---

*Directus URLs — Quick Reference v1.0 — Simply Enak*
