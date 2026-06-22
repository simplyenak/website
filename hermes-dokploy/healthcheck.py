#!/usr/bin/env python3
"""Lightweight health check for Hermes Agent container."""

import sys
import urllib.request
import urllib.error


def check():
    try:
        req = urllib.request.Request("http://localhost:8080/health")
        resp = urllib.request.urlopen(req, timeout=3)
        if resp.status == 200:
            sys.exit(0)
    except Exception:
        pass

    try:
        with open("/proc/1/cmdline", "r") as f:
            cmdline = f.read()
            if "hermes" in cmdline or "gateway" in cmdline:
                sys.exit(0)
    except Exception:
        pass

    sys.exit(1)


if __name__ == "__main__":
    check()