#!/usr/bin/env python3
"""Credential health monitor — checks all LLM providers + data sources.
Runs as no_agent=True cron. Sends Telegram alert on failures.
Silent when everything is OK (watchdog pattern)."""

import json, os, sys, urllib.request
from datetime import datetime

# ── Configuration ──────────────────────────────────────────────
PROVIDERS = [
    {"name": "Omniroute", "url": "http://omniroute:20129/v1/models",
     "key_env": "OMNIROUTE_API_KEY", "auth": "Bearer"},
    {"name": "Brilliant KB", "url": "http://compose-brilliant_api:8000/entries",
     "key_env": "BRILLIANT_API_KEY", "auth": "Bearer"},
    {"name": "PyRunner", "url": "http://pyrunner:8000/",
     "key_env": None, "auth": None},
    {"name": "Payload CMS", "url": "http://simplyenakbackend_payload:3000/api/access",
     "key_env": None, "auth": None},
    {"name": "SearXNG", "url": os.environ.get("SEARXNG_URL",
         "http://agent-search-searxng:8080") + "/healthz",
     "key_env": None, "auth": None},
    # GH_TOKEN: catches logout/rotation silently killing loop issue-tracking.
    # 404 from this endpoint = token invalid/expired (gh auth logout kills it).
    {"name": "GitHub", "url": "https://api.github.com/repos/simplyenak/self-running-agents",
     "key_env": "GH_TOKEN", "auth": "token"},
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


def _dotenv_fallback(*keys):
    """Cron scripts get the CONTAINER env, not the gateway's profile .env.
    Read missing keys from ~/.hermes/.env (the server credential store)."""
    import pathlib
    env_file = pathlib.Path.home() / ".hermes" / ".env"
    try:
        lines = env_file.read_text().splitlines()
    except OSError:
        return
    for ln in lines:
        if "=" in ln and not ln.startswith("#"):
            k, v = ln.split("=", 1)
            if k in keys:
                os.environ.setdefault(k, v.strip())


def agentsearch_canary():
    """Real-search canary for AgentSearch (SearXNG fusion).

    Google's google.com/goto redirect rollout (2026-09) can break
    SearXNG's Google parser SILENTLY: 0 results, no engine error, and
    /health stays green. Run one stable query and fail loudly on
    (a) zero results = engines suspended/blocked/IP-burned, or
    (b) google.com/goto URLs = parser passing masked redirects through.

    Query includes the date so the API's 1h result cache can never mask
    an outage with a stale good (or bad) response.
    """
    _dotenv_fallback("GH_TOKEN", "AGENT_SEARCH_TOKEN")
    base = os.environ.get("AGENT_SEARCH_URL", "http://agent-search-api:3939")
    token = os.environ.get("AGENT_SEARCH_TOKEN", "")
    if not token:
        return "AGENT_SEARCH_TOKEN not set (empty default, failing loudly)"
    stamp = datetime.now().strftime("%Y%m%d")
    try:
        req = urllib.request.Request(
            f"{base}/search?q=wikipedia+{stamp}",
            headers={"Authorization": f"Bearer {token}"})
        d = json.load(urllib.request.urlopen(req, timeout=30))
    except Exception as e:
        return f"search request failed: {str(e)[:70]}"
    results = d.get("results") or []
    goto = [r.get("url", "") for r in results
            if "google.com/goto" in r.get("url", "")]
    if goto:
        return (f"{len(goto)}/{len(results)} result URLs are "
                "google.com/goto (masked redirects)")
    if not results:
        errs = "; ".join((d.get("meta") or {}).get("upstream_errors") or [])
        return (f"0 results for stable query "
                f"({errs[:120] or 'no engine errors - silent parse failure?'})")
    return None


def main():
    _dotenv_fallback("GH_TOKEN", "OMNIROUTE_API_KEY", "BRILLIANT_API_KEY")
    failures = []
    for p in PROVIDERS:
        # Missing credential = loud failure, not a confusing downstream error.
        if p["key_env"] and not os.environ.get(p["key_env"], ""):
            failures.append(f"  \u274c {p['name']}: {p['key_env']} not set")
            continue
        ok, detail = check(p["name"], p["url"], p["key_env"], p["auth"])
        if not ok:
            failures.append(f"  \u274c {p['name']}: {detail}")

    canary_fail = agentsearch_canary()
    if canary_fail:
        failures.append(f"  \u274c AgentSearch canary: {canary_fail}")

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
