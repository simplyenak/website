# Simply Enak - Local Development Environment

## 🚀 Quick Start

The development server is automatically configured to start when the container boots up. You can access it at:

**Local URL:** http://localhost:4321/

## 📋 Development Commands

### Server Management
```bash
# Check server status
./dev-status.sh

# Start development server
npm run dev
# or
./start-dev-server.sh

# Stop development server
pkill -f "astro dev"
# or
dev-stop

# Restart development server
pkill -f "astro dev" && npm run dev
# or
dev-restart

# View server logs
tail -f dev-server.log
# or
dev-logs
```

### Project Management
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview

# Update Astro
npx @astrojs/upgrade
```

## ⚙️ Environment Configuration

The `.env` file is automatically created with the following configuration:

```env
# Strapi Backend Configuration
PUBLIC_STRAPI_URL=https://simplyenak.com

# Contact Form Configuration
VITE_FORM_ENDPOINT=https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABpeXumlMVzDHFDl

# YouTube API Configuration
PUBLIC_VITE_YOUTUBE_API_KEY=AIzaSyDj8q1YxVtB-U9iXmV8K3M2DQr4WxZ7E0c
PUBLIC_VITE_YOUTUBE_CHANNEL_ID=UCsW0J_Ip_-I5J9JtYqJ3YQA
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Astro components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Static and dynamic pages
│   └── utils/          # Utility functions
├── public/             # Static assets
├── dist/               # Build output
├── .env                # Environment variables
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts
└── wrangler.toml       # Cloudflare Workers config
```

## 🛠️ Development Workflow

### 1. Making Changes
- Edit files in the `src/` directory
- The development server automatically hot-reloads
- Changes are reflected immediately at http://localhost:4321/

### 2. Testing Changes
- Test locally before deploying
- Use browser developer tools for debugging
- Check the console for any errors

### 3. Building for Production
```bash
npm run build
```
- Builds the project to `dist/` folder
- Optimizes for Cloudflare Pages deployment

### 4. Deployment
Use the deployment scripts:
```bash
# Deploy to staging
./deploy-staging.sh

# Deploy to production (manual)
wrangler pages deploy dist --project-name website
```

## 🔧 Available Aliases

The following aliases are available for convenience:

```bash
dev-start     # Start development server
dev-logs      # View server logs
dev-stop      # Stop development server
dev-restart   # Restart development server
```

## 🐛 Troubleshooting

### Server not starting
```bash
# Check if another process is using port 4321
lsof -i :4321

# Kill any existing astro processes
pkill -f "astro dev"

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment issues
```bash
# Recreate .env file
rm .env
# The startup script will recreate it automatically
```

### Build errors
```bash
# Check Astro configuration
cat astro.config.mjs

# Update dependencies
npm update

# Clear Astro cache
rm -rf .astro
```

## 📱 Mobile Development

To test on mobile devices:
1. Ensure both devices are on the same network
2. Find your local IP address: `ip addr show`
3. Access via: `http://YOUR_LOCAL_IP:4321`

## 🚨 Important Notes

- The development server automatically starts when the container boots
- Changes are hot-reloaded automatically
- Environment variables are loaded from `.env` file
- The server runs on port 4321 by default
- All changes are local until you deploy manually

## 📞 Support

If you encounter any issues:
1. Check the server status: `./dev-status.sh`
2. View the logs: `dev-logs`
3. Restart the server: `dev-restart`
4. Check this README for common solutions