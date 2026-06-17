# 🚀 Deploying Payload CMS to Staging & Production

**Date**: April 2, 2026  
**Status**: ✅ **COMPLETE DEPLOYMENT GUIDE**

---

## 📦 Current Setup

**Local Development:**
- ✅ All plugins installed
- ✅ Configuration in `payload.config.ts`
- ✅ Dependencies in `package.json`

**Staging (revamp project):**
- ⏳ Needs plugin installation
- ⏳ Needs configuration sync

**Production (45.136.28.238):**
- ⏳ Needs plugin installation
- ⏳ Needs configuration sync

---

## 🎯 Deployment Strategy

### Option 1: Git-Based Deployment ✅ RECOMMENDED

**How it works:**
1. Commit all changes to Git
2. Push to staging/production repo
3. Run `npm install` on server
4. Restart server

**Pros:**
- ✅ Version controlled
- ✅ Repeatable
- ✅ Easy rollback
- ✅ Audit trail

**Cons:**
- Requires Git setup
- Need server access

---

### Option 2: Manual Deployment

**How it works:**
1. Copy `package.json` to server
2. Run `npm install` on server
3. Copy config files
4. Restart server

**Pros:**
- Simple
- No Git needed

**Cons:**
- Error-prone
- No version control
- Hard to track changes

---

## 📋 Step-by-Step: Git Deployment

### Step 1: Commit All Changes Locally

```bash
cd /var/home/maarten/website-optimization/payload-local

# Check what changed
git status

# Add all changes
git add package.json package-lock.json
git add src/payload.config.ts
git add src/collections/

# Commit
git commit -m "feat: Install form-builder, import-export, and MCP plugins"

# Push to staging (revamp repo)
git push origin main
```

### Step 2: Deploy to Staging (revamp project)

**SSH into staging server or use your deployment tool:**

```bash
# SSH to staging server
ssh maarten@your-staging-server.com

# Navigate to project
cd /path/to/revamp/payload-cms

# Pull latest changes
git pull origin main

# Install dependencies (includes new plugins)
npm install

# Restart Payload
pm2 restart payload-cms
# OR if using systemd
sudo systemctl restart payload-cms
# OR if using Docker
docker-compose restart payload
```

### Step 3: Deploy to Production

**Same as staging:**

```bash
# SSH to production server
ssh maarten@45.136.28.238 -p 4040

# Navigate to project
cd /home/maarten/payload-cms

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Restart Payload
docker-compose restart payload
# OR
pm2 restart payload-cms
```

---

## 📋 Step-by-Step: Manual Deployment

### If NOT Using Git

#### 1. Create Deployment Package Locally

```bash
cd /var/home/maarten/website-optimization/payload-local

# Create deployment archive
tar -czf payload-deployment-$(date +%Y%m%d).tar.gz \
  package.json \
  package-lock.json \
  src/payload.config.ts \
  src/collections/ \
  src/app/\(payload\)/admin/importMap.js

# Upload to server
scp payload-deployment-*.tar.gz maarten@45.136.28.238:/tmp/
```

#### 2. On Production Server

```bash
# SSH to production
ssh maarten@45.136.28.238 -p 4040

# Go to project
cd /home/maarten/payload-cms

# Extract deployment package
tar -xzf /tmp/payload-deployment-*.tar.gz

# Install dependencies (CRITICAL - installs new plugins)
npm install

# Restart server
docker-compose restart payload
# OR
pm2 restart payload-cms

# Verify plugins are loaded
curl http://localhost:3000/api/forms | head -20
```

---

## ✅ Pre-Deployment Checklist

### Before Deploying:

- [ ] All plugins working locally
- [ ] `package.json` updated with new dependencies
- [ ] `payload.config.ts` configured correctly
- [ ] Import map generated (`npm run generate:importmap`)
- [ ] No console errors in admin
- [ ] Tested all new features
- [ ] Database migrations ready (if any)
- [ ] Environment variables documented

### On Staging First:

- [ ] Deploy to staging
- [ ] Run `npm install`
- [ ] Restart server
- [ ] Test all plugins work
- [ ] Check forms collection exists
- [ ] Test export functionality
- [ ] Verify no errors in logs
- [ ] Get team signoff

### Then Production:

- [ ] Schedule maintenance window (if needed)
- [ ] Backup database
- [ ] Deploy to production
- [ ] Run `npm install`
- [ ] Restart server
- [ ] Smoke test all features
- [ ] Monitor logs for errors
- [ ] Update deployment documentation

---

## 🔧 Server Configuration

### Required on ALL Environments

**1. Node.js Version:**
```bash
node --version
# Should be: v20.9.0 or higher
```

**2. npm Version:**
```bash
npm --version
# Should be: 10.x or higher
```

**3. Environment Variables:**

Create `.env` on each server:

