# Directus Schema: Tours ↔ Location Pages Relationship
# High Priority Fix from Directus Technical Audit
# Created: March 26, 2026

# ============================================
# UPDATE: tours collection
# ============================================
# Add m2o relationship to location_landing_pages

fields_to_add_to_tours:
  - field: location_page_id
    type: integer
    meta:
      field: location_page_id
      hidden: false
      interface: select-dropdown-m2o
      note: "Location landing page (KL, Penang, etc.)"
      options:
        template: "{{location_name}}"
      readonly: false
      required: false
      searchable: true
      sort: 99
      width: full
      special: ["m2o"]
      relation:
        type: many-to-one
        collection: location_landing_pages
        key: id
    schema:
      data_type: integer
      is_nullable: true
      foreign_key_table: location_landing_pages
      foreign_key_column: id

# ============================================
# UPDATE: location_landing_pages collection
# ============================================
# Add reverse relationship (optional, for CMS convenience)

fields_to_add_to_location_pages:
  - field: tours
    type: alias
    meta:
      field: tours
      hidden: false
      interface: list-o2m
      note: "Tours in this location"
      options:
        template: "{{name}}"
      readonly: false
      required: false
      searchable: false
      sort: 99
      width: full
      special: ["o2m"]
      relation:
        type: one-to-many
        collection: tours
        key: location_page_id
    schema:
      data_type: alias
      is_nullable: true

# ============================================
# MIGRATION SCRIPT (Python)
# ============================================
# Run this after creating the relationship

migration_script: |
  #!/usr/bin/env python3
  """
  Migrate existing tour location strings to location_page_id relationship
  """
  
  from directus import Directus
  
  # Connect to Directus
  client = Directus('http://localhost:8055')
  client.login('admin@simplyenak.com', 'admin123')
  
  # Get all location pages
  location_pages = client.items('location_landing_pages').read()
  
  # Create slug to ID map
  location_map = {}
  for page in location_pages:
      slug = page.get('slug', '')
      location_name = page.get('location_name', '').lower()
      location_map[slug] = page['id']
      location_map[location_name] = page['id']
      # Also map common variations
      if 'kuala lumpur' in location_name:
          location_map['kl'] = page['id']
          location_map['kuala lumpur'] = page['id']
      elif 'penang' in location_name:
          location_map['georgetown'] = page['id']
          location_map['george town'] = page['id']
  
  # Get all tours
  tours = client.items('tours').read()
  
  # Update tours with location_page_id
  for tour in tours:
      # Try to match location string
      location_string = tour.get('location', '').lower()
      
      # Check various fields for location info
      location_candidates = [
          location_string,
          tour.get('slug', '').lower(),
          tour.get('name', '').lower()
      ]
      
      location_page_id = None
      for candidate in location_candidates:
          if candidate in location_map:
              location_page_id = location_map[candidate]
              break
      
      # Update tour if location found
      if location_page_id:
          client.items('tours').update(tour['id'], {
              'location_page_id': location_page_id
          })
          print(f"Updated tour '{tour['name']}' with location_page_id: {location_page_id}")
      else:
          print(f"WARNING: Could not match location for tour '{tour['name']}' (location: {location_string})")
  
  print("Migration complete!")

# ============================================
# USAGE IN FRONTEND
# ============================================
# Update tours/[slug].astro to use location_page relationship:

frontend_changes: |
  // In frontmatter (replace existing location logic):
  const locationPage = tour.location_page_id 
    ? await getLocationPageById(tour.location_page_id)
    : null;
  
  // In template (update internal links section):
  {locationPage && (
    <div class="location-link">
      <a href={`/tours/locations/${locationPage.slug}/`}>
        {locationPage.location_name} food tours
      </a>
    </div>
  )}
  
  // Update location pages to use relationship:
  // In tours/locations/[slug].astro:
  const tours = await getToursByLocationId(page.id); // Instead of by slug

# ============================================
# SEO BENEFITS
# ============================================
# 1. Explicit tour-to-location relationships
# 2. Auto-generate "Tours in [Location]" sections
# 3. Better internal linking structure
# 4. Easier to add new locations
# 5. Consistent location data across site

# ============================================
# CONTENT EDITOR BENEFITS
# ============================================
# 1. Select location from dropdown (no typing)
# 2. See all tours for a location in one place
# 3. Easy to move tours between locations
# 4. Prevents typos in location names

# ============================================
# DEPRECATE OLD FIELD
# ============================================
# After migration, the `location` string field can be:
# 1. Kept as backup (hidden in CMS)
# 2. Removed entirely (after verifying all tours have location_page_id)
# 
# Recommendation: Keep hidden for 30 days, then remove
