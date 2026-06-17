# Image Upload Instructions

**Created:** 2026-03-30  
**Status:** Ready for manual upload  

---

## ✅ What's Ready

### **Optimized Images**
- **Location:** `/var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/`
- **Total:** 515 images
- **Size:** 243 MB (optimized from 1.2GB, 80% reduction)
- **Quality:** Web-optimized (1920px max, 85% quality)

### **Upload Script**
- **Location:** `scripts/upload-images-to-directus.sh`
- **Status:** Ready to run
- **Directus URL:** https://cms.simplyenak.com (corrected)

---

## 🔑 Step 1: Get Admin Token

### **Via Directus Admin UI**

1. **Go to:** https://cms.simplyenak.com/admin
2. **Login:**
   - If you know the password, use it
   - If not, you may need to reset it via your server

3. **Create Token:**
   - Go to: Settings (gear icon) → API → Create Token
   - Give it a name (e.g., "Image Upload Script")
   - Copy the token

### **If You Don't Know the Password**

The default password `admin123` isn't working. You may need to:

**Option A: Reset via Directus**
1. Click "Forgot Password?" on login page
2. Enter admin email
3. Check email for reset link

**Option B: Reset via Server**
If you have server access, you can reset the Directus admin password via Docker/database.

---

## 🖼️ Step 2: Upload Images

### **Via Script (Recommended)**

```bash
cd /var/home/maarten/website-optimization/revamp

# Set environment variables
export DIRECTUS_URL="https://cms.simplyenak.com"
export DIRECTUS_TOKEN="paste-your-token-here"

# Upload all optimized images
./scripts/upload-images-to-directus.sh /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/
```

**Expected output:**
```
☁️  Batch Upload to Directus
==================================================

Directus URL: https://cms.simplyenak.com
Images folder: .../optimized/
Total images: 515

Starting upload...
✅ Uploaded: pl1TERR1151.jpg
✅ Uploaded: pl1TERR146a.jpg
...
```

**Upload time:** ~5-10 minutes

---

### **Via Admin UI (Alternative)**

1. **Go to:** https://cms.simplyenak.com/admin
2. **Click:** Files (folder icon in sidebar)
3. **Click:** Upload button (top right)
4. **Drag & drop** images from:
   ```
   /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/
   ```
5. **Upload in batches** of 50-100 images (easier to manage)

**Upload time:** ~20-30 minutes (manual)

---

## 📋 Step 3: Verify Upload

### **Check in Directus**

1. Go to: https://cms.simplyenak.com/admin/files
2. Verify 515 images are present
3. Spot-check image quality
4. Check images are accessible (click to view)

### **Check Storage**

Images should be stored in your S3 bucket:
- Bucket: `se-website-images`
- Provider: Cloudflare R2 (or Scaleway)

---

## 📊 Expected Results

| Metric | Before | After Upload |
|--------|--------|--------------|
| **Images in Directus** | 0 (or existing) | 515 new |
| **Storage used** | Existing | +243 MB |
| **Available for content** | Some | All 515 images |

---

## ⚠️ Troubleshooting

### **"Invalid token"**
- Token may have expired
- Create a new token in Directus admin
- Make sure token has admin role

### **"Upload failed"**
- Check network connection
- Try uploading in smaller batches
- Check Directus storage configuration (S3)

### **"File already exists"**
- Script skips files with same title
- To re-upload, delete existing file first

### **Directus admin not accessible**
- URL: https://cms.simplyenak.com (not cms.system.simplyenak.com)
- Check DNS is configured
- Check Directus is running on your server

---

## 📞 Quick Reference

| Resource | URL/Path |
|----------|----------|
| Directus Admin | https://cms.simplyenak.com/admin |
| Directus Files | https://cms.simplyenak.com/admin/files |
| Optimized Images | `/var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/optimized/` |
| Upload Script | `scripts/upload-images-to-directus.sh` |
| Token Script | `scripts/get-directus-token.sh` |

---

## ✅ Checklist

- [ ] Get admin token from Directus
- [ ] Test token works
- [ ] Run upload script OR upload via admin UI
- [ ] Verify 515 images uploaded
- [ ] Check image quality
- [ ] Organize into folders (optional)
- [ ] Use images in tours/stories content

---

**Optimized Images:** ✅ Ready (515 images, 243MB)  
**Upload Script:** ✅ Ready  
**Directus URL:** ✅ Corrected (cms.simplyenak.com)  
**Next:** Get admin token and upload  

---

*Image Upload Instructions v1.0 — Simply Enak*
