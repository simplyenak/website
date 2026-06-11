# Vendors Collection - Food Vendor Database

## Overview

A comprehensive database of food vendors, stalls, hawkers, and restaurants featured on Simply Enak tours. This allows you to:

- **Track vendor relationships** - Know which vendors serve which dishes
- **Preserve vendor stories** - Document heritage, family history, cultural significance
- **Provide practical info** - Operating hours, location, payment methods, facilities
- **Build vendor profiles** - Create rich pages for each vendor

## Collection Structure

### Core Information
- **name** - Vendor/stall/restaurant name
- **slug** - URL-friendly identifier
- **type** - Street stall, hawker, kopitiam, restaurant, etc.
- **description** - Brief overview
- **cuisineType** - Malay, Chinese, Indian, Peranakan, etc.

### Heritage & Story
- **history** - Background and heritage
- **yearEstablished** - When they started
- **generation** - Which generation runs it now
- **ownerName** - Current owner/chef
- **story** - Full narrative, anecdotes, interesting facts

### Products & Offerings
- **specialtyDishes** - Relationship to Dishes collection (hasMany)
- **dietaryOptions** - Relationship to Dietary Options (Halal, Vegetarian, etc.)

### Location
- **location.address** - Street address
- **location.city** - City
- **location.state** - State
- **location.postcode** - Postcode
- **location.country** - Country (default: Malaysia)
- **location.latitude/longitude** - GPS coordinates
- **location.landmark** - Nearby landmark for directions

### Operating Information
- **operatingHours** - Array: Day-by-day hours with notes
- **closedOn** - Array: Regular closed days
- **priceRange** - Budget to fine dining
- **paymentMethods** - Cash, eWallet, cards, etc.
- **facilities** - Aircon, WiFi, parking, wheelchair access, etc.

### Contact
- **contact.phone** - Phone number
- **contact.whatsapp** - WhatsApp number
- **contact.email** - Email
- **contact.website** - Website
- **contact.facebook** - Facebook page
- **contact.instagram** - Instagram

### Media
- **images.main** - Main photo (relationship to Media)
- **images.gallery** - Additional photos (hasMany)
- **images.foodPhotos** - Food photos (hasMany)

### Recognition
- **awards** - Array: Awards, recognitions with year and organization
- **mediaFeatures** - TV shows, newspapers, magazines, blogs
- **featured** - Mark as heritage/featured vendor

### Practical
- **tips** - Visitor tips ("Arrive early", "Cash only", etc.)
- **status** - Draft/Published/Closed Permanently

## Future Use Cases (Prepared For)

### 1. Tour-Vendor Relationships
Track which tours visit which vendors:
```typescript
// Already possible via Dishes collection
// Tour → Dishes → Vendors (indirect)

// Or add direct relationship in future:
{
  name: 'vendors',
  type: 'relationship',
  relationTo: 'vendors',
  hasMany: true,
}
```

### 2. Vendor Landing Pages
Create public-facing vendor profiles:
```
/vendors/chan-kong-kopitiam → Full vendor story, menu, location
/vendors/auntie-laksa → Heritage, awards, visiting info
```

### 3. Blog Content
Link vendors to stories:
```typescript
// In Stories collection (future)
{
  name: 'featuredVendors',
  type: 'relationship',
  relationTo: 'vendors',
  hasMany: true,
}
```

### 4. Map Integration
Plot vendors on interactive map:
- Filter by cuisine type
- Filter by vendor type
- Show operating hours
- Walking tour routes

### 5. Vendor Analytics
Track which vendors are most popular:
- Tour feedback
- Customer reviews
- Photo submissions

## Sample Malaysian Vendors to Add

### Heritage Kopitiams
**Chan Kong Kopitiam (Kuala Lumpur)**
- Type: Coffee Shop (Kopitiam)
- Established: 1952, 3rd generation
- Specialty: Traditional Hainanese coffee, kaya toast
- Location: Jalan Petaling, KL
- Story: Family-run for 70+ years, original recipes

### Hawker Legends
**Auntie's Char Koay Teow (Penang)**
- Type: Hawker Stall
- Established: 1978, 2nd generation
- Specialty: Char Koay Teow, Hokkien Mee
- Location: Siam Road, Penang
- Awards: Featured on Anthony Bourdain's No Reservations

### Night Market Stars
**Pasar Malam SS2 Stall 47**
- Type: Night Market Stall
- Specialty: Satay, Lok Lok
- Operating: Friday nights only
- Tips: Arrive before 8pm to avoid crowds

## Database Schema

### Main Tables
- `vendors` - Main vendors table
- `_vendors_v` - Version table for drafts
- `vendors_operating_hours` - Array field
- `vendors_closed_on` - Array field
- `vendors_payment_methods` - Array field
- `vendors_facilities` - Array field
- `vendors_awards` - Array field
- `vendors_rels` - Relationship table (specialtyDishes, dietaryOptions, images)
- `_vendors_v_rels` - Version relationship table

### Key Relationships
- **Vendors → Dishes** (hasMany, via vendors_rels.dishes_id)
- **Vendors → Dietary Options** (hasMany, via vendors_rels.dietary_options_id)
- **Vendors → Media** (hasMany, via vendors_rels.media_id)

## How to Use

### For Admins

1. **Add a new vendor:**
   - Go to Content → Vendors
   - Click "Create New"
   - Fill in all details
   - Upload photos
   - Add specialty dishes (link to existing dishes)
   - Set status to Published

2. **Link dishes to vendor:**
   - Edit the vendor
   - In "Specialty Dishes" field, select dishes they serve
   - Save

3. **Update vendor information:**
   - Changes apply everywhere (tours, blog posts, etc.)

### For Developers

**Query vendor with dishes:**
```typescript
const vendor = await payload.findByID({
  collection: 'vendors',
  id: vendorId,
  depth: 2, // Populates specialtyDishes relationship
});

// vendor.specialtyDishes will be array of dish objects
vendor.specialtyDishes.forEach(dish => {
  console.log(dish.name, dish.description);
});
```

**Find vendors by city:**
```typescript
const klVendors = await payload.find({
  collection: 'vendors',
  where: {
    'location.city': {
      equals: 'Kuala Lumpur',
    },
  },
});
```

**Find vendors serving specific dish:**
```typescript
const vendors = await payload.find({
  collection: 'vendors',
  where: {
    specialtyDishes: {
      equals: dishId,
    },
  },
});
```

## Migration

Run the migration:
```bash
psql -U directus -d payload-local \
  -f /var/home/maarten/website-optimization/payload-local/migrations/0004_add_vendors.sql
```

Verify:
```bash
./scripts/verify-schema.sh
```

## Data Entry Priority

### Phase 1: Core Vendors (Week 1)
- Add 10-15 vendors currently featured on tours
- Include basic info: name, type, location, specialty dishes
- Link to existing dishes

### Phase 2: Rich Profiles (Week 2-3)
- Add vendor stories and history
- Upload photos
- Add operating hours, payment methods, facilities

### Phase 3: Complete Database (Ongoing)
- Add all vendors from tour history
- Include awards and media features
- Map coordinates for all

---

**Created:** 2026-04-02  
**Status:** ✅ Ready for data entry  
**Next Steps:** Add 10-15 signature vendors from current tours
