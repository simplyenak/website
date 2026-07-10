# Centralized Reference Data - Deployment Guide

## Overview

This update centralizes **three types of reference data** for tours. Instead of manually typing options for each tour, you now administer them in centralized collections and select from dropdowns.

## What Changed

### Before
| Field | Type | Problem |
|-------|------|---------|
| `dietaryOptions` | Array (manual text) | Typing "Vegetarian", "Halal" repeatedly |
| `travelTypes` | Array (manual text) | Inconsistent naming, no standardization |
| `specialtyExperiences` | Array (manual text) | Same experience named differently |

### After
| Field | Type | Solution |
|-------|------|----------|
| `dietaryOptions` | Relationship → `dietary_options` | Centralized dietary reference |
| `travelTypes` | Relationship → `travel_type_landing_pages` | Reuse travel type pages |
| `specialtyExperiences` | Relationship → `specialty_landing_pages` | Reuse specialty pages |

## Benefits

✅ **Single source of truth** - Administer once, use everywhere  
✅ **Consistency** - No more "Vegetarian" vs "vegetarian" vs "Veggie"  
✅ **Rich metadata** - Icons, colors, descriptions for UI display  
✅ **Landing pages** - Each reference can have its own SEO page  
✅ **Easy updates** - Change in one place, updates all tours  

## Files Modified

| File | Status | Change |
|------|--------|--------|
| `src/collections/DietaryOptions.ts` | ✅ NEW | Centralized dietary options collection |
| `src/collections/Tours.ts` | ✏️ UPDATED | 3 fields changed to relationships |
| `src/payload.config.ts` | ✏️ UPDATED | Registered DietaryOptions collection |
| `migrations/0002_add_dietary_options.sql` | ✅ NEW | Database migration |

## Deployment Steps

### Step 1: Backup Database

```bash
pg_dump -U YOUR_DB_USER payload-local > backup_$(date +%Y%m%d).sql
```

### Step 2: Run Database Migration

**Option A: Direct connection (if no password)**
```bash
psql -U YOUR_DB_USER -d payload-local -f /var/home/maarten/website-optimization/payload-local/migrations/0002_add_dietary_options.sql
```

**Option B: With password**
```bash
PGPASSWORD=your_password psql -h localhost -U YOUR_DB_USER -d payload-local \
  -f /var/home/maarten/website-optimization/payload-local/migrations/0002_add_dietary_options.sql
```

### Step 3: Verify Database Changes

```sql
-- Verify relationship tables exist
\d tours_rels
\d _tours_v_rels

-- Verify default dietary options (should see 8 rows)
SELECT id, name, slug, icon, color FROM dietary_options;

-- Check existing travel types (from travel_type_landing_pages)
SELECT id, travel_type_name, slug FROM travel_type_landing_pages;

-- Check existing specialty pages (from specialty_landing_pages)
SELECT id, specialty_name, slug FROM specialty_landing_pages;
```

### Step 4: Restart Payload Server

The server needs to restart to pick up the new schema.

```bash
# If using PM2
pm2 restart payload-dev --update-env

# Or if running manually
pkill -f "next-server"
cd /var/home/maarten/website-optimization/payload-local
NODE_OPTIONS="--no-deprecation --max-old-space-size=8192" npx next dev --webpack
```

**Note:** If you see errors about `_tours_v_rels` table missing, the migration didn't run successfully. Re-run Step 2.

### Step 5: Verify in Admin Panel

1. **Dietary Options** (NEW)
   - Navigate to **Content → Dietary Options**
   - Should see 8 default options with icons

2. **Travel Types** (EXISTING)
   - Navigate to **Landing Pages → Travel Type Landing Pages**
   - These already exist, no new data needed

3. **Specialty Pages** (EXISTING)
   - Navigate to **Landing Pages → Specialty Landing Pages**
   - These already exist, no new data needed

4. **Tours**
   - Edit any tour
   - Three fields should now be dropdowns:
     - **Dietary Options** → Select from dietary_options
     - **Travel Types** → Select from travel_type_landing_pages
     - **Specialty Experiences** → Select from specialty_landing_pages

## Reference Collections Summary

### 1. Dietary Options (`dietary_options`)

**Purpose:** Centralized dietary requirement reference  
**Default entries:** 8 (Vegetarian, Vegan, Halal, etc.)  
**Fields:** name, slug, icon, color, description, status  

