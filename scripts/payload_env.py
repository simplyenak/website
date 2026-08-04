#!/usr/bin/env python3
"""
Shared Payload credential loader.

Loads site/.env (PAYLOAD_URL, PAYLOAD_EMAIL, PAYLOAD_PASSWORD, ...) into
os.environ so scripts that log into Payload CMS keep working after the
admin password is rotated — the credentials live in ONE place (site/.env,
gitignored) instead of hardcoded fallbacks in each script.

Usage: `import payload_env` (no-op if already imported / env already set).
"""

import os

_ENV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "site", ".env"
)

if os.path.exists(_ENV_PATH):
    with open(_ENV_PATH) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k, _v)
