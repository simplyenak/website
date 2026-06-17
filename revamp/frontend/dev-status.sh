#!/bin/bash

echo "🔍 Simply Enak Development Server Status"
echo "=================================="

# Check if astro dev process is running
if pgrep -f "astro dev" > /dev/null; then
    echo "✅ Development server is RUNNING"
    echo "🔗 Local URL: http://localhost:4321/"

    # Get the PID
    PID=$(pgrep -f "astro dev")
    echo "🔢 Process ID: $PID"

    # Check if port 4321 is listening
    if netstat -tuln | grep :4321 > /dev/null; then
        echo "🌐 Port 4321 is active and listening"
    else
        echo "⚠️  Port 4321 might not be accessible"
    fi

    echo ""
    echo "📝 Recent logs:"
    echo "----------------"
    if [ -f "dev-server.log" ]; then
        tail -10 dev-server.log
    else
        echo "No log file found"
    fi
else
    echo "❌ Development server is NOT running"
    echo ""
    echo "🚀 To start the server:"
    echo "   npm run dev"
    echo "   or"
    echo "   ./start-dev-server.sh"
fi

echo ""
echo "📂 Working directory: $(pwd)"
echo "🕐 Current time: $(date)"