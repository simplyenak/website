#!/usr/bin/env python3
"""Transform Directus JSON exports to Payload import format - CORRECTED field mapping."""

import json
import os
from datetime import datetime

EXPORT_DIR = "/var/home/maarten/website-optimization/payload-local/scripts/directus-export"
OUTPUT_DIR = "/var/home/maarten/website-optimization/payload-local/scripts/payload-import"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def transform_tours(tours, translations):
    """Transform tours with correct Payload field mapping."""
    trans_by_tour = {}
    for t in translations:
        parent_id = t.get("tour_id") or t.get("tours_id")
        if parent_id:
            trans_by_tour.setdefault(parent_id, []).append(t)
    
    result = []
    for tour in tours:
        tour_id = tour["id"]
        tour_trans = trans_by_tour.get(tour_id, [])
        
        # Find translations by language code
        ms_trans = next((t for t in tour_trans if t.get("languages_code") == "ms"), None)
        id_trans = next((t for t in tour_trans if t.get("languages_code") == "id"), None)
        
        doc = {
            "_status": "published",
            "name": tour.get("name"),
            "slug": tour.get("slug"),
            "tagline": tour.get("tagline"),
            "shortDescription": tour.get("short_description"),
            "fullDescription": tour.get("full_description"),
            "price": tour.get("price"),
            "currency": tour.get("currency"),
            "duration": tour.get("duration"),
            "durationMinutes": tour.get("duration_minutes"),
            "location": tour.get("location"),
            "meetingPoint": tour.get("meeting_point"),
            "maxParticipants": tour.get("max_participants"),
            "minParticipants": tour.get("min_participants"),
            "instantConfirmation": bool(tour.get("instant_confirmation")),
            "tailoredAvailable": bool(tour.get("tailored_available")),
            "tailoredNotes": tour.get("tailored_notes"),
            "heroImage": tour.get("hero_image"),
            "whatToBring": tour.get("what_to_bring"),
            "whatToWear": tour.get("what_to_wear"),
            "cancellationPolicy": tour.get("cancellation_policy"),
            "bookingUrl": tour.get("booking_url"),
            "metaTitle": tour.get("meta_title"),
            "metaDescription": tour.get("meta_description"),
        }
        
        # Parse JSON arrays from Directus and convert to Payload array format
        # Payload arrays: [{item: "text"}] or [{highlight: "text"}]
        for field in ["whats_included", "whats_excluded", "highlights"]:
            val = tour.get(field)
            if val and isinstance(val, str):
                try:
                    items = json.loads(val)
                    if isinstance(items, list):
                        key_name = "item" if field in ["whats_included", "whats_excluded"] else "highlight"
                        doc[field] = [{key_name: str(item)} for item in items]
                except:
                    pass
            elif val and isinstance(val, list):
                key_name = "item" if field in ["whats_included", "whats_excluded"] else "highlight"
                doc[field] = [{key_name: str(item)} for item in val]
        
        # gallery_images → galleryImages: [{image: "url"}]
        gallery = tour.get("gallery_images")
        if gallery and isinstance(gallery, str):
            try:
                items = json.loads(gallery)
                if isinstance(items, list):
                    doc["galleryImages"] = [{"image": str(item)} for item in items]
            except:
                pass
        elif gallery and isinstance(gallery, list):
            doc["galleryImages"] = [{"image": str(item)} for item in gallery]
        
        # itinerary → [{item: "text"}]
        itinerary = tour.get("itinerary")
        if itinerary and isinstance(itinerary, str):
            try:
                items = json.loads(itinerary)
                if isinstance(items, list):
                    doc["itinerary"] = [{"item": str(item)} for item in items]
            except:
                pass
        
        # Relationships: dietary_options, travel_types, specialty_experiences
        # These are relationship fields in Payload - we need to skip them or map to IDs
        # For now, skip them since we don't have the target IDs
        
        # Add Malay translations
        if ms_trans:
            doc["name__ms"] = ms_trans.get("name")
            doc["tagline__ms"] = ms_trans.get("tagline")
            doc["shortDescription__ms"] = ms_trans.get("short_description")
            doc["fullDescription__ms"] = ms_trans.get("full_description")
            doc["metaTitle__ms"] = ms_trans.get("meta_title")
            doc["metaDescription__ms"] = ms_trans.get("meta_description")
        
        # Add Indonesian translations
        if id_trans:
            doc["name__id"] = id_trans.get("name")
            doc["tagline__id"] = id_trans.get("tagline")
            doc["shortDescription__id"] = id_trans.get("short_description")
            doc["fullDescription__id"] = id_trans.get("full_description")
            doc["metaTitle__id"] = id_trans.get("meta_title")
            doc["metaDescription__id"] = id_trans.get("meta_description")
        
        result.append(doc)
    return result

def transform_stories(stories, translations):
    """Transform stories - Directus fields match Payload fields."""
    trans_by_story = {}
    for t in translations:
        parent_id = t.get("stories_id") or t.get("story_id")
        if parent_id:
            trans_by_story.setdefault(parent_id, []).append(t)
    
    result = []
    for story in stories:
        story_id = story["id"]
        story_trans = trans_by_story.get(story_id, [])
        
        ms_trans = next((t for t in story_trans if t.get("languages_code") == "ms"), None)
        id_trans = next((t for t in story_trans if t.get("languages_code") == "id"), None)
        
        doc = {
            "_status": "published",
            "title": story.get("title"),
            "slug": story.get("slug"),
            "author": story.get("author"),
            "excerpt": story.get("excerpt"),
            "content": story.get("content"),
            "heroImage": story.get("hero_image"),
            "metaTitle": story.get("meta_title"),
            "metaDescription": story.get("meta_description"),
        }
        
        if ms_trans:
            doc["title__ms"] = ms_trans.get("title")
            doc["excerpt__ms"] = ms_trans.get("excerpt")
            doc["content__ms"] = ms_trans.get("content")
        
        if id_trans:
            doc["title__id"] = id_trans.get("title")
            doc["excerpt__id"] = id_trans.get("excerpt")
            doc["content__id"] = id_trans.get("content")
        
        result.append(doc)
    return result

