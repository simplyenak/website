# April 2, 2026 - Collection Updates Summary

## Changes Made

### 1. ✅ Renamed Dishes → Food Items

**Why:** To include beverages and drinks in the same collection

**Changes:**
- Collection slug: `dishes` → `food_items`
- Collection name: `Dishes` → `FoodItems`
- Admin group: `Content` → `Reference Data`
- Added drink categories:
  - `Coffee/Tea` (Teh Tarik, Kopi O, etc.)
  - `Fresh Juice` (Air Mangga, Lime Juice, etc.)
  - `Traditional Drink` (Cincau, Air Sirap, Soy Bean Milk)

**Database renamed:**
- `dishes` → `food_items`
- `_dishes_v` → `_food_items_v`
- All relationship tables updated
- `tours.dishes_id` → `tours.food_items_id`

**Seeded data:** 22 items
- 12 food dishes (Nasi Lemak, Char Koay Teow, Laksa, Satay, etc.)
- 4 coffee/tea (Teh Tarik, Kopi O, etc.)
- 3 fresh juices
- 3 traditional drinks
- 2 desserts
- 2 grilled items
- 1 snack (Roti Canai)
- 3 rice dishes

### 2. ✅ Reorganized Admin Collections

**New Group Structure:**

```
🚌 Tours & Booking
  └─ Tours

📝 Content & Blog
  ├─ Stories
  ├─ Testimonials
  ├─ FAQs
  └─ Media Coverage

📚 Reference Data (NEW)
  ├─ Dietary Options
  ├─ Food Items (formerly Dishes)
  └─ Vendors

🌐 Landing Pages
  ├─ Dietary Landing Pages
  ├─ Specialty Landing Pages
  ├─ Travel Type Landing Pages
  └─ Location Landing Pages

📄 Pages
  ├─ About Page
  ├─ Contact Page
  └─ Thank You Pages

⚙️ Settings
  ├─ Translations
  └─ Site Settings
```

### 3. ❌ Dashboard

**Issue:** Payload doesn't have a built-in dashboard view by default.

**Current state:** The admin panel shows collections organized by groups.

**Options for dashboard:**
1. **Custom dashboard view** - Requires creating a custom admin view component
2. **Use first collection as "dashboard"** - Typically users see Tours first
3. **Add dashboard widget plugin** - Would need additional Payload plugin

**Recommendation:** For now, the organized collection groups serve as navigation. Users will see Tours first (it's listed first in the config).

---

## Files Modified

### Collections
- `src/collections/Dishes.ts` → `src/collections/FoodItems.ts` (renamed & updated)
- `src/collections/Tours.ts` (updated relationship to food_items)
- `src/collections/Vendors.ts` (updated relationship to food_items, changed group)
- `src/payload.config.ts` (reorganized collection order and groups)

### Migrations
- `migrations/0005_seed_food_items.sql` (NEW - seeds 22 Malaysian food/drink items)

### Database
- All `dishes*` tables renamed to `food_items*`
- Foreign keys and indexes updated
- 22 food/drink items seeded

---

## How to Access Dashboard

**There is no dedicated dashboard button.** Payload CMS shows your collections organized by groups in the left sidebar.

**What you'll see:**
1. **Left sidebar** - Collections grouped by category
2. **Main area** - List view of the selected collection
3. **Top bar** - Search, user menu, settings

**To navigate:**
1. Click collection name in left sidebar
2. Use groups to find related collections
3. First collection (Tours) is typically the "main" view

**If you want a dashboard:**
- Would require custom React component
- Could show stats: total tours, vendors, food items
- Would need custom route in Payload admin

---

## Next Steps

### Immediate
1. **Hard refresh browser** (`Ctrl+Shift+R` or `Cmd+Shift+R`)
2. **Go to Content → Food Items** - see 22 seeded items
3. **Add more food items** as needed
4. **Start adding vendors** and link to food items

### Future Enhancements
1. **Add vendor data** - 10-15 signature vendors
2. **Link tours to food items** - Edit tours and select featured foods
3. **Link vendors to food items** - Add specialty dishes for each vendor
4. **Consider custom dashboard** - If needed for analytics/overview

---

## Verification Commands

```bash
# Check food items by category
psql -U directus -d payload-local -c \
  "SELECT category, COUNT(*) FROM food_items GROUP BY category ORDER BY category;"

# Check featured items
psql -U directus -d payload-local -c \
  "SELECT name, category FROM food_items WHERE featured = true;"

# Verify admin groups
# (Check in admin panel - collections should be grouped)
```

---

**Status:** ✅ Complete  
**Date:** 2026-04-02  
**Author:** Simply Enak Dev Team
