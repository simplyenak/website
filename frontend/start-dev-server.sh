#!/bin/bash

# Start Development Server for Simply Enak Website
# This script will be automatically run on container startup

echo "🚀 Starting Simply Enak Development Server..."
echo "📍 Directory: $(pwd)"
echo "🕐 Time: $(date)"

# Navigate to frontend directory if not already there
cd /home/maarten/website-optimization/frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists, if not create it
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# Strapi Backend Configuration
PUBLIC_STRAPI_URL=https://simplyenak.com

# Contact Form Configuration
VITE_FORM_ENDPOINT=https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABpeXumlMVzDHFDl

# YouTube API Configuration
PUBLIC_VITE_YOUTUBE_API_KEY=***REMOVED***
PUBLIC_VITE_YOUTUBE_CHANNEL_ID=UCsW0J_Ip_-I5J9JtYqJ3YQA
EOF
fi

# Start the development server
echo "🌟 Starting Astro development server..."
echo "🔗 Local URL: http://localhost:4321/"
echo "🌐 Network URL: http://0.0.0.0:4321/ (if exposed)"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================="

# Run in foreground so we can see logs
npm run dev