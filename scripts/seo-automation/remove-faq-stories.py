#!/usr/bin/env python3
"""
Execute the no-FAQ-stories mandate:
1. Fold unique content (picking tips) from my draft expansion into the
   published durian-season-malaysia guide (same query, already ranks).
2. DELETE all 11 faq-* draft stories (dead weight, not live, no value).
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

PICKING_TIPS = """## How to Pick a Good Durian

A few things we teach on tour, and use ourselves:

- **Shape** — rounder fruit has more flesh per shell than long, oval ones.
- **Stem** — a thick, short stem usually means thick flesh inside.
- **Aroma** — a strong smell even unopened is a good sign. If you can't smell it, it's likely underripe.
- **The knock test** — tap the shell. A deep, hollow sound means it's ready; a high, tight sound means it's not.
- **Never buy pre-opened** — the flesh loses its aroma and sweetness once exposed. Let the vendor crack it in front of you.
"""


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


def get_story(token: str, slug: str) -> dict | None:
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
        data=body, method="PATCH",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
    )
    urllib.request.urlopen(req, timeout=30).read()


def delete_story(token: str, story_id: int) -> bool:
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories/{story_id}",
        method="DELETE",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        urllib.request.urlopen(req, timeout=15).read()
        return True
    except urllib.error.HTTPError as e:
        print(f"    HTTP {e.code}: {e.read().decode()[:120]}", file=sys.stderr)
        return False


def main() -> None:
    token = login()
    print("Logged in.\n")

    # ── 1. Add picking tips to durian-season-malaysia (skip if already present) ──
    guide = get_story(token, "durian-season-malaysia")
    if not guide:
        print("[FAIL] durian-season-malaysia not found")
    else:
        md = guide.get("content_markdown") or ""
        if "How to Pick a Good Durian" in md:
            print("[SKIP] durian-season-malaysia already has picking-tips section")
        else:
            # Insert before the "A Note on Durian and Hotels" section if present, else append
            anchor = "## A Note on Durian and Hotels"
            if anchor in md:
                md = md.replace(anchor, PICKING_TIPS + "\n" + anchor)
            else:
                md = md.rstrip() + "\n\n" + PICKING_TIPS
            patch_story(token, guide["id"], {"content_markdown": md})
            check = get_story(token, "durian-season-malaysia")
            ok = "How to Pick a Good Durian" in (check.get("content_markdown") or "")
            print(f"[{'OK' if ok else 'FAIL'}] added picking tips to durian-season-malaysia (id {guide['id']})")

    # ── 2. Delete all faq-* stories ──
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/stories?limit=200")
    resp = json.loads(urllib.request.urlopen(req, timeout=20).read())
    faq_docs = [d for d in resp.get("docs", []) if (d.get("slug") or "").startswith("faq-")]
    print(f"\nDeleting {len(faq_docs)} faq-* stories:")
    ok_del = 0
    for d in sorted(faq_docs, key=lambda x: x.get("slug", "")):
        print(f"  - {d.get('slug')} (id {d.get('id')}, _status {d.get('_status')})")
        if delete_story(token, d["id"]):
            ok_del += 1
    print(f"\nDeleted {ok_del}/{len(faq_docs)}")

    # ── 3. Verify none remain ──
    resp2 = json.loads(urllib.request.urlopen(
        urllib.request.Request(f"{PAYLOAD_URL}/api/stories?limit=200"), timeout=20).read())
    remaining = [d for d in resp2.get("docs", []) if (d.get("slug") or "").startswith("faq-")]
    print(f"faq-* stories remaining: {len(remaining)}")
    if remaining:
        for d in remaining:
            print(f"  STILL EXISTS: {d.get('slug')} (id {d.get('id')})")


if __name__ == "__main__":
    main()
