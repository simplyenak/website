#!/usr/bin/env python3
"""
Cannibalization fix part 2 (Payload side):
1. Unpublish durian-guide-2026 (both _status and workflowStatus) — the Worker
   301 now points it at eating-durians.
2. Retitle durian-season-malaysia to evergreen (drop "(2026 Guide)").
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


def main() -> None:
    token = login()
    print("Logged in.\n")

    # 1. Unpublish durian-guide-2026
    g = get_story(token, "durian-guide-2026")
    if not g:
        print("[FAIL] durian-guide-2026 not found")
    else:
        patch_story(token, g["id"], {"_status": "draft", "workflowStatus": "draft", "status": "draft"})
        chk = get_story(token, "durian-guide-2026")
        ok = chk.get("_status") == "draft" and chk.get("workflowStatus") == "draft"
        print(f"[{'OK' if ok else 'FAIL'}] durian-guide-2026 (id {g['id']}) -> "
              f"_status={chk.get('_status')} wf={chk.get('workflowStatus')}")

    # 2. Retitle durian-season-malaysia to evergreen
    s = get_story(token, "durian-season-malaysia")
    if not s:
        print("[FAIL] durian-season-malaysia not found")
    else:
        old_title = s.get("title", "")
        new_title = "Durian Season in Malaysia: When to Visit for the Best Fruit"
        new_meta = "Durian Season in Malaysia: When to Visit for the Best Fruit | Simply Enak"
        patch_story(token, s["id"], {"title": new_title, "meta_title": new_meta})
        chk = get_story(token, "durian-season-malaysia")
        ok = chk.get("title") == new_title and chk.get("meta_title") == new_meta
        print(f"[{'OK' if ok else 'FAIL'}] durian-season-malaysia (id {s['id']})")
        print(f"       old title: {old_title!r}")
        print(f"       new title: {chk.get('title')!r}")
        print(f"       new meta : {chk.get('meta_title')!r}")


if __name__ == "__main__":
    main()
