# Directus Schema: Authors Collection
# High Priority Fix from Directus Technical Audit
# Created: March 26, 2026

# ============================================
# COLLECTION TO CREATE: authors
# ============================================
# Purpose: Reusable author bios for blog posts
# Benefits: Better E-E-A-T for SEO, consistent author information

# Collection Definition
collection: authors
meta:
  accountability: all
  archive_app_filter: true
  archive_field: null
  archive_value: null
  collapse: open
  collection: authors
  color: blue
  display_template: "{{name}}"
  group: null
  hidden: false
  icon: person
  item_duplication_fields: null
  note: "Author bios for blog posts — improves E-E-A-T for SEO"
  preview_url: null
  singleton: false
  sort: null
  sort_field: null
  translations: null
  unarchive_value: null
  versioning: false

# Fields
fields:
  - field: id
    type: integer
    meta:
      hidden: true
      readonly: true
    schema:
      data_type: integer
      is_primary_key: true
      has_auto_increment: true

  - field: name
    type: string
    meta:
      field: name
      hidden: false
      interface: input
      note: "Author's full name"
      options: {}
      readonly: false
      required: true
      searchable: true
      sort: 1
      width: full
    schema:
      data_type: varchar
      max_length: 255
      is_nullable: false

  - field: slug
    type: string
    meta:
      field: slug
      hidden: false
      interface: input
      note: "URL-friendly identifier (auto-generated)"
      options:
        slugify: true
      readonly: false
      required: true
      searchable: true
      sort: 2
      width: full
    schema:
      data_type: varchar
      max_length: 255
      is_nullable: false
      is_unique: true

  - field: bio
    type: text
    meta:
      field: bio
      hidden: false
      interface: input-multiline
      note: "2-3 sentence bio in author's own voice"
      options:
        softLength: 300
      readonly: false
      required: false
      searchable: true
      sort: 3
      width: full
    schema:
      data_type: text
      is_nullable: true

  - field: photo
    type: uuid
    meta:
      field: photo
      hidden: false
      interface: file-image
      note: "Author headshot"
      options: {}
      readonly: false
      required: false
      searchable: false
      sort: 4
      width: full
    schema:
      data_type: char(36)
      is_nullable: true
      foreign_key_table: directus_files
      foreign_key_column: id

  - field: job_title
    type: string
    meta:
      field: job_title
      hidden: false
      interface: input
      note: "e.g., Co-founder & Head Guide"
      options: {}
      readonly: false
      required: false
      searchable: true
      sort: 5
      width: full
    schema:
      data_type: varchar
      max_length: 255
      is_nullable: true

  - field: social_links
    type: json
    meta:
      field: social_links
      hidden: false
      interface: input-code
      note: "Social media links: { linkedin, facebook, instagram, twitter }"
      options:
        language: json
      readonly: false
      required: false
      searchable: false
      sort: 6
      width: full
    schema:
      data_type: json
      is_nullable: true

  - field: featured
    type: boolean
    meta:
      field: featured
      hidden: false
      interface: boolean
      note: "Show in author spotlight"
      options:
        label: "Featured Author"
      readonly: false
      required: false
      searchable: false
      sort: 7
      width: half
    schema:
      data_type: boolean
      default_value: false
      is_nullable: true

  - field: sort
    type: integer
    meta:
      field: sort
      hidden: false
      interface: input
      note: "Sort order"
      options: {}
      readonly: false
      required: false
      searchable: false
      sort: 8
      width: half
    schema:
      data_type: integer
      is_nullable: true

# ============================================
# UPDATE: stories collection
# ============================================
# Change author field from string to m2o relationship

fields_to_add_to_stories:
  - field: author_id
    type: integer
    meta:
      field: author_id
      hidden: false
      interface: select-dropdown-m2o
      note: "Author (replaces author_name string)"
      options:
        template: "{{name}}"
      readonly: false
      required: false
      searchable: true
      sort: 99
      width: full
      special: ["m2o"]
      relation:
        type: many-to-one
        collection: authors
        key: id
    schema:
      data_type: integer
      is_nullable: true
      foreign_key_table: authors
      foreign_key_column: id

# ============================================
# MIGRATION SCRIPT (Python)
# ============================================
# Run this after creating the authors collection

migration_script: |
  #!/usr/bin/env python3
  """
  Migrate existing author_name strings to authors collection
  Run after creating authors collection
  """
  
  from directus import Directus
  
  # Connect to Directus
  client = Directus('http://localhost:8055')
  client.login('admin@simplyenak.com', 'admin123')
  
  # Get all unique author names from stories
  stories = client.items('stories').read()
  unique_authors = set(story.get('author_name') for story in stories if story.get('author_name'))
  
  # Create author entries
  author_map = {}  # name -> id
  for author_name in unique_authors:
      if author_name:
          # Create author
          author_data = {
              'name': author_name,
              'slug': author_name.lower().replace(' ', '-'),
              'bio': f"Guide at Simply Enak since 2011.",
              'job_title': 'Tour Guide',
              'featured': True
          }
          created = client.items('authors').create(author_data)
          author_map[author_name] = created['id']
          print(f"Created author: {author_name} (ID: {created['id']})")
  
  # Update stories with author_id
  for story in stories:
      author_name = story.get('author_name')
      if author_name and author_name in author_map:
          client.items('stories').update(story['id'], {
              'author_id': author_map[author_name]
          })
          print(f"Updated story '{story['title']}' with author_id: {author_map[author_name]}")
  
  print("Migration complete!")

# ============================================
# USAGE IN FRONTEND
# ============================================
# Update stories/[slug].astro to use author relationship:

frontend_changes: |
  // In frontmatter:
  const author = story.author_id ? await getAuthorById(story.author_id) : null;
  
  // In template:
  {author && (
    <div class="author-bio">
      {author.photo && <img src={author.photo} alt={author.name} />}
      <h3>{author.name}</h3>
      <p class="job-title">{author.job_title}</p>
      <p class="bio">{author.bio}</p>
      {author.social_links && (
        <div class="social-links">
          {author.social_links.linkedin && <a href={author.social_links.linkedin}>LinkedIn</a>}
          {author.social_links.instagram && <a href={author.social_links.instagram}>Instagram</a>}
        </div>
      )}
    </div>
  )}

# ============================================
# SEO BENEFITS
# ============================================
# 1. Author Person schema can reference @id consistently
# 2. Better E-E-A-T signals for Google
# 3. Author archive pages possible
# 4. Consistent author information across all posts
# 5. Easier to add new authors in future
