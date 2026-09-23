#!/usr/bin/env python3
"""
Daily Payment Matching — no_agent=True cron script.

Triggers the gmail-payment-matcher webhook on pyrunner.
Payment processing happens server-side; this script reports trigger status.
"""
import json, urllib.request, sys

import os as _os, pathlib as _pl
PYRUNNER = _os.environ.get("PYRUNNER_BASE", "https://pyrunner.system.simplyenak.com")

def _webhook_id():
    v = _os.environ.get("PYRUNNER_PAYMENT_WEBHOOK", "")
    if v:
        return v
    try:
        ef = _pl.Path.home() / ".hermes" / ".env"
        if ef.exists():
            for ln in ef.read_text().splitlines():
                if ln.startswith("PYRUNNER_PAYMENT_WEBHOOK="):
                    return ln.split("=", 1)[1].strip()
    except OSError:
        pass
    return "57256e5765e441a086e68f9cf5231e34"

WEBHOOK_ID = _webhook_id()

def main():
    print("=== Daily Payment Matching ===\n")
    
    try:
        req = urllib.request.Request(
            f"{PYRUNNER}/webhook/{WEBHOOK_ID}/",
            data=b"{}",
            headers={"Content-Type": "application/json"}
        )
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        run_id = resp.get("run_id", "")
        
        if resp.get("status") == "queued" and run_id:
            print(f"✅ Payment matcher triggered successfully")
            print(f"   Run ID: {run_id}")
            print(f"   Script: {resp.get('script', 'unknown')}")
            print("\n   Payment matching is processing server-side.")
            print("   Check results in Dolibarr for updated invoice payments.")
        else:
            print(f"⚠️  Webhook responded but unexpected: {json.dumps(resp)}")
            sys.exit(1)
            
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP {e.code}: {e.read().decode()[:200]}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed: {e}")
        sys.exit(1)
    
    print("\n— Payment matching complete —")

if __name__ == "__main__":
    main()
