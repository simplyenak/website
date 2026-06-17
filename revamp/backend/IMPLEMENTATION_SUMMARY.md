# Centralized Reference Data - Implementation Summary

## What We Built

A centralized system for managing reference data (dietary options, travel types, specialty experiences) that can be administered in one place and selected via dropdowns in tours.

## Architecture

```
┌─────────────────────┐      ┌─────────────────────┐
│  Dietary Options    │      │  Travel Type Pages  │
│  (Centralized)      │      │  (Centralized)      │
│                     │      │                     │
│  - Vegetarian 🌱    │      │  - Family           │
│  - Vegan 🌿         │      │  - Couples          │
│  - Halal ☪️          │      │  - Solo             │
│  - etc. (8 total)   │      │  - etc.             │
└─────────┬───────────┘      └─────────┬───────────┘
          │                            │
          │ relationship               │ relationship
          ↓                            ↓
┌─────────────────────────────────────────────────┐
│                    Tours                        │
│                                                 │
│  - dietaryOptions[] (relationship, hasMany)    │
│  - travelTypes[] (relationship, hasMany)        │
│  - specialtyExperiences[] (relationship)        │
└─────────────────────────────────────────────────┘
```

## Files Created/Modified

### New Files
- `src/collections/DietaryOptions.ts` - Dietary options collection config
- `migrations/0002_add_dietary_options.sql` - Complete database migration
- `scripts/verify-schema.sh` - Schema verification script
- `SCHEMA_CHANGE_CHECKLIST.md` - Best practices guide
- `CENTRALIZED_REFERENCES_MIGRATION.md` - Deployment guide

### Modified Files
- `src/collections/Tours.ts` - Changed 3 fields from arrays to relationships
- `src/payload.config.ts` - Registered DietaryOptions collection

## Database Tables

### dietary_options
| Column | Type | Purpose |
|--------|------|---------|
| id | SERIAL | Primary key |
| name | TEXT | Display name (e.g., "Vegetarian") |
| slug | TEXT | URL-friendly identifier |
| icon | TEXT | Emoji or icon name |
| color | TEXT | Hex color code |
| description | TEXT | Detailed description |
| status | TEXT | User-facing status |
| _status | TEXT | Payload workflow status |
| autosave | TEXT | Draft autosave data |

### tours_rels (Relationship table)
| Column | Type | Purpose |
|--------|------|---------|
| id | SERIAL | Primary key |
| parent_id | INTEGER | FK to tours.id |
| path | TEXT | Field path (e.g., "dietaryOptions") |
| order | INTEGER | Sort order |
| dietary_options_id | INTEGER | FK to dietary_options.id |
| travel_type_landing_pages_id | INTEGER | FK to travel_type_landing_pages.id |
| specialty_landing_pages_id | INTEGER | FK to specialty_landing_pages.id |

### _tours_v_rels (Version relationship table)
Same structure as `tours_rels` but references `_tours_v` for draft versions.

## Key Learnings (Issues We Encountered)

### 1. Version Table Requirements
**Problem:** Payload's versioning system requires specific columns that aren't obvious.

**Solution:** Always include these for versioned collections:
- Main table: `_status`, `autosave`
- Version table: `parent_id`, `version__status`, `version_created_at`, `version_updated_at`, `version_autosave`, `latest`

### 2. Relationship Table Structure
**Problem:** `hasMany` relationships need special relationship tables with specific columns.

**Solution:** Create both `collection_rels` and `_collection_v_rels` with:
- `parent_id` (not `parent`)
- `"order"` (quoted, not `_order`)
- Foreign keys to all related collections

### 3. Payload Locked Documents
**Problem:** Real-time collaboration feature requires columns in `payload_locked_documents_rels`.

**Solution:** Add a column for each new collection:
```sql
ALTER TABLE payload_locked_documents_rels 
  ADD COLUMN IF NOT EXISTS dietary_options_id INTEGER 
  REFERENCES dietary_options(id);
```

### 4. Version Record Coverage
**Problem:** Every document needs a corresponding version record.

**Solution:** After inserting documents, create version records:
```sql
INSERT INTO "_dietary_options_v" (parent_id, version_name, latest)
SELECT id, name, true FROM dietary_options;
```

### 5. Environment Variables
**Problem:** `.env` file got overwritten with placeholder values.

**Solution:** 
- Never commit `.env` with placeholders
- Keep `.env.example` for templates
- Double-check `DATABASE_URL` after file operations

## How to Use

### For Admins

1. **Manage Dietary Options:**
   - Go to Content → Dietary Options
   - Add/edit/remove options as needed
   - Each option has: name, slug, icon, color, description

2. **Edit Tours:**
   - Go to Content → Tours
   - Edit any tour
   - Select dietary options from dropdown (multi-select)
   - Select travel types and specialty experiences similarly

### For Developers

**Adding a new reference collection:**

1. Create collection config with versions enabled
2. Run `npm run generate:types`
3. Create migration with ALL required tables/columns
4. Run `./scripts/verify-schema.sh`
5. Restart server
6. Test list view → create → edit

## Testing Checklist

- [ ] List view loads without errors
- [ ] Create new document works
- [ ] Edit existing document works
- [ ] Relationship dropdowns show correct options
- [ ] API endpoints return correct data
- [ ] Version/draft functionality works
- [ ] No console errors (except 1Password hydration warnings)

## Future Improvements

1. **Automated migrations** - Use Payload's migration system instead of manual SQL
2. **Seed data script** - Automatically populate default options
3. **CI/CD checks** - Verify schema before deployment
4. **Documentation generator** - Auto-generate schema docs from collection configs

---

**Created:** 2026-04-02  
**Author:** Simply Enak Dev Team  
**Status:** ✅ Production Ready
