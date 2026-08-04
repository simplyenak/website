#!/usr/bin/env python3
"""
Fix the meta title for 'Do Malaysians Speak English' page in Payload CMS.

Current meta_title is Portuguese: 'Os malaios falam inglês? Um guia do visitante (2026)'
Current title is: 'Do Malaysians Speak English? A Visitor Guide' (direct answer, low CTR)

Applies a curiosity-gap / promise+suspense format title to drive clicks.
"""

import json
import os
import sys
import urllib.request
import urllib.error

PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com")
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "")

SLUG = "do-malaysians-speak-english"
# New title in promise+suspense format – keeps the query but creates curiosity gap
# "Do Malaysians Speak English?" → keeps exact query match
# "What Surprised Our Guests Most in KL" → creates curiosity, personal, specific
NEW_META_TITLE = "Do Malaysians Speak English? What Surprised Our Guests Most in KL"


def login():
    data = json.dumps({"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/users/login",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        token = resp.get("token", "")
        if not token:
            print(f"ERROR: Login returned no token: {resp}")
            sys.exit(1)
        return token
    except urllib.error.HTTPError as e:
        print(f"ERROR: Login HTTP {e.code}: {e.read().decode()}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Login failed: {e}")
        sys.exit(1)


def get_story(token):
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?where[slug][equals]={SLUG}&depth=1"
        f"&fields=id,slug,title,meta_title,meta_description,meta",
        headers={"Authorization": f"Bearer {token}"},
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
    docs = resp.get("docs", [])
    if not docs:
        print(f"ERROR: Story with slug '{SLUG}' not found")
        sys.exit(1)
    return docs[0]


def update_story(token, story_id, payload):
    url = f"{PAYLOAD_URL}/api/stories/{story_id}?depth=0"
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="PATCH",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        return resp
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"ERROR: PATCH failed HTTP {e.code}: {body[:500]}")
        sys.exit(1)


def main():
    print("=== Fix Meta Title for 'Do Malaysians Speak English' ===\n")

    token = login()
    print(f"✅ Logged in to Payload CMS\n")

    story = get_story(token)
    story_id = story["id"]

    print(f"Story ID: {story_id}")
    print(f"Slug:     {story['slug']}")
    print(f"Title:    {story.get('title', 'N/A')!r}")
    print(f"Current meta_title:    {story.get('meta_title', 'NOT SET')!r}")
    meta = story.get("meta", {}) or {}
    print(f"Current meta.title:    {meta.get('title', 'NOT SET')!r}")
    print(f"Current meta_description: {story.get('meta_description', 'NOT SET')!r}")
    print()

    # Build update payload
    # We update both meta_title (top-level Payload field) and meta.title (SEO meta object)
    payload = {
        "meta_title": NEW_META_TITLE,
        "meta": {
            "title": NEW_META_TITLE,
            # Keep existing description and image
            "description": meta.get("description", ""),
            "image": meta.get("image", None),
        },
    }

    print(f"Proposed new meta_title: {NEW_META_TITLE!r}")
    print(f"Proposed new meta.title: {NEW_META_TITLE!r}")
    print()

    # Dry-run mode
    if "--dry-run" in sys.argv:
        print("🔍 DRY RUN — no changes made")
        print("Would send PATCH with payload:")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return

    # Confirm?
    if "--auto" not in sys.argv:
        print("Press Enter to apply, Ctrl+C to cancel...")
        try:
            input()
        except KeyboardInterrupt:
            print("\nCancelled.")
            sys.exit(0)

    # Apply
    result = update_story(token, story_id, payload)
    print(f"✅ Story updated successfully!")

    # Verify
    updated = get_story(token)
    new_meta_title = updated.get("meta_title", "")
    new_meta = updated.get("meta", {}) or {}
    new_meta_title_inner = new_meta.get("title", "")
    print(f"\nVerification:")
    print(f"  New meta_title:    {new_meta_title!r}")
    print(f"  New meta.title:    {new_meta_title_inner!r}")

    if new_meta_title == NEW_META_TITLE and new_meta_title_inner == NEW_META_TITLE:
        print("\n✅ FIX APPLIED SUCCESSFULLY!")
        print(f"   Old: 'Os malaios falam inglês? Um guia do visitante (2026)'")
        print(f"   New: '{NEW_META_TITLE}'")
    else:
        print("\n⚠️  Verification mismatch — check Payload admin")
        sys.exit(1)


if __name__ == "__main__":
    main()
