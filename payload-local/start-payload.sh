#!/bin/bash
# Start Payload dev server with pm2
# Run this after boot to start the Payload CMS

# Start Postgres
sudo -u postgres /usr/bin/pg_ctl -D /var/lib/pgsql/data start -l /var/lib/pgsql/data/postgresql.log 2>/dev/null
sleep 2

# Start Payload with pm2
cd /var/home/maarten/website-optimization/payload-local
pm2 start "npx next dev --webpack" \
  --name payload-dev \
  --cwd /var/home/maarten/website-optimization/payload-local \
  --restart-delay 3000 \
  2>&1

echo ""
echo "✅ Payload CMS starting at http://localhost:3000/admin"
echo "   Admin: admin@simplyenak.com (password via ADMIN_PASSWORD env)"
echo ""
echo "Monitor: pm2 logs payload-dev"
echo "Stop:    pm2 stop payload-dev"
