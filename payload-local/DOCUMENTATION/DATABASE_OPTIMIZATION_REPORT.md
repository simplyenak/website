# 📊 Payload CMS Database Optimization Report

**Generated:** 2026-04-02  
**Database:** payload_local  
**Total Tables:** 60+

---

## Executive Summary

The database is **well-structured** with proper indexes and constraints. However, there are several opportunities for improvement:

### Health Score: 8/10 ✅

**Strengths:**
- ✅ All tables have primary keys
- ✅ No duplicate slugs detected
- ✅ No NULL values in required fields
- ✅ Good index coverage on main tables
- ✅ Foreign key constraints properly defined

**Areas for Improvement:**
- ⚠️ 15 foreign keys missing indexes
- ⚠️ Some version tables growing without cleanup
- ⚠️ No automated vacuum/analyze schedule
- ⚠️ Missing composite indexes for common queries

---

## 🔍 Detailed Analysis

### 1. Table Sizes (Top 10)

| Table | Rows | Notes |
|-------|------|-------|
| translations | 699 | ✅ Healthy |
| translations_rels | 411 | ✅ Healthy |
| stories_localized_versions | 195 | ⚠️ Consider cleanup |
| faqs_localized_versions | 126 | ⚠️ Consider cleanup |
| tours_localized_versions | 45 | ✅ OK |
| tours_whats_included | 36 | ✅ OK |
| _tours_v_version_gallery_images | 28 | ⚠️ Version bloat |
| tours_gallery_images | 28 | ✅ OK |
| tours_highlights | 25 | ✅ OK |
| stories | 23 | ✅ OK |

### 2. Missing Indexes on Foreign Keys ⚠️

**15 foreign keys without indexes** - This can slow down JOINs and DELETEs:

```sql
-- RECOMMENDED: Add these indexes

-- stories.author_id (frequently queried)
CREATE INDEX IF NOT EXISTS stories_author_id_idx ON stories(author_id);

-- payload_locked_documents_rels (many FKs without indexes)
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_dietary_options_id_idx 
  ON payload_locked_documents_rels(dietary_options_id);

-- exports_texts (parent relationship)
CREATE INDEX IF NOT EXISTS exports_texts_parent_id_idx 
  ON exports_texts(parent_id);

-- Food items version tables (if still used)
CREATE INDEX IF NOT EXISTS food_items_v_version_local_names_parent_id_idx 
  ON _food_items_v_version_local_names(_parent_id);

-- Vendors version tables (if still used)
CREATE INDEX IF NOT EXISTS vendors_v_version_operating_hours_parent_id_idx 
  ON _vendors_v_version_operating_hours(_parent_id);
```

**Impact:** Medium
- DELETE operations on parent tables will be slower
- JOIN queries on these columns won't use indexes

---

### 3. Version Table Bloat ⚠️

Version tables accumulate data over time. Consider cleanup strategy:

```sql
-- Check version table sizes
SELECT 
    '_tours_v' as table_name, COUNT(*) as versions, 
    COUNT(*) FILTER (WHERE latest = true) as latest_versions
FROM _tours_v
UNION ALL
SELECT '_stories_v', COUNT(*), COUNT(*) FILTER (WHERE latest = true) FROM _stories_v
UNION ALL
SELECT '_faqs_v', COUNT(*), COUNT(*) FILTER (WHERE latest = true) FROM _faqs_v
UNION ALL
SELECT '_testimonials_v', COUNT(*), COUNT(*) FILTER (WHERE latest = true) FROM _testimonials_v;
```

**Recommendation:**
- Keep max 50 versions per document (already configured)
- Add monthly cleanup job for old non-latest versions
- Consider archiving versions older than 1 year

---

### 4. Index Usage Analysis ✅

**Most Used Indexes:**
1. `translations_rels_parent_idx` - 3,550 scans
2. `payload_preferences_pkey` - 3,043 scans
3. `tours_pkey` - 1,932 scans

**Unused Indexes (candidates for removal):**
- None detected - all indexes are being used!

---

### 5. Data Integrity ✅

**Checks Passed:**
- ✅ No NULL values in required fields (tours.name, tours.slug, stories.title, etc.)
- ✅ No duplicate slugs detected
- ✅ No orphaned records found

---

## 🚀 Optimization Recommendations

### Priority 1: Add Missing Indexes (1 hour)

```sql
-- Critical indexes for performance
CREATE INDEX IF NOT EXISTS stories_author_id_idx ON stories(author_id);
CREATE INDEX IF NOT EXISTS tours_workflow_status_idx ON tours(workflow_status);
CREATE INDEX IF NOT EXISTS stories_workflow_status_idx ON stories(workflow_status);
CREATE INDEX IF NOT EXISTS tours_status_idx ON tours(status);
CREATE INDEX IF NOT EXISTS stories_status_idx ON stories(status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS tours_status_featured_idx ON tours(status, featured);
CREATE INDEX IF NOT EXISTS stories_published_date_idx ON stories(published_date DESC);
CREATE INDEX IF NOT EXISTS tours_created_at_idx ON tours(created_at DESC);
```

**Expected Impact:** 20-30% faster queries on list views

---

### Priority 2: Version Cleanup Policy (2 hours)

Create automated cleanup script:

