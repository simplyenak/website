#!/bin/bash
# Payload CMS Local - Auto-start Script
# Starts the Payload development server

set -e

PROJECT_DIR="/var/home/maarten/website-optimization/payload-local"
LOG_FILE="$PROJECT_DIR/payload-dev.log"
PID_FILE="$PROJECT_DIR/payload-dev.pid"

cd "$PROJECT_DIR"

# Check if already running
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "Payload is already running (PID: $OLD_PID)"
        exit 0
    else
        echo "Stale PID file found, removing..."
        rm -f "$PID_FILE"
    fi
fi

# Start the server
echo "Starting Payload CMS..."
npm run dev > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Save PID
echo "$SERVER_PID" > "$PID_FILE"

# Wait for server to be ready
echo "Waiting for server to start (PID: $SERVER_PID)..."
for i in {1..60}; do
    if ps -p "$SERVER_PID" > /dev/null 2>&1; then
        if grep -q "Ready in" "$LOG_FILE" 2>/dev/null; then
            echo "✅ Payload CMS started successfully!"
            echo "   Admin: http://localhost:1337/admin"
            echo "   Log file: $LOG_FILE"
            exit 0
        fi
    else
        echo "❌ Server process died"
        cat "$LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi
    sleep 1
done

echo "❌ Server failed to start within 60 seconds"
cat "$LOG_FILE"
rm -f "$PID_FILE"
exit 1
