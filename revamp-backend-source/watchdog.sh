#!/bin/bash
# Payload dev server watchdog
# Monitors port 3000 and restarts server if it goes down
# Usage: ./watchdog.sh [--turbo]

cd /var/home/maarten/website-optimization/payload-local

export NODE_OPTIONS="--no-deprecation --max-old-space-size=4096"

MODE="webpack"
[ "$1" = "--turbo" ] && MODE="turbo"

start_server() {
  echo "[$(date)] 🚀 Starting server ($MODE)..."
  if [ "$MODE" = "turbo" ]; then
    npx next dev --turbo 2>&1 &
  else
    npx next dev --webpack 2>&1 &
  fi
  SERVER_PID=$!
  echo "[$(date)] Server PID: $SERVER_PID"
}

# Initial start
start_server

while true; do
  sleep 10
  
  # Check if port is listening
  if ! ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "[$(date)] ⚠️  Server down! Cleaning up..."
    kill -9 $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
    sleep 2
    start_server
  fi
done
