# Dishes Collection - Food Database

## Overview

A centralized database of food items featured on Simply Enak tours. This allows you to:
- **Administer dishes once** - Add detailed information about each dish in one place
- **Reuse across tours** - Link the same dish to multiple tours
- **Build rich content** - Connect dishes to blog posts, vendor profiles, and recipes
- **Maintain consistency** - Standardized names, descriptions, and dietary information

## Collection Structure

### Core Fields
- **name** - Dish name (e.g., "Nasi Lemak")
- **slug** - URL-friendly identifier
- **localNames** - Names in different languages (Bahasa, Chinese, Tamil)
- **description** - What is this dish?
- **category** - Type (main, snack, dessert, beverage, etc.)
- **origin** - Cultural origin (Malay, Chinese, Indian, Peranakan, etc.)
- **region** - Specific region (Penang, Kelantan, Hainan, etc.)

### Food Details
- **ingredients** - Key ingredients with main ingredient flagged
- **allergens** - Common allergens (shellfish, peanuts, wheat, etc.)
- **dietaryTags** - Relationship to dietary_options (Halal, Vegetarian, etc.)
- **spiceLevel** - 0-5 scale
- **flavorProfile** - Sweet, sour, salty, umami, etc.
- **preparationMethod** - Stir-fried, steamed, grilled, etc.

### Media
- **image** - Main hero photo (uploaded to Media library)
- **galleryImages** - Additional photos (multiple images from Media library)

### Practical Info
- **typicalPrice** - Street food price range in MYR
- **availability** - Year-round, seasonal, festival only, etc.
- **culturalSignificance** - History and stories behind the dish
- **servingSuggestions** - How to eat it, what it comes with
- **popularVariations** - Regional or vendor variations
- **pairings** - What drinks/dishes go well with it
- **vendorNotes** - Famous stalls or restaurants

### Admin Fields
- **status** - Draft/Published
- **featured** - Mark as signature/must-try dish
- **scheduledPublish** - Auto-publish date/time

## Future Use Cases (Prepared For)

### 1. Blog Content
Link dishes to stories/blog posts:
```typescript
// In Stories collection (future enhancement)
{
  name: 'relatedDishes',
  type: 'relationship',
  relationTo: 'dishes',
  hasMany: true,
}
```

### 2. Vendor Profiles
Track which vendors serve each dish:
```typescript
// Create Vendors collection (future)
{
  name: 'signatureDishes',
  type: 'relationship',
  relationTo: 'dishes',
  hasMany: true,
}
```

### 3. Recipe Database
Add recipe fields when ready to share:
```typescript
// Add to Dishes collection (future)
{
  name: 'recipe',
  type: 'richText',
  admin: {
    description: 'Full recipe for home cooks',
  },
}
```

### 4. Food Tours by Dish
Create landing pages for specific dishes:
```
/dishes/nasi-lemak → All tours featuring Nasi Lemak
/dishes/char-koay-teow → All tours with CKT
```

## Sample Malaysian Dishes to Add

### Nasi Lemak
- **Category:** Rice Dish / Breakfast
- **Origin:** Malay
- **Description:** Fragrant coconut rice with sambal, anchovies, peanuts, boiled egg, cucumber
- **Spice Level:** 2-3 (depends on sambal)
- **Allergens:** Fish (anchovies), Peanuts
- **Dietary:** Can be made Halal, Vegetarian version available
- **Typical Price:** RM 3-8 (street food)

### Char Koay Teow
- **Category:** Noodles / Main Dish
- **Origin:** Chinese (Hokkien)
- **Region:** Penang
- **Description:** Stir-fried flat rice noodles with shrimp, cockles, Chinese sausage, bean sprouts
- **Spice Level:** 1-2
- **Allergens:** Shellfish, Fish, Soy, Wheat
- **Preparation:** Stir-fried
- **Typical Price:** RM 6-10

