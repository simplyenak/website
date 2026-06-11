# 🔐 Payload CMS - Permissions & Workflows Guide

**Date**: April 2, 2026  
**Status**: ✅ **READY TO IMPLEMENT**

---

## ✅ Yes, Payload Has Permissions!

Payload has **granular access control** built-in. You can control:

| Permission Level | What You Can Control |
|-----------------|---------------------|
| **Collection Access** | Who can access which collections |
| **Field-Level Access** | Who can edit specific fields |
| **Document-Level Access** | Who can edit specific documents |
| **Operation-Level** | Create, Read, Update, Delete permissions |
| **Custom Logic** | Any custom rules you need |

---

## 🎯 Simply Enak Team Roles

### Recommended Roles:

| Role | Who | Permissions |
|------|-----|-------------|
| **Admin** | You (Maarten) | ✅ Full access to everything |
| **Content Editor** | Marketing team | ✅ Edit content, ❌ Can't delete, ❌ Can't change settings |
| **Translator** | Translation agency | ✅ Edit translations only, ❌ Can't publish |
| **SEO Manager** | SEO person | ✅ Edit SEO fields, ❌ Can't change content |
| **Reviewer** | Manager | ✅ Review & approve, ❌ Can't create content |

---

## 📋 Implementation Options

### Option 1: Simple Roles (Recommended to Start)

**Quick to implement** (30 minutes):

```typescript
// In Users collection
{
  name: 'role',
  type: 'select',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Content Editor', value: 'editor' },
    { label: 'Translator', value: 'translator' },
    { label: 'Reviewer', value: 'reviewer' },
  ],
  defaultValue: 'editor',
}
```

**Then add access control to collections:**

```typescript
// Tours collection
admin: {
  useAsTitle: 'name',
  group: 'Content',
}
access: {
  // Who can read tours
  read: () => true,
  
  // Who can create tours
  create: (req) => ['admin', 'editor'].includes(req.user.role),
  
  // Who can update tours
  update: (req) => ['admin', 'editor'].includes(req.user.role),
  
  // Who can delete tours (only admin!)
  delete: (req) => req.user.role === 'admin',
},
```

---

### Option 2: Advanced Workflows (Best for Teams)

**Full workflow with status tracking:**

```
Draft → In Review → Approved → Published
```

**Implementation:**

```typescript
// Add workflow status field
{
  name: 'workflowStatus',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  admin: {
    description: 'Workflow status',
  },
}

// Access control based on workflow
access: {
  update: (req) => {
    const user = req.user;
    const doc = req.data;
    
    // Admin can do anything
    if (user.role === 'admin') return true;
    
    // Editors can create and draft
    if (user.role === 'editor' && doc.workflowStatus === 'draft') {
      return true;
    }
    
    // Reviewers can approve
    if (user.role === 'reviewer' && doc.workflowStatus === 'in_review') {
      return true;
    }
    
    return false;
  },
},
```

---

### Option 3: Field-Level Permissions (Most Granular)

**Control who can edit specific fields:**

```typescript
// Price field - only admin can change
{
  name: 'price',
  type: 'number',
  access: {
    update: (req) => req.user.role === 'admin',
  },
}

// SEO fields - only SEO manager can edit
{
  name: 'metaTitle',
  type: 'text',
  access: {
    update: (req) => ['admin', 'seo_manager'].includes(req.user.role),
  },
}

// Translations - only translators can edit
{
  name: 'translations',
  type: 'array',
  access: {
    update: (req) => ['admin', 'translator'].includes(req.user.role),
  },
}
```

---

## 🎯 Recommended Setup for Simply Enak

### User Roles:

```typescript
const ROLES = {
  ADMIN: 'admin',           // You - full access
  EDITOR: 'content_editor', // Marketing team - edit content
  TRANSLATOR: 'translator', // Translation agency - translations only
  REVIEWER: 'reviewer',     // Manager - approve content
}
```

### Collection Permissions:

| Collection | Admin | Editor | Translator | Reviewer |
|------------|-------|--------|------------|----------|
| **Tours** | ✅ All | ✅ Edit | ❌ | ✅ Approve |
| **Stories** | ✅ All | ✅ Edit | ❌ | ✅ Approve |
| **Testimonials** | ✅ All | ✅ Edit | ❌ | ✅ Approve |
| **FAQs** | ✅ All | ✅ Edit | ❌ | ✅ Approve |
| **Translations** | ✅ All | ❌ | ✅ Edit | ✅ Approve |
| **Media** | ✅ All | ✅ Upload | ❌ | ❌ |
| **Users** | ✅ All | ❌ | ❌ | ❌ |
| **Site Settings** | ✅ All | ❌ | ❌ | ❌ |

---

## 📝 Workflow Examples

### Content Creation Workflow

```
1. Editor creates tour (Status: Draft)
2. Editor submits for review (Status: In Review)
3. Reviewer approves (Status: Approved)
4. Admin publishes (Status: Published)
```

### Translation Workflow

```
1. Admin creates translation request (Status: Draft)
2. Translator translates (Status: In Translation)
3. Translator marks ready (Status: Ready for Review)
4. Reviewer approves (Status: Approved)
5. Admin publishes (Status: Published)
```

---

## 🔧 Implementation Code

### Step 1: Add Role to Users

```typescript
// src/collections/Users.ts
{
  name: 'role',
  type: 'select',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Content Editor', value: 'editor' },
    { label: 'Translator', value: 'translator' },
    { label: 'Reviewer', value: 'reviewer' },
  ],
  defaultValue: 'editor',
  admin: {
    description: 'User role determines permissions',
  },
}
```

### Step 2: Add Access Control to Collections

```typescript
// src/collections/Tours.ts
export const Tours: CollectionConfig = {
  slug: 'tours',
  access: {
    read: () => true,
    create: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'editor', 'reviewer'].includes(user?.role),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  // ... fields
}
```

### Step 3: Add Workflow Status

```typescript
// Add to Tours, Stories, etc.
{
  name: 'workflowStatus',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  admin: {
    description: 'Where is this content in the workflow?',
  },
}
```

---

## 💡 Advanced Features

### Hook-Based Workflows

```typescript
// Send email when content submitted for review
hooks: {
  beforeChange: [
    async ({ req, data, originalDoc }) => {
      if (data.workflowStatus === 'in_review' && 
          originalDoc.workflowStatus === 'draft') {
        // Send email to reviewers
        await sendReviewEmail({
          to: 'reviewer@simplyenak.com',
          subject: 'Content Ready for Review',
          content: originalDoc.name,
        });
      }
      return data;
    },
  ],
},
```

### Version Comparison

```typescript
// Payload has built-in versioning!
versions: {
  drafts: {
    autosave: {
      interval: 300000, // 5 minutes
    },
  },
  maxPerDoc: 50,
},
```

---

## 🎯 Quick Start (15 Minutes)

**Want me to implement basic permissions now?**

I can add:
1. ✅ Role field to Users
2. ✅ Basic access control to all collections
3. ✅ Workflow status field
4. ✅ Field-level permissions for sensitive fields

**Just say "yes" and I'll set it up!**

---

## 📚 Resources

**Official Docs:**
- Access Control: https://payloadcms.com/docs/access-control/overview
- Hooks: https://payloadcms.com/docs/hooks/overview
- Versions: https://payloadcms.com/docs/versions/overview

**Examples:**
- Role-based access
- Field-level permissions
- Workflow automation
- Email notifications

---

**Created**: 2026-04-02  
**For**: Simply Enak Team  
**Ready to Implement**: YES!
