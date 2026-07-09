# Simply Enak Payload CMS

**Production CMS for Simply Enak Food Tours**

## 🚀 Quick Start

```bash
cd /var/home/maarten/website-optimization/payload-local

# Install dependencies
npm install

# Start development server
npm run dev
```

Access admin: **http://localhost:3000/admin**

## 📚 Documentation

- `DOCUMENTATION/SCHEMA_UPDATE_GUIDE.md` - How to update database schema safely
- `NAVIGATION_STRUCTURE.md` - Collection organization
- `SETUP_COMPLETE.md` - Initial setup guide

## 🗄️ Database

- **Type**: PostgreSQL
- **Database**: payload_local
- **User**: Configure in `.env`

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Payload utilities
npm run generate:types   # Generate TypeScript types
npm run generate:importmap  # Generate import map
```

## 📁 Project Structure

```
payload-local/
├── src/
│   ├── app/              # Next.js app router
│   ├── collections/      # Payload collections
│   ├── components/       # React components
│   └── payload.config.ts # Main config
├── scripts/              # Helper scripts
├── DOCUMENTATION/        # Guides and docs
└── .env                  # Environment variables
```

## 🛠️ Database Helpers

```bash
# Add a field
./scripts/db-helpers.sh add-field tours scheduled_publish TIMESTAMP

# Check schema
./scripts/db-helpers.sh check-schema tours

# Backup database
./scripts/db-helpers.sh backup
```

## 📝 Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Encryption key
- `S3_*` - S3 storage credentials (optional)

## 🆘 Support

See `DOCUMENTATION/SCHEMA_UPDATE_GUIDE.md` for troubleshooting.

---

**Version**: 3.81.0  
**Last Updated**: 2026-04-02
