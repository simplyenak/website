#!/usr/bin/env python3
"""
Phase 5 — weekly SEO-OS report add-ons.

The main weekly combined GSC+Bing report already runs on the server. This
script produces the three ADD-ON lines the plan calls for, sourced from Grist:

  1. Competitor top-5 gaps this week (CompetitorGaps)
  2. Pipeline state: awaiting-approval / published-this-week / published-ever
     (ContentPipeline + paa-drafts/pending.json)
  3. DataForSEO GSC↔competitor data delta: competitor-keyword overlap vs our
     GSCQueries (last week) — the external cross-check from the video demo

It also checks whether the competitor/backlink pulls actually ran this week
(CompetitorKeywords / BacklinkSnapshot rows exist). If not, it says so and
states WHY: unfunded DataForSEO (40200) — the Phase-2 gate — rather than
reporting empty as "no gaps".

Output: a markdown section (also prints plain lines) that the weekly cron job
can append under the main GSC+Bing numbers. Delivered to Telegram via
HERMES_TELEGRAM_TOKEN env when set (optional — the job orchestrates delivery).

Usage:
  python3 weekly-seo-os-report.py                 # print add-on section
  python3 weekly-seo-os-report.py --telegram      # also send to the home channel
"""
import argparse
import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import grist  # noqa: E402

PENDING_QUEUE = REPO / ".hermes" / "paa-drafts" / "pending.json"


def last_week_start():
    now = datetime.now(timezone.utc).date()
    this_mon = now - timedelta(days=now.weekday())
    return this_mon - timedelta(days=7)


def collect():
    wk = grist.ts(last_week_start())
    report = {"week": str(last_week_start()), "sections": []}

    # 1. Competitor top-5 gaps
    gaps = grist.get_records("CompetitorGaps", {"WeekStart": [wk]})
    gaps_sorted = sorted(gaps, key=lambda r: (r.get("fields", {}).get("CompPosition") or 999))[:5]
    if gaps_sorted:
        lines = [f"{r['fields'].get('Domain','?')}: '{r['fields'].get('GapKeyword','')}' "
                 f"(their pos {r['fields'].get('CompPosition')})" for r in gaps_sorted]
        report["sections"].append(("Top competitor gaps this week", lines))
    else:
        report["sections"].append(("Top competitor gaps this week",
                                   ["none captured — competitor pulls did not run this week "
                                    "(funding gate, see DataForSEO status below)"]))

    # 2. Pipeline state
    pipe = grist.get_records("ContentPipeline")
    awaiting = [r for r in pipe if r.get("fields", {}).get("Status") == "awaiting-approval"]
    published = [r for r in pipe if r.get("fields", {}).get("Status") == "published"]
    pending_file = []
    if PENDING_QUEUE.exists():
        try:
            pending_file = json.loads(PENDING_QUEUE.read_text())
        except Exception:
            pending_file = []
    lines = [
        f"awaiting owner approval: {len(awaiting)} Grist rows / {len(pending_file)} draft queue",
        f"published ever (pipeline): {len(published)}",
    ]
    if awaiting:
        lines.append("  waiting on: " + ", ".join(
            r["fields"].get("Title") or r["fields"].get("Query") for r in awaiting[:5]))
    report["sections"].append(("Content pipeline state", lines))

    # 3. DataForSEO cross-check status
    comp_kw = grist.get_records("CompetitorKeywords", {"WeekStart": [wk]})
    bl = grist.get_records("BacklinkSnapshot", {"WeekStart": [wk]})
    gsc_q = grist.get_records("GSCQueries", {"WeekStart": [wk]})
    dfs_status = []
    if comp_kw:
        ours = { (r.get("fields",{}).get("Query") or "").lower() for r in gsc_q }
        overlap = sum(1 for r in comp_kw if (r.get("fields",{}).get("Keyword","")).lower() in ours)
        dfs_status.append(f"DataForSEO competitor pull: {len(comp_kw)} competitor keywords, "
                          f"{overlap} already in our GSC (resonance check) — funded account running")
    elif bl:
        dfs_status.append("DataForSEO backlinks only (no competitor keyword rows this week)")
    else:
        dfs_status.append("DataForSEO UNFUNDED (task 40200) — competitor + backlink pulls not "
                          "running; fund the account (Phase 2, ~$10-20) to activate")
    if bl:
        r0 = bl[0].get("fields", {})
        dfs_status.append(f"backlinks: {r0.get('RefDomains')} domains / {r0.get('TotalBacklinks')} links "
                          f"(simplyenak.com week {last_week_start()})")
    report["sections"].append(("DataForSEO / cross-check status", dfs_status))

    return report


def render(report):
    out = [f"# SEO-OS Add-Ons — week {report['week']}", ""]
    for title, lines in report["sections"]:
        out.append(f"## {title}")
        for l in lines:
            out.append(f"- {l}" if not l.startswith(" ") else l)
        out.append("")
    return "\n".join(out)


def send_telegram(text):
    token, chat = "", "1511186614"
    envp = Path.home() / ".hermes-website" / ".env"
    if envp.exists():
        for line in envp.open():
            line = line.strip()
            if line.startswith("TELEGRAM_BOT_TOKEN="):
                token = line.split("=", 1)[1].strip().strip("'\"")
    if not token:
        return False
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data=json.dumps({"chat_id": chat, "text": text[:4000]}).encode(),
            headers={"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=15)
        return True
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--telegram", action="store_true")
    args = ap.parse_args()
    report = collect()
    text = render(report)
    print(text)
    if args.telegram:
        print(f"[sent to Telegram: {send_telegram(text)}]")


if __name__ == "__main__":
    main()
