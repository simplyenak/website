#!/bin/sh
set -eu

# Template ov.conf with env vars
CONFIG_FILE="/app/ov.conf"
TEMPLATE="/app/ov.conf.template"

if [ -f "$TEMPLATE" ]; then
    envsubst < "$TEMPLATE" > "$CONFIG_FILE"
    echo "[entrypoint] Generated ov.conf from template"
fi

# Ensure Ollama has the embedding model
OLLAMA_HOST="${OLLAMA_HOST:-ollama}"
OLLAMA_PORT="${OLLAMA_PORT:-11434}"

echo "[entrypoint] Waiting for Ollama at ${OLLAMA_HOST}:${OLLAMA_PORT}..."
for i in $(seq 1 60); do
    if curl -sf "http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/tags" > /dev/null 2>&1; then
        echo "[entrypoint] Ollama ready after ${i}s"
        break
    fi
    if [ "$i" = "60" ]; then
        echo "[entrypoint] WARNING: Ollama not available after 60s, continuing anyway"
    fi
    sleep 2
done

# Pull nomic-embed-text if not already present
echo "[entrypoint] Ensuring nomic-embed-text model is available..."
MODEL_LIST=$(curl -sf "http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/tags" 2>/dev/null || echo "")
if echo "$MODEL_LIST" | grep -q "nomic-embed-text"; then
    echo "[entrypoint] Model already present"
else
    echo "[entrypoint] Pulling nomic-embed-text..."
    curl -sf -X POST "http://${OLLAMA_HOST}:${OLLAMA_PORT}/api/pull" \
      -d '{"name":"nomic-embed-text"}' > /dev/null 2>&1 && \
      echo "[entrypoint] Model pulled successfully" || \
      echo "[entrypoint] WARNING: Failed to pull model"
fi

# Start OpenViking bound to 0.0.0.0
exec openviking-server --host 0.0.0.0 --port 1933
