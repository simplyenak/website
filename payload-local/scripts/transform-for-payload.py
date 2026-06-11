#!/usr/bin/env python3
"""Transform Directus JSON exports to Payload import format."""

import json
import os
from datetime import datetime

EXPORT_DIR = "/var/home/maarten/website-optimization/payload-local/scripts/directus-export"
OUTPUT_DIR = "/var/home/maarten/website-optimization/payload-local/scripts/payload-import"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def transform_users(data):
    """Transform Directus users to Payload format."""
    result = []
    for user in data:
        result.append({
            "email": user["email"],
            "role": "admin",  # Default to admin for the main user
            "fullName": f"{user.get('first_name', '')} {user.get('last_name', '')}".strip() or None,
            "_status": "published",
        })
    return result

def transform_tours(tours, translations):
    """Transform tours with translations into Payload format."""
    # Build translation lookup by parent ID
    trans_by_tour = {}
    for t in translations:
        parent_id = t.get("tours_id") or t.get("tours_id_1")
        if parent_id:
            if parent_id not in trans_by_tour:
                trans_by_tour[parent_id] = []
            trans_by_tour[parent_id].append(t)
    
    result = []
    for tour in tours:
        tour_id = tour["id"]
        tour_trans = trans_by_tour.get(tour_id, [])
        
        # Find English and Indonesian translations
        en_trans = next((t for t in tour_trans if t.get("languages") == "en"), None)
        id_trans = next((t for t in tour_trans if t.get("languages") == "id"), None)
        
        doc = {
            "_status": "published",
        }
        
        # Map base fields
        if tour.get("slug"):
            doc["slug"] = tour["slug"]
        if tour.get("status"):
            doc["status"] = tour["status"]
        if tour.get("sort"):
            doc["sortOrder"] = tour["sort"]
        
        # Map translations into localized fields
        if en_trans:
            if en_trans.get("title"):
                doc["title"] = en_trans["title"]
            if en_trans.get("description"):
                doc["description"] = en_trans["description"]
            if en_trans.get("content"):
                doc["content"] = en_trans["content"]
            if en_trans.get("excerpt"):
                doc["excerpt"] = en_trans["excerpt"]
        
        # Indonesian translations
        if id_trans:
            if id_trans.get("title"):
                doc["title__id"] = id_trans["title"]
            if id_trans.get("description"):
                doc["description__id"] = id_trans["description"]
            if id_trans.get("content"):
                doc["content__id"] = id_trans["content"]
            if id_trans.get("excerpt"):
                doc["excerpt__id"] = id_trans["excerpt"]
        
        result.append(doc)
    return result

def transform_stories(stories, translations):
    """Transform stories with translations."""
    trans_by_story = {}
    for t in translations:
        parent_id = t.get("stories_id") or t.get("stories_id_1")
        if parent_id:
            if parent_id not in trans_by_story:
                trans_by_story[parent_id] = []
            trans_by_story[parent_id].append(t)
    
    result = []
    for story in stories:
        story_id = story["id"]
        story_trans = trans_by_story.get(story_id, [])
        
        en_trans = next((t for t in story_trans if t.get("languages") == "en"), None)
        id_trans = next((t for t in story_trans if t.get("languages") == "id"), None)
        
        doc = {"_status": "published"}
        
        if story.get("slug"):
            doc["slug"] = story["slug"]
        if story.get("status"):
            doc["status"] = story["status"]
        
        if en_trans:
            if en_trans.get("title"):
                doc["title"] = en_trans["title"]
            if en_trans.get("content"):
                doc["content"] = en_trans["content"]
            if en_trans.get("excerpt"):
                doc["excerpt"] = en_trans["excerpt"]
        
        if id_trans:
            if id_trans.get("title"):
                doc["title__id"] = id_trans["title"]
            if id_trans.get("content"):
                doc["content__id"] = id_trans["content"]
            if id_trans.get("excerpt"):
                doc["excerpt__id"] = id_trans["excerpt"]
        
        result.append(doc)
    return result

def transform_faqs(faqs, translations):
    """Transform FAQs with translations."""
    trans_by_faq = {}
    for t in translations:
        parent_id = t.get("faqs_id") or t.get("faqs_id_1")
        if parent_id:
            if parent_id not in trans_by_faq:
                trans_by_faq[parent_id] = []
            trans_by_faq[parent_id].append(t)
    
    result = []
    for faq in faqs:
        faq_id = faq["id"]
        faq_trans = trans_by_faq.get(faq_id, [])
        
        en_trans = next((t for t in faq_trans if t.get("languages") == "en"), None)
        id_trans = next((t for t in faq_trans if t.get("languages") == "id"), None)
        
        doc = {"_status": "published"}
        
        if en_trans:
            if en_trans.get("question"):
                doc["question"] = en_trans["question"]
            if en_trans.get("answer"):
                doc["answer"] = en_trans["answer"]
        
        if id_trans:
            if id_trans.get("question"):
                doc["question__id"] = id_trans["question"]
            if id_trans.get("answer"):
                doc["answer__id"] = id_trans["answer"]
        
        result.append(doc)
    return result

