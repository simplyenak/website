# Dietary Options Centralization - Deployment Guide

## Overview

This update centralizes dietary options management. Instead of manually typing dietary options for each tour, you now:
1. **Administer dietary options in one place** (Dietary Options collection)
2. **Select from predefined options** when editing tours (relationship field)

## What Changed

### Before
- `tours.dietaryOptions` was an **array field** with manual text input
- Each tour required typing dietary options repeatedly
- No consistency or standardization

### After
- `tours.dietaryOptions` is now a **relationship field** to `dietary_options` collection
- Dietary options are managed centrally in one place
- Tours select from available options via dropdown

## Files Modified

| File | Change |
|------|--------|
| `src/collections/DietaryOptions.ts` | ✅ NEW - Centralized dietary options collection |
| `src/collections/Tours.ts` | ✏️ UPDATED - Changed `dietaryOptions` from array to relationship |
| `src/payload.config.ts` | ✏️ UPDATED - Registered new `DietaryOptions` collection |
| `migrations/0002_add_dietary_options.sql` | ✅ NEW - Database migration script |

## Deployment Steps

### Step 1: Backup Database

```bash
pg_dump -U YOUR_DB_USER payload-local > backup_$(date +%Y%m%d).sql
```

### Step 2: Run Database Migration

```bash
# Connect to PostgreSQL
psql -U YOUR_DB_USER -d payload-local

# Run the migration
\i /var/home/maarten/website-optimization/payload-local/migrations/0002_add_dietary_options.sql
```

**Or run directly:**
```bash
psql -U YOUR_DB_USER -d payload-local -f /var/home/maarten/website-optimization/payload-local/migrations/0002_add_dietary_options.sql
```

### Step 3: Verify Database Changes

```sql
-- Check dietary_options table exists
\d dietary_options

-- Check tours table has new column
\d tours

-- Verify default dietary options were inserted
SELECT id, name, slug, icon FROM dietary_options;
```

### Step 4: Restart Payload Server

```bash
# If using PM2
pm2 restart payload-dev --update-env

# Or if running manually
pkill -f "next-server"
cd /var/home/maarten/website-optimization/payload-local
NODE_OPTIONS="--no-deprecation --max-old-space-size=8192" npx next dev --webpack
```

### Step 5: Verify in Admin Panel

1. Navigate to **Content → Dietary Options**
2. You should see 8 default dietary options:
   - 🌱 Vegetarian
   - 🌿 Vegan
   - ☪️ Halal
   - 🌾 Gluten-Free
   - 🥛 Dairy-Free
   - 🥜 Nut-Free
   - ✡️ Kosher
   - 🐟 Pescatarian

3. Navigate to **Content → Tours**
4. Edit an existing tour
5. The **Dietary Options** field should now be a dropdown/multi-select
6. Select options from the list

## Migration Notes

### Data Migration for Existing Tours

The migration **drops the old array data**. If you have existing dietary options in tours that need to be preserved, you'll need to manually re-select them in the admin panel.

**To check if you have existing data:**
```sql
-- Check if old array table exists and has data
SELECT * FROM tours_dietary_options LIMIT 10;
```

If this returns data, let me know and I can create a data migration script to map the old text values to the new relationship IDs.

### Adding New Dietary Options

To add new dietary options in the future:

**Via Admin Panel:**
1. Go to **Content → Dietary Options**
2. Click **Create New**
3. Fill in:
   - Name (e.g., "Low-Carb")
   - Slug (auto-generated, e.g., "low-carb")
   - Icon (emoji or icon name)
   - Color (hex code)
   - Description
4. Click **Save**

**Via SQL:**
```sql
INSERT INTO dietary_options (name, slug, icon, color, description, status)
VALUES ('Low-Carb', 'low-carb', '🥩', '#dc2626', 'Low in carbohydrates', 'published');
```

## Similar Improvements Available

The same pattern can be applied to these fields in Tours:

1. **`travelTypes`** - Currently manual array, could use `travel_type_landing_pages`
2. **`specialtyExperiences`** - Currently manual array, could use `specialty_landing_pages`

Would you like me to implement these as well?

## Troubleshooting

### Error: "relation dietary_options does not exist"
- **Cause:** Migration not run
- **Fix:** Run Step 2 above

### Error: "column tours.dietary_options_id does not exist"
- **Cause:** Migration incomplete
- **Fix:** Check migration output for errors

### Admin shows blank page
- **Cause:** Schema mismatch
- **Fix:** 
  ```bash
  pm2 logs payload-dev --lines 100
  # Check for missing column errors
  ```

### Relationship field shows no options
- **Cause:** No published dietary options
- **Fix:** Ensure dietary options have `status: published`

## Rollback (if needed)

```sql
-- Remove new collection
DROP TABLE IF EXISTS "_dietary_options_v";
DROP TABLE IF EXISTS dietary_options;

-- Restore old array field (if needed)
-- Note: You'll need to restore from backup for actual data
```

---

**Created:** 2026-04-02  
**Author:** Simply Enak Dev Team