```sql
-- Monthly cleanup: Keep only latest + 49 most recent versions
DELETE FROM _tours_v 
WHERE latest = false 
AND id NOT IN (
  SELECT id FROM _tours_v 
  WHERE parent_id = _tours_v.parent_id 
  ORDER BY created_at DESC 
  LIMIT 50
);
```

**Expected Impact:** Prevents unbounded growth

---

### Priority 3: Database Maintenance (Ongoing)

```bash
# Add to crontab for weekly maintenance
0 3 * * 0 psql -d payload_local -c "VACUUM ANALYZE;"
```

**Benefits:**
- Reclaims disk space
- Updates query planner statistics
- Improves query performance

---

### Priority 4: Connection Pooling (If needed)

If you experience connection limits:

```typescript
// payload.config.ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
    max: 20,           // Max connections
    min: 5,            // Min connections
    idleTimeoutMillis: 30000,
  },
}),
```

---

### Priority 5: Backup Strategy

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backups/payload"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h localhost -U YOUR_USER payload_local | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

---

## 📈 Performance Monitoring

### Key Metrics to Track

```sql
-- Slow queries (enable pg_stat_statements)
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table bloat
SELECT 
    schemaname, tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Cache hit ratio (should be > 95%)
SELECT 
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

---

## 🎯 Quick Wins

### 1. Add Missing Indexes (15 min)
Run the SQL from Priority 1 above.

### 2. Update Database Statistics (5 min)
```sql
ANALYZE tours;
ANALYZE stories;
ANALYZE faqs;
ANALYZE testimonials;
```

### 3. Check for Lock Contention (5 min)
```sql
SELECT * FROM pg_stat_activity WHERE state != 'idle';
```

---

## 📋 Maintenance Checklist

### Daily
- [ ] Monitor error logs
- [ ] Check disk space

### Weekly
- [ ] Run VACUUM ANALYZE
- [ ] Review slow query log
- [ ] Check backup completion

### Monthly
- [ ] Clean old versions (keep 50 per doc)
- [ ] Review index usage
- [ ] Test backup restoration
- [ ] Update statistics

### Quarterly
- [ ] Review table growth trends
- [ ] Optimize frequently-run queries
- [ ] Review and update indexes
- [ ] Security audit

---

## 🔧 Implementation Scripts

### Add All Recommended Indexes

```bash
#!/bin/bash
# scripts/add-recommended-indexes.sh

psql -h localhost -U YOUR_USER -d payload_local << 'EOF'
-- Author lookups
CREATE INDEX IF NOT EXISTS stories_author_id_idx ON stories(author_id);

-- Workflow filtering
CREATE INDEX IF NOT EXISTS tours_workflow_status_idx ON tours(workflow_status);
CREATE INDEX IF NOT EXISTS stories_workflow_status_idx ON stories(workflow_status);

-- Status filtering
CREATE INDEX IF NOT EXISTS tours_status_idx ON tours(status);
CREATE INDEX IF NOT EXISTS stories_status_idx ON stories(status);

-- Common list view queries
CREATE INDEX IF NOT EXISTS tours_status_featured_idx ON tours(status, featured);
CREATE INDEX IF NOT EXISTS stories_published_date_idx ON stories(published_date DESC);
CREATE INDEX IF NOT EXISTS tours_created_at_idx ON tours(created_at DESC);

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_dietary_options_id_idx 
  ON payload_locked_documents_rels(dietary_options_id);
CREATE INDEX IF NOT EXISTS exports_texts_parent_id_idx 
  ON exports_texts(parent_id);
EOF

echo "✅ Indexes created successfully"
```

### Version Cleanup Job

```bash
#!/bin/bash
# scripts/cleanup-old-versions.sh

psql -h localhost -U YOUR_USER -d payload_local << 'EOF'
-- Keep latest + 49 most recent versions per document
WITH to_delete AS (
  SELECT id FROM _tours_v v1
  WHERE latest = false
  AND EXISTS (
    SELECT 1 FROM _tours_v v2 
    WHERE v2.parent_id = v1.parent_id 
    AND v2.latest = true
  )
  AND id NOT IN (
    SELECT id FROM _tours_v v3
    WHERE v3.parent_id = v1.parent_id
    ORDER BY v3.created_at DESC
    LIMIT 50
  )
)
DELETE FROM _tours_v WHERE id IN (SELECT id FROM to_delete);

-- Repeat for other collections
-- (Similar queries for _stories_v, _faqs_v, _testimonials_v)
EOF

echo "✅ Old versions cleaned up"
```

---

## 📊 Summary

| Area | Status | Priority | Effort |
|------|--------|----------|--------|
| Missing Indexes | ⚠️ Needs Work | High | 1 hour |
| Version Cleanup | ⚠️ Needs Policy | Medium | 2 hours |
| Data Integrity | ✅ Excellent | - | - |
| Primary Keys | ✅ Complete | - | - |
| Index Usage | ✅ Good | - | - |
| Backup Strategy | ⚠️ Manual | High | 1 hour |
| Monitoring | ❌ None | Medium | 2 hours |

**Total Estimated Effort:** 6-8 hours for full optimization

---

**Next Steps:**
1. Run `scripts/add-recommended-indexes.sh`
2. Set up automated backups
3. Schedule weekly VACUUM ANALYZE
4. Implement version cleanup policy

---

**Generated by:** Simply Enak Dev Team  
**Database Version:** PostgreSQL 16  
**Payload CMS:** 3.81.0
