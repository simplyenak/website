# Cloudflare Pages Environment Variables Setup

**Created:** 2026-03-30  
**Status:** Ready to execute  

---

## 🎯 What Needs to Be Updated

Two Cloudflare Pages projects need their environment variables updated:

| Project | Domain | Environment Variable | Value |
|---------|--------|---------------------|-------|
| **website** | simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms.system.simplyenak.com` |
| **revamp** | staging.simplyenak.com | `PUBLIC_DIRECTUS_URL` | `https://cms-staging.system.simplyenak.com` |

---

## 🔧 Method 1: Cloudflare Dashboard (Manual)

### **Production (website project)**

1. Go to: https://dash.cloudflare.com/?to=/:account/pages/view/website/settings/environment-variables
2. Click "Add variable"
3. Enter:
   - **Variable name:** `PUBLIC_DIRECTUS_URL`
   - **Value:** `https://cms.system.simplyenak.com`
4. Click "Save"
5. Trigger new deployment

### **Staging (revamp project)**

1. Go to: https://dash.cloudflare.com/?to=/:account/pages/view/revamp/settings/environment-variables
2. Click "Add variable" (or edit existing)
3. Enter:
   - **Variable name:** `PUBLIC_DIRECTUS_URL`
   - **Value:** `https://cms-staging.system.simplyenak.com`
4. Click "Save"
5. Trigger new deployment (automatic on push to main)

---

## 🤖 Method 2: Script (Automated)

### **Prerequisites**

**Get Cloudflare API Token:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Create token with "Pages:Edit" permission
3. Or use existing token from: `/var/home/maarten/.cloudflare/tokens.env`

### **Run Script**

```bash
cd /var/home/maarten/website-optimization/revamp

# Source Cloudflare tokens
source /var/home/maarten/.cloudflare/tokens.env

# Run update script
./scripts/update-cloudflare-env.sh
```

**Expected output:**
```
☁️  Updating Cloudflare Pages Environment Variables
==================================================

Account ID: 464881de51ec2f03bea6104e467bf3fb

📝 Updating website (production)...
   PUBLIC_DIRECTUS_URL = https://cms.system.simplyenak.com
   ✅ Success!

📝 Updating revamp (staging)...
   PUBLIC_DIRECTUS_URL = https://cms-staging.system.simplyenak.com
   ✅ Success!

==================================================
✅ Environment variable update complete!
```

---

## 📋 Post-Update Checklist

### **Verify in Dashboard**

**Production:**
- [ ] Visit: https://dash.cloudflare.com/?to=/:account/pages/view/website/settings/environment-variables
- [ ] Confirm `PUBLIC_DIRECTUS_URL` = `https://cms.system.simplyenak.com`

**Staging:**
- [ ] Visit: https://dash.cloudflare.com/?to=/:account/pages/view/revamp/settings/environment-variables
- [ ] Confirm `PUBLIC_DIRECTUS_URL` = `https://cms-staging.system.simplyenak.com`

### **Trigger Deployments**

**Production:**
- [ ] Go to: https://dash.cloudflare.com/?to=/:account/pages/view/website/deployments
- [ ] Click "Create deployment" → "Direct upload" or "From Git provider"
- [ ] Wait for deployment to complete

**Staging:**
- [ ] Push to `main` branch (triggers auto-deploy)
- [ ] Or manually trigger: https://dash.cloudflare.com/?to=/:account/pages/view/revamp/deployments
- [ ] Wait for deployment to complete

### **Test Both Sites**

**Production:**
- [ ] Visit: https://simplyenak.com
- [ ] Check homepage loads
- [ ] Check tour pages load
- [ ] Verify images load from `cms.system.simplyenak.com`

**Staging:**
- [ ] Visit: https://staging.simplyenak.com
- [ ] Check homepage loads
- [ ] Check tour pages load
- [ ] Verify images load from `cms-staging.system.simplyenak.com`

---

## 📊 wrangler.toml Configuration

The `frontend/wrangler.toml` file has been updated with environment configuration:

```toml
name = "revamp"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

# Production Environment (simplyenak.com)
[env.production.vars]
PUBLIC_DIRECTUS_URL = "https://cms.system.simplyenak.com"

# Staging Environment (staging.simplyenak.com)
[env.staging.vars]
PUBLIC_DIRECTUS_URL = "https://cms-staging.system.simplyenak.com"
```

**Note:** This is for documentation. Actual environment variables must be set in Cloudflare Dashboard.

---

## 🔐 Security Notes

**API Token Permissions Required:**
- `Pages:Edit` — Modify Pages projects
- `Account:Read` — Read account details

**Token Storage:**
- Store in `/var/home/maarten/.cloudflare/tokens.env`
- Never commit tokens to git
- Use environment variable: `export CLOUDFLARE_API_TOKEN=your-token`

---

## ⚠️ Troubleshooting

### **"CLOUDFLARE_API_TOKEN not set"**

```bash
# Source tokens file
source /var/home/maarten/.cloudflare/tokens.env

# Or set manually
export CLOUDFLARE_API_TOKEN=your-token-here
```

### **"Project not found"**

Check project names:
- Production: `website`
- Staging: `revamp`

### **"Permission denied"**

Check API token has `Pages:Edit` permission:
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Edit token
3. Add `Pages:Edit` permission

### **Deployment fails after update**

1. Check Directus is accessible:
   ```bash
   curl -I https://cms.system.simplyenak.com
   curl -I https://cms-staging.system.simplyenak.com
   ```

2. Check environment variables are correct:
   - Verify in Cloudflare Dashboard
   - Re-run update script if needed

3. Check build logs:
   - Go to Pages project → Deployments
   - Click failed deployment
   - Review build logs

---

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Pages Projects | https://dash.cloudflare.com/?to=/:account/pages |
| Production Project | https://dash.cloudflare.com/?to=/:account/pages/view/website |
| Staging Project | https://dash.cloudflare.com/?to=/:account/pages/view/revamp |
| API Tokens | https://dash.cloudflare.com/profile/api-tokens |

---

**Script:** `scripts/update-cloudflare-env.sh`  
**wrangler.toml:** `frontend/wrangler.toml`  
**Status:** Ready to execute  

---

*Cloudflare Pages Environment Variables Setup v1.0 — Simply Enak*
