# 🎯 Plugin Installation Plan

**Date**: April 2, 2026  
**Status**: 📋 **READY TO INSTALL**

---

## ✅ Available Plugins (Official)

| Plugin | Package | Status | Install? |
|--------|---------|--------|----------|
| **Search** | `@payloadcms/plugin-search` | ✅ Exists | ✅ YES |
| **Import/Export** | `@payloadcms/plugin-import-export` | ✅ Exists | ✅ Already installed |
| **MCP (AI)** | `@payloadcms/plugin-mcp` | ✅ Exists | ✅ Already installed |
| **SEO** | `@payloadcms/plugin-seo` | ✅ Exists | ✅ Already installed |
| **Redirects** | `@payloadcms/plugin-redirects` | ✅ Exists | ✅ Already installed |
| **Nested Docs** | `@payloadcms/plugin-nested-docs` | ✅ Exists | ✅ Already installed |
| **Stripe** | `@payloadcms/plugin-stripe` | ✅ Exists | ⏳ Maybe later |
| **Form Builder** | `@payloadcms/plugin-form-builder` | ✅ Exists | ❌ Removed (using Cloudflare) |
| **Multi-Tenant** | `@payloadcms/plugin-multi-tenant` | ✅ Exists | ❌ Not needed |
| **Ecommerce** | `@payloadcms/plugin-ecommerce` | ✅ Exists | ❌ Not needed |
| **Cloud Storage** | `@payloadcms/plugin-cloud-storage` | ✅ Exists | ⏳ Maybe (you have S3) |
| **Sentry** | `@payloadcms/plugin-sentry` | ✅ Exists | ⏳ For production |

---

## ⚠️ Plugins You Requested (Reality Check)

| Requested | Available? | Alternative |
|-----------|-----------|-------------|
| **Search plugin** | ✅ YES | `@payloadcms/plugin-search` |
| **Author fields plugin** | ❌ NO | Add author field to collections (5 min) |
| **Activity log plugin** | ❌ NO | Use Payload's built-in versions/audit |
| **Content freeze plugin** | ❌ NO | Use workflow status + permissions |
| **Better Fields plugin** | ❌ NO | Use custom field components |
| **Payload-AI plugin** | ❌ NO | Use MCP plugin (already installed!) |
| **Agentic connections** | ⚠️ Partial | MCP plugin provides this |
| **OpenAPI plugin** | ✅ YES | `payload-oapi` (community) |

---

## 🚀 Installation Plan

### Phase 1: Install Now (15 minutes)

1. **Search Plugin** ⭐
   - Package: `@payloadcms/plugin-search`
   - Purpose: Better content search across collections
   - Impact: HIGH

2. **OpenAPI Plugin** ⭐
   - Package: `payload-oapi` or `payload-swagger`
   - Purpose: Auto-generate API documentation
   - Impact: MEDIUM

3. **Author Fields** (Custom, not plugin)
   - Add author field to Stories, Tours, etc.
   - Link to Users collection
   - Impact: MEDIUM

### Phase 2: Consider Later

4. **Sentry Plugin** (Production only)
   - Error tracking
   - Install before going live

5. **Cloud Storage Plugin** (If needed)
   - Better S3 UI
   - Only if you want enhanced media management

### Phase 3: Not Needed (Already Covered)

6. **Activity Log** → Use Payload's built-in versions
7. **Content Freeze** → Use workflow permissions
8. **Better Fields** → Custom components if needed
9. **Payload-AI** → MCP plugin already does this

---

## 📋 What Each Plugin Does

### Search Plugin
**Features:**
- Unified search across all collections
- Search by title, content, tags
- Filter by collection
- Search result prioritization

**Use Cases:**
- Find tours by name
- Search stories by keyword
- Find testimonials mentioning specific tours

---

### OpenAPI/Swagger Plugin
**Features:**
- Auto-generate OpenAPI spec
- Interactive API documentation
- Test API endpoints in browser
- Export API spec

**Use Cases:**
- Document your API for frontend devs
- Let team test API without Postman
- Generate API clients

---

### Author Fields (Custom Implementation)
**Features:**
- Add author relationship to collections
- Show author name in list view
- Filter by author
- Auto-set current user as author

**Collections to Add:**
- Stories (primary author)
- Tours (tour creator)
- Media Coverage (journalist)

---

## 💡 MCP Plugin (Already Installed!)

**What it does:**
- AI/LLM integration
- Connect to AI models
- Auto-generate content
- Smart suggestions

**Your MCP Servers:**
- Google Analytics
- Google Search Console
- Google Cloud
- Affine (notes/docs)

**Use Cases:**
- AI-generated tour descriptions
- Auto-translate content
- SEO suggestions
- Content optimization

---

## 🎯 Recommendation

**Install These Now:**
1. ✅ Search plugin (15 min)
2. ✅ OpenAPI plugin (10 min)
3. ✅ Author fields (5 min custom)

**Skip These:**
- ❌ Activity log (built-in versions cover this)
- ❌ Content freeze (workflow permissions cover this)
- ❌ Better Fields (not needed yet)
- ❌ Payload-AI (MCP already installed)

**Install Later:**
- ⏳ Sentry (before production)
- ⏳ Cloud Storage (if you need better media UI)

---

## 📊 Plugin Status Summary

| Category | Plugin | Status |
|----------|--------|--------|
| **Content** | SEO | ✅ Installed |
| **Content** | Search | ⏳ Ready to install |
| **Content** | Redirects | ✅ Installed |
| **Content** | Nested Docs | ✅ Installed |
| **Operations** | Import/Export | ✅ Installed |
| **Operations** | MCP (AI) | ✅ Installed |
| **Operations** | OpenAPI | ⏳ Ready to install |
| **Payments** | Stripe | ⏳ Later |
| **Monitoring** | Sentry | ⏳ Production only |
| **Custom** | Author Fields | ⏳ 5 min custom |

---

**Created**: 2026-04-02  
**For**: Simply Enak Team  
**Next**: Install Search + OpenAPI + Author fields
