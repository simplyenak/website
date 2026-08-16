#!/usr/bin/env python3
"""
Apply SEO title/meta iterations to leak pages (local-buzz playbook step 8).

Updates meta_title + meta_description (flat snake_case fields on stories) in
Payload, then verifies by read-back. Light PATCH, no draft param (versioned
collections 500 on full-doc merge PATCH).

Credentials: site/.env via payload_env (never hardcoded).
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import payload_env  # noqa: E402

PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")

# slug -> (meta_title, meta_description, excerpt)
# The story template renders excerpt as the meta description (stories/[slug].astro),
# so excerpt must carry the click-earning copy too.
UPDATES = {
    "eating-durians": (
        "Durian in Malaysia: 8 Varieties Worth Paying For | Simply Enak",
        "Musang King, D24, kampung durian: how to pick, when to eat, and where to try Malaysia's king of fruits in KL and Penang.",
        "Musang King, D24, kampung durian: how to pick, when to eat, and where to try Malaysia's king of fruits in KL and Penang.",
    ),
    "do-malaysians-speak-english": (
        "Yes, Malaysians Speak English. What to Expect | Simply Enak",
        "Yes, and better than most visitors expect. Malaysian English is easy to follow; here's how it works and the phrases you'll hear on the street.",
        "Yes, and better than most visitors expect. Malaysian English is easy to follow; here's how it works and the phrases you'll hear on the street.",
    ),
    "durian-guide-2026": (
        "Durian Season in Malaysia: The 2026 Guide | Simply Enak",
        "When is durian season in Malaysia this year? What to buy, how to pick a good fruit, and where first-timers should try it.",
        "When is durian season in Malaysia this year? What to buy, how to pick a good fruit, and where first-timers should try it.",
    ),
}


def login() -> str:
    data = json.dumps({
        "email": os.environ["PAYLOAD_EMAIL"],
        "password": os.environ["PAYLOAD_PASSWORD"],
    }).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/users/login",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
    token = resp.get("token", "")
    if not token:
        raise RuntimeError("login failed, no token in response")
    return token


def find_story(token: str, slug: str) -> dict:
    q = urllib.parse.urlencode({"where[slug][equals]": slug, "limit": 1})
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?{q}",
        headers={"Authorization": f"Bearer {token}"},
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
    docs = resp.get("docs", [])
    if not docs:
        raise RuntimeError(f"story not found: {slug}")
    return docs[0]


def patch_meta(token: str, story_id: int, meta_title: str, meta_description: str, excerpt: str) -> None:
    body = json.dumps({
        "meta_title": meta_title,
        "meta_description": meta_description,
        "excerpt": excerpt,
    }).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories/{story_id}",
        data=body,
        method="PATCH",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    urllib.request.urlopen(req, timeout=15).read()


def main() -> None:
    token = login()
    print(f"Logged in. Applying {len(UPDATES)} meta updates...\n")
    ok, fail = 0, 0
    for slug, (meta_title, meta_desc, excerpt) in UPDATES.items():
        try:
            story = find_story(token, slug)
            sid = story.get("id")
            old_t = story.get("meta_title")
            old_d = story.get("meta_description")
            patch_meta(token, sid, meta_title, meta_desc, excerpt)
            # Verify by read-back (PATCH 200 does NOT mean it persisted)
            check = find_story(token, slug)
            new_t = check.get("meta_title")
            new_d = check.get("meta_description")
            new_e = check.get("excerpt")
            if new_t == meta_title and new_d == meta_desc and new_e == excerpt:
                ok += 1
                print(f"[OK]   {slug} (id {sid})")
                print(f"       old title: {old_t!r}")
                print(f"       new title: {new_t!r}")
                print(f"       old desc : {(old_d or '')[:70]!r}")
                print(f"       new desc : {new_d[:70]!r}")
                print(f"       new exc  : {new_e[:70]!r}")
            else:
                fail += 1
                print(f"[FAIL] {slug}: read-back mismatch")
                print(f"       expected: {meta_title!r} / {meta_desc[:60]!r} / {excerpt[:60]!r}")
                print(f"       got:      {new_t!r} / {(new_d or '')[:60]!r} / {(new_e or '')[:60]!r}")
        except Exception as e:
            fail += 1
            print(f"[FAIL] {slug}: {e}")
        print()
    print(f"Done: {ok} ok, {fail} failed")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
