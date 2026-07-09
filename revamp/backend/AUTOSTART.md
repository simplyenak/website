# Payload CMS - Auto-Start Setup

## Overview

Payload CMS is now configured to run locally on your machine. The server runs on **port 1337** and provides:

- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api
- **Database**: PostgreSQL on localhost:5432 (database: `payload-local`)

## Quick Commands

All scripts are located in `/var/home/maarten/website-optimization/scripts/`:

```bash
# Start Payload CMS
/var/home/maarten/website-optimization/scripts/start-payload-cms.sh

# Stop Payload CMS
/var/home/maarten/website-optimization/scripts/stop-payload-cms.sh

# Check status
/var/home/maarten/website-optimization/scripts/status-payload-cms.sh
```

## Add to Toolbox Startup

To automatically start Payload CMS when you start your toolbox, add this line to your toolbox initialization script or shell profile:

### Option 1: Add to `.bashrc` or `.zshrc`

```bash
# Auto-start Payload CMS
echo "🚀 Starting Payload CMS..."
/var/home/maarten/website-optimization/scripts/start-payload-cms.sh &
```

### Option 2: Create a toolbox startup script

Create `/var/home/maarten/website-optimization/scripts/start-toolbox.sh`:

```bash
#!/bin/bash
echo "🚀 Starting Toolbox..."

# Start Payload CMS
echo "Starting Payload CMS..."
/var/home/maarten/website-optimization/scripts/start-payload-cms.sh &

# Add other services here...

echo "✅ Toolbox started!"
```

Then make it executable:
```bash
chmod +x /var/home/maarten/website-optimization/scripts/start-toolbox.sh
```

## Manual Start/Stop

### Start
```bash
cd /var/home/maarten/website-optimization/payload-local
npm run dev
```

### Stop
Press `Ctrl+C` in the terminal where it's running, or:
```bash
/var/home/maarten/website-optimization/scripts/stop-payload-cms.sh
```

## Logs

- **Log file**: `/var/home/maarten/website-optimization/payload-local/payload-dev.log`
- **View live logs**: `tail -f /var/home/maarten/website-optimization/payload-local/payload-dev.log`

## Troubleshooting

### Server won't start
1. Check if port 1337 is already in use:
   ```bash
   ss -tlnp | grep 1337
   ```

2. Kill any stale processes:
   ```bash
   /var/home/maarten/website-optimization/scripts/stop-payload-cms.sh
   ```

3. Check the log file for errors:
   ```bash
   tail -50 /var/home/maarten/website-optimization/payload-local/payload-dev.log
   ```

### Database connection errors
Make sure PostgreSQL is running:
```bash
pg_isready -h localhost
```

### Admin panel shows 404
The server might still be starting up. Wait a few seconds and refresh, or check:
```bash
/var/home/maarten/website-optimization/scripts/status-payload-cms.sh
```

## Configuration

- **Project directory**: `/var/home/maarten/website-optimization/payload-local`
- **Environment file**: `/var/home/maarten/website-optimization/payload-local/.env`
- **Payload config**: `/var/home/maarten/website-optimization/payload-local/src/payload.config.ts`

## Credentials

- **Admin email**: `admin@simplyenak.com`
- **Admin password**: `admin123` (change this in production!)

---

**Created**: 2026-04-02
**For**: Simply Enak Development Team
