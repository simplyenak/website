#!/usr/bin/env python3
"""
Cleanup and import script for Payload CMS database.
Connects directly via psycopg to avoid Payload ORM schema issues.
"""

import json
import psycopg
from datetime import datetime
from pathlib import Path

DB_URL = "postgres://postgres@localhost:5432/payload-local"
CONTENT_DIR = Path("/home/maarten/website-optimization/revamp/frontend/src/data/content")

# ─── helpers ───

def load_json(filename):
    path = CONTENT_DIR / filename
    if not path.exists():
        print(f"  ⚠️  Not found: {path}")
        return []
    return json.loads(path.read_text())

def now():
    return datetime.utcnow()

def exec(cur, sql, params=()):
    try:
        cur.execute(sql, params)
    except Exception as e:
        print(f"  SQL ERROR: {e}")
        print(f"  Query: {sql[:200]}...")
        raise

# ─── CLEANUP ───

def cleanup_tours(conn):
    print("\n🧹 Cleaning up non-bookable tours...")
    with conn.cursor() as cur:
        cur.execute("SELECT id, slug FROM tours WHERE is_bookable = false")
        rows = cur.fetchall()
        print(f"  Found {len(rows)} non-bookable tours to delete")
        for tid, slug in rows:
            cur.execute("DELETE FROM tours WHERE id = %s", (tid,))
            print(f"    🗑️  Deleted: {slug}")
    conn.commit()
    return len(rows)

# ─── REFERENCE COLLECTIONS ───

