# Directus Schema: Stories ↔ Tours Relationships
# High Priority Fix from Directus Technical Audit
# Created: March 26, 2026

# ============================================
# UPDATE: stories collection
# ============================================
# Add m2m relationship to tours

fields_to_add_to_stories:
  - field: related_tours
    type: alias
    meta:
      field: related_tours
      hidden: false
      interface: list-m2m
      note: "Tours related to this story"
      options:
        fields:
          - field: tours_id
            type: integer
            meta:
              field: tours_id
              hidden: true
              interface: select-dropdown-m2o
              options:
                template: "{{name}}"
              width: full
          - field: sort
            type: integer
            meta:
              field: sort
              hidden: true
              interface: input
              width: half
        enableCreate: true
        enableSelect: true
      readonly: false
      required: false
      searchable: false
      sort: 100
      width: full
      special: ["m2m"]
    schema:
      data_type: alias
      is_nullable: true

# ============================================
# JUNCTION TABLE: stories_related_tours
# ============================================
# Auto-created by Directus for m2m relationship

junction_table: stories_related_tours
junction_fields:
  - field: id
    type: integer
    schema:
      data_type: integer
      is_primary_key: true
      has_auto_increment: true
  
  - field: stories_id
    type: integer
    schema:
      data_type: integer
      is_nullable: false
      foreign_key_table: stories
      foreign_key_column: id
  
  - field: tours_id
    type: integer
    schema:
      data_type: integer
      is_nullable: false
      foreign_key_table: tours
      foreign_key_column: id
  
  - field: sort
    type: integer
    schema:
      data_type: integer
      is_nullable: true

# ============================================
# UPDATE: tours collection
# ============================================
# Add reverse relationship (optional, for CMS convenience)

fields_to_add_to_tours:
  - field: related_stories
    type: alias
    meta:
      field: related_stories
      hidden: false
      interface: list-o2m
      note: "Stories that mention this tour"
      options:
        template: "{{title}}"
      readonly: false
      required: false
      searchable: false
      sort: 99
      width: full
      special: ["o2m"]
      relation:
        type: one-to-many
        collection: stories_related_tours
        key: tours_id
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
  Migrate existing tour references in stories to m2m relationship
  Uses content analysis to find tour mentions
  """
  
  from directus import Directus
  import re
  
  # Connect to Directus
  client = Directus('http://localhost:8055')
  client.login('admin@simplyenak.com', 'admin123')
  
  # Get all tours
  tours = client.items('tours').read()
  tour_slug_map = {tour['slug']: tour['id'] for tour in tours}
  
  # Get all stories
  stories = client.items('stories').read()
  
  # Analyze each story for tour mentions
  for story in stories:
      content = story.get('content', '') or ''
      title = story.get('title', '') or ''
      excerpt = story.get('excerpt', '') or ''
      
      # Combine all text for analysis
      all_text = f"{title} {excerpt} {content}".lower()
      
      # Find tour slug mentions
      related_tour_ids = []
      for tour_slug, tour_id in tour_slug_map.items():
          # Check if tour slug appears in content
          if tour_slug.replace('-', ' ') in all_text or tour_slug in all_text:
              related_tour_ids.append(tour_id)
      
      # Create relationship if tours found
      if related_tour_ids:
          # Create junction table entries
          for sort_order, tour_id in enumerate(related_tour_ids):
              junction_data = {
                  'stories_id': story['id'],
                  'tours_id': tour_id,
                  'sort': sort_order
              }
              client.items('stories_related_tours').create(junction_data)
              print(f"Linked story '{story['title']}' to tour ID {tour_id}")
  
  print("Migration complete!")

# ============================================
# USAGE IN FRONTEND
# ============================================
# Update stories/[slug].astro to use related_tours relationship:

frontend_changes: |
  // In frontmatter:
  const relatedTours = story.related_tours 
    ? await getToursByIds(story.related_tours.map(rt => rt.tours_id))
    : [];
  
  // In template (replace existing related tours section):
  {relatedTours.length > 0 && (
    <section>
      <h3>Experience This on Our Tours</h3>
      <div class="grid sm:grid-cols-2 gap-6">
        {relatedTours.map((tour) => (
          <a href={`/tours/${tour.slug}/`} class="tour-card">
            {tour.hero_image && (
              <img src={tour.hero_image} alt={tour.name} />
            )}
            <h4>{tour.name}</h4>
            <p>{tour.short_description}</p>
            <span class="price">From RM {tour.price}</span>
          </a>
        ))}
      </div>
    </section>
  )}

# ============================================
# SEO BENEFITS
# ============================================
# 1. Explicit story-to-tour relationships for better internal linking
# 2. Auto-generate "Related Tours" sections
# 3. Better crawl depth for tour pages
# 4. Contextual linking improves SEO
# 5. Easier to maintain than manual content links

# ============================================
# CONTENT EDITOR BENEFITS
# ============================================
# 1. Select related tours in CMS (no manual linking)
# 2. Sort order controlled in CMS
# 3. See which stories mention each tour
# 4. Easy to update relationships
