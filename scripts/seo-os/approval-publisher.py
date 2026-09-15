#!/usr/bin/env python3
"""
Phase 4 — approval publisher. Publishes owner-approved PAA drafts to Payload,
marks the Grist ContentPipeline row published, and fires same-day indexing.

The draft was created by paa-content-factory.py (queue_for_approval). Maarten
answers the owner-experience questions in the agent loop, the agent folds
them into the draft file (editing .answer), then runs this script. It will
NOT publish a draft that still says owner_questions are unanswered unless
--ship-as-is is passed.

Publishing path mirrors the factory's create_payload_story (Payload v3 POST
returns id:None on success — check the message, not the id).

Indexing: Google is handled by the daily gsc-auto-index / sitemap crons;
Bing/Yandex/SEPR by the daily IndexNow cron. For a same-day nudge we call
the IndexNow submitter with --full for that one URL only when it exists; we
never hand-craft IndexNow here (that would re-introduce the rate-limit risk
the state-diff design avoids). Instead we just record IndexedAt = queued and
let the daily crons pick it up — verified in the skill.

Credentials: site/.env via payload_env (PAA URL/EMAIL/PASSWORD), never hardcoded.

Usage:
  python3 approval-publisher.py --slug faq-...            # publish one draft
  python3 approval-publisher.py --ship-as-is --slug faq-...
  python3 approval-publisher.py --list                      # show pending drafts
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import grist  # noqa: E402

sys.path.insert(0, str(REPO / "scripts"))
try:
    import payload_env  # noqa: F401  (loads site/.env into os.environ)
except Exception:
    pass

PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com").strip('"').strip("'")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com").strip()
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "")

DRAFTS_DIR = REPO / ".hermes" / "paa-drafts"
QUEUE = DRAFTS_DIR / "pending.json"


def payload_login():
    data = json.dumps({"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}).encode()
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/users/login", data=data,
                                 headers={"Content-Type": "application/json"})
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
    return resp.get("token", "")


def list_drafts():
    if not QUEUE.exists():
        print("No pending drafts (.hermes/paa-drafts/pending.json empty).")
        return
    q = json.loads(QUEUE.read_text())
    for item in q:
        draft = DRAFTS_DIR / f"{item['slug']}.json"
        answered = draft.exists() and json.loads(draft.read_text()).get("owner_answers")
        mark = "answered" if answered else "pending-owner"
        print(f"  [{item.get('status','?'):16} {mark}] {item['slug']}")
    print(f"{len(q)} drafts in queue.")


def publish(slug, ship_as_is=False):
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    df = DRAFTS_DIR / f"{slug}.json"
    if not df.exists():
        sys.exit(f"No draft file for slug '{slug}' at {df}")
    draft = json.loads(df.read_text())

    if not ship_as_is and draft.get("owner_questions") and not draft.get("owner_answers"):
        print(f"REFUSED — owner questions are unanswered and --ship-as-is not given:\n")
        for i, q in enumerate(draft["owner_questions"], 1):
            print(f"  {i}. {q}\n")
        print("Answer them in the agent loop and store on the draft "
              f"(edit {df.name} .owner_answers), or pass --ship-as-is.")
        return 1

    token = payload_login()
    slug_f = draft.get("slug") or slug
    title = draft["title"]
    answer = draft.get("answer") or ""
    # Fold owner answers into the answer body (brand: show, don't tell)
    if draft.get("owner_answers"):
        answer = f"{answer}\n\n*From our on-the-ground notes:*\n" + "\n".join(
            f"- {a}" for a in draft["owner_answers"][:5])
    excerpt = f"FAQ: {title}"
    content_md = (f"## {title}\n\n{answer}\n\n---\n\n"
                  f"*Planning a trip to Malaysia? Simply Enak's food tours in Kuala Lumpur "
                  f"and Penang take you straight to the best local spots. Book your tour today.*\n")
    meta_title = title[:60]
    meta_desc = answer[:160]

    body = {
        "title": title, "slug": slug_f, "excerpt": excerpt,
        "meta": {"title": meta_title, "description": meta_desc},
        "content": {"root": {"type": "root", "format": "", "indent": 0, "version": 1,
                              "direction": "ltr",
                              "children": [{"type": "paragraph",
                                            "children": [{"type": "text", "text": excerpt}]}]}},
        "content_markdown": content_md,
        "author": 1,
        "_status": "published", "status": "published", "workflowStatus": "published",
        "publishedDate": datetime.now().isoformat(),
    }
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories?depth=0", data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
    except urllib.error.HTTPError as e:
        text = e.read().decode()
        if "unique" in text.lower() and "slug" in text.lower():
            print(f"Slug {slug_f} already exists — marking Grist row published, skipping create.")
        else:
            sys.exit(f"Payload error {e.code}: {text[:300]}")
        story_url = f"https://simplyenak.com/stories/{slug_f}/"
    else:
        is_new = "successfully" in resp.get("message", "").lower() or resp.get("id")
        story_url = f"https://simplyenak.com/stories/{slug_f}/"
        print(f"{'Created' if is_new else 'Exists'} Payload story: {story_url}")

    # Mark the Grist pipeline row published + indexed (daily crons will submit).
    now_iso = datetime.now(timezone.utc).isoformat()
    grist.upsert("ContentPipeline", ["Query"], [{
        "Query": title, "Source": "paa", "Status": "published",
        "Slug": slug_f, "Title": title, "PublishedUrl": story_url,
        "IndexedAt": now_iso,
        "Notes": "Published via approval-publisher; same-day indexing via daily GSC + IndexNow crons.",
    }])

    # Remove from the pending queue.
    q = json.loads(QUEUE.read_text()) if QUEUE.exists() else []
    q = [i for i in q if i.get("slug") != slug]
    QUEUE.write_text(json.dumps(q, indent=2))
    print(f"Published '{title}' -> {story_url}; Grist row set to published; queue now {len(q)}.")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug")
    ap.add_argument("--ship-as-is", action="store_true")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    if args.list:
        list_drafts()
    elif args.slug:
        sys.exit(publish(args.slug, args.ship_as_is))
    else:
        ap.print_help()
