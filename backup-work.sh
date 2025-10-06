#!/bin/bash

# Daily backup script for website work
# Usage: ./backup-work.sh

BACKUP_DIR="/home/maarten/website-backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="website-backup-$DATE"
PROJECT_DIR="/home/maarten/website-optimization"

echo "🔄 Creating backup: $BACKUP_NAME"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# 1. Create git backup (committed changes)
echo "📦 Creating git backup..."
cd "$PROJECT_DIR"
git log --oneline -10 > "$BACKUP_DIR/$BACKUP_NAME-git-history.txt"
git branch -a > "$BACKUP_DIR/$BACKUP_NAME-branches.txt"
git status --porcelain > "$BACKUP_DIR/$BACKUP_NAME-status.txt"

# 2. Create file backup (including uncommitted changes)
echo "📁 Creating file backup..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME-files.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude="*.log" \
    -C "$PROJECT_DIR" .

# 3. Stash any uncommitted work with description
echo "💾 Stashing uncommitted work..."
if [ -n "$(git status --porcelain)" ]; then
    git stash push -m "Auto-backup stash $DATE" --include-untracked
    echo "✅ Uncommitted work stashed"
fi

# 4. Create summary of what's in the backup
echo "📋 Creating backup summary..."
cat > "$BACKUP_DIR/$BACKUP_NAME-summary.md" << EOF
# Website Backup Summary - $DATE

## What's Included:
- **Git History**: Last 10 commits
- **File Structure**: All source files (excluding node_modules, dist)
- **Branch Info**: All available branches
- **Git Status**: Current working directory state

## Important Notes:
- This backup includes both committed AND uncommitted work
- Stashed changes can be recovered with: \`git stash pop\`
- Files are in: \`$BACKUP_NAME-files.tar.gz\`

## Recovery Commands:
\`\`\`bash
# Restore files (if needed)
tar -xzf $BACKUP_NAME-files.tar.gz

# Check stashed work
git stash list

# Recover stashed work (most recent)
git stash pop
\`\`\`

---

**Backup Location**: $BACKUP_DIR
**Created**: $(date)
**Project**: Simply Enak Website
EOF

echo "✅ Backup completed successfully!"
echo "📍 Location: $BACKUP_DIR/$BACKUP_NAME-*"
echo "📄 Summary: $BACKUP_DIR/$BACKUP_NAME-summary.md"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "website-backup-*" -type f -mtime +7 -delete
find "$BACKUP_DIR" -name "website-backup-*" -type d -mtime +7 -delete

echo "🎉 Backup process completed!"