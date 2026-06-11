#!/usr/bin/env python3
"""Export Directus SQLite data to JSON files for Payload import."""

import sqlite3
import json
import os
from datetime import datetime

DB_PATH = "/var/home/maarten/website-optimization/ARCHIVED/directus-old/directus/docker/data.db"
OUTPUT_DIR = "/var/home/maarten/website-optimization/payload-local/scripts/directus-export"

os.makedirs(OUTPUT_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Map Directus tables to Payload collections
TABLE_MAPPINGS = {
    'directus_users': 'users',
    'tours': 'tours',
    'tours_translations': 'tours_translations',
    'stories': 'stories',
    'stories_translations': 'stories_translations',
    'faqs': 'faqs',
    'faqs_translations': 'faqs_translations',
    'testimonials': 'testimonials',
    'testimonials_translations': 'testimonials_translations',
    'dietary_landing_pages': 'dietary_landing_pages',
    'dietary_landing_pages_translations': 'dietary_landing_pages_translations',
    'specialty_landing_pages': 'specialty_landing_pages',
    'specialty_landing_pages_translations': 'specialty_landing_pages_translations',
    'travel_type_landing_pages': 'travel_type_landing_pages',
    'travel_type_landing_pages_translations': 'travel_type_landing_pages_translations',
    'location_landing_pages': 'location_landing_pages',
    'location_landing_pages_translations': 'location_landing_pages_translations',
    'about_page': 'about_page',
    'about_page_translations': 'about_page_translations',
    'contact_page': 'contact_page',
    'contact_page_translations': 'contact_page_translations',
    'faq_page': 'faq_page',
    'faq_page_translations': 'faq_page_translations',
    'media_coverage': 'media_coverage',
    'directus_files': 'directus_files',
}

for table, collection in TABLE_MAPPINGS.items():
    try:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        if rows:
            data = [dict(row) for row in rows]
            output_file = os.path.join(OUTPUT_DIR, f"{collection}.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)
            print(f"✅ {collection}: {len(data)} rows → {output_file}")
        else:
            print(f"⚠️  {collection}: empty")
    except Exception as e:
        print(f"❌ {collection}: ERROR - {e}")

conn.close()
print(f"\nExport complete! Files saved to: {OUTPUT_DIR}")
