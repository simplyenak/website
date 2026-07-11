#!/usr/bin/env python3
"""Hermes Agent entrypoint — handles volume permissions, config bootstrap, health server, and gateway.

Swarm-zero-capability-safe: the locks directory is pre-created with 777 permissions
at build time so the gateway can write there even with cap_drop: ALL.
"""
import os
import subprocess
import sys

HOME = "/home/hermes"
HERMES_DIR = f"{HOME}/.hermes"
WORKSPACE = f"{HOME}/workspace"
SSH_DIR = f"{HOME}/.ssh"
LOCKS_DIR = f"{HOME}/.local/state/hermes/gateway-locks"


def fix_permissions(path):
    """Ensure volume path is accessible (Swarm workaround — chmod only, keep root ownership).
    
    Uses a generous timeout since volumes with accumulated data (cron, sessions, logs)
    can take 30-60s to chmod recursively.
    """
    try:
        subprocess.run(
            ["chmod", "-R", "755", path],
            check=False, capture_output=True, timeout=120
        )
    except (FileNotFoundError, PermissionError):
        pass
    except subprocess.TimeoutExpired:
        # Still running — let it continue, skip the check to avoid crashing
        print(f"Warning: chmod -R on {path} is taking long, continuing anyway", flush=True)


def ensure_lock_dir():
    """Ensure the gateway-locks directory exists and is world-writable.

    At build time the Dockerfile creates this with 777, but at first startup
    (fresh volume) it may not exist yet. Without DAC_OVERRIDE, root can't
    create subdirs on the overlay — so we have the healthcheck bootstrap it
    IF it happens to be writable, otherwise we rely on build-time creation.
    """
    try:
        os.makedirs(LOCKS_DIR, mode=0o777, exist_ok=True)
        # Make sure it's world-writable even if it already existed
        os.chmod(LOCKS_DIR, 0o777)
    except PermissionError:
        # Expected when cap_drop: ALL — the dir must be pre-created at build time
        pass


def patch_provider_models():
    """Patch _PROVIDER_MODELS inline (same process — survives into gateway)."""
    try:
        import yaml
        from hermes_cli import models as m

        config_path = f"{HERMES_DIR}/config.yaml"
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


def _bootstrap_scripts():
    """Copy baked-in scripts to the volume and auto-register cron jobs.

    Image-build scripts live at /home/hermes/scripts/ (from COPY in Dockerfile).
    On first startup they are copied to the persistent volume at HERMES_DIR/scripts/.
    Known cron-job scripts are registered as no_agent=True jobs if not already present.
    """
    import json, shutil

    baked_dir = "/home/hermes/scripts"
    volume_dir = f"{HERMES_DIR}/scripts"

    # 1. Copy baked scripts to volume (if baked dir exists)
    if os.path.isdir(baked_dir):
        os.makedirs(volume_dir, exist_ok=True)
        for fname in os.listdir(baked_dir):
            src = os.path.join(baked_dir, fname)
            dst = os.path.join(volume_dir, fname)
            if os.path.isfile(src) and fname.endswith(".py") or fname.endswith(".sh"):
                try:
                    shutil.copy2(src, dst)
                    os.chmod(dst, 0o755)
                    print(f"  Script deployed: {fname}", flush=True)
                except Exception as e:
                    print(f"  Script deploy failed for {fname}: {e}", flush=True)

    # 2. Auto-register known cron jobs if not already present
    cron_file = f"{HERMES_DIR}/cron/jobs.json"
    try:
        if os.path.exists(cron_file):
            with open(cron_file) as f:
                existing = json.load(f)
            existing_jobs = existing.get("jobs", existing) if isinstance(existing, dict) else existing
        else:
            existing_jobs = []

        existing_names = {j.get("name", "") for j in existing_jobs if isinstance(j, dict)}

        # The credential health monitor
        auto_jobs = [
            {
                "name": "Credential Health Monitor",
                "id": "credential-health-monitor",
                "schedule": "*/30 * * * *",
                "script": "provider-health.py",
                "no_agent": True,
                "enabled": True,
                "deliver": "all",
            },
        ]

        added = 0
        for job in auto_jobs:
            if job["name"] not in existing_names:
                existing_jobs.append(job)
                added += 1
                print(f"  Cron registered: {job['name']}", flush=True)

        if added:
            # Write back
            if isinstance(existing, dict):
                existing["jobs"] = existing_jobs
                data = existing
            else:
                data = existing_jobs
            os.makedirs(f"{HERMES_DIR}/cron", exist_ok=True)
            with open(cron_file, "w") as f:
                json.dump(data, f, indent=2)
            print(f"  Added {added} cron job(s) to {cron_file}", flush=True)
    except Exception as e:
        print(f"  Cron auto-register skipped: {e}", flush=True)


def main():
    print("=== Hermes Agent v0.18.0 Entrypoint ===", flush=True)

    # Fix volume permissions (best effort — may fail without CAP_CHOWN/DAC_OVERRIDE)
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

    # Restore SOUL.md from volume — it's NOT baked into the Docker image.
    # The volume backup includes SOUL.md. For full recovery from a server
    # reset, the restore script (scripts/restore-hermes.sh) handles it.

    # Bootstrap scripts onto the volume and auto-register cron jobs
    _bootstrap_scripts()

    # Start health server in background
    try:
        health_proc = subprocess.Popen(
            [sys.executable, "/home/hermes/health_server.py"]
        )
        print("Health server on :8080", flush=True)
    except Exception as e:
        print(f"Health server failed: {e}", flush=True)

    # Start dashboard in background
    try:
        dashboard_proc = subprocess.Popen(
            [sys.executable, "-m", "hermes_cli.main", "dashboard",
             "--port", "9119", "--host", "0.0.0.0", "--no-open", "--insecure"]
        )
        print("Dashboard on :9119", flush=True)
    except Exception as e:
        print(f"Dashboard failed: {e}", flush=True)

    # Point HOME at the volume mount so the gateway reads/writes state directly.
    os.environ["HOME"] = "/home/hermes"

    # Ensure gateway-locks directory exists (build-time pre-created, but be safe)
    ensure_lock_dir()

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
