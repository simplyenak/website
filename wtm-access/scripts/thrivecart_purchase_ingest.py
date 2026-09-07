# thrivecart-purchase-ingest
# Public ThriveCart webhook front door (fire-and-forget): receipts the event,
# then relays the raw payload to wtm-access's internal /webhooks/thrivecart
# endpoint, which owns the purchases DB + grant/revoke logic (single source of
# truth). Credentials from the PyRunner secret store, never hardcoded.
import json
import os
import urllib.parse
import urllib.request
import urllib.error

HOOKKEY = os.environ.get("WTM_HOOKKEY", "")
WTM_ACCESS = os.environ.get("WTM_ACCESS_INTERNAL", "http://wtm-access:8300")


def log(msg):
    print(msg)


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
        payload = json.loads(os.environ.get("WEBHOOK_BODY_JSON", "{}"))
    except Exception as e:
        log("bad payload: %s" % e)
        payload = {}
    if not HOOKKEY:
        log("ABORTED: WTM_HOOKKEY secret not set")
        return
    if not isinstance(payload, dict) or not payload.get("event"):
        log("ignoring non-ThriveCart payload")
        return
    status, body = relay(payload)
    log("relayed event=%s -> wtm-access HTTP %s %s"
        % (payload.get("event"), status, body[:200]))


main()