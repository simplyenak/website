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
    """Chown path to hermes user if it's owned by root."""
    try:
        st = os.stat(path)
        if st.st_uid == 0:
            print(f"Fixing volume permissions on {path}...", flush=True)
            subprocess.run(
                ["chown", "-R", "hermes:hermes", path],
                check=True, capture_output=True
            )
    except FileNotFoundError:
        pass


def main():
    print("=== Hermes Agent v0.16.0 Entrypoint ===", flush=True)

    # Fix volume permissions
    fix_permissions(HERMES_DIR)
    fix_permissions(WORKSPACE)

    # Bootstrap config from env vars
    print("Generating config...", flush=True)
    subprocess.run(
        [sys.executable, "/bootstrap_config.py"],
        check=True
    )

    # SSH key setup
    deploy_key = f"{SSH_DIR}/deploy_key"
    if os.path.isfile(deploy_key):
        os.chmod(deploy_key, 0o600)
        subprocess.run(
            ["ssh-keyscan", "-H", "github.com"],
            capture_output=True,
            timeout=10
        )
        print("Deploy key configured", flush=True)

    # Start health server in background
    health_proc = subprocess.Popen(
        [sys.executable, "/home/hermes/health_server.py"]
    )
    print("Health server on :8080", flush=True)

    # Start dashboard in background (FastAPI + built-in web dist)
    dashboard_proc = subprocess.Popen(
        ["su", "hermes", "-c",
         "python3 -m hermes_cli.main dashboard --port 9119 --host 0.0.0.0 --no-open --insecure"]
    )
    print("Dashboard on :9119", flush=True)

    # Start the gateway (drop privileges to hermes user)
    print("=== Starting Hermes Gateway ===", flush=True)
    gateway_cmd = [
        "su", "hermes", "-c",
        "python3 -m hermes_cli.main gateway run"
    ]
    try:
        os.execvp("su", gateway_cmd)
    except FileNotFoundError:
        # Fallback: try running as root if su not available
        print("su not found, running gateway as root", flush=True)
        os.execvp(
            sys.executable,
            [sys.executable, "-m", "hermes_cli.main", "gateway", "run"]
        )


if __name__ == "__main__":
    main()
