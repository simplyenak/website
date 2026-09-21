#!/usr/bin/env python3
"""Run the jev-ultrafast browser agent against a URL with one or more goals.

Env vars (provided by the container environment):
  TYPESAFE_API_KEY      — required, from Dokploy env
  TEXT_MODEL_API_KEY    — required for TYPE_TEXT actions
  TEXT_MODEL_BASE_URL   — default https://openrouter.ai/api/v1
  TEXT_MODEL            — default inception/mercury-2.5

Usage:
  python3 /home/hermes/scripts/jev-run.py --url https://example.com \
      --goal "Find the pricing section" [--goal "second ordered goal"]
"""
import argparse
import json
import os
import sys


def main():
    missing = [k for k in ("TYPESAFE_API_KEY",) if not os.environ.get(k)]
    if missing:
        print(f"ERROR: missing required env var(s): {', '.join(missing)}", file=sys.stderr)
        print("Set them in Dokploy → project → environment variables.", file=sys.stderr)
        sys.exit(2)

    from jev_ultrafast import Agent

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", required=True)
    parser.add_argument("--goal", action="append", required=True,
                        help="Repeat for an ordered list of goals.")
    args = parser.parse_args()

    state = None
    with Agent(args.url, args.goal) as agent:
        for state in agent.run():
            history = state["history"]
            last = history[-1]["action"] if history else ""
            print(f"{state['elapsed_ms']:>6} ms  {len(history)} actions  {state['status']}  {last}", flush=True)
        final = agent.snapshot()

    print("FINAL_URL:", final["page"]["url"])
    print("STATUS:", final["status"])
    if "--json" in sys.argv:
        print(json.dumps(final, indent=2, default=str))


if __name__ == "__main__":
    main()
