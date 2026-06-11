# Payload CMS Database Schema Update Guide

## ⚠️ CRITICAL: Always Follow This Process

When making changes to Payload collections, **ALWAYS** update the database schema in the correct order to avoid breaking the admin UI.

---

## The Problem We Faced

Adding fields to collections without updating database tables caused:
- `column does not exist` errors
- Blank admin pages
- API 500 errors
- Version table query failures

Example error:
```
error: column _tours_v.version_scheduled_publish does not exist
```

---

## ✅ Correct Schema Update Process

### Step 1: Add Field to Collection Config

```typescript
// src/collections/Tours.ts
{
  name: 'scheduledPublish',
  type: 'date',
  admin: {
    description: 'Auto-publish at this date/time',
    position: 'sidebar',
  },
}
```

### Step 2: Add Column to MAIN Table

```sql
-- Add to main tours table
ALTER TABLE tours 
  ADD COLUMN IF NOT EXISTS scheduled_publish TIMESTAMP(3) WITH TIME ZONE;
```

### Step 3: Add Column to VERSION Table (if versions enabled)

```sql
-- Add to version table (_tours_v)
ALTER TABLE "_tours_v" 
  ADD COLUMN IF NOT EXISTS "version_scheduled_publish" TIMESTAMP(3) WITH TIME ZONE;
```

### Step 4: Add to Version Relation Tables (for array fields)

If you added an **array field**, also create relation tables:

```sql
-- For array fields like dietaryOptions
CREATE TABLE "_tours_v_version_dietary_options" (
  _order INTEGER,
  _parent_id INTEGER REFERENCES "_tours_v"(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  option TEXT,
  _uuid TEXT
);
CREATE INDEX "_tours_v_version_dietary_options_order_idx" 
  ON "_tours_v_version_dietary_options" (_order);
```

### Step 5: Restart Server

```bash
# Stop PM2
pm2 restart payload-dev --update-env

# Or run manually
pkill -f "next-server"
NODE_OPTIONS="--no-deprecation --max-old-space-size=8192" npx next dev --webpack
```

---

## 📋 Complete Checklist for Field Additions

### For Simple Fields (text, number, boolean, date):

- [ ] Add field to collection config
- [ ] Add column to main table (`tours`)
- [ ] Add `version_*` column to version table (`_tours_v`)
- [ ] Restart server

### For Array Fields:

- [ ] Add array field to collection config
- [ ] Add column to main table (usually JSONB or relation table)
- [ ] Create main table relation table (`tours_dietary_options`)
- [ ] Create version table relation table (`_tours_v_version_dietary_options`)
- [ ] Add indexes on `_order` column
- [ ] Restart server

### For Relationship Fields:

- [ ] Add relationship field to collection config
- [ ] Add foreign key column to main table (`*_id`)
- [ ] Add `version_*_id` column to version table
- [ ] Ensure referenced collection exists
- [ ] Restart server

### For RichText (Lexical) Fields:

- [ ] Add richText field to collection config
- [ ] Add JSONB column to main table
- [ ] Add `version_*` JSONB column to version table
- [ ] **IMPORTANT**: Default value must be valid Lexical JSON:
  ```json
  {
    "root": {
      "children": [],
      "direction": "ltr",
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  }
  ```

---

## 🔧 Quick Fix Commands

### Check for Missing Columns

```sql
-- Check what columns exist
\d tours
\d "_tours_v"

-- Check what's missing from error message
-- Error: column _tours_v.version_scheduled_publish does not exist
-- Fix:
ALTER TABLE "_tours_v" 
  ADD COLUMN IF NOT EXISTS "version_scheduled_publish" TIMESTAMP(3) WITH TIME ZONE;
```

### Clear Invalid Lexical Data

If you get "Lexical editor is not an object" error:

```sql
-- Clear HTML data from richText fields
UPDATE about_page 
SET founder_story_text = NULL 
WHERE founder_story_text::text LIKE '<%';

-- Or set to valid empty Lexical object
UPDATE stories 
SET content = '{"root":{"children":[],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'::jsonb
WHERE content::text LIKE '<%';
```

### Check Version Table Structure

```sql
-- List all version tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname='public' 
AND tablename LIKE '%_v%'
ORDER BY tablename;

-- Check specific version table
\d "_tours_v"

-- Check version relation tables
\d "_tours_v_version_dietary_options"
```

---

## 🚨 Common Errors & Fixes

### Error: `column does not exist`

**Cause:** Field added to config but not database

**Fix:**
```sql
ALTER TABLE "table_name" ADD COLUMN IF NOT EXISTS "column_name" TYPE;
ALTER TABLE "_table_name_v" ADD COLUMN IF NOT EXISTS "version_column_name" TYPE;
```