def transform_faqs(faqs, translations):
    """Transform FAQs - Directus fields match Payload fields."""
    trans_by_faq = {}
    for t in translations:
        parent_id = t.get("faqs_id") or t.get("faq_id")
        if parent_id:
            trans_by_faq.setdefault(parent_id, []).append(t)
    
    result = []
    for faq in faqs:
        faq_id = faq["id"]
        faq_trans = trans_by_faq.get(faq_id, [])
        
        ms_trans = next((t for t in faq_trans if t.get("languages_code") == "ms"), None)
        id_trans = next((t for t in faq_trans if t.get("languages_code") == "id"), None)
        
        doc = {
            "_status": "published",
            "question": faq.get("question"),
            "answer": faq.get("answer"),
            "category": faq.get("category"),
            "sortOrder": faq.get("sort_order"),
        }
        
        if ms_trans:
            doc["question__ms"] = ms_trans.get("question")
            doc["answer__ms"] = ms_trans.get("answer")
        
        if id_trans:
            doc["question__id"] = id_trans.get("question")
            doc["answer__id"] = id_trans.get("answer")
        
        result.append(doc)
    return result

def transform_testimonials(testimonials, translations):
    """Transform testimonials - Directus fields match Payload fields."""
    trans_by_test = {}
    for t in translations:
        parent_id = t.get("testimonials_id") or t.get("testimonial_id")
        if parent_id:
            trans_by_test.setdefault(parent_id, []).append(t)
    
    result = []
    for test in testimonials:
        test_id = test["id"]
        test_trans = trans_by_test.get(test_id, [])
        
        ms_trans = next((t for t in test_trans if t.get("languages_code") == "ms"), None)
        id_trans = next((t for t in test_trans if t.get("languages_code") == "id"), None)
        
        doc = {
            "_status": "published",
            "authorName": test.get("author_name"),
            "authorLocation": test.get("author_location"),
            "reviewText": test.get("review_text"),
            "rating": test.get("rating"),
            "tour": test.get("tour"),
            "heroImage": test.get("hero_image"),
        }
        
        if ms_trans:
            doc["authorName__ms"] = ms_trans.get("author_name")
            doc["reviewText__ms"] = ms_trans.get("review_text")
        
        if id_trans:
            doc["authorName__id"] = id_trans.get("author_name")
            doc["reviewText__id"] = id_trans.get("review_text")
        
        result.append(doc)
    return result

def transform_simple(data, remove_fields=None):
    """Transform simple collections - pass through Directus fields, remove internal ones."""
    remove_fields = remove_fields or ["id", "user_created", "user_updated", "date_created", "date_updated"]
    result = []
    for item in data:
        doc = {"_status": "published"}
        for key, value in item.items():
            if key not in remove_fields and not key.startswith("_"):
                doc[key] = value
        result.append(doc)
    return result

# Load and transform
print("🔄 Transforming tours...")
with open(os.path.join(EXPORT_DIR, "tours.json")) as f:
    tours_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "tours_translations.json")) as f:
    tours_trans = json.load(f)
transformed = transform_tours(tours_data, tours_trans)
with open(os.path.join(OUTPUT_DIR, "tours.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} tours")

print("🔄 Transforming stories...")
with open(os.path.join(EXPORT_DIR, "stories.json")) as f:
    stories_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "stories_translations.json")) as f:
    stories_trans = json.load(f)
transformed = transform_stories(stories_data, stories_trans)
with open(os.path.join(OUTPUT_DIR, "stories.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} stories")

print("🔄 Transforming FAQs...")
with open(os.path.join(EXPORT_DIR, "faqs.json")) as f:
    faqs_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "faqs_translations.json")) as f:
    faqs_trans = json.load(f)
transformed = transform_faqs(faqs_data, faqs_trans)
with open(os.path.join(OUTPUT_DIR, "faqs.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} FAQs")

print("🔄 Transforming testimonials...")
with open(os.path.join(EXPORT_DIR, "testimonials.json")) as f:
    tests_data = json.load(f)
with open(os.path.join(EXPORT_DIR, "testimonials_translations.json")) as f:
    tests_trans = json.load(f)
transformed = transform_testimonials(tests_data, tests_trans)
with open(os.path.join(OUTPUT_DIR, "testimonials.json"), "w") as f:
    json.dump(transformed, f, indent=2, ensure_ascii=False)
print(f"  ✅ {len(transformed)} testimonials")

# Simple collections - just clean up internal Directus fields
for collection in ["dietary_landing_pages", "specialty_landing_pages", 
                   "travel_type_landing_pages", "location_landing_pages",
                   "about_page", "contact_page", "media_coverage"]:
    export_file = os.path.join(EXPORT_DIR, f"{collection}.json")
    if os.path.exists(export_file):
        print(f"🔄 Transforming {collection}...")
        with open(export_file) as f:
            data = json.load(f)
        transformed = transform_simple(data)
        with open(os.path.join(OUTPUT_DIR, f"{collection}.json"), "w") as f:
            json.dump(transformed, f, indent=2, ensure_ascii=False)
        print(f"  ✅ {len(transformed)} {collection}")

print(f"\n✅ Transformation complete!")
