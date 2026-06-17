#!/bin/bash

# Simply Enak Full Development Environment Startup
# This script starts both Frontend (Astro) and Backend (Directus) servers

echo "🚀 Starting Simply Enak Full Development Environment"
echo "=================================================="

# Navigate to the main project directory
cd /home/maarten/website-optimization

# Function to check if a process is running
check_process() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start backend (Directus)
start_backend() {
    echo "🔧 Starting Directus Backend..."
    cd directus

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "❌ Directus .env file not found!"
        echo "⚠️  Please create directus/.env first (copy from .env.example)"
        cd ..
        return 1
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Directus dependencies..."
        npm install
    fi

    # Start Directus in background
    npx directus start . > ../directus-dev.log 2>&1 &
    DIRECTUS_PID=$!
    echo "✅ Directus Backend started with PID: $DIRECTUS_PID"
    echo "🔗 Directus Admin Panel: http://localhost:8055/admin"
    cd ..
}

# Function to start frontend (Astro)
start_frontend() {
    echo "🎨 Starting Astro Frontend..."
    cd frontend

    # Check if .env exists, if not create it
    if [ ! -f ".env" ]; then
        echo "⚙️  Creating Frontend .env file..."
        cat > .env << EOF
# Directus Backend Configuration
PUBLIC_DIRECTUS_URL=http://localhost:8055

# Contact Form Configuration
VITE_FORM_ENDPOINT=https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABpeXumlMVzDHFDl

# YouTube API Configuration
PUBLIC_VITE_YOUTUBE_API_KEY=***REMOVED***
PUBLIC_VITE_YOUTUBE_CHANNEL_ID=UCsW0J_Ip_-I5J9JtYqJ3YQA
EOF
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Frontend dependencies..."
        npm install
    fi

    # Start Astro in background
    npm run dev > ../astro-dev.log 2>&1 &
    ASTRO_PID=$!
    echo "✅ Astro Frontend started with PID: $ASTRO_PID"
    echo "🔗 Frontend URL: http://localhost:4321/"
    cd ..
}

# Main execution
echo "🔍 Checking for running processes..."

if check_process "directus start"; then
    echo "✅ Directus Backend is already running"
else
    start_backend
    if [ $? -eq 0 ]; then
        # Wait a bit for Directus to initialize
        sleep 10
    fi
fi

if check_process "astro dev"; then
    echo "✅ Astro Frontend is already running"
else
    start_frontend
    # Wait a bit for Astro to initialize
    sleep 5
fi

echo ""
echo "🎉 Development Environment is Ready!"
echo "=================================="
echo "🔧 Directus Admin Panel: http://localhost:8055/admin"
echo "🎨 Astro Frontend:       http://localhost:4321/"
echo "📊 Directus API:         http://localhost:8055/items"
echo ""
echo "📝 Logs:"
echo "   Directus: tail -f /home/maarten/website-optimization/revamp/directus-dev.log"
echo "   Astro:    tail -f /home/maarten/website-optimization/revamp/astro-dev.log"
echo ""
echo "🛑 To stop all servers:"
echo "   pkill -f 'directus start'"
echo "   pkill -f 'astro dev'"
echo ""
echo "⚡ Quick Commands (add to ~/.bashrc for convenience):"
echo "   alias dev-start='./start-full-dev.sh'"
echo "   alias dev-logs='tail -f directus-dev.log astro-dev.log'"
echo "   alias dev-stop='pkill -f \"directus start\" && pkill -f \"astro dev\"'"

# Save PIDs for potential cleanup
echo $DIRECTUS_PID > .directus.pid
echo $ASTRO_PID > .astro.pid

echo ""
echo "🎯 Setup complete! Happy coding!"