def transform_testimonials(testimonials, translations):
    """Transform testimonials with translations."""
    trans_by_test = {}
    for t in translations:
        parent_id = t.get("testimonials_id") or t.get("testimonials_id_1")
        if parent_id:
            if parent_id not in trans_by_test:
                trans_by_test[parent_id] = []
            trans_by_test[parent_id].append(t)
    
    result = []
    for test in testimonials:
        test_id = test["id"]
        test_trans = trans_by_test.get(test_id, [])
        
        en_trans = next((t for t in test_trans if t.get("languages") == "en"), None)
        id_trans = next((t for t in test_trans if t.get("languages") == "id"), None)
        
        doc = {"_status": "published"}
        
        if test.get("author"):
            doc["author"] = test["author"]
        if test.get("rating"):
            doc["rating"] = test["rating"]
        
        if en_trans:
            if en_trans.get("quote"):
                doc["quote"] = en_trans["quote"]
        
        if id_trans:
            if id_trans.get("quote"):
                doc["quote__id"] = id_trans["quote"]
        
        result.append(doc)
    return result

def transform_simple_collection(data, field_mapping=None):
    """Transform a simple collection with optional field mapping."""
    result = []
    for item in data:
        doc = {"_status": "published"}
        if field_mapping:
            for directus_field, payload_field in field_mapping.items():
                if item.get(directus_field) is not None:
                    doc[payload_field] = item[directus_field]
        else:
            # Pass through all non-internal fields
            for key, value in item.items():
                if not key.startswith("_") and key != "id":
                    doc[key] = value
        result.append(doc)
    return result

# Load and transform users
print("🔄 Transforming users...")
with open(os.path.join(EXPORT_DIR, "users.json")) as f:
    users_data = json.load(f)
transformed = transform_users(users_data)
with open(os.path.join(OUTPUT_DIR, "users.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} users")

# Load and transform tours
print("🔄 Transforming tours...")
with open(os.path.join(EXPORT_DIR, "tours.json")) as f:
    tours_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "tours_translations.json")) as f:
    tours_trans = json.load(f)
transformed = transform_tours(tours_data, tours_trans)
with open(os.path.join(OUTPUT_DIR, "tours.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} tours")

# Load and transform stories
print("🔄 Transforming stories...")
with open(os.path.join(EXPORT_DIR, "stories.json")) as f:
    stories_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "stories_translations.json")) as f:
    stories_trans = json.load(f)
transformed = transform_stories(stories_data, stories_trans)
with open(os.path.join(OUTPUT_DIR, "stories.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} stories")

# Load and transform FAQs
print("🔄 Transforming FAQs...")
with open(os.path.join(EXPORT_DIR, "faqs.json")) as f:
    faqs_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "faqs_translations.json")) as f:
    faqs_trans = json.load(f)
transformed = transform_faqs(faqs_data, faqs_trans)
with open(os.path.join(OUTPUT_DIR, "faqs.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} FAQs")

# Load and transform testimonials
print("🔄 Transforming testimonials...")
with open(os.path.join(EXPORT_DIR, "testimonials.json")) as f:
    tests_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "testimonials_translations.json")) as f:
    tests_trans = json.load(f)
transformed = transform_testimonials(tests_data, tests_trans)
with open(os.path.join(OUTPUT_DIR, "testimonials.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} testimonials")

# Simple collections - pass through
for collection in ["media_coverage", "dietary_landing_pages", "specialty_landing_pages",
                   "travel_type_landing_pages", "location_landing_pages", "about_page",
                   "contact_page"]:
    export_file = os.path.join(EXPORT_DIR, f"{collection}.json")
    if os.path.exists(export_file):
        print(f"🔄 Transforming {collection}...")
        with open(export_file) as f:
            data = json.load(f)
        transformed = transform_simple_collection(data)
        with open(os.path.join(OUTPUT_DIR, f"{collection}.json"), "w") as f:
            json.dump(transformed, f, indent=2, ensure_ascii=False)
        print(f"  ✅ {len(transformed)} {collection}")

print(f"\n✅ Transformation complete! Files saved to: {OUTPUT_DIR}")
print("\nNext steps:")
print("1. Log into Payload admin at http://localhost:1337/admin")
print("2. Go to each collection and use the Import button")
print("3. Upload the corresponding JSON file")
