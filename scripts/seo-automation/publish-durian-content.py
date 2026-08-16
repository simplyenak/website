#!/usr/bin/env python3
"""
Publish durian content batch (local-buzz playbook execution):
1. PATCH faq-when-is-durian-season-in-malaysia  -> expanded pillar content + meta
2. POST   durian-season-penang                  -> new story (Penang durian season)

Credential policy: site/.env via payload_env, never hardcoded.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import payload_env  # noqa: E402

PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")

FAQ_SLUG = "faq-when-is-durian-season-in-malaysia"
FAQ_META_TITLE = "When Is Durian Season in Malaysia? Month-by-Month Guide | Simply Enak"
FAQ_META_DESC = ("Durian season in Malaysia runs June to August, peaking in July. "
                 "Month-by-month guide, regional differences, prices and how to pick a good one.")
FAQ_EXCERPT = FAQ_META_DESC

NEW_STORY = {
    "slug": "durian-season-penang",
    "title": "Durian Season in Penang: When, Where and What to Eat",
    "meta_title": "Durian Season in Penang: When and Where to Eat | Simply Enak",
    "meta_description": ("Penang's durian season runs late May to August, peaking in June and July. "
                         "Balik Pulau orchards, Black Thorn and Hor Lor, and the Jalan Macalister durian strip."),
    "excerpt": ("Penang's durian season runs late May to August, peaking in June and July. "
                "Balik Pulau orchards, Black Thorn and Hor Lor, and the Jalan Macalister durian strip."),
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
        raise RuntimeError("login failed")
    return token


def find_story(token: str, slug: str) -> dict | None:
    q = urllib.parse.urlencode({"where[slug][equals]": slug, "limit": 1})
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?{q}",
        headers={"Authorization": f"Bearer {token}"},
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
    docs = resp.get("docs", [])
    return docs[0] if docs else None


def patch_story(token: str, story_id: int, fields: dict) -> None:
    body = json.dumps(fields).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories/{story_id}",
        data=body,
        method="PATCH",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
    )
    urllib.request.urlopen(req, timeout=30).read()


def post_story(token: str, story: dict) -> dict:
    data = json.dumps(story).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?depth=0",
        data=data,
        method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        return {"id": resp.get("id"), "resp": resp}
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "unique" in body.lower() and "slug" in body.lower():
            return {"status": "exists"}
        print(f"  HTTP {e.code}: {body[:300]}", file=sys.stderr)
        return {"status": "error", "code": e.code, "body": body[:300]}


def main() -> None:
    token = login()
    print("Logged in.\n")

    # ── 1. PATCH FAQ story ────────────────────────────────
    faq = find_story(token, FAQ_SLUG)
    if not faq:
        print(f"[FAIL] FAQ story not found: {FAQ_SLUG}")
    else:
        faq_md = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.hermes/tmp/faq-season-pillar.md")).read()
        patch_story(token, faq["id"], {
            "content_markdown": faq_md,
            "excerpt": FAQ_EXCERPT,
            "meta_title": FAQ_META_TITLE,
            "meta_description": FAQ_META_DESC,
        })
        check = find_story(token, FAQ_SLUG)
        ok = (check.get("meta_title") == FAQ_META_TITLE
              and check.get("excerpt") == FAQ_EXCERPT
              and len(check.get("content_markdown") or "") > 4000)
        print(f"[{'OK' if ok else 'FAIL'}] PATCH {FAQ_SLUG} (id {faq['id']}) "
              f"| meta_title: {check.get('meta_title')!r} | md chars: {len(check.get('content_markdown') or '')}")

    # ── 2. POST new Penang story ─────────────────────────
    penang_md = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.hermes/tmp/durian-penang.md")).read()
    minimal_rich = {
        "root": {
            "type": "root", "format": "", "indent": 0, "version": 1,
            "children": [{"type": "paragraph",
                          "children": [{"type": "text", "text": NEW_STORY["excerpt"]}]}],
            "direction": "ltr",
        }
    }
    story_payload = {
        "title": NEW_STORY["title"],
        "slug": NEW_STORY["slug"],
        "excerpt": NEW_STORY["excerpt"],
        "meta_title": NEW_STORY["meta_title"],
        "meta_description": NEW_STORY["meta_description"],
        "content": minimal_rich,
        "content_markdown": penang_md,
        "author": 1,
        "_status": "published",
        "status": "published",
        "workflowStatus": "published",
        "publishedDate": datetime.now().isoformat(),
    }
    result = post_story(token, story_payload)
    if result.get("status") == "exists":
        print(f"[EXISTS] {NEW_STORY['slug']} already present")
    elif result.get("id"):
        check = find_story(token, NEW_STORY["slug"])
        ok = check is not None and len(check.get("content_markdown") or "") > 4000
        print(f"[{'OK' if ok else 'FAIL'}] POST {NEW_STORY['slug']} (id {result['id']}) "
              f"| md chars: {len(check.get('content_markdown') or '') if check else 0}")
    else:
        print(f"[FAIL] POST {NEW_STORY['slug']}: {result}")


if __name__ == "__main__":
    main()
