#!/bin/bash
# Auto-restart wrapper for Astro dev server
# Handles the known crash-after-N-requests issue
while true; do
  echo "$(date): Starting Astro dev server..."
  NODE_OPTIONS="--max-old-space-size=4096" npx astro dev
  echo "$(date): Astro crashed, restarting in 2 seconds..."
  sleep 2
done
