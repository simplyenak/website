# Simply Enak - Complete Local Development Environment

## 🎯 Overview

This development environment provides a complete local setup for the Simply Enak website, including both the **Astro Frontend** and **Strapi Backend** CMS running locally.

## 🚀 Quick Start

### Current Status
Both servers are **already running**:
- **🔧 Strapi Backend**: http://localhost:1337/admin
- **🎨 Astro Frontend**: http://localhost:4321/

### Access Points
- **Frontend Website**: http://localhost:4321/
- **Strapi Admin Panel**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## ⚡ Commands

### Essential Commands
```bash
# Check current status
dev-status

# Start both servers (if stopped)
dev-start

# Stop both servers
dev-stop

# Restart both servers
dev-restart

# View live logs
dev-logs

# Start individual servers
strapi-start    # Start only Strapi
astro-start     # Start only Astro
```

### Development Workflow
```bash
# 1. Make changes to frontend (src/) or backend (src/api/)
# 2. Changes auto-reload immediately
# 3. Test locally at http://localhost:4321/
# 4. Manage content at http://localhost:1337/admin
# 5. Deploy when ready
```

## 📁 Project Structure

```
website-optimization/
├── frontend/                 # Astro frontend application
│   ├── src/                 # Source code (components, pages, layouts)
│   ├── public/              # Static assets
│   ├── dist/                # Build output
│   └── .env                 # Frontend environment variables
├── backend/                  # Strapi backend CMS
│   ├── src/                 # Strapi source code
│   ├── config/              # Configuration files
│   ├── .tmp/                # SQLite database (data.db)
│   └── .env                 # Backend environment variables
├── downloaded-project/       # Original project files
├── start-full-dev.sh        # Startup script
├── dev-status-full.sh       # Status checker
└── *.log                    # Log files
```

## 🔧 Configuration

### Frontend (.env)
```env
# Connects to local Strapi backend
PUBLIC_STRAPI_URL=http://localhost:1337

# YouTube API and other services
PUBLIC_VITE_YOUTUBE_API_KEY=AIzaSy...
```

### Backend (.env)
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

## 🎨 Frontend Development

### Making Changes
- Edit files in `frontend/src/`
- Auto hot-reload on save
- Preview at http://localhost:4321/

### Key Directories
- `frontend/src/pages/` - Route pages
- `frontend/src/components/` - Reusable components
- `frontend/src/layouts/` - Page layouts
- `frontend/src/utils/` - Utility functions

### Build & Deploy
```bash
cd frontend
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🔧 Backend Development

### Admin Panel
- **URL**: http://localhost:1337/admin
- **First Visit**: Create admin account
- **Features**: Content management, media upload, API configuration

### Database
- **Type**: SQLite
- **Location**: `backend/.tmp/data.db`
- **Auto-created**: On first startup

### API Endpoints
- **Base URL**: http://localhost:1337/api
- **Collections**: Stories, Tours, About, Contact, etc.
- **Documentation**: Available in Strapi admin panel

## 🔄 Database Management

### Local Database
The system uses SQLite for local development:
```bash
# Database location
backend/.tmp/data.db

# Backup database
cp backend/.tmp/data.db backup-$(date +%Y%m%d).db

# Reset database (careful!)
rm backend/.tmp/data.db
# Restart Strapi to recreate
```

### Using Downloaded Project Data
If you have a database from the downloaded project:
```bash
# Copy database file (if exists)
cp downloaded-project/backend/.tmp/data.db backend/.tmp/data.db

# Restart servers to apply
dev-restart
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port
lsof -i :1337  # Strapi
lsof -i :4321  # Astro

# Kill process
kill -9 <PID>

# Or stop both servers
dev-stop
```

**Dependencies Issues**
```bash
# Reinstall frontend dependencies
cd frontend && rm -rf node_modules package-lock.json && npm install

# Reinstall backend dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
```

**Database Issues**
```bash
# Reset Strapi database
cd backend && rm -rf .tmp && npm run dev
```

**Permission Issues**
```bash
# Fix file permissions
chmod +x start-full-dev.sh dev-status-full.sh
```

### Server Not Responding
```bash
# Check logs for errors
tail -f strapi-dev.log    # Strapi logs
tail -f astro-dev.log     # Astro logs

# Restart servers
dev-restart
```

## 📊 Monitoring

### Checking Status
```bash
dev-status
```
Shows:
- Server status (running/stopped)
- Process IDs
- URL endpoints
- Recent activity

### Viewing Logs
```bash
# Both servers
dev-logs

# Individual servers
tail -f strapi-dev.log    # Backend logs
tail -f astro-dev.log     # Frontend logs
```

## 🚀 Deployment

### Build for Production
```bash
# Build frontend
cd frontend && npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name website

# Or use deployment script
./deploy-staging.sh  # Deploy to staging
```

### Environment Variables
Remember to update environment variables for production:
- Change `PUBLIC_STRAPI_URL` to production Strapi URL
- Update API keys and secrets
- Configure database connection

## 🎉 Tips

### Development Best Practices
1. **Use local development**: Make changes locally first
2. **Test thoroughly**: Test both frontend and backend changes
3. **Check logs**: Monitor logs for errors and warnings
4. **Backup data**: Backup database before major changes
5. **Hot reload**: Changes auto-reload - no need to restart servers

### Productivity Features
- **Auto-reload**: Both frontend and backend auto-reload on changes
- **Integrated logging**: All logs captured and easily accessible
- **Quick commands**: Short aliases for common operations
- **Status monitoring**: Real-time status of both servers

### Performance
- **Fast startup**: Both servers start in ~10 seconds
- **Low memory usage**: Optimized for local development
- **Hot reload**: Instant feedback on changes

## 📞 Support

If you encounter issues:
1. Run `dev-status` to check current state
2. Check logs with `dev-logs`
3. Try restarting with `dev-restart`
4. Check this README for common solutions

---

**Happy Development! 🎯**

The complete local development environment is ready for use. Both frontend and backend are running and configured for optimal development workflow.