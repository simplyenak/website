#!/usr/bin/env python3
"""Credential health monitor — checks all LLM providers + data sources.
Runs as no_agent=True cron. Sends Telegram alert on failures.
Silent when everything is OK (watchdog pattern)."""

import json, os, sys, urllib.request

# ── Configuration ──────────────────────────────────────────────
PROVIDERS = [
    {"name": "Omniroute", "url": "http://omniroute:20129/v1/models",
     "key_env": "OMNIROUTE_API_KEY", "auth": "Bearer"},
    {"name": "Brilliant KB", "url": "http://compose-brilliant_api:8000/entries",
     "key_env": "BRILLIANT_API_KEY", "auth": "Bearer"},
    {"name": "PyRunner", "url": "http://pyrunner:9090/health",
     "key_env": None, "auth": None},
    {"name": "Payload CMS", "url": "http://simplyenakbackend_payload:3000/api/globals",
     "key_env": None, "auth": None},
    {"name": "SearXNG", "url": "http://searxng:8080/health",
     "key_env": None, "auth": None},
]

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.environ.get("TELEGRAM_ALLOWED_USERS", "1511186614")
HOST = os.uname().nodename


def check(name, url, key_env, auth_scheme):
    key = os.environ.get(key_env, "") if key_env else ""
    try:
        req = urllib.request.Request(url)
        if key and auth_scheme:
            req.add_header("Authorization", f"{auth_scheme} {key}")
        resp = urllib.request.urlopen(req, timeout=10)
        return True, resp.status
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}"
    except Exception as e:
        return False, str(e)[:80]


def main():
    failures = []
    for p in PROVIDERS:
        ok, detail = check(p["name"], p["url"], p["key_env"], p["auth"])
        if not ok:
            failures.append(f"  \u274c {p['name']}: {detail}")

    if not failures:
        return

    msg = (
        f"\U0001f6a8 Credential health check FAILED on {HOST}\n"
        + "\n".join(failures)
    )

    if TOKEN:
        data = json.dumps({"chat_id": CHAT_ID, "text": msg}).encode()
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TOKEN}/sendMessage",
            data=data,
            headers={"Content-Type": "application/json"},
        )
        urllib.request.urlopen(req, timeout=10)
    else:
        print(msg)


if __name__ == "__main__":
    main()
