#!/usr/bin/env python3
"""Hermes Agent entrypoint — handles volume permissions, config bootstrap, health server, and gateway."""
import os
import stat
import subprocess
import sys
import time

HOME = "/home/hermes"
HERMES_DIR = f"{HOME}/.hermes"
WORKSPACE = f"{HOME}/workspace"
SSH_DIR = f"{HOME}/.ssh"


def fix_permissions(path):
    """Ensure volume path is accessible (Swarm workaround — chmod only, keep root ownership)."""
    try:
        subprocess.run(
            ["chmod", "-R", "755", path],
            check=False, capture_output=True, timeout=5
        )
    except (FileNotFoundError, PermissionError):
        pass


def patch_provider_models():
    """Patch _PROVIDER_MODELS inline (same process — survives into gateway)."""
    try:
        import yaml
        from hermes_cli import models as m

        config_path = "/home/hermes/.hermes/config.yaml"
        with open(config_path) as f:
            cfg = yaml.safe_load(f)

        all_models = []
        for cp in cfg.get("custom_providers", []):
            all_models.extend(cp.get("models", []) or [])
        for prov in cfg.get("providers", {}).values():
            all_models.extend(prov.get("models", []) or [])
        all_models.extend(cfg.get("model", {}).get("models", []) or [])
        all_models = list(dict.fromkeys(all_models))

        if all_models and hasattr(m, "_PROVIDER_MODELS"):
            m._PROVIDER_MODELS["custom:omniroute"] = all_models
            print(f"Patched _PROVIDER_MODELS with {len(all_models)} Omniroute models", flush=True)
    except Exception as e:
        print(f"Model patch skipped: {e}", flush=True)


def main():
    print("=== Hermes Agent v0.18.0 Entrypoint ===", flush=True)

    # Fix volume permissions (best effort)
    fix_permissions(HERMES_DIR)
    fix_permissions(WORKSPACE)

    # Bootstrap config from env vars (best effort)
    print("Generating config...", flush=True)
    try:
        subprocess.run(
            [sys.executable, "/bootstrap_config.py"],
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Bootstrap config failed (non-fatal): {e}", flush=True)

    # SSH key setup
    deploy_key = f"{SSH_DIR}/deploy_key"
    if os.path.isfile(deploy_key):
        try:
            os.chmod(deploy_key, 0o600)
            subprocess.run(
                ["ssh-keyscan", "-H", "github.com"],
                capture_output=True,
                timeout=10
            )
            print("Deploy key configured", flush=True)
        except Exception:
            pass

    # Start health server in background (best effort)
    try:
        health_proc = subprocess.Popen(
            [sys.executable, "/home/hermes/health_server.py"]
        )
        print("Health server on :8080", flush=True)
    except Exception as e:
        print(f"Health server failed: {e}", flush=True)

    # Start dashboard in background (best effort)
    try:
        dashboard_proc = subprocess.Popen(
            [sys.executable, "-m", "hermes_cli.main", "dashboard",
             "--port", "9119", "--host", "0.0.0.0", "--no-open", "--insecure"]
        )
        print("Dashboard on :9119", flush=True)
    except Exception as e:
        print(f"Dashboard failed: {e}", flush=True)

    # Point HOME at the volume mount so the gateway reads/writes state directly.
    # This eliminates the fragile startup-copy + lost-on-restart pattern.
    # The volume is mounted at /home/hermes/.hermes/ and owned by root:root.
    os.environ["HOME"] = "/home/hermes"

    # Patch provider models INLINE (same process — survives into gateway)
    patch_provider_models()

    print("=== Starting Hermes Gateway ===", flush=True)
    # Import and run the gateway IN-PROCESS so the model patch survives
    sys.argv = ["hermes", "gateway", "run"]
    try:
        from hermes_cli import main as hermes_main
        hermes_main.main()
    except SystemExit:
        pass


if __name__ == "__main__":
    main()
