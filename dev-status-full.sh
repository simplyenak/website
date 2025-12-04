#!/bin/bash

echo "🔍 Simply Enak Development Environment Status"
echo "=========================================="

# Check Strapi Backend
if pgrep -f "strapi develop" > /dev/null; then
    echo "✅ Strapi Backend: RUNNING"
    STRAPI_PID=$(pgrep -f "strapi develop")
    echo "   📡 Process ID: $STRAPI_PID"
    echo "   🔗 Admin Panel: http://localhost:1337/admin"
    echo "   🌐 API Endpoint: http://localhost:1337/api"

    # Test if Strapi is responding
    if curl -s http://localhost:1337/admin > /dev/null; then
        echo "   ✅ Server responding"
    else
        echo "   ⚠️  Server not responding (still starting?)"
    fi
else
    echo "❌ Strapi Backend: NOT RUNNING"
fi

echo ""

# Check Astro Frontend
if pgrep -f "astro dev" > /dev/null; then
    echo "✅ Astro Frontend: RUNNING"
    ASTRO_PID=$(pgrep -f "astro dev")
    echo "   📡 Process ID: $ASTRO_PID"
    echo "   🌐 Local URL: http://localhost:4321/"

    # Test if Astro is responding
    if curl -s http://localhost:4321 > /dev/null; then
        echo "   ✅ Server responding"
    else
        echo "   ⚠️  Server not responding (still starting?)"
    fi
else
    echo "❌ Astro Frontend: NOT RUNNING"
fi

echo ""

# Check Environment Configuration
echo "⚙️  Environment Configuration:"
echo "   📁 Working Directory: $(pwd)"
echo "   🌍 Frontend Strapi URL: $(grep 'PUBLIC_STRAPI_URL' frontend/.env 2>/dev/null | cut -d'=' -f2 || echo 'Not configured')"

# Check if downloaded project exists
if [ -d "downloaded-project" ]; then
    echo "   📦 Downloaded project available at: ./downloaded-project/"
fi

echo ""

# Show recent logs
echo "📝 Recent Activity:"
echo "   🔄 To see Strapi logs: tail -f strapi-dev.log"
echo "   🔄 To see Astro logs:  tail -f astro-dev.log"

echo ""

# Quick commands
echo "⚡ Quick Commands:"
echo "   🚀 Start both servers: ./start-full-dev.sh"
echo "   🛑 Stop both servers:  pkill -f 'strapi develop' && pkill -f 'astro dev'"
echo "   🔄 Restart both:      dev-restart"
echo "   📊 Check status:      ./dev-status-full.sh"

echo ""
echo "🕐 Last checked: $(date)"