### Error: `relation does not exist`

**Cause:** Array field relation table missing

**Fix:**
```sql
CREATE TABLE "_tours_v_version_array_field" (
  _order INTEGER,
  _parent_id INTEGER REFERENCES "_tours_v"(id),
  id SERIAL PRIMARY KEY,
  field_column TEXT,
  _uuid TEXT
);
```

### Error: `Lexical editor is not an object`

**Cause:** HTML content in richText field

**Fix:**
```sql
UPDATE collection 
SET richTextField = NULL 
WHERE richTextField::text LIKE '<%';
```

### Error: `null value violates not-null constraint`

**Cause:** Required field with no default

**Fix:**
```sql
-- Add with default value
ALTER TABLE tours 
  ADD COLUMN IF NOT EXISTS field_name TEXT DEFAULT 'default_value';
```

---

## 📝 Example: Complete Field Addition

### Adding `scheduledPublish` to Tours

**1. Update Config** (`src/collections/Tours.ts`):
```typescript
{
  name: 'scheduledPublish',
  type: 'date',
  admin: {
    description: 'Auto-publish at this date/time',
    position: 'sidebar',
  },
}
```

**2. Run SQL**:
```sql
-- Main table
ALTER TABLE tours 
  ADD COLUMN IF NOT EXISTS scheduled_publish TIMESTAMP(3) WITH TIME ZONE;

-- Version table
ALTER TABLE "_tours_v" 
  ADD COLUMN IF NOT EXISTS "version_scheduled_publish" TIMESTAMP(3) WITH TIME ZONE;

-- Create index
CREATE INDEX IF NOT EXISTS "tours_scheduled_publish_idx" 
  ON tours (scheduled_publish);
```

**3. Restart**:
```bash
pm2 restart payload-dev --update-env
```

**4. Verify**:
```bash
curl http://localhost:3000/api/tours/1 | jq '.scheduledPublish'
```

---

## 🛡️ Prevention Best Practices

1. **Always test in development first**
   - Never make schema changes directly in production

2. **Use migrations for production**
   ```bash
   npx payload migrate:create add_scheduled_publish_field
   ```

3. **Keep `push: false` in production**
   ```typescript
   db: postgresAdapter({
     pool: { connectionString: process.env.DATABASE_URL },
     push: false, // Prevents accidental schema changes
   }),
   ```

4. **Document all schema changes**
   - Keep a changelog of SQL migrations

5. **Backup before changes**
   ```bash
   pg_dump -U YOUR_DB_USER payload-local > backup_$(date +%Y%m%d).sql
   ```

6. **Test admin UI after each change**
   - List view
   - Detail view
   - Create new
   - Update existing
   - Delete

---

## 📚 Reference

### Table Naming Conventions

| Collection | Main Table | Version Table | Relation Table |
|------------|-----------|---------------|----------------|
| `tours` | `tours` | `_tours_v` | `tours_dietary_options` |
| `stories` | `stories` | `_stories_v` | N/A |
| `faqs` | `faqs` | `_faqs_v` | N/A |

### Column Naming Conventions

| Field Type | Main Table | Version Table |
|------------|-----------|---------------|
| `scheduledPublish` | `scheduled_publish` | `version_scheduled_publish` |
| `dietaryOptions` (array) | `tours_dietary_options` (table) | `_tours_v_version_dietary_options` (table) |
| `heroImage` (text) | `hero_image` | `version_hero_image` |

### Type Mappings

| Payload Type | PostgreSQL Type |
|-------------|-----------------|
| `text` | `TEXT` or `VARCHAR` |
| `number` | `NUMERIC` |
| `date` | `TIMESTAMP(3) WITH TIME ZONE` |
| `boolean` | `BOOLEAN` |
| `richText` | `JSONB` |
| `array` | Separate relation table |
| `relationship` | `INTEGER` with foreign key |

---

## 🆘 Emergency Recovery

If admin is completely broken:

1. **Check logs**:
   ```bash
   pm2 logs payload-dev --lines 100
   ```

2. **Identify missing column from error**

3. **Add missing column**:
   ```sql
   ALTER TABLE "table" ADD COLUMN IF NOT EXISTS "column" TYPE;
   ```

4. **Clear cache**:
   ```bash
   rm -rf .next
   pm2 restart payload-dev
   ```

5. **Test API directly**:
   ```bash
   curl http://localhost:3000/api/tours/1
   ```

---

**Last Updated:** 2026-04-02  
**Author:** Simply Enak Dev Team  
**Payload Version:** 3.81.0
