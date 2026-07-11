#!/bin/bash
set -e
echo "=== Hermes Agent v0.14.0 Entrypoint ==="

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

# Start the gateway
echo "=== Starting Hermes Gateway ==="
exec python3 -m hermes_cli.main gateway run
