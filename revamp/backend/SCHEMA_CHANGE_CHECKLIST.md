# Schema Change Best Practices

## ⚠️ Critical Lessons from April 2, 2026 Incident

When adding new collections with relationships and versions, **many database tables/columns are auto-created by Payload**. Missing these causes admin UI failures.

---

## ✅ Complete Schema Change Checklist

### Phase 1: Before Making Changes

- [ ] **Backup database**
  ```bash
  pg_dump -U directus -h localhost payload-local > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] **Document what you're changing**
  - Which collections?
  - Which fields?
  - Are there relationships?
  - Does it use versions/drafts?

### Phase 2: Collection Config Changes

- [ ] Add collection to `src/collections/`
- [ ] Register in `src/payload.config.ts`
- [ ] **Run type generation immediately:**
  ```bash
  npm run generate:types
  npm run generate:importmap
  ```

### Phase 3: Database Schema (CRITICAL - Most Error-Prone)

#### For Collections WITH Versions/ Drafts:

**Main Table:**
```sql
CREATE TABLE IF NOT EXISTS collection_name (
  id SERIAL PRIMARY KEY,
  -- Your fields here
  created_at TIMESTAMP(3) WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP(3) WITH TIME ZONE DEFAULT NOW(),
  
  -- REQUIRED for versions:
  _status TEXT DEFAULT 'draft',
  autosave TEXT
);
```

**Version Table:**
```sql
CREATE TABLE IF NOT EXISTS "_collection_name_v" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER,  -- NOT "parent"
  
  -- Version fields (prefix with version_)
  version_field_name TEXT,
  version__status TEXT DEFAULT 'draft',
  version_created_at TIMESTAMP(3) WITH TIME ZONE,
  version_updated_at TIMESTAMP(3) WITH TIME ZONE,
  version_autosave TEXT,
  
  -- System fields
  autosave TEXT,
  created_at TIMESTAMP(3) WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP(3) WITH TIME ZONE DEFAULT NOW(),
  latest BOOLEAN
);
```

**Relationship Table (for hasMany relationships):**
```sql
CREATE TABLE IF NOT EXISTS "collection_name_rels" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES collection_name(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  "order" INTEGER,  -- NOT "_order"
  related_collection_id INTEGER REFERENCES related_collection(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "_collection_name_v_rels" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES "_collection_name_v"(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  "order" INTEGER,  -- NOT "_order"
  related_collection_id INTEGER REFERENCES related_collection(id) ON DELETE CASCADE
);
```

**Payload Locked Documents (for real-time collaboration):**
```sql
-- Add column for EACH new collection
ALTER TABLE payload_locked_documents_rels 
  ADD COLUMN IF NOT EXISTS collection_name_id INTEGER 
  REFERENCES collection_name(id) ON DELETE CASCADE;
```

#### For Collections WITHOUT Versions:

Simpler - just main table and relationship tables if needed.

### Phase 4: Verify Schema

```sql
-- Check main table
\d collection_name

-- Check version table
\d "_collection_name_v"

-- Check relationship tables
\d "collection_name_rels"
\d "_collection_name_v_rels"

-- Check locked documents
\d payload_locked_documents_rels

-- Verify all expected columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'collection_name' 
ORDER BY ordinal_position;
```

### Phase 5: Seed Initial Data (if needed)

```sql
-- Insert default records
INSERT INTO collection_name (name, slug, status, _status, created_at, updated_at)
VALUES ('Default Name', 'default-name', 'published', 'published', NOW(), NOW());

-- Create version records for each
INSERT INTO "_collection_name_v" (
  parent_id, version_name, version_slug, version_status, version__status, 
  latest, created_at, updated_at
)
SELECT id, name, slug, status, _status, true, created_at, updated_at
FROM collection_name;
```

### Phase 6: Restart & Test

```bash
# Restart server
pkill -f "next-server"
npm run dev

# Test in this order:
# 1. List view: /admin/collections/collection_name
# 2. Create new: /admin/collections/collection_name/create
# 3. Edit existing: /admin/collections/collection_name/1
# 4. API endpoint: curl http://localhost:3000/api/collection_name
```

---

## 🚨 Common Mistakes to Avoid

### 1. Column Naming

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `parent` | `parent_id` |
| `_order` | `"order"` (quoted) |
| `version_updatedAt` | `version_updated_at` |
| `versionCreatedAt` | `version_created_at` |

### 2. Missing Required Columns

**For versioned collections, these are REQUIRED:**
- `_status` (main table)
- `autosave` (main table)
- `parent_id` (version table)
- `version__status` (version table)
- `version_created_at` (version table)
- `version_updated_at` (version table)
- `version_autosave` (version table)
- `latest` (version table)

### 3. Relationship Table Issues

- Must have `"order"` column (quoted, as it's a reserved word)
- Must have separate tables for main and version (`_rels` and `_v_rels`)
- Must add foreign key to `payload_locked_documents_rels`

### 4. Version Records

- Every document in main table needs a corresponding version record
- Version records must have `latest = true` for published docs
- Orphaned version records cause list view errors

### 5. Environment Variables

- **NEVER commit `.env` with placeholder values**
- Double-check `DATABASE_URL` after any file operations
- Keep a `.env.example` with placeholders, not `.env`

---

## 🛠️ Helper Script: Verify Schema

Create `scripts/verify-schema.sh`:

```bash
#!/bin/bash

echo "🔍 Verifying database schema..."

# Check if tables exist
TABLES=("dietary_options" "_dietary_options_v" "tours_rels" "_tours_v_rels" "payload_locked_documents_rels")

for table in "${TABLES[@]}"; do
  if PGPASSWORD=directus_local_2026 psql -h localhost -U directus -d payload-local -c "\d $table" &>/dev/null; then
    echo "✅ $table exists"
  else
    echo "❌ $table MISSING"
  fi
done

# Check for orphaned version records
echo ""
echo "🔍 Checking for orphaned version records..."
PGPASSWORD=directus_local_2026 psql -h localhost -U directus -d payload-local -c "
  SELECT v.id, v.parent_id 
  FROM \"_dietary_options_v\" v 
  LEFT JOIN dietary_options d ON v.parent_id = d.id 
  WHERE d.id IS NULL;
"

echo ""
echo "✅ Schema verification complete"
```

---

## 📝 Migration Template

For future changes, create migrations in `migrations/`:

```sql
-- migrations/0003_add_new_feature.sql
-- Date: YYYY-MM-DD
-- Description: What this migration does

-- 1. Create new tables
CREATE TABLE IF NOT EXISTS new_collection (...);

-- 2. Add columns to existing tables
ALTER TABLE existing_table ADD COLUMN IF NOT EXISTS new_column TYPE;

-- 3. Create relationship tables
CREATE TABLE IF NOT EXISTS "existing_rels" (...);

-- 4. Add to locked documents
ALTER TABLE payload_locked_documents_rels 
  ADD COLUMN IF NOT EXISTS new_collection_id INTEGER REFERENCES new_collection(id);

-- 5. Seed data
INSERT INTO new_collection (...) VALUES (...);

-- 6. Create version records
INSERT INTO "_new_collection_v" (...) SELECT ...;
```

---

## 🔧 Quick Fix Commands

### Delete orphaned version record
```sql
DELETE FROM "_collection_v" 
WHERE parent_id NOT IN (SELECT id FROM collection);
```

### Add missing _status column
```sql
ALTER TABLE collection ADD COLUMN IF NOT EXISTS "_status" TEXT DEFAULT 'draft';
```

### Add missing version columns
```sql
ALTER TABLE "_collection_v" ADD COLUMN IF NOT EXISTS "version__status" TEXT DEFAULT 'draft';
ALTER TABLE "_collection_v" ADD COLUMN IF NOT EXISTS "version_updated_at" TIMESTAMP(3) WITH TIME ZONE;
ALTER TABLE "_collection_v" ADD COLUMN IF NOT EXISTS "version_created_at" TIMESTAMP(3) WITH TIME ZONE;
```

### Create version records for existing docs
```sql
INSERT INTO "_collection_v" (parent_id, version_name, latest, created_at, updated_at)
SELECT id, name, true, created_at, updated_at
FROM collection
WHERE id NOT IN (SELECT parent_id FROM "_collection_v");
```

---

## 📚 Reference: Table Naming

| Collection | Main Table | Version Table | Rel Table | Version Rel Table |
|------------|-----------|---------------|-----------|-------------------|
| `dietary_options` | `dietary_options` | `_dietary_options_v` | `tours_rels` | `_tours_v_rels` |
| `tours` | `tours` | `_tours_v` | `tours_rels` | `_tours_v_rels` |

## 📚 Reference: Column Naming

| Field Type | Main Table | Version Table |
|------------|-----------|---------------|
| `name` (text) | `name` | `version_name` |
| `status` (select) | `status` | `version_status` |
| `createdAt` (auto) | `created_at` | `version_created_at` |
| `_status` (system) | `_status` | `version__status` |
| Relationship | `collection_rels` table | `_collection_v_rels` table |

---

**Last Updated:** 2026-04-02  
**Author:** Simply Enak Dev Team
