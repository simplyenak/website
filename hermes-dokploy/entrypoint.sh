#!/bin/bash
set -e

echo "=== Hermes Agent v0.14.0 Entrypoint ==="

# Fix permissions on volume mounts (fresh volumes are root-owned)
# The .hermes directory is mounted from a Docker volume which may be
# root-owned when first created — ensure hermes user can write to it.
if [ "$(stat -c '%u' /home/hermes/.hermes)" = "0" ]; then
    echo "Fixing volume permissions for hermes user..."
    chown -R hermes:hermes /home/hermes/.hermes
fi
if [ -d /home/hermes/workspace ] && [ "$(stat -c '%u' /home/hermes/workspace)" = "0" ]; then
    chown -R hermes:hermes /home/hermes/workspace
fi

# Bootstrap config from env vars
echo "Generating config..."
python3 /home/hermes/bootstrap_config.py

# SSH key setup for git deploy
if [ -f /home/hermes/.ssh/deploy_key ]; then
    chmod 600 /home/hermes/.ssh/deploy_key
    ssh-keyscan -H github.com >> /home/hermes/.ssh/known_hosts 2>/dev/null || true
    echo "Deploy key configured"
fi

# Start health server
python3 /home/hermes/health_server.py &
echo "Health server on :8080"

# Start the gateway (drop privileges to hermes user)
echo "=== Starting Hermes Gateway ==="
exec su hermes -c "python3 -m hermes_cli.main gateway run"
