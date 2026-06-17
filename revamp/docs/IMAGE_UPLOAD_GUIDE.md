# Batch Upload Images to Directus

**Created:** 2026-03-30  
**Status:** Ready to execute  

---

## 📊 Images to Upload

**Folder:** `/var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/`  
**Total images:** 515 JPG files

---

## 🔧 Option 1: Script (Recommended for 515 images)

### **Get Directus Admin Token**

1. Login to: https://cms.system.simplyenak.com/admin
2. Go to: Settings → API → Create Token
3. Copy the token

### **Run Upload Script**

```bash
cd /var/home/maarten/website-optimization/revamp

# Set environment variables
export DIRECTUS_URL="https://cms.system.simplyenak.com"
export DIRECTUS_TOKEN="your-admin-token-here"

# Run upload script
./scripts/upload-images-to-directus.sh /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/
```

**Expected output:**
```
☁️  Batch Upload to Directus
==================================================

Directus URL: https://cms.system.simplyenak.com
Images folder: /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/
Total images: 515

Starting upload...
✅ Uploaded: pl1TERR1151.jpg
✅ Uploaded: pl1TERR146a.jpg
✅ Uploaded: pl1TERR15cf.jpg
...
```

**Time estimate:** ~10-20 minutes for 515 images (depends on upload speed)

---

## 🖼️ Option 2: Directus Admin UI (Manual)

For smaller batches or if you want to organize as you upload:

### **Steps**

1. **Login:** https://cms.system.simplyenak.com/admin
2. **Go to:** Files (folder icon in sidebar)
3. **Click:** Upload button (top right)
4. **Select files:** Drag & drop or browse
   - Can select multiple files at once
   - Recommended: Upload in batches of 50-100
5. **Add metadata** (optional):
   - Title
   - Description
   - Tags
   - Folder organization

**Time estimate:** ~30-60 minutes for 515 images

---

## 📁 Organizing Images (Recommended)

### **By Tour/Collection**

Create folders in Directus Files:
```
📁 Tours
  ├── 📁 KL Street Food
  ├── 📁 Penang Street Food
  ├── 📁 Flavours of Malaysia
  └── 📁 Eat Drink George Town

📁 Vendors
  ├── 📁 Aunty Lim
  ├── 📁 Uncle Tan
  └── ...

📁 Blog
  ├── 📁 Mamak Culture
  ├── 📁 Satay Master
  └── 📁 Char Kway Teow

📁 General
  ├── 📁 Hero Images
  ├── 📁 Social Media
  └── 📁 Press
```

### **How to Organize**

1. **Upload all images** to root Files collection
2. **Create folders:** Files → New Folder
3. **Move images:** Select images → Move to folder
4. **Add tags:** Select image → Add tags (for easier searching)

---

## 🔍 After Upload

### **Verify Upload**

1. Go to: https://cms.system.simplyenak.com/admin/files
2. Check all 515 images are present
3. Spot-check image quality
4. Verify images are accessible

### **Use in Content**

When editing tours, stories, etc.:
1. Click image field
2. Browse or search for uploaded image
3. Select image
4. Save content

---

## ⚠️ Tips

### **Upload Speed**
- Upload over wired connection if possible
- Upload during off-peak hours
- Script uploads one at a time (prevents timeout)

### **Image Optimization**
- Images are already HQ (good for production)
- Directus will create optimized versions automatically
- Original files preserved in S3

### **Organization**
- Add descriptive titles (not just filenames)
- Use tags for cross-folder organization
- Consider uploading in logical batches (by tour, by vendor, etc.)

### **Backup**
- Images are stored in S3 (`se-website-images`)
- Verify S3 backup after upload completes
- Keep local copy until verified

---

## 📞 Troubleshooting

### **"Authorization failed"**
- Check token is correct (copy/paste carefully)
- Token may have expired — create new one
- Token needs admin role

### **"File too large"**
- Check Directus upload limit (default: 100MB)
- Upload large files individually via admin UI
- Or increase limit in Directus config

### **"Upload timeout"**
- Script uploads one at a time (prevents this)
- If using admin UI, upload in smaller batches
- Check network connection

### **"Duplicate file"**
- Script skips files with same title
- To re-upload, delete existing file first
- Or rename file before upload

---

## 📋 Quick Command Reference

```bash
# Set variables
export DIRECTUS_URL="https://cms.system.simplyenak.com"
export DIRECTUS_TOKEN="your-token-here"

# Upload all images
./scripts/upload-images-to-directus.sh /var/home/maarten/website-optimization/revamp/piufoto-all-photos-hq/

# Upload specific folder
./scripts/upload-images-to-directus.sh /path/to/specific/folder/

# Check Directus files
curl -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  "$DIRECTUS_URL/items/files?limit=5"
```

---

**Script:** `scripts/upload-images-to-directus.sh`  
**Images:** 515 files in `piufoto-all-photos-hq/`  
**Status:** Ready to execute  

---

*Batch Upload Images Guide v1.0 — Simply Enak*
