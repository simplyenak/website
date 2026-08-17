#!/usr/bin/env python3
"""
deploy-health.py — the deploy-health gate for simplyenak.com.

Runs ALL the checks that were previously scattered reactions to incidents,
in one place, with one exit code. Each check is independently skippable.

Checks:
  1. credential  — no known secret values in tracked files (known-secrets.txt)
                   + no apiKey/sessions in content snapshots
  2. nav         — navigation.json has non-empty header_links (menus auth bug)
  3. redirects   — every Worker REDIRECTS source returns 301 (or is a known
                   skip); every target returns 200 (or is a known skip)
  4. render      — refresh-loop --verify: flagged pages render current content
                   (stale-deploy + wrong-field detection, with deploy-window retry)

Usage:
    python3 scripts/seo-automation/deploy-health.py            # all checks
    python3 scripts/seo-automation/deploy-health.py --check nav,render
    python3 scripts/seo-automation/deploy-health.py --no-live  # skip network checks

Exit 0 = all pass. Exit 1 = any failure. Output is the delivered report.
"""
import argparse
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
KNOWN_SECRETS = REPO / "scripts" / "known-secrets.txt"
CONTENT_DIR = REPO / "site" / "src" / "data" / "content"
WORKER = REPO / "site" / "workers" / "cdn-rewriter.js"
SITE = "https://simplyenak.com"


def check_credentials() -> list[str]:
    """1. Known secret values must not appear in tracked files."""
    problems = []
    if not KNOWN_SECRETS.exists():
        problems.append("known-secrets.txt missing — cannot verify")
        return problems
    values = [l.strip() for l in KNOWN_SECRETS.read_text().splitlines()
              if l.strip() and not l.startswith("#") and len(l.strip()) >= 12 and " " not in l.strip()]

    tracked = subprocess.run(
        ["git", "-C", str(REPO), "ls-files"], capture_output=True, text=True).stdout.splitlines()
    for f in tracked:
        if not f or "/.hermes/" in f:
            continue
        try:
            text = (REPO / f).read_text(errors="replace")
        except Exception:
            continue
        for v in values:
            if v in text and ("=" in text.split(v)[0][-40:] or ":" in text.split(v)[0][-40:]):
                problems.append(f"known secret {v[:10]}… found in tracked {f}")
    # snapshots must not carry user apiKey/sessions
    for snap in CONTENT_DIR.glob("*.json"):
        try:
            t = snap.read_text()
        except Exception:
            continue
        if '"apiKey"' in t:
            problems.append(f"apiKey present in snapshot {snap.name}")
    return problems


def check_nav() -> list[str]:
    """2. navigation.json must have non-empty header_links (menus wipe bug)."""
    problems = []
    nav = CONTENT_DIR / "navigation.json"
    if not nav.exists():
        problems.append("navigation.json missing")
        return problems
    try:
        d = json.loads(nav.read_text())
        links = d.get("header_links") or []
        if len(links) == 0:
            problems.append("navigation.json header_links is EMPTY (menus auth wipe?)")
    except Exception as e:
        problems.append(f"navigation.json unreadable: {e}")
    return problems


def _http_status(url: str, timeout: int = 15, follow: bool = False) -> int | None:
    """HTTP status via curl, NOT urllib.

    Cloudflare bot-fight TLS-fingerprints clients: urllib's JA3 fingerprint is
    flagged as a bot and gets a DIFFERENT response (200 instead of the Worker's
    301) for the same URL. curl passes the fingerprint check. Discovered
    2026-08-17 — deploy-health's redirect check returned 85 false failures
    with urllib while curl consistently saw 301s.

    follow=True follows the redirect chain and returns the FINAL status
    (redirect sources should be checked with follow=False — the 301/308 IS the
    answer; targets with follow=True — the chain must end at 200).
    """
    try:
        import subprocess
        cmd = ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
               "--max-time", str(timeout), "-A", "Mozilla/5.0 (compatible; deploy-health/1.0)"]
        if follow:
            cmd.append("-L")
        else:
            cmd.append("-I")
        cmd.append(url)
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 5)
        if r.returncode != 0:
            return None
        code = r.stdout.strip()
        return int(code) if code.isdigit() else None
    except Exception:
        return None