### Satay
- **Category:** Grilled / Main Dish / Snack
- **Origin:** Malay / Indonesian
- **Description:** Skewered and grilled meat with peanut sauce
- **Spice Level:** 1-2
- **Allergens:** Peanuts, Soy
- **Dietary:** Halal (chicken/beef), Vegetarian version available
- **Preparation:** Grilled/BBQ
- **Typical Price:** RM 0.80-1.50 per stick

### Cendol
- **Category:** Dessert / Beverage
- **Origin:** Peranakan / Malay
- **Description:** Shaved ice dessert with green rice flour jelly, coconut milk, palm sugar
- **Spice Level:** 0
- **Allergens:** Dairy (coconut)
- **Dietary:** Vegetarian, Vegan
- **Availability:** Year-round, best in hot weather
- **Typical Price:** RM 3-5

### Roti Canai
- **Category:** Breakfast / Main Dish
- **Origin:** Indian
- **Description:** Flaky flatbread served with curry or dhal
- **Spice Level:** 1-2 (depends on curry)
- **Allergens:** Wheat, Dairy (ghee)
- **Dietary:** Vegetarian option available
- **Preparation:** Stir-fried (dough tossing technique)
- **Typical Price:** RM 1.50-3

### Laksa Penang (Asam Laksa)
- **Category:** Noodles / Soup / Main Dish
- **Origin:** Peranakan
- **Region:** Penang
- **Description:** Sour and spicy fish-based noodle soup with tamarind
- **Spice Level:** 3-4
- **Allergens:** Fish, Shellfish
- **Flavor Profile:** Sour, Spicy, Savory
- **Typical Price:** RM 5-8

## How to Use

### For Admins

1. **Add a new dish:**
   - Go to Content → Dishes
   - Click "Create New"
   - Fill in all relevant fields
   - Upload photos
   - Set status to Published

2. **Link dish to tour:**
   - Go to Content → Tours
   - Edit a tour
   - In the "Dishes" field, select dishes featured on that tour
   - Save

3. **Update dish information:**
   - Go to Content → Dishes
   - Click on any dish
   - Edit details (e.g., update vendor notes, add new photos)
   - Changes apply to ALL tours featuring this dish

### For Developers

**Query dishes on a tour:**
```typescript
const tour = await payload.findByID({
  collection: 'tours',
  id: tourId,
  depth: 2, // Populates dishes relationship
});

// tour.dishes will be array of dish objects
tour.dishes.forEach(dish => {
  console.log(dish.name, dish.description, dish.image);
});
```

**Find all tours featuring a specific dish:**
```typescript
const tours = await payload.find({
  collection: 'tours',
  where: {
    dishes: {
      equals: dishId,
    },
  },
});
```

**Query dishes by dietary requirement:**
```typescript
const halalDishes = await payload.find({
  collection: 'dishes',
  where: {
    dietaryTags: {
      in: [halalDietaryOptionId],
    },
  },
});
```

## Database Schema

### Main Tables
- `dishes` - Main dishes table
- `_dishes_v` - Version table for drafts
- `dishes_local_names` - Array field
- `dishes_ingredients` - Array field
- `dishes_allergens` - Array field
- `dishes_flavor_profile` - Array field
- `dishes_gallery_images` - Array field
- `tours_rels` - Relationship table (includes dishes_id)
- `_tours_v_rels` - Version relationship table

### Key Relationships
- **Tours → Dishes** (hasMany, via tours_rels.dishes_id)
- **Dishes → Dietary Options** (hasMany, via dishes.dietaryTags)

## Migration

Run the migration:
```bash
psql -U directus -d payload-local \
  -f /var/home/maarten/website-optimization/payload-local/migrations/0003_add_dishes.sql
```

Verify:
```bash
./scripts/verify-schema.sh
```

---

**Created:** 2026-04-02  
**Status:** ✅ Ready for data entry  
**Next Steps:** Add 20-30 signature Malaysian dishes
