#!/usr/bin/env python3
"""
Shared Grist access for the SEO-OS scripts (ContentPipeline + competitor tables).

Credential policy: no secrets in code. Grist key is read from, in order:
  1. env var GRIST_API_KEY
  2. ~/.config/grist-mcp/.env        (local machine)
  3. ~/.skills-data/data-driven-product/configs/grist.env (server)
URL/doc id default to the production Website-Metrics doc; override via
GRIST_URL / GRIST_DOC_ID env.
"""
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://grist.system.simplyenak.com"
DOC = "nNS1MDqZnRLoeASAdLESkA"


def _load_key():
    if os.environ.get("GRIST_API_KEY"):
        return os.environ["GRIST_API_KEY"]
    for p in (
        os.path.expanduser("~/.config/grist-mcp/.env"),
        os.path.expanduser("~/.skills-data/data-driven-product/configs/grist.env"),
    ):
        if not os.path.exists(p):
            continue
        for line in open(p):
            line = line.strip()
            if line.startswith("GRIST_API_KEY="):
                return line.split("=", 1)[1].strip().strip("'\"")
    raise SystemExit("GRIST_API_KEY not found (env or .env files) — refusing to guess")


def request(path, method="GET", body=None, retries=2):
    """path is doc-relative, e.g. '/tables/ContentPipeline/records'.
    Resolves to {GRIST_URL}/api/docs/{DOC}{path}."""
    key = _load_key()
    doc = os.environ.get("GRIST_DOC_ID", DOC)
    base = os.environ.get("GRIST_URL", BASE).rstrip("/")
    url = f"{base}/api/docs/{doc}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url, method=method,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        data=data,
    )
    last = None
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                txt = r.read().decode()
                return json.loads(txt) if txt.strip() else txt
        except urllib.error.HTTPError as e:
            last = RuntimeError(f"Grist {method} {path} -> {e.code}: {e.read().decode()[:300]}")
            if e.code >= 500 and attempt < retries:
                time.sleep(2)
                continue
            raise last
    raise last


def upsert(table, key_fields, records):
    """Idempotent write. records: list of {Field: value} (omit empties).
    Existing rows (matched on ALL key_fields) are PATCHed, new rows POSTed.
    Returns {"patched": n, "posted": n}."""
    clean = [
        {k: v for k, v in r.items() if v not in (None, "")}
        for r in records
    ]
    if not clean:
        return {"patched": 0, "posted": 0}
    q = json.dumps({kf: sorted({r.get(kf) for r in clean if r.get(kf) is not None}) for kf in key_fields})
    existing = request(f"/tables/{table}/records?filter=" + urllib.parse.quote(q)).get("records", [])
    have = {}
    for e in existing:
        have[tuple(e.get("fields", {}).get(kf) for kf in key_fields)] = e
    patches, posts = [], []
    for r in clean:
        key = tuple(r.get(kf) for kf in key_fields)
        rec = {"fields": r}
        if key in have and have[key] is not None:
            rec["id"] = have[key]["id"]
            patches.append(rec)
        else:
            posts.append(rec)
            have[key] = None
    for i in range(0, len(patches), 100):
        request(f"/tables/{table}/records", "PATCH", {"records": patches[i:i+100]})
    for i in range(0, len(posts), 100):
        request(f"/tables/{table}/records", "POST", {"records": posts[i:i+100]})
    return {"patched": len(patches), "posted": len(posts)}


def get_records(table, filter_dict=None):
    q = f"?filter={urllib.parse.quote(json.dumps(filter_dict))}" if filter_dict else ""
    return request(f"/tables/{table}/records{q}").get("records", [])


def ts(dt):
    """date/datetime -> Grist Date value (epoch seconds, UTC midnight)."""
    import datetime as _dt
    if isinstance(dt, _dt.datetime):
        return int(dt.timestamp())
    if isinstance(dt, _dt.date):
        return int(_dt.datetime(dt.year, dt.month, dt.day, tzinfo=_dt.timezone.utc).timestamp())
    return int(dt)
