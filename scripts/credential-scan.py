#!/usr/bin/env python3
"""
Credential scan — enforces the repo's credential policy (AGENTS.md).

Fails if any TRACKED, ACTIVE file contains:
  1. Known leaked credential values (e.g. admin123)
  2. Private key material
  3. Well-known provider key formats (OpenAI, AWS, GitHub PAT, Slack, Google)
  4. env-var getters with a REAL-VALUE default (the mandate violation pattern:
     os.environ.get("PAYLOAD_PASSWORD", "admin123") — defaults must be empty)

Excludes: docs (*.md), lockfiles, ARCHIVED/, downloaded-project/,
revamp-backend-source/ (historical snapshots, not active code).

Usage: python3 scripts/credential-scan.py
Exit 0 = clean, exit 1 = violations found.
"""

import os
import re
import subprocess
import sys

EXCLUDES = (
    ":!*.md",
    ":!*.lock",
    ":!package-lock.json",
    ":!ARCHIVED/**",
    ":!downloaded-project/**",
    ":!revamp-backend-source/**",
    ":!site/.env",
    ":!**/.env",
    ":!*.svg",
    # The scanner itself contains the literal patterns it searches for
    ":!scripts/credential-scan.py",
    ":!scripts/known-secrets.txt",
)

# Known leaked/rotated credential VALUES. The static list covers the historical
# leak; scripts/known-secrets.txt (gitignored) is appended by the rotation
# procedure (AGENTS.md) so every rotated-away password is flagged immediately.
KNOWN_SECRETS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "known-secrets.txt")

def load_known_secrets() -> list:
    vals = ["admin123"]
    if os.path.exists(KNOWN_SECRETS_FILE):
        with open(KNOWN_SECRETS_FILE) as f:
            for line in f:
                v = line.strip()
                if v and not v.startswith("#"):
                    vals.append(v)
    return vals

KNOWN_SECRETS = load_known_secrets()

CHECKS = [
    (
        "Known leaked values",
        r"(" + "|".join(re.escape(v) for v in KNOWN_SECRETS) + r")",
        ("*.py", "*.js", "*.mjs", "*.ts", "*.sh", "*.yml", "*.yaml", "*.json"),
    ),
    (
        "Private key material",
        r"BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY",
        ("*",),
    ),
    (
        "Provider key formats",
        r"(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|sk-ant-[A-Za-z0-9_-]{20,})",
        ("*",),
    ),
    (
        "env-get with real-value default",
        # Only credential-named keys (PASSWORD/SECRET/TOKEN/API_KEY/KEY/CREDENTIAL)
        # with a non-empty literal default. URLs, emails, ports, hostnames, and
        # PUBLIC_VITE_* (public-by-design client keys) are legitimate defaults.
        r"(os\.environ\.get|os\.getenv)\s*\(\s*[\"'][A-Z_0-9]*(PASSWORD|PASSWD|SECRET|API_?KEY|TOKEN|CREDENTIAL|PRIVATE_?KEY|ACCESS_?KEY)[A-Z_0-9]*[\"']\s*,\s*[\"'][^\"']{4,}[\"']",
        ("*.py", "*.js", "*.mjs", "*.ts", "*.sh"),
    ),
]

# Values that are legitimately non-secret even in credential-named keys
ALLOWED_VALUE_SUBSTRINGS = ("://", "@", "REPLACE", "example", "changeme", "PUBLIC_VITE_")

def is_benign(line: str) -> bool:
    return any(s in line for s in ALLOWED_VALUE_SUBSTRINGS)

def run_git_grep(pattern: str, globs: tuple) -> list:
    cmd = ["git", "grep", "-n", "-E", pattern, "--", *globs, *EXCLUDES]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode == 0:
        return r.stdout.strip().splitlines()
    return []

def main() -> int:
    violations = []
    for name, pattern, globs in CHECKS:
        hits = run_git_grep(pattern, globs)
        # Filter benign values (URLs/emails/examples/public client keys)
        hits = [h for h in hits if not is_benign(h)]
        if hits:
            violations.append((name, hits))
    if not violations:
        print("✅ Credential scan clean — no hardcoded credentials in tracked code.")
        return 0
    for name, hits in violations:
        print(f"❌ {name}:")
        for h in hits[:10]:
            print(f"   {h}")
        if len(hits) > 10:
            print(f"   ... and {len(hits) - 10} more")
    return 1

if __name__ == "__main__":
    sys.exit(main())
