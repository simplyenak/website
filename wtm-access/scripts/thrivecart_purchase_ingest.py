# thrivecart-purchase-ingest
# Public ThriveCart webhook front door (fire-and-forget). ThriveCart delivers
# either:
#  - Event Subscription API (what we registered): body is JSON
#  - Legacy account-wide webhook: body is x-www-form-urlencoded
# This script normalises both into the ThriveCart payload shape wtm-access
# expects, then relays to wtm-access's internal /webhooks/thrivecart, which owns
# the purchases DB + grant/revoke logic (single source of truth).
# Credentials from the PyRunner secret store, never hardcoded.
import json
import os
import urllib.parse
import urllib.request
import urllib.error

HOOKKEY = os.environ.get("WTM_HOOKKEY", "")
TC_SECRET = os.environ.get("THRIVECART_SECRET", "")
WTM_ACCESS = os.environ.get("WTM_ACCESS_INTERNAL", "http://wtm-access:8300")


def log(msg):
    print(msg)


def parse_body(raw):
    """Return (payload_dict, is_valid). Handle JSON or form-urlencoded."""
    if not raw:
        return {}, False
    raw = raw.strip()
    # Try JSON first
    if raw.startswith(("{", "[")):
        try:
            return json.loads(raw), True
        except Exception:
            pass
    # Fall back to form-urlencoded
    try:
        parsed = urllib.parse.parse_qs(raw, keep_blank_values=True)
        # Un-flatten keys like 'customer[email]', 'purchase_map[0]', 'order[total]'
        obj = {}
        for k, vals in parsed.items():
            v = vals[-1] if vals else ""
            _set_path(obj, k, v)
        return obj, bool(obj)
    except Exception as e:
        log("parse error: %s" % e)
        return {}, False


def _set_path(obj, key, value):
    """Set nested value from 'a[b][c]' style form key. Handles flat string lists
    (purchase_map[0]=val) and lists of objects (order[charges][0][name]=x)."""
    if "[" not in key:
        obj[key] = value
        return
    head, rest = key.split("[", 1)
    rest = rest.rstrip("]")
    parts = [head] + [p for p in rest.split("][") if p != ""]
    pos = 0
    cur = obj
    while pos < len(parts):
        part = parts[pos]
        last = (pos == len(parts) - 1)
        nxt = parts[pos + 1] if pos + 1 < len(parts) else None
        if nxt is not None and nxt.isdigit():
            # entering a list via `part`; ensure it's a list
            if not isinstance(cur.get(part), list):
                cur[part] = []
            lst = cur[part]
            idx = int(nxt)
            nxt_terminal = (pos + 1 == len(parts) - 1)
            if nxt_terminal:
                while len(lst) <= idx:
                    lst.append(None)
                lst[idx] = value
                return
            while len(lst) <= idx:
                lst.append({})
            if lst[idx] is None:
                lst[idx] = {}
            cur = lst[idx]
            pos += 2
        else:
            if last:
                cur[part] = value
                return
            if not isinstance(cur.get(part), dict):
                cur[part] = {}
            cur = cur[part]
            pos += 1


def verify_secret(payload):
    """ThriveCart includes thrivecart_secret; reject payloads without a match
    when we have a configured secret. Failure is logged, not fatal, so a missing
    secret value (test mode etc.) doesn't silently drop real events."""
    if not TC_SECRET:
        return True
    got = payload.get("thrivecart_secret")
    return bool(got) and got == TC_SECRET


def relay(payload):
    url = WTM_ACCESS + "/webhooks/thrivecart?k=" + urllib.parse.quote(HOOKKEY)
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        log("relay error: %s" % type(e).__name__)
        return None, str(e)[:200]


def main():
    try:
        payload_str = os.environ.get("WEBHOOK_BODY_JSON", "") or os.environ.get("WEBHOOK_BODY", "")
    except Exception as e:
        payload_str = ""
    # parse_body handles JSON or form-urlencoded; WEBHOOK_BODY_JSON holds raw body string
    payload, ok = parse_body(payload_str)
    if not HOOKKEY:
        log("ABORTED: WTM_HOOKKEY secret not set")
        return
    if not ok or not isinstance(payload, dict) or not payload.get("event"):
        log("ignoring non-ThriveCart payload (event missing)")
        return
    if not verify_secret(payload):
        log("SECRET_MISMATCH: thrivecart_secret did not match; dropped event=%s" % payload.get("event"))
        return
    status, body = relay(payload)
    log("relayed event=%s -> wtm-access HTTP %s %s"
        % (payload.get("event"), status, body[:200]))


main()