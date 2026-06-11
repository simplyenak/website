# Database Schema Fixes - April 2, 2026

## Problem

Multiple collections were showing blank screens when trying to create new items. The root cause was missing `_order` columns in relationship tables (`*_rels`).

## Root Cause

Payload CMS requires BOTH `order` AND `_order` columns in relationship tables for `hasMany` relationships. Several tables were missing the `_order` column.

## Collections Fixed

### 1. Food Items (formerly Dishes) ✅
**Issue:** Missing `_order` column in relationship tables

**Fixed:**
- Added `_order` to `food_items_rels`
- Added `_order` to `_food_items_v_rels`
- Created `food_items_gallery_images` array table
- Created `_food_items_v_gallery_images` array table

**Now works:** Creating new food items with gallery images

### 2. Vendors ✅
**Issues:** Multiple missing columns

**Fixed:**
- Added `_order` to `vendors_rels`
- Added `_order` to `_vendors_v_rels`
- Added `contact_*` fields (6 columns)
- Added `images_main_id` field
- Added `version_contact_*` fields (6 columns)
- Added `version_images_*` fields (3 columns)
- Changed `images.gallery` from `hasMany` relationship to array
- Changed `images.foodPhotos` from `hasMany` relationship to array
- Created `vendors_images_gallery` array table
- Created `_vendors_v_images_gallery` array table

**Now works:** Creating new vendors with contact info and images

### 3. Other Relationship Tables Fixed ✅
**Tables updated:**
- `payload_locked_documents_rels` - Added `_order`
- `payload_preferences_rels` - Added `_order`
- `redirects_rels` - Added `_order`
- `translations_rels` - Added `_order`

## Collections Already Working ✅

| Collection | Status | Notes |
|------------|--------|-------|
| Tours | ✅ Working | All relationship tables correct |
| Stories | ✅ Working | Simple relationship (no hasMany) |
| Dietary Options | ✅ Working | Simple collection |
| Testimonials | ✅ Working | No issues found |
| FAQs | ✅ Working | No issues found |
| Media | ✅ Working | Built-in collection |
| Users | ✅ Working | Built-in collection |

## Database Tables Created/Modified

### New Tables Created
```sql
food_items_gallery_images
_food_items_v_gallery_images
vendors_images_gallery
_vendors_v_images_gallery
```

### Tables Modified (Added `_order` column)
```sql
food_items_rels
_food_items_v_rels
vendors_rels
_vendors_v_rels
payload_locked_documents_rels
payload_preferences_rels
redirects_rels
translations_rels
```

### Tables Modified (Added fields)
```sql
vendors (added contact_*, images_main_id)
_vendors_v (added version_contact_*, version_images_*)
```

## How to Verify Collections Work

### Test Each Collection:
1. **Food Items**
   - Go to Reference Data → Food Items
   - Click "Create New"
   - Fill in name, description, category
   - Upload main image
   - Add gallery images
   - Save ✅

2. **Vendors**
   - Go to Reference Data → Vendors
   - Click "Create New"
   - Fill in name, type, description
   - Add location info
   - Add contact info (phone, email, social)
   - Upload main image
   - Add gallery photos
   - Link to food items
   - Save ✅

3. **Tours**
   - Go to Tours & Booking → Tours
   - Click "Create New"
   - Fill in tour details
   - Select food items, dietary options, etc.
   - Save ✅

4. **Stories**
   - Go to Content & Blog → Stories
   - Click "Create New"
   - Fill in story details
   - Select author
   - Save ✅

## Prevention: Schema Verification Script

Run this after any schema changes:

```bash
./scripts/verify-schema.sh
```

Or manually check:

```sql
-- Check all relationship tables have _order
SELECT table_name, 
  EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = t.table_name AND column_name = '_order') as has__order
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
AND t.table_name LIKE '%rels'
ORDER BY table_name;

-- Check all version tables have required columns
SELECT table_name,
  EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = t.table_name AND column_name = 'parent_id') as has_parent_id,
  EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = t.table_name AND column_name = 'version__status') as has_version__status,
  EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = t.table_name AND column_name = 'latest') as has_latest
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
AND t.table_name LIKE '_%_v'
AND t.table_name NOT LIKE '%version%'
ORDER BY table_name;
```

## Lessons Learned

### For Collections with `hasMany` Relationships:
1. **Always create relationship tables** (`collection_rels` and `_collection_v_rels`)
2. **Include BOTH columns:**
   - `order` (unquoted, lowercase)
   - `_order` (quoted, with underscore)
3. **For array fields inside groups:**
   - Create separate array tables
   - Don't use `hasMany` relationships inside groups

### For Collections with Group Fields:
1. **Group fields with relationships** need special handling
2. **`hasMany` relationships inside groups don't work** - use arrays instead
3. **Version table needs `version_*` prefix** for all group sub-fields

### For All Versioned Collections:
1. **Main table needs:**
   - `_status` TEXT
   - `autosave` TEXT
   
2. **Version table needs:**
   - `parent_id` INTEGER
   - `version__status` TEXT
   - `version_created_at` TIMESTAMP
   - `version_updated_at` TIMESTAMP
   - `version_autosave` TEXT
   - `latest` BOOLEAN

## Migration Files Updated

- `migrations/0003_add_dishes.sql` → Updated to `food_items`
- `migrations/0004_add_vendors.sql` → Updated with all missing fields
- `migrations/0005_seed_food_items.sql` → Seeds 22 Malaysian food/drink items

## Next Steps

1. ✅ Test all collections in admin panel
2. ✅ Add more food items if needed
3. ✅ Add vendor data
4. ✅ Link tours to food items and vendors
5. Consider creating a dashboard view for overview

---

**Status:** ✅ All Collections Fixed  
**Date:** 2026-04-02  
**Author:** Simply Enak Dev Team