```env
# Database
DATABASE_URL=postgres://user:password@host:5432/database

# Payload
PAYLOAD_SECRET=your-secret-key-change-per-environment

# S3 Storage
S3_ACCESS_KEY_ID=SCWXXXXXXXXXXXXXX
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=se-website-images
S3_REGION=nl-ams
S3_ENDPOINT=https://s3.nl-ams.scw.cloud

# Server
PORT=3000
NODE_ENV=production
```

**⚠️ IMPORTANT:**
- Different `PAYLOAD_SECRET` per environment
- Different database URLs per environment
- Same S3 credentials (or separate buckets per env)

---

## 📊 Environment Comparison

| Setting | Local | Staging | Production |
|---------|-------|---------|------------|
| **URL** | localhost:1337 | staging.simplyenak.com | cms.system.simplyenak.com |
| **Database** | payload-local | payload_staging | payload_production |
| **PAYLOAD_SECRET** | dev-secret | staging-secret | production-secret |
| **NODE_ENV** | development | staging | production |
| **S3 Bucket** | se-website-images | se-website-images-staging | se-website-images |
| **Debug Mode** | ✅ Enabled | ⚠️ Limited | ❌ Disabled |
| **Auto-Start** | Manual | ✅ Yes | ✅ Yes |

---

## 🚨 Rollback Plan

### If Deployment Fails:

**Option 1: Git Rollback**
```bash
# On server
cd /path/to/payload-cms

# Revert to previous commit
git revert HEAD

# Reinstall dependencies
npm install

# Restart
pm2 restart payload-cms
```

**Option 2: Manual Rollback**
```bash
# On server
cd /path/to/payload-cms

# Restore previous package.json
git checkout HEAD~1 package.json

# Reinstall (removes new plugins)
npm install

# Restart
pm2 restart payload-cms
```

---

## 📝 Deployment Scripts

### Create These Scripts:

**scripts/deploy-staging.sh:**
```bash
#!/bin/bash
echo "🚀 Deploying to Staging..."

# Pull latest
git pull origin main

# Install dependencies
npm install

# Generate import map
npm run generate:importmap

# Restart
pm2 restart payload-staging

echo "✅ Staging deployment complete!"
```

**scripts/deploy-production.sh:**
```bash
#!/bin/bash
echo "🚀 Deploying to Production..."

# Backup first
echo "Creating backup..."
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Deploy
git pull origin main
npm install
npm run generate:importmap

# Restart
pm2 restart payload-production

echo "✅ Production deployment complete!"
```

Make executable:
```bash
chmod +x scripts/deploy-*.sh
```

---

## 🎯 Quick Deploy Commands

### For Your Setup:

**Deploy to Staging (revamp):**
```bash
cd /var/home/maarten/website-optimization/revamp
git pull origin main
npm install
npm run generate:importmap
/var/home/maarten/website-optimization/scripts/start-payload-cms.sh
```

**Deploy to Production (45.136.28.238):**
```bash
# From your local machine
scp package.json maarten@45.136.28.238:/home/maarten/payload-cms/
scp src/payload.config.ts maarten@45.136.28.238:/home/maarten/payload-cms/src/

# Then SSH and run:
ssh maarten@45.136.28.238 -p 4040
cd /home/maarten/payload-cms
npm install
docker-compose restart payload
```

---

## ✅ Verification After Deploy

### Check These on Each Environment:

**1. Admin Panel Loads:**
```bash
curl -I http://localhost:3000/admin
# Should return: HTTP/1.1 200 OK
```

**2. Forms Collection Exists:**
```bash
curl http://localhost:3000/api/forms
# Should return: {"docs":[],"totalDocs":0,...}
```

**3. Export Button Visible:**
- Go to Tours collection
- Check for "Export" button in UI

**4. No Console Errors:**
- Open browser DevTools
- Check Console tab
- Should be clean

**5. Check Logs:**
```bash
# PM2
pm2 logs payload-cms

# Docker
docker-compose logs payload

# Systemd
journalctl -u payload-cms -f
```

---

## 📚 Documentation to Maintain

**Keep These Updated:**

1. `DEPLOYMENT.md` - This file
2. `ENVIRONMENT_SETUP.md` - Environment variables
3. `BACKUP_PROCEDURE.md` - How to backup
4. `ROLLBACK_PLAN.md` - How to rollback

---

## 🎉 Summary

**To Deploy Plugins:**

1. ✅ Commit `package.json` and config to Git
2. ✅ Push to staging repo
3. ✅ SSH to staging server
4. ✅ Run `npm install` (CRITICAL - installs plugins!)
5. ✅ Restart server
6. ✅ Test everything works
7. ✅ Repeat for production

**Key Command:**
```bash
npm install  # THIS INSTALLS THE NEW PLUGINS!
```

Without this, plugins won't be available!

---

**Created**: 2026-04-02  
**For**: Simply Enak Team  
**Next Action**: Deploy to staging first!