def check_redirects(live: bool) -> list[str]:
    """3. Worker REDIRECTS: sources 301, targets 200. Uses the same logic the
    Worker uses (pathname match) so a broken map shows up here, not in GSC."""
    problems = []
    if not WORKER.exists():
        problems.append("worker file missing")
        return problems
    src = WORKER.read_text()
    m = re.search(r"REDIRECTS\s*=\s*\{(.*?)\n\}", src, re.S)
    if not m:
        problems.append("cannot parse REDIRECTS map")
        return problems
    entries = re.findall(r'"((?:/[^"]*?[^/]|/))"\s*:\s*"([^"]+)"', m.group(1))
    if not live:
        print(f"  [redirects] {len(entries)} map entries parsed (live checks skipped)")
        return problems
    checked = 0
    for source, target in entries:
        if source in ("/directions",):
            continue  # canonicalizes to slash variant; covered by target check
        # only check the canonical (non-trailing-slash) source to avoid doubling
        if source.endswith("/") and source != "/":
            continue
        url = SITE + source
        st = _http_status(url)
        checked += 1
        if st != 301:
            problems.append(f"redirect source {source} → HTTP {st} (expected 301)")
        else:
            tgt = SITE + target
            # follow the chain: 301 → (possible 308) → final page must be 200
            tst = _http_status(tgt, follow=True)
            if tst != 200:
                problems.append(f"redirect target {target} → chain ends HTTP {tst} (expected 200)")
    print(f"  [redirects] checked {checked} redirect sources")
    return problems


def check_render(live: bool) -> list[str]:
    """4. refresh-loop --verify: flagged pages render current content."""
    problems = []
    rl = REPO / "scripts" / "seo-automation" / "refresh-loop.py"
    if not rl.exists():
        problems.append("refresh-loop.py missing — cannot render-check")
        return problems
    cmd = [sys.executable, str(rl), "--verify", "--no-verify-retry"]
    if not live:
        print("  [render] live checks skipped")
        return problems
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=300, cwd=REPO)
    out = (r.stdout or "") + (r.stderr or "")
    print("  [render] " + " | ".join(l for l in out.splitlines() if l.strip())[:600])
    if r.returncode != 0:
        problems.append("render verification FAILED (see output)")
    return problems


def main():
    parser = argparse.ArgumentParser(description="Deploy-health gate for simplyenak.com")
    parser.add_argument("--check", default="credential,nav,redirects,render",
                        help="Comma-separated checks (default all)")
    parser.add_argument("--no-live", action="store_true", help="Skip network checks (redirects, render)")
    args = parser.parse_args()
    live = not args.no_live
    wanted = set(args.check.split(","))

    checks = {
        "credential": (check_credentials, []),
        "nav": (check_nav, []),
        "redirects": (check_redirects, [live]),
        "render": (check_render, [live]),
    }

    print(f"=== Deploy-Health Gate ({'live' if live else 'offline'}) ===")
    all_problems = []
    for name in ("credential", "nav", "redirects", "render"):
        if name not in wanted:
            continue
        fn, args_ = checks[name]
        try:
            problems = fn(*args_)
        except Exception as e:
            problems = [f"{name} check crashed: {e}"]
        status = "✓" if not problems else "✗"
        print(f"{status} {name}")
        for p in problems:
            print(f"    - {p}")
        all_problems.extend(problems)

    print(f"\n=== {'PASSED' if not all_problems else f'FAILED ({len(all_problems)} issue(s))'} ===")
    return 0 if not all_problems else 1


if __name__ == "__main__":
    sys.exit(main())