**Admin location:** Content → Dietary Options

### 2. Travel Type Landing Pages (`travel_type_landing_pages`)

**Purpose:** Travel style categories with landing pages  
**Default entries:** Already exist (Family, Couples, Solo, etc.)  
**Fields:** travel_type_name, slug, icon, color, hero content, etc.  

**Admin location:** Landing Pages → Travel Type Landing Pages

### 3. Specialty Landing Pages (`specialty_landing_pages`)

**Purpose:** Specialty experience categories with landing pages  
**Default entries:** Already exist (Street Food, Market Tours, etc.)  
**Fields:** specialty_name, slug, icon, color, hero content, etc.  

**Admin location:** Landing Pages → Specialty Landing Pages

## Adding New Reference Items

### Adding a New Dietary Option

**Via Admin:**
1. Go to **Content → Dietary Options**
2. Click **Create New**
3. Fill in details (name, icon, color, description)
4. Click **Save**

**Via SQL:**
```sql
INSERT INTO dietary_options (name, slug, icon, color, description, status)
VALUES ('Low-Carb', 'low-carb', '🥩', '#dc2626', 'Low in carbohydrates', 'published');
```

### Adding a New Travel Type

**Via Admin:**
1. Go to **Landing Pages → Travel Type Landing Pages**
2. Click **Create New**
3. Fill in details
4. Click **Save**

**Via SQL:**
```sql
INSERT INTO travel_type_landing_pages (travel_type_name, slug, icon, color, status)
VALUES ('Adventure', 'adventure', '🏔️', '#f97316', 'published');
```

### Adding a New Specialty

**Via Admin:**
1. Go to **Landing Pages → Specialty Landing Pages**
2. Click **Create New**
3. Fill in details
4. Click **Save**

**Via SQL:**
```sql
INSERT INTO specialty_landing_pages (specialty_name, slug, icon, color, status)
VALUES ('Cooking Class', 'cooking-class', '👨‍🍳', '#8b5cf6', 'published');
```

## Migration Notes

### Data Migration for Existing Tours

The migration **drops the old array data**. If you have existing data in these fields that needs to be preserved:

**Check for existing data:**
```sql
-- Check old dietary options table
SELECT * FROM tours_dietary_options LIMIT 10;

-- Check old travel types table
SELECT * FROM tours_travel_types LIMIT 10;

-- Check old specialty experiences table
SELECT * FROM tours_specialty_experiences LIMIT 10;
```

If these return data, I can create a data migration script to map old text values to new relationship IDs.

### Relationship Field Behavior

- **hasMany: true** - You can select multiple options per tour
- **Filtered selection** - Only shows items with `status: published`
- **Soft delete** - Deleting a reference sets tour's field to NULL (doesn't delete tour)

## Troubleshooting

### Error: "relation does not exist"
- **Cause:** Migration not run
- **Fix:** Run Step 2 above

### Admin shows blank page
- **Cause:** Schema mismatch
- **Fix:** Check logs: `pm2 logs payload-dev --lines 100`

### Dropdown shows no options
- **Cause:** No published items in reference collection
- **Fix:** Ensure items have `status: published`

### Can't select multiple options
- **Cause:** UI behavior - click to select multiple
- **Fix:** Click multiple items in dropdown (it supports multi-select)

## Rollback (if needed)

```sql
-- Remove new collection
DROP TABLE IF EXISTS "_dietary_options_v";
DROP TABLE IF EXISTS dietary_options;

-- Remove relationship columns from tours
ALTER TABLE tours DROP COLUMN IF EXISTS dietary_options_id;
ALTER TABLE tours DROP COLUMN IF EXISTS travel_types_id;
ALTER TABLE tours DROP COLUMN IF EXISTS specialty_experiences_id;

-- Remove version columns
ALTER TABLE "_tours_v" DROP COLUMN IF EXISTS "version_dietary_options_id";
ALTER TABLE "_tours_v" DROP COLUMN IF EXISTS "version_travel_types_id";
ALTER TABLE "_tours_v" DROP COLUMN IF EXISTS "version_specialty_experiences_id";
```

---

**Created:** 2026-04-02  
**Updated:** 2026-04-02 (added travelTypes + specialtyExperiences)  
**Author:** Simply Enak Dev Team
