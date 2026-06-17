#!/bin/bash
# Payload dev server with auto-restart
# Usage: ./start-dev.sh [--turbo]

cd /var/home/maarten/website-optimization/payload-local

export NODE_OPTIONS="--no-deprecation --max-old-space-size=4096"

MODE="webpack"
if [ "$1" = "--turbo" ]; then
  MODE="turbo"
fi

echo "[$(date)] Starting Payload dev server ($MODE mode)..."
echo "Admin: http://localhost:1337/admin"
echo "Press Ctrl+C to stop"
echo ""

while true; do
  if [ "$MODE" = "turbo" ]; then
    npx next dev --turbo 2>&1 | tee -a /tmp/payload-dev.log
  else
    npx next dev --webpack 2>&1 | tee -a /tmp/payload-dev.log
  fi
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "[$(date)] Server exited cleanly"
    break
  fi
  
  echo ""
  echo "[$(date)] ⚠️  Server crashed (exit $EXIT_CODE), restarting in 2s..."
  echo "[$(date)] Restarting..." >> /tmp/payload-dev.log
  sleep 2
done