def import_reference(conn, table, filename, mapper):
    print(f"\n📦 Importing {table}...")
    data = load_json(filename)
    if not data:
        return 0, 0

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for item in data:
            try:
                mapped = mapper(item)
                if not mapped:
                    continue
                slug = mapped.get('slug')
                if not slug:
                    continue

                # Check existing
                cur.execute(f"SELECT id FROM {table} WHERE slug = %s", (slug,))
                existing = cur.fetchone()

                if existing:
                    # Update
                    eid = existing[0]
                    set_clause = ", ".join([f"{k} = %s" for k in mapped if k != 'slug'])
                    values = [v for k, v in mapped.items() if k != 'slug']
                    cur.execute(f"UPDATE {table} SET {set_clause}, updated_at = %s WHERE id = %s",
                                values + [now(), eid])
                    print(f"    🔄 Updated: {slug}")
                else:
                    # Insert main table
                    cols = ", ".join(mapped.keys())
                    placeholders = ", ".join(["%s"] * len(mapped))
                    cur.execute(f"INSERT INTO {table} ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                list(mapped.values()) + [now(), now()])
                    eid = cur.fetchone()[0]
                    print(f"    ✅ Created: {slug}")

                # Insert locale
                name = mapped.get('name') or mapped.get('title') or slug
                cur.execute(f"""
                    INSERT INTO {table}_locales (title, _locale, _parent_id)
                    VALUES (%s, 'en', %s)
                    ON CONFLICT (_locale, _parent_id) DO UPDATE SET title = EXCLUDED.title
                """, (name, eid))

                inserted += 1
            except Exception as e:
                print(f"    ❌ Error on {item.get('slug', '?')}: {e}")
                errors += 1

    conn.commit()
    print(f"  ✅ {table}: {inserted} done, {errors} errors")
    return inserted, errors

# ─── TOURS ───

def import_bookable_tours(conn):
    print("\n📦 Importing bookable tours...")
    data = load_json("tours.json")
    bookable = [t for t in data if t.get("isBookable")]
    print(f"  Found {len(bookable)} bookable tours")

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for item in bookable:
            try:
                slug = item["slug"]
                # Check existing
                cur.execute("SELECT id FROM tours WHERE slug = %s", (slug,))
                existing = cur.fetchone()

                # Main table fields (non-localized)
                main = {
                    "slug": slug,
                    "price": item.get("price") or item.get("price"),
                    "currency": item.get("currency", "MYR"),
                    "duration": item.get("duration") or item.get("duration"),
                    "duration_minutes": item.get("durationMinutes") or item.get("duration_minutes"),
                    "location": item.get("location"),
                    "max_participants": item.get("maxParticipants") or item.get("max_participants"),
                    "min_participants": item.get("minParticipants") or item.get("min_participants") or 2,
                    "tailored_available": item.get("tailoredAvailable") or item.get("tailored_available") or False,
                    "hero_image_id": None,
                    "ticketing_hub_id": item.get("ticketingHubId") or item.get("ticketing_hub_id"),
                    "is_bookable": True,
                    "booking_url": item.get("bookingUrl") or item.get("booking_url"),
                    "instant_confirmation": item.get("instantConfirmation") or item.get("instant_confirmation") if item.get("instantConfirmation") is not None else True,
                    "scheduled_publish": item.get("scheduledPublish") or item.get("scheduled_publish"),
                    "tour_frequency": item.get("tourFrequency") or item.get("tour_frequency"),
                    "dishes_count": item.get("dishesCount") or item.get("dishes_count"),
                    "difficulty": item.get("difficulty", "easy"),
                    "walking_distance": item.get("walkingDistance") or item.get("walking_distance"),
                    "directions_html": item.get("directionsHtml") or item.get("directions_html"),
                    "promo_video_url": item.get("promoVideoUrl") or item.get("promo_video_url"),
                    "featured": item.get("featured", False),
                    "popular": item.get("popular", False),
                    "new": item.get("new", False),
                    "published_at": item.get("publishedAt") or item.get("published_at"),
                    "status": item.get("status", "published"),
                    "workflow_status": item.get("workflowStatus") or item.get("workflow_status") or "published",
                }

                if existing:
                    tid = existing[0]
                    set_clause = ", ".join([f"{k} = %s" for k in main])
                    cur.execute(f"UPDATE tours SET {set_clause}, updated_at = %s WHERE id = %s",
                                list(main.values()) + [now(), tid])
                    print(f"    🔄 Updated tour: {slug}")
                else:
                    cols = ", ".join(main.keys())
                    placeholders = ", ".join(["%s"] * len(main))
                    cur.execute(f"INSERT INTO tours ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                list(main.values()) + [now(), now()])
                    tid = cur.fetchone()[0]
                    print(f"    ✅ Created tour: {slug}")

                # Locale
                meta = item.get("meta", {})
                cur.execute("""
                    INSERT INTO tours_locales (name, tagline, short_description, full_description, meeting_point,
                        tailored_notes, meta_title, meta_description, meta_image_id, _locale, _parent_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'en', %s)
                    ON CONFLICT (_locale, _parent_id) DO UPDATE SET
                        name = EXCLUDED.name,
                        tagline = EXCLUDED.tagline,
                        short_description = EXCLUDED.short_description,
                        full_description = EXCLUDED.full_description
                """, (
                    item.get("name"),
                    item.get("tagline"),
                    item.get("shortDescription") or item.get("short_description"),
                    item.get("fullDescription") or item.get("full_description"),
                    item.get("meetingPoint") or item.get("meeting_point"),
                    item.get("tailoredNotes") or item.get("tailored_notes"),
                    meta.get("title"),
                    meta.get("description"),
                    None,  # meta_image_id
                    tid,
                ))

                # Arrays: highlights
                highlights = item.get("highlights", [])
                if highlights:
                    cur.execute("DELETE FROM tours_highlights WHERE _parent_id = %s", (tid,))
                    for i, h in enumerate(highlights):
                        val = h["highlight"] if isinstance(h, dict) else h
                        cur.execute("INSERT INTO tours_highlights (_order, _parent_id, id, highlight) VALUES (%s, %s, gen_random_uuid()::text, %s)",
                                    (i, tid, val))

                # Arrays: whats_included
                included = item.get("whatsIncluded") or item.get("whats_included", [])
                if included:
                    cur.execute("DELETE FROM tours_whats_included WHERE _parent_id = %s", (tid,))
                    for i, val in enumerate(included):
                        item_val = val["item"] if isinstance(val, dict) else val
                        cur.execute("INSERT INTO tours_whats_included (_order, _locale, _parent_id, id, item) VALUES (%s, 'en', %s, gen_random_uuid()::text, %s)",
                                    (i, tid, item_val))

                # Arrays: whats_excluded
                excluded = item.get("whatsExcluded") or item.get("whats_excluded", [])
                if excluded:
                    cur.execute("DELETE FROM tours_whats_excluded WHERE _parent_id = %s", (tid,))
                    for i, val in enumerate(excluded):
                        item_val = val["item"] if isinstance(val, dict) else val
                        cur.execute("INSERT INTO tours_whats_excluded (_order, _locale, _parent_id, id, item) VALUES (%s, 'en', %s, gen_random_uuid()::text, %s)",
                                    (i, tid, item_val))

                inserted += 1
            except Exception as e:
                print(f"    ❌ Error on tour {item.get('slug', '?')}: {e}")
                errors += 1

    conn.commit()
    print(f"  ✅ Tours: {inserted} done, {errors} errors")
    return inserted, errors

# ─── PAGES ───

def import_pages(conn):
    print("\n📦 Importing pages...")
    data = load_json("pages.json")
    print(f"  Found {len(data)} pages")

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for item in data:
            try:
                slug = item["slug"]
                cur.execute("SELECT id FROM pages WHERE slug = %s", (slug,))
                existing = cur.fetchone()

                main = {
                    "slug": slug,
                    "type": item.get("type", "general"),
                    "status": item.get("status", "published"),
                    "location": item.get("location"),
                    "hero_image_id": None,
                    "price": str(item["price"]) if item.get("price") else None,
                    "duration": str(item["duration"]) if item.get("duration") else None,
                    "max_participants": item.get("max_participants") or item.get("maxParticipants"),
                    "order": item.get("order", 0),
                }

                if existing:
                    pid = existing[0]
                    set_clause = ", ".join([f"{k} = %s" for k in main])
                    cur.execute(f"UPDATE pages SET {set_clause}, updated_at = %s WHERE id = %s",
                                list(main.values()) + [now(), pid])
                    print(f"    🔄 Updated page: {slug}")
                else:
                    cols = ", ".join(main.keys())
                    placeholders = ", ".join(["%s"] * len(main))
                    cur.execute(f"INSERT INTO pages ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                list(main.values()) + [now(), now()])
                    pid = cur.fetchone()[0]
                    print(f"    ✅ Created page: {slug}")

                # Locale
                cur.execute("""
                    INSERT INTO pages_locales (title, tagline, hero_title, hero_subtitle, hero_description,
                        short_description, full_description, meta_title, meta_description, meta_image_id, _locale, _parent_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'en', %s)
                    ON CONFLICT (_locale, _parent_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        short_description = EXCLUDED.short_description,
                        full_description = EXCLUDED.full_description
                """, (
                    item.get("title") or item.get("name"),
                    item.get("tagline"),
                    item.get("hero_title") or item.get("heroTitle"),
                    item.get("hero_subtitle") or item.get("heroSubtitle"),
                    item.get("hero_description") or item.get("heroDescription"),
                    item.get("short_description") or item.get("shortDescription"),
                    item.get("full_description") or item.get("fullDescription"),
                    item.get("meta_title") or item.get("meta", {}).get("title"),
                    item.get("meta_description") or item.get("meta", {}).get("description"),
                    None,
                    pid,
                ))

                # Highlights
                highlights = item.get("highlights", [])
                if highlights:
                    cur.execute("DELETE FROM pages_highlights WHERE _parent_id = %s", (pid,))
                    for i, h in enumerate(highlights):
                        val = h["item"] if isinstance(h, dict) else h
                        cur.execute("INSERT INTO pages_highlights (_order, _locale, _parent_id, id, item) VALUES (%s, 'en', %s, gen_random_uuid()::text, %s)",
                                    (i, pid, val))

                inserted += 1
            except Exception as e:
                print(f"    ❌ Error on page {item.get('slug', '?')}: {e}")
                errors += 1

    conn.commit()
    print(f"  ✅ Pages: {inserted} done, {errors} errors")
    return inserted, errors

# ─── LANDING PAGES ───

def import_landing_pages(conn):
    print("\n📦 Importing landing pages...")
    files = [
        ("dietary-landing-pages.json", "dietary"),
        ("location-landing-pages.json", "location"),
        ("specialty-landing-pages.json", "specialty"),
        ("travel-type-landing-pages.json", "travel_type"),
    ]

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for filename, default_type in files:
            data = load_json(filename)
            if not data:
                continue
            for item in data:
                try:
                    slug = item["slug"]
                    cur.execute("SELECT id FROM landing_pages WHERE slug = %s", (slug,))
                    existing = cur.fetchone()

                    main = {
                        "slug": slug,
                        "type": item.get("type", default_type),
                        "status": item.get("status", "published"),
                        "icon": item.get("icon"),
                        "color": item.get("color"),
                        "hero_image_id": None,
                    }

                    if existing:
                        lid = existing[0]
                        set_clause = ", ".join([f"{k} = %s" for k in main])
                        cur.execute(f"UPDATE landing_pages SET {set_clause}, updated_at = %s WHERE id = %s",
                                    list(main.values()) + [now(), lid])
                        print(f"    🔄 Updated landing page: {slug}")
                    else:
                        cols = ", ".join(main.keys())
                        placeholders = ", ".join(["%s"] * len(main))
                        cur.execute(f"INSERT INTO landing_pages ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                    list(main.values()) + [now(), now()])
                        lid = cur.fetchone()[0]
                        print(f"    ✅ Created landing page: {slug}")

                    # Locale
                    cur.execute("""
                        INSERT INTO landing_pages_locales (
                            title, hero_title, hero_subtitle, hero_description, intro_heading, intro_content,
                            challenges_heading, options_heading, options_content, features_heading,
                            tips_heading, tips_content, safe_dishes_heading, avoid_dishes_heading,
                            tours_heading, meta_title, meta_description, meta_image_id, _locale, _parent_id
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'en', %s)
                        ON CONFLICT (_locale, _parent_id) DO UPDATE SET
                            title = EXCLUDED.title,
                            hero_title = EXCLUDED.hero_title
                    """, (
                        item.get("title") or item.get("dietary_name") or item.get("hero_title") or slug,
                        item.get("hero_title"),
                        item.get("hero_subtitle"),
                        item.get("hero_description"),
                        item.get("intro_heading"),
                        item.get("intro_content"),
                        item.get("challenges_heading"),
                        item.get("options_heading"),
                        item.get("options_content"),
                        item.get("features_heading"),
                        item.get("tips_heading"),
                        item.get("tips_content"),
                        item.get("safe_dishes_heading"),
                        item.get("avoid_dishes_heading"),
                        item.get("tours_heading"),
                        item.get("meta_title") or item.get("meta", {}).get("title"),
                        item.get("meta_description") or item.get("meta", {}).get("description"),
                        None,
                        lid,
                    ))

                    # Arrays
                    def insert_array(table, parent_id, items, fields):
                        if not items:
                            return
                        cur.execute(f"DELETE FROM {table} WHERE _parent_id = %s", (parent_id,))
                        for i, it in enumerate(items):
                            vals = [it.get(f) if isinstance(it, dict) else it for f in fields]
                            col_names = ", ".join(fields)
                            placeholders = ", ".join(["%s"] * len(fields))
                            cur.execute(f"INSERT INTO {table} (_order, _parent_id, id, {col_names}) VALUES (%s, %s, gen_random_uuid()::text, {placeholders})",
                                        [i, parent_id] + vals)

                    insert_array("landing_pages_challenges", lid, item.get("challenges", []), ["title", "description"])
                    insert_array("landing_pages_highlights", lid, item.get("highlights", []), ["title", "description"])
                    insert_array("landing_pages_tips", lid, item.get("tips", []), ["title", "content"])
                    insert_array("landing_pages_safe_dishes", lid, item.get("safe_dishes", []), ["name", "description"])
                    insert_array("landing_pages_avoid_dishes", lid, item.get("avoid_dishes", []), ["name", "description"])
                    insert_array("landing_pages_travel_tips", lid, item.get("travel_tips", []), ["title", "content"])

                    inserted += 1
                except Exception as e:
                    print(f"    ❌ Error on landing page {item.get('slug', '?')}: {e}")
                    errors += 1

    conn.commit()
    print(f"  ✅ Landing pages: {inserted} done, {errors} errors")
    return inserted, errors

# ─── STORIES ───

def import_stories(conn):
    print("\n📦 Importing stories...")
    data = load_json("stories.json")
    print(f"  Found {len(data)} stories")

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for item in data:
            try:
                slug = item["slug"]
                cur.execute("SELECT id FROM stories WHERE slug = %s", (slug,))
                existing = cur.fetchone()

                main = {
                    "slug": slug,
                    "status": item.get("status", "published"),
                    "workflow_status": item.get("workflowStatus") or item.get("workflow_status") or "published",
                    "featured_image": None,
                }

                if existing:
                    sid = existing[0]
                    set_clause = ", ".join([f"{k} = %s" for k in main])
                    cur.execute(f"UPDATE stories SET {set_clause}, updated_at = %s WHERE id = %s",
                                list(main.values()) + [now(), sid])
                    print(f"    🔄 Updated story: {slug}")
                else:
                    cols = ", ".join(main.keys())
                    placeholders = ", ".join(["%s"] * len(main))
                    cur.execute(f"INSERT INTO stories ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                list(main.values()) + [now(), now()])
                    sid = cur.fetchone()[0]
                    print(f"    ✅ Created story: {slug}")

                # Locale
                cur.execute("""
                    INSERT INTO stories_locales (title, excerpt, content, meta_title, meta_description, meta_image_id, _locale, _parent_id)
                    VALUES (%s, %s, %s, %s, %s, %s, 'en', %s)
                    ON CONFLICT (_locale, _parent_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        excerpt = EXCLUDED.excerpt,
                        content = EXCLUDED.content
                """, (
                    item.get("title"),
                    item.get("excerpt"),
                    json.dumps(item.get("content", [])) if isinstance(item.get("content"), list) else item.get("content"),
                    item.get("meta_title") or item.get("meta", {}).get("title"),
                    item.get("meta_description") or item.get("meta", {}).get("description"),
                    None,
                    sid,
                ))

                inserted += 1
            except Exception as e:
                print(f"    ❌ Error on story {item.get('slug', '?')}: {e}")
                errors += 1

    conn.commit()
    print(f"  ✅ Stories: {inserted} done, {errors} errors")
    return inserted, errors

# ─── FAQs, TESTIMONIALS, MEDIA COVERAGE ───

def import_simple(conn, table, filename, mapper):
    print(f"\n📦 Importing {table}...")
    data = load_json(filename)
    if not data:
        return 0, 0

    inserted = 0
    errors = 0
    with conn.cursor() as cur:
        for item in data:
            try:
                mapped = mapper(item)
                if not mapped:
                    continue
                # Use first text field as identifier for upsert
                id_field = list(mapped.keys())[0]
                id_val = mapped[id_field]

                cur.execute(f"SELECT id FROM {table} WHERE {id_field} = %s", (id_val,))
                existing = cur.fetchone()

                if existing:
                    eid = existing[0]
                    set_clause = ", ".join([f"{k} = %s" for k in mapped if k != id_field])
                    values = [v for k, v in mapped.items() if k != id_field]
                    cur.execute(f"UPDATE {table} SET {set_clause}, updated_at = %s WHERE id = %s",
                                values + [now(), eid])
                    print(f"    🔄 Updated: {str(id_val)[:50]}")
                else:
                    cols = ", ".join(mapped.keys())
                    placeholders = ", ".join(["%s"] * len(mapped))
                    cur.execute(f"INSERT INTO {table} ({cols}, updated_at, created_at) VALUES ({placeholders}, %s, %s) RETURNING id",
                                list(mapped.values()) + [now(), now()])
                    print(f"    ✅ Created: {str(id_val)[:50]}")

                inserted += 1
            except Exception as e:
                print(f"    ❌ Error: {e}")
                errors += 1

    conn.commit()
    print(f"  ✅ {table}: {inserted} done, {errors} errors")
    return inserted, errors

# ─── MAIN ───

def main():
    print("🚀 Cleanup & Import via Direct SQL")
    print("=" * 50)

    with psycopg.connect(DB_URL, autocommit=False) as conn:
        # 1. Cleanup
        deleted = cleanup_tours(conn)

        # 2. Reference data
        import_reference(conn, "dietary_options", "dietary-options.json",
            lambda i: {"name": i.get("name"), "slug": i.get("slug"), "icon": i.get("icon"), "color": i.get("color"), "status": i.get("status", "published")})

        import_reference(conn, "travel_types", "travel-types.json",
            lambda i: {"name": i.get("name"), "slug": i.get("slug"), "icon": i.get("icon"), "status": i.get("status", "published")})

        import_reference(conn, "specialty_experiences", "specialty-experiences.json",
            lambda i: {"name": i.get("name"), "slug": i.get("slug"), "icon": i.get("icon"), "status": i.get("status", "published")})

        import_reference(conn, "locations", "locations.json",
            lambda i: {"name": i.get("name"), "slug": i.get("slug"), "icon": i.get("icon"), "color": i.get("color"), "status": i.get("status", "published")})

        # 3. Main content
        import_bookable_tours(conn)
        import_pages(conn)
        import_landing_pages(conn)
        import_stories(conn)

        # 4. Other content
        import_simple(conn, "faqs", "faqs.json",
            lambda i: {"question": i.get("question"), "answer": i.get("answer"), "category": i.get("category", "general"), "sort_order": i.get("sort_order", 0), "status": i.get("status", "published")})

        import_simple(conn, "testimonials", "testimonials.json",
            lambda i: {"name": i.get("name"), "text": i.get("text") or i.get("review"), "rating": i.get("rating", 5), "source": i.get("source", "google"), "status": i.get("status", "published")})

        import_simple(conn, "media_coverage", "media-coverage.json",
            lambda i: {"outlet": i.get("outlet") or i.get("name"), "category": i.get("category", "print"), "year": i.get("year"), "url": i.get("url"), "status": i.get("status", "published")})

        # Final count
        print("\n" + "=" * 50)
        print("📊 Final Counts:")
        with conn.cursor() as cur:
            for table in ["tours", "pages", "landing_pages", "stories", "dietary_options", "travel_types", "specialty_experiences", "locations", "faqs", "testimonials", "media_coverage"]:
                cur.execute(f"SELECT COUNT(*) FROM {table}")
                count = cur.fetchone()[0]
                print(f"  {table}: {count}")
        print("=" * 50)

if __name__ == "__main__":
    main()
