#!/usr/bin/env python3
"""Generate Hermes config.yaml from environment variables.

Reads existing config.yaml (from config/ COPY at build time), merges in
model/provider/security settings, and writes back — preserving the
telegram, api, dashboard, webhook, and other operational settings.

Supports multiple models per provider via env vars and puts them
in the `models:` list format (not deprecated `model:`).
"""

import os
import yaml


def _prov_from_key(key, name, base_url, models):
    v = os.environ.get(key)
    if not v:
        return None
    return {"name": name, "base_url": base_url, "api_key": v, "models": models}


def deep_merge(base, override):
    """Recursively merge override into base dict. Lists are replaced, not merged."""
    result = dict(base)
    for key, val in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(val, dict):
            result[key] = deep_merge(result[key], val)
        else:
            result[key] = val
    return result


def main():
    d = "/home/hermes/.hermes"
    config_path = os.path.join(d, "config.yaml")

    # 1. Read existing config (the one copied from config/ at build time)
    existing = {}
    if os.path.exists(config_path):
        with open(config_path) as f:
            existing = yaml.safe_load(f) or {}
        print(f"Read existing config ({len(existing)} keys)")
    else:
        print("No existing config -- starting fresh")

    # 2. Build provider config from env vars

    # Omniroute models (auto-routed via gateway)
    omniroute_models = [
        "auto/best-coding",
        "auto/best-reasoning",
        "auto/best-fast",
        "auto/best-vision",
        "auto/best-chat",
        "auto/best-coding-fast",
        "auto/pro-coding",
        "auto/pro-reasoning",
        "opencode-go/deepseek-v4-flash",
        "opencode-go/deepseek-v4-pro",
        "opencode-go/kimi-k2.7-code",
        "opencode-go/glm-5.2",
        "zai/glm-5.2",
        "zai/glm-5.1",
        "zai/glm-5-turbo",
        "ds/deepseek-v4-flash",
        "ds/deepseek-v4-pro",
        "lc/LongCat-2.0",
        "github/claude-sonnet-4.6",
        "github/gpt-5.5",
        "github/gemini-3.5-flash",
    ]

    omniroute_url = os.environ.get("OMNIROUTE_URL", "http://omniroute:20129/v1")
    omniroute_key = os.environ.get("OMNIROUTE_API_KEY", "")

    # OpenCode Go models (direct, bypass Omniroute)
    opencode_models = [
        "deepseek-v4-flash",
        "deepseek-v4-pro",
        "kimi-k2.7-code",
        "kimi-k2.6",
        "glm-5.2",
        "glm-5.1",
        "minimax-m3",
        "qwen3.7-max",
    ]
    opencode_key = os.environ.get("OPENCODE_API_KEY") or os.environ.get("OPENCODE_GO_API_KEY", "")

    # Build custom_providers list
    providers = []

    # Omniroute first (primary)
    if omniroute_key:
        providers.append({
            "name": "omniroute",
            "base_url": omniroute_url,
            "api_key": omniroute_key,
            "model": "auto/best-coding",
            "models": omniroute_models,
        })

    # OpenCode Go (fallback / direct)
    if opencode_key:
        providers.append({
            "name": "opencode-go",
            "base_url": "https://opencode.ai/zen/go/v1",
            "api_key": opencode_key,
            "model": "deepseek-v4-flash",
            "models": opencode_models,
        })

    explicit_provider = os.environ.get("HERMES_PROVIDER", "custom:omniroute")
    explicit_model = os.environ.get("HERMES_MODEL", "auto/best-coding")

    # 3. Build the override config (these keys replace/add to existing)
    overrides = {
        "model": {
            "default": explicit_model,
            "provider": explicit_provider,
            "models": omniroute_models,
        },
        "general": {"log_level": os.environ.get("LOG_LEVEL", "info")},
        "providers": {
            "omniroute": {
                "base_url": omniroute_url,
                "api_key": omniroute_key,
                "models": omniroute_models,
            },
            "opencode-go": {
                "base_url": "https://opencode.ai/zen/go/v1",
                "api_key": opencode_key,
                "models": opencode_models,
            },
        },
        "custom_providers": providers,
        "delegation": {
            "model": "opencode-go/deepseek-v4-flash",
            "provider": explicit_provider,
            "base_url": omniroute_url,
            # Read delegation-specific key, fall back to main Omniroute key
            "api_key": os.environ.get("DELEGATION_API_KEY") or omniroute_key,
            "max_iterations": 50,
            "reasoning_effort": "low",
        },
        "fallback_providers": [
            {"provider": "custom:opencode-go", "model": "deepseek-v4-flash"},
        ],
        "gateway": {
            "api_server_enabled": os.environ.get("API_SERVER_ENABLED", "true") == "true",
            "api_server_host": os.environ.get("API_SERVER_HOST", "0.0.0.0"),
        },
        "agent": {"max_turns": 60, "gateway_timeout": 1800},

        # Operational settings (read from env, override stale volume state)
        "dashboard": {
            "port": int(os.environ.get("DASHBOARD_PORT", "9119")),
            "host": os.environ.get("DASHBOARD_HOST", "0.0.0.0"),
            "insecure": os.environ.get("DASHBOARD_INSECURE", "false").lower() == "true",
        },
        "api": {
            "enabled": os.environ.get("API_SERVER_ENABLED", "true").lower() == "true",
            "host": os.environ.get("API_SERVER_HOST", "0.0.0.0"),
            "key": os.environ.get("API_SERVER_KEY", ""),
            "workspacePassword": os.environ.get("HERMES_WORKSPACE_PASSWORD", ""),
        },
        "telegram": {
            # Auto-detect: if webhook URL is set, use webhook mode; otherwise polling
            "webhook_mode": bool(os.environ.get("TELEGRAM_WEBHOOK_URL", "")),
            "webhook_url": os.environ.get("TELEGRAM_WEBHOOK_URL", ""),
            "webhook_port": int(os.environ.get("TELEGRAM_WEBHOOK_PORT", "8443")),
            "webhook_secret": os.environ.get("TELEGRAM_WEBHOOK_SECRET", ""),
            "bot_token": os.environ.get("TELEGRAM_BOT_TOKEN", ""),
            "allowed_users": [os.environ.get("TELEGRAM_ALLOWED_USERS", "")] if os.environ.get("TELEGRAM_ALLOWED_USERS") else [],
            "home_channel": os.environ.get("TELEGRAM_HOME_CHANNEL", ""),
        },
        "webhook": {
            "enabled": os.environ.get("WEBHOOK_ENABLED", "true").lower() == "true",
            "port": int(os.environ.get("WEBHOOK_PORT", "8644")),
            "secret": os.environ.get("WEBHOOK_SECRET", ""),
        },
        "brilliant": {
            "mcp_url": os.environ.get("BRILLIANT_MCP_URL", ""),
            "api_url": os.environ.get("BRILLIANT_URL", ""),
            "api_key": os.environ.get("BRILLIANT_API_KEY", ""),
        },

        # Phase 1 Hardening -- approval gates
        "tool_loop_guardrails": {
            "warnings_enabled": True,
            "hard_stop_enabled": True,
            "warn_after": {"exact_failure": 2, "same_tool_failure": 3, "idempotent_no_progress": 2},
            "hard_stop_after": {"exact_failure": 3, "same_tool_failure": 5, "idempotent_no_progress": 3},
        },

        # Phase 1 Hardening -- approvals
        "approvals": {
            "mode": "manual",
            "timeout": 60,
            "cron_mode": "deny",
            "destructive_slash_confirm": True,
        },

        # Phase 1 Hardening -- security
        "security": {
            "redact_secrets": True,
            "tirith_enabled": True,
            "tirith_fail_open": False,
            "allow_private_urls": False,
        },

        # Phase 1 Hardening -- session management
        "sessions": {
            "auto_prune": True,
            "retention_days": int(os.environ.get("SESSION_RETENTION_DAYS", "90")),
            "vacuum_after_prune": True,
            "min_interval_hours": 24,
        },
    }

    # Fallback providers from env (overrides hardcoded list if set)
    fb = os.environ.get("FALLBACK_PROVIDERS")
    if fb:
        overrides["fallback_providers"] = [x.strip() for x in fb.split(",") if x.strip()]

    mempalace_url = os.environ.get("MEMPALACE_URL")
    if mempalace_url:
        overrides.setdefault("mcp_servers", {})
        overrides["mcp_servers"]["mempalace"] = {
            "command": "", "url": mempalace_url,
            "timeout": int(os.environ.get("MEMPALACE_TIMEOUT", "60")),
        }

    brilliant_url = os.environ.get("BRILLIANT_MCP_URL")
    if brilliant_url:
        overrides.setdefault("mcp_servers", {})
        overrides["mcp_servers"]["brilliant"] = {"command": "", "url": brilliant_url, "timeout": 60}

    # 4. MERGE: existing config with overrides on top
    merged = deep_merge(existing, overrides)

    # 5. Write
    os.makedirs(d, exist_ok=True)
    with open(config_path, "w") as f:
        yaml.dump(merged, f, default_flow_style=False, sort_keys=False)

    print(f"Config written ({len(providers)} providers, {len(merged)} top-level keys)")


if __name__ == "__main__":
    main()
