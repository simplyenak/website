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


PROFILE_ENV = "/home/hermes/.hermes/.env"


def load_env_defaults():
    """Seed os.environ from the profile .env for values not already set.

    Keeps credentials in the maintained env file (empty-default policy) while
    raw `docker exec` shells — which bypass Hermes' own env loader — still get
    them. Never overwrites an existing value.
    """
    try:
        with open(PROFILE_ENV) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and value:
                    os.environ.setdefault(key, value)
    except FileNotFoundError:
        pass


def resolve_typesafe_key():
    """Map the Zen key onto TYPESAFE_API_KEY when routing Jev through Zen."""
    if "opencode.ai" in (os.environ.get("JEV_API_URL") or ""):
        zen = os.environ.get("OPENCODE_ZEN_API_KEY")
        if zen:
            os.environ.setdefault("TYPESAFE_API_KEY", zen)


def main():
    load_env_defaults()
    resolve_typesafe_key()

    missing = [k for k in ("TYPESAFE_API_KEY",) if not os.environ.get(k)]
    if missing:
        print(f"ERROR: missing required env var(s): {', '.join(missing)}", file=sys.stderr)
        print("Set them in Dokploy → project → environment variables.", file=sys.stderr)
        sys.exit(2)

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import jev_zen_shim

    jev_zen_shim.install()

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
