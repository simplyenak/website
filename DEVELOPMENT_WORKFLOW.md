# Simply Enak Website - Development Workflow

## 🚀 Safe Development Process

### 1. Start Work Session
```bash
# Navigate to project
cd /home/maarten/website-optimization

# Make sure you're on development branch
git checkout development

# Pull latest changes
git pull origin development

# Create backup before starting (optional but recommended)
./backup-work.sh
```

### 2. During Development
```bash
# Work on your changes...

# FREQUENTLY commit your work (every 30 minutes or after significant changes)
git add .
git commit -m "Descriptive message about what you changed"

# Or use the safe deployment script (includes backup)
./safe-deploy.sh "Your deployment message"
```

### 3. Before Stopping Work
```bash
# ALWAYS create a backup before ending session
./backup-work.sh

# Commit any remaining work
git add .
git commit -m "WIP: Work session $(date +%Y-%m-%d_%H-%M)"

# Push to GitHub for remote backup
git push origin development
```

## 🛡️ Safety Features

### Pre-commit Hook
- Warns you about uncommitted files before committing
- Prevents accidental loss of work
- Shows summary of changes being committed

### Backup Script (`./backup-work.sh`)
- Creates timestamped backups in `/home/maarten/website-backups/`
- Includes both committed AND uncommitted work
- Stashes uncommitted changes for recovery
- Automatically cleans up old backups (keeps 7 days)
- Creates summary file with recovery instructions

### Safe Deployment (`./safe-deploy.sh`)
- Checks for uncommitted changes before deployment
- Creates backup before deploying
- Requires confirmation before proceeding
- Prevents deployment if work isn't committed

## 📁 Backup Locations

### Local Backups
- **Directory**: `/home/maarten/website-backups/`
- **Format**: `website-backup-YYYY-MM-DD_HH-MM-SS-*`
- **Contents**:
  - All source files (tar.gz)
  - Git history and status
  - Stashed uncommitted work
  - Recovery instructions

### GitHub Backups
- **Branch**: `development`
- **URL**: https://github.com/simplyenak/website/tree/development
- **All committed work is automatically backed up here**

### Cloudflare Deployments
- **Staging**: https://staging-kl-page.staging-5zf.pages.dev
- **History**: Available in Cloudflare dashboard

## 🔄 Recovery Procedures

### If you lose work during a session:
```bash
# 1. Check recent backups
ls -la /home/maarten/website-backups/

# 2. Find your most recent backup
LATEST_BACKUP=$(ls -t /home/maarten/website-backups/website-backup-* | head -1)

# 3. Extract files if needed
tar -xzf $LATEST_BACKUP-files.tar.gz

# 4. Check for stashed work
git stash list

# 5. Recover stashed work
git stash pop
```

### If you need to revert changes:
```bash
# Check git history
git log --oneline -10

# Reset to specific commit (BE CAREFUL!)
git reset --hard <commit-hash>

# Or use safe reset (keeps work as stash)
git reset --soft <commit-hash>
git stash push -m "backup before reset"
```

## 📋 Daily Checklist

### ✅ Before Starting Work:
- [ ] Switch to `development` branch
- [ ] Pull latest changes: `git pull origin development`
- [ ] Create backup: `./backup-work.sh`

### ✅ During Work:
- [ ] Commit frequently (every 30 mins)
- [ ] Test changes locally
- [ ] Use meaningful commit messages

### ✅ Before Stopping:
- [ ] Create backup: `./backup-work.sh`
- [ ] Commit all work: `git add . && git commit -m "..."`
- [ ] Push to GitHub: `git push origin development`

## 🚨 Emergency Recovery

### If something goes wrong:
1. **Don't panic** - you have multiple backup layers
2. **Check local backups**: `/home/maarten/website-backups/`
3. **Check GitHub**: https://github.com/simplyenak/website/tree/development
4. **Use recovery procedures** above
5. **Ask for help** if needed

### Contact & Support:
- **GitHub**: https://github.com/simplyenak/website
- **Claude**: Available for recovery assistance
- **Documentation**: This file + backup summaries

---

**Last Updated**: 2025-10-06
**Status**: Active - All safety systems in place
**Backup Health**: ✅ Multiple layers working

**Remember**: Commit early, commit often! Your work is precious and protected. 🛡️