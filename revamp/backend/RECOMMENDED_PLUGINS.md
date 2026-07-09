# 🎯 Recommended Plugins for Simply Enak

**Date**: April 2, 2026  
**Status**: ✅ **CURATED LIST**

---

## ✅ Currently Installed

| Plugin | Purpose | Status |
|--------|---------|--------|
| **@payloadcms/plugin-seo** | SEO meta tags | ✅ Active |
| **@payloadcms/plugin-redirects** | URL redirects | ✅ Active |
| **@payloadcms/plugin-nested-docs** | Hierarchical pages | ✅ Active |
| **@payloadcms/storage-s3** | S3 storage | ✅ Active |

---

## 🚀 Highly Recommended (Install These!)

### 1. Form Builder Plugin ⭐⭐⭐⭐⭐

**Package**: `@payloadcms/plugin-form-builder`

**Why You Need It:**
- Create contact forms
- Booking inquiry forms
- Custom lead capture forms
- Newsletter signup
- Feedback forms

**Use Cases for Simply Enak:**
```
✅ Contact Us form
✅ Private Tour Inquiry form
✅ Corporate Groups Inquiry
✅ Feedback/Survey form
✅ Newsletter signup
```

**What It Adds:**
- Forms collection
- Form submissions tracking
- Email notifications
- Custom fields per form

**Install Time**: 5 minutes  
**Impact**: HIGH - Essential for business!

---

### 2. Search Plugin ⭐⭐⭐⭐

**Package**: `@payloadcms/plugin-search`

**Why You Need It:**
- Better content search in admin
- Search across all collections
- Filter by collection, date, status
- Faster content discovery

**Use Cases:**
```
✅ Find tours by name/location
✅ Search stories by keyword
✅ Find testimonials mentioning specific tours
✅ Quick content lookup
```

**What It Adds:**
- Unified search index
- Search UI in admin
- Cross-collection search
- Search analytics (optional)

**Install Time**: 10 minutes  
**Impact**: MEDIUM - Nice to have for large content

---

### 3. Import/Export Plugin ⭐⭐⭐⭐⭐

**Package**: `@payloadcms/plugin-import-export`

**Why You Need It:**
- Export content to CSV/JSON
- Import content from spreadsheets
- Backup content easily
- Migrate content between environments

**Use Cases for Simply Enak:**
```
✅ Export all tours to Excel for review
✅ Import new tour data from spreadsheet
✅ Backup content before major changes
✅ Share content with team offline
```

**What It Adds:**
- Export button in list views
- Import from CSV/JSON
- Field mapping
- Batch operations

**Install Time**: 5 minutes  
**Impact**: HIGH - Essential for content management!

---

### 4. Cloud Storage Plugin (Enhanced) ⭐⭐⭐⭐

**Package**: `@payloadcms/plugin-cloud-storage`

**Why You Need It:**
- You already have S3 configured
- This adds better UI for media management
- File browser interface
- Better upload handling

**Use Cases:**
```
✅ Browse S3 bucket in admin
✅ Better image upload UI
✅ File organization
✅ CDN integration
```

**Note**: You have `@payloadcms/storage-s3` already. This adds the UI layer.

**Install Time**: 10 minutes  
**Impact**: MEDIUM - Quality of life improvement

---

## ⚠️ Maybe Useful (Consider Later)

### 5. Stripe Plugin ⭐⭐⭐

**Package**: `@payloadcms/plugin-stripe`

**Why Consider:**
- If you want to sell tours directly
- Payment processing
- Subscription management
- Invoice generation

**Use Cases:**
```
⏳ Direct tour booking with payment
⏳ Subscription plans (monthly food tours)
⏳ Gift card sales
⏳ Deposit collection for private tours
```

**Why Wait:**
- Requires Stripe account
- Need booking system first
- Complex setup
- Legal/compliance considerations

**Install Time**: 1-2 hours  
**Impact**: HIGH (but only if you need payments)

---

### 6. Sentry Plugin ⭐⭐⭐

**Package**: `@payloadcms/plugin-sentry`

**Why Consider:**
- Error tracking
- Performance monitoring
- User session tracking
- Crash reporting

**Use Cases:**
```
⏳ Track admin errors
⏳ Monitor API performance
⏳ Catch production issues
⏳ User experience monitoring
```

**Why Wait:**
- Need Sentry account (free tier available)
- Only useful in production
- Can add noise during development

**Install Time**: 15 minutes  
**Impact**: MEDIUM (for production only)

---

### 7. MCP Plugin ⭐⭐⭐⭐

**Package**: `@payloadcms/plugin-mcp`

**Why Consider:**
- AI/LLM integration
- You already have MCP servers set up
- AI-assisted content creation
- Smart content suggestions

**Use Cases for Simply Enak:**
```
✅ AI-generated tour descriptions
✅ Auto-translate content
✅ Smart content suggestions
✅ AI image tagging
```

**What It Adds:**
- MCP server integration
- AI content generation
- Context sharing
- LLM capabilities

**Install Time**: 15 minutes  
**Impact**: HIGH - You already have MCP infrastructure!

---

## ❌ Not Needed (Skip These)

### Ecommerce Plugin
**Package**: `@payloadcms/plugin-ecommerce`

**Why Skip:**
- Too complex for tour bookings
- Better to build custom booking system
- Stripe plugin is simpler if needed
- Tours aren't typical "products"

---

### Multi-Tenant Plugin
**Package**: `@payloadcms/plugin-multi-tenant`

**Why Skip:**
- For SaaS with multiple customers
- You're a single business
- Unnecessary complexity

---

## 📊 My Recommendations

### Install NOW (Today - 30 minutes):

1. **Form Builder** - Essential for inquiries
2. **Import/Export** - Essential for content management
3. **MCP** - You have the infrastructure, use it!

### Install SOON (This Week):

4. **Search** - Better content discovery
5. **Cloud Storage UI** - Better media management

### Install LATER (When Needed):

6. **Sentry** - When you go live
7. **Stripe** - If you add direct booking

---

## 💰 Cost Breakdown

| Plugin | Cost | Notes |
|--------|------|-------|
| Form Builder | FREE | Official plugin |
| Import/Export | FREE | Official plugin |
| Search | FREE | Official plugin |
| MCP | FREE | Official plugin |
| Cloud Storage | FREE | Official plugin |
| Sentry | FREE-$29/mo | Free tier sufficient |
| Stripe | 2.9% + $0.30 | Per transaction |

**Total**: $0/month for most plugins!

---

## 🚀 Installation Priority

```
Priority 1 (Business Critical):
├── Form Builder ✅ Install today
└── Import/Export ✅ Install today

Priority 2 (Productivity):
├── MCP ✅ Install today
├── Search ⏳ Install this week
└── Cloud Storage UI ⏳ Install this week

Priority 3 (Production):
├── Sentry ⏳ Install before launch
└── Stripe ⏳ Install if needed
```

---

## 📝 Next Steps

**Shall I install these for you?**

Run this command to install all recommended plugins:

```bash
cd /var/home/maarten/website-optimization/payload-local
npm install @payloadcms/plugin-form-builder @payloadcms/plugin-import-export @payloadcms/plugin-mcp @payloadcms/plugin-search
```

Then I'll configure them for your Simply Enak setup!

---

**Created**: 2026-04-02  
**For**: Simply Enak Team  
**Recommendation**: Install Priority 1 plugins NOW!
