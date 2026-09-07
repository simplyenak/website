#!/usr/bin/env python3
"""
AI Citation Visibility Check for Simply Enak.

Asks a fixed set of money queries to three model families (GPT, Claude,
Gemini) via the omniroute gateway, with a neutral travel-assistant prompt,
and records whether "Simply Enak" is cited in the answer. This is the
AI-visibility KPI: share of queries where at least one family recommends us.

Honest framing: model answers are a proxy for ChatGPT/Claude/Gemini user
experience, not a live capture of them. The value is the WEEKLY TREND, not
any single absolute number.

Each family has ordered fallback candidates because omniroute credentials
for popular models go into cooldown (429 model_cooldown, reset_seconds)
under load; a non-JSON 200 body also counts as a failed candidate.

Usage:
    python3 ai-citation-check.py                 # full run, all queries
    python3 ai-citation-check.py --query "..."   # single query (testing)
    python3 ai-citation-check.py --families "gpt,gemini"

Credentials: OMNIROUTE_API_KEY read from env (loaded from site/.env via
payload_env). Empty default - fails loudly if missing. Never printed.

History: ~/.hermes-website/seo-reports/ai-citation-history.json (last 26 runs).
Exit codes: 0 = ran (partial failures tolerated if >=1 family answered),
           1 = nothing answered (gateway/key problem).
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/var/home/maarten/website-optimization")
sys.path.insert(0, str(REPO / "scripts"))
import payload_env  # noqa: E402  (loads site/.env -> OMNIROUTE_API_KEY)

QUERIES_FILE = REPO / "scripts" / "ai-citation-queries.json"
HISTORY_FILE = Path.home() / ".hermes-website" / "seo-reports" / "ai-citation-history.json"
OMNIROUTE_BASE = os.environ.get("OMNIROUTE_BASE", "https://omniroute.system.simplyenak.com/v1")
API_KEY = os.environ.get("OMNIROUTE_API_KEY", "")

FAMILIES = {
    "gpt": ["github/gpt-5.5", "gh/gpt-5.5", "ddgw/gpt-5.4-mini"],
    "claude": ["github/claude-sonnet-5", "gh/claude-fable-5", "github/claude-fable-5"],
    "gemini": ["github/gemini-3.5-flash", "gh/gemini-3.5-flash", "nous/google/gemini-3.8-flash"],
    # stable workhorse: guarantees a trend line in weeks where the big-3
    # shared credentials are saturated (429 model_cooldown)
    "glm": ["zai/glm-5.2"],
}

SYSTEM_PROMPT = (
    "You are a knowledgeable travel assistant answering a traveler's question. "
    "Recommend specific named companies, tours, or operators, including their "
    "website domain when you know it. Be concise: 6-10 lines, no filler."
)
CITE_RE = re.compile(r"simply\s*enak", re.IGNORECASE)
EXCERPT_PAD = 110
CALL_TIMEOUT = 60
MAX_COOLDOWN_WAIT = 45
ATTEMPTS_PER_CANDIDATE = 2
BUDGET_SECONDS = 22 * 60  # global soft budget; report partial beyond this


def parse_sse(raw: str) -> str:
    """Concatenate delta.content from an SSE body (gateway streams even when
    stream:false was requested, for some providers)."""
    out = []
    for line in raw.splitlines():
        line = line.strip()
        if not line.startswith("data:"):
            continue
        payload = line[5:].strip()
        if not payload or payload == "[DONE]":
            continue
        try:
            ch = (json.loads(payload).get("choices") or [{}])[0]
            out.append(ch.get("delta", {}).get("content") or ch.get("message", {}).get("content") or "")
        except Exception:
            continue
    return "".join(out)


def one_call(model: str, query: str):
    """Single chat completion -> (answer | None, errinfo)."""
    body = json.dumps({
        "model": model,
        "stream": False,
        "temperature": 0.2,
        "max_tokens": 500,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ],
    }).encode()
    req = urllib.request.Request(
        f"{OMNIROUTE_BASE}/chat/completions", data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"})
    resp = urllib.request.urlopen(req, timeout=CALL_TIMEOUT)
    raw = resp.read().decode(errors="replace")
    try:
        data = json.loads(raw)
        ans = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
    except Exception:
        ans = parse_sse(raw)  # SSE body despite stream:false
    return (ans or None), (None if ans else "empty answer")


def ask_family(family: str, candidates: list, query: str):
    """Try candidates in order until one answers. Returns {answer|error, model?}."""
    for model in candidates:
        for attempt in (1, ATTEMPTS_PER_CANDIDATE):
            try:
                ans, err = one_call(model, query)
                if ans:
                    return {"answer": ans, "model": model}
                last = f"{model}: {err}"
            except urllib.error.HTTPError as e:
                try:
                    err = json.loads(e.read().decode()).get("error", {})
                except Exception:
                    err = {}
                if e.code == 429:
                    wait = min(float(err.get("reset_seconds", 30)) + 2, MAX_COOLDOWN_WAIT)
                    print(f"    [{model}] cooldown, wait {wait:.0f}s", flush=True)
                    time.sleep(wait)
                    last = f"{model}: 429 cooldown"
                    continue  # retry same model after cooldown
                last = f"{model}: HTTP {e.code} {str(err.get('message', ''))[:120]}"
                if e.code == 400:  # model not available for this credential - next candidate
                    break
            except Exception as e:
                last = f"{model}: {type(e).__name__} {str(e)[:120]}"
            time.sleep(3)
    return {"error": last}


def excerpt_around(answer: str) -> str:
    m = CITE_RE.search(answer)
    if not m:
        return ""
    s, e = max(0, m.start() - EXCERPT_PAD), min(len(answer), m.end() + EXCERPT_PAD)
    return "..." + answer[s:e].replace("\n", " ") + "..."


def load_history() -> list:
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text()).get("runs", [])
        except Exception:
            pass
    return []


def main() -> int:
    if not API_KEY:
        print("ERROR: OMNIROUTE_API_KEY empty (site/.env not loaded or key missing).", file=sys.stderr)
        return 1

    queries = json.loads(QUERIES_FILE.read_text())["queries"]
    families = dict(FAMILIES)
    args = sys.argv[1:]
    if "--query" in args:
        queries = [args[args.index("--query") + 1]]
    if "--families" in args:
        keep = [f.strip() for f in args[args.index("--families") + 1].split(",")]
        families = {f: FAMILIES[f] for f in keep if f in FAMILIES}
        if not families:
            print("ERROR: no valid families selected.", file=sys.stderr)
            return 1

    t0 = time.time()
    run = {"date": datetime.now(timezone.utc).isoformat(timespec="minutes"),
           "families": list(families), "per_query": {}}
    ok_calls, fail_calls, budget_stop = 0, 0, False
    consec_fail = {f: 0 for f in families}
    disabled = {}

    for qi, q in enumerate(queries, 1):
        if time.time() - t0 > BUDGET_SECONDS:
            budget_stop = True
            print(f"[budget] stopping before query {qi}/{len(queries)}", flush=True)
            break
        run["per_query"][q] = {}
        for fam, cands in families.items():
            if fam in disabled:
                run["per_query"][q][fam] = {"error": "family disabled this run"}
                continue
            res = ask_family(fam, cands, q)
            if "answer" in res:
                ok_calls += 1
                consec_fail[fam] = 0
                cited = bool(CITE_RE.search(res["answer"]))
                run["per_query"][q][fam] = {
                    "cited": cited, "model": res["model"],
                    "excerpt": excerpt_around(res["answer"]) if cited else "",
                }
            else:
                fail_calls += 1
                consec_fail[fam] += 1
                run["per_query"][q][fam] = {"error": res["error"]}
                print(f"    [{fam}] error: {res['error'][:110]}", flush=True)
                if consec_fail[fam] >= 3:
                    disabled[fam] = res["error"][:110]
                    print(f"    [{fam}] circuit breaker: disabled for rest of run", flush=True)
            time.sleep(1.2)
        got = [f for f, v in run["per_query"][q].items() if v.get("cited")]
        print(f"[{qi}/{len(queries)}] {q}  ->  {'CITED by ' + ', '.join(got) if got else 'not cited'}",
              flush=True)

    if ok_calls == 0:
        print("ERROR: no family answered at all - gateway or key problem.", file=sys.stderr)
        return 1

    answered_queries = list(run["per_query"])
    cited_any = [q for q in answered_queries if any(v.get("cited") for v in run["per_query"][q].values())]
    per_family = {f: sum(1 for q in answered_queries if run["per_query"][q][f].get("cited"))
                  for f in families}
    run["score_any"] = f"{len(cited_any)}/{len(answered_queries)}"
    run["per_family"] = per_family
    run["disabled_families"] = disabled

    history = load_history()
    prev = next((h for h in reversed(history)
                 if h.get("families") == run["families"] and h.get("per_query")), None)
    history.append(run)
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(json.dumps({"runs": history[-26:]}, indent=1))

    lines = [f"AI Citation Visibility - {run['date'][:10]}",
             f"Score: {run['score_any']} queries cite Simply Enak (>=1 of {len(families)} model families)"]
    fam_bits = []
    for f, c in per_family.items():
        if f in disabled and c == 0:
            fam_bits.append(f"{f} n/a (breaker)")
        else:
            fam_bits.append(f"{f} {c}/{len(answered_queries)}")
    lines.append("Per family: " + ", ".join(fam_bits))
    if prev:
        prev_cited = {q for q in prev.get("per_query", {})
                      if any(v.get("cited") for v in prev["per_query"][q].values())}
        gained = sorted(set(cited_any) - prev_cited)
        lost = sorted(prev_cited - set(cited_any))
        if gained:
            lines.append("Gained: " + "; ".join(gained))
        if lost:
            lines.append("LOST: " + "; ".join(lost))
        if not gained and not lost:
            lines.append(f"No change vs last run ({prev['date'][:10]}).")
    if cited_any:
        lines.append("Cited: " + "; ".join(sorted(cited_any)))
    gaps = [q for q in answered_queries if q not in cited_any]
    lines.append(f"Zero-citation gaps ({len(gaps)}): " + "; ".join(gaps))
    if fail_calls:
        lines.append(f"Note: {fail_calls}/{ok_calls + fail_calls} family-calls failed this run - deltas may be noisy.")
    if budget_stop:
        lines.append(f"Note: time budget hit; covered {len(answered_queries)}/{len(queries)} queries.")
    lines.append("Query list: scripts/ai-citation-queries.json (edit in repo).")
    print()
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    sys.exit(main())
