#!/bin/bash

# Simply Enak Full Development Environment Startup
# This script starts both Frontend (Astro) and Backend (Strapi) servers

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

# Function to start backend (Strapi)
start_backend() {
    echo "🔧 Starting Strapi Backend..."
    cd backend

    # Check if .env exists, if not create it
    if [ ! -f ".env" ]; then
        echo "⚙️  Creating Strapi .env file..."
        cat > .env << EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS="simplyenak-dev-1,simplyenak-dev-2,simplyenak-dev-3,simplyenak-dev-4"
API_TOKEN_SALT=simplyenak-api-token-salt-dev
ADMIN_JWT_SECRET=simplyenak-admin-jwt-secret-dev
TRANSFER_TOKEN_SALT=simplyenak-transfer-token-salt-dev
JWT_SECRET=simplyenak-jwt-secret-dev
ENCRYPTION_KEY=simplyenak-encryption-key-dev-16-chars
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Strapi dependencies..."
        npm install
        npm install better-sqlite3 --save
    fi

    # Start Strapi in background
    npm run dev > ../strapi-dev.log 2>&1 &
    STRAPI_PID=$!
    echo "✅ Strapi Backend started with PID: $STRAPI_PID"
    echo "🔗 Backend URL: http://localhost:1337/admin"
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
# Strapi Backend Configuration
PUBLIC_STRAPI_URL=http://localhost:1337

# Contact Form Configuration
VITE_FORM_ENDPOINT=https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABpeXumlMVzDHFDl

# YouTube API Configuration
PUBLIC_VITE_YOUTUBE_API_KEY=AIzaSyDj8q1YxVtB-U9iXmV8K3M2DQr4WxZ7E0c
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

if check_process "strapi develop"; then
    echo "✅ Strapi Backend is already running"
else
    start_backend
    # Wait a bit for Strapi to initialize
    sleep 10
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
echo "🔧 Strapi Admin Panel: http://localhost:1337/admin"
echo "🎨 Astro Frontend:   http://localhost:4321/"
echo "📊 Strapi API:       http://localhost:1337/api"
echo ""
echo "📝 Logs:"
echo "   Strapi: tail -f /home/maarten/website-optimization/strapi-dev.log"
echo "   Astro:  tail -f /home/maarten/website-optimization/astro-dev.log"
echo ""
echo "🛑 To stop all servers:"
echo "   pkill -f 'strapi develop'"
echo "   pkill -f 'astro dev'"
echo ""
echo "⚡ Quick Commands (add to ~/.bashrc for convenience):"
echo "   alias dev-start='./start-full-dev.sh'"
echo "   alias dev-logs='tail -f strapi-dev.log astro-dev.log'"
echo "   alias dev-stop='pkill -f \"strapi develop\" && pkill -f \"astro dev\"'"

# Save PIDs for potential cleanup
echo $STRAPI_PID > .strapi.pid
echo $ASTRO_PID > .astro.pid

echo ""
echo "🎯 Setup complete! Happy coding!"