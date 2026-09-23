#!/usr/bin/env python3
"""
Daily Agent Booking Check — no_agent=True cron script.

Triggers the gmail-booking-check pyrunner webhook which:
1. Searches booking@simplyenak.com Gmail for recent booking emails
2. Extracts booking refs, tour info, dates
3. Checks Dolibarr for existing invoices
4. Creates new invoices if none found
"""
import json, urllib.request, sys

import os as _os, pathlib as _pl


def _webhook_token():
    v = _os.environ.get("PYRUNNER_BOOKING_WEBHOOK", "")
    if v:
        return v
    try:
        ef = _pl.Path.home() / ".hermes" / ".env"
        if ef.exists():
            for ln in ef.read_text().splitlines():
                if ln.startswith("PYRUNNER_BOOKING_WEBHOOK="):
                    return ln.split("=", 1)[1].strip()
    except OSError:
        pass
    return ""

WEBHOOK_TOKEN = _webhook_token()

def main():
    print("=== Daily Agent Booking Check ===")
    
    try:
        req = urllib.request.Request(
            f"https://pyrunner.system.simplyenak.com/webhook/{WEBHOOK_TOKEN}/",
            data=b"{}",
            headers={"Content-Type": "application/json"}
        )
        resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
        
        if resp.get("status") == "queued":
            run_id = resp.get("run_id", "")[:12]
            print(f"✅ Booking check triggered (run_id: {run_id}...)")
            print("\n   Pipeline is processing on pyrunner:")
            print("   • Searching Gmail for booking emails")
            print("   • Extracting booking references")
            print("   • Checking Dolibarr invoices")
            print("   • Creating missing invoices")
            print("\n   Results will be available shortly.")
        else:
            print(f"⚠️  Unexpected: {json.dumps(resp)}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Failed: {e}")
        sys.exit(1)
    
    print("\n— Booking check complete —")

if __name__ == "__main__":
    main()
