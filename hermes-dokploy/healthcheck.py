#!/usr/bin/env python3
"""Docker HEALTHCHECK - verifies agent is responsive."""
import sys, urllib.request
def check():
    for url in ["http://localhost:8080/health", "http://localhost:8642/health"]:
        try:
            r = urllib.request.urlopen(url, timeout=5)
            if r.status == 200:
                return True
        except Exception:
            pass
    return False
if __name__ == "__main__":
    sys.exit(0 if check() else 1)