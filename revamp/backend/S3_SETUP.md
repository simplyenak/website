# S3 Storage Setup Guide for Payload CMS

## Overview

Payload CMS is configured to use **Scaleway S3-compatible storage** for media files. This guide shows you how to complete the setup.

---

## Step 1: Get Scaleway Credentials

### Option A: If you already have Scaleway account

1. Go to [Scaleway Console](https://console.scaleway.com/)
2. Navigate to **IAM** → **API Keys**
3. Click **Create API Key**
4. Copy the **Access Key** (starts with `SCW...`) and **Secret Key**
5. Make sure the key has permissions for Object Storage (S3)

### Option B: If you don't have Scaleway account

1. Create account at [scaleway.com](https://www.scaleway.com/)
2. Create a new project (or use default)
3. Go to **Object Storage** → **Buckets**
4. Create bucket named: `se-website-images`
5. Go to **IAM** → **API Keys** and create credentials

---

## Step 2: Configure Environment Variables

Edit the `.env` file at:
```
/var/home/maarten/website-optimization/payload-local/.env
```

**Uncomment and fill in these lines:**

```env
S3_ACCESS_KEY_ID=SCWXXXXXXXXXXXXXX
S3_SECRET_ACCESS_KEY=your-actual-secret-key-here
S3_BUCKET=se-website-images
S3_REGION=nl-ams
S3_ENDPOINT=https://s3.nl-ams.scw.cloud
```

**Replace:**
- `SCWXXXXXXXXXXXXXX` with your actual Access Key
- `your-actual-secret-key-here` with your actual Secret Key

---

## Step 3: Restart Payload CMS

After updating the `.env` file:

```bash
# Stop current server
/var/home/maarten/website-optimization/scripts/stop-payload-cms.sh

# Start with new config
/var/home/maarten/website-optimization/scripts/start-payload-cms.sh
```

---

## Step 4: Verify S3 is Working

1. Open Payload Admin: http://localhost:1337/admin
2. Go to **Media** collection
3. Click **Create New**
4. Upload a test image
5. Check if it appears in your Scaleway bucket

### Check Logs

```bash
tail -f /var/home/maarten/website-optimization/payload-local/payload-dev.log
```

Look for any S3-related errors.

---

## Troubleshooting

### Error: "Access Denied"

- Check your API key has correct permissions
- Verify bucket name is correct
- Make sure bucket exists in Scaleway console

### Error: "Connection timeout"

- Check `S3_ENDPOINT` is correct: `https://s3.nl-ams.scw.cloud`
- Verify network connectivity to Scaleway

### Files still saving locally

- Check `disableLocalStorage: true` in `payload.config.ts`
- Verify S3 plugin is loaded (check startup logs)

---

## Bucket Configuration

**Recommended Scaleway bucket settings:**

- **Region**: Amsterdam (nl-ams)
- **Bucket name**: `se-website-images`
- **Public access**: Private (files served through Payload API)
- **Versioning**: Optional (for file version history)

---

## Alternative: Using Local Storage (Development Only)

If you want to use local storage temporarily (not recommended for production):

1. Edit `payload.config.ts`
2. Change `disableLocalStorage: true` to `disableLocalStorage: false`
3. Remove or comment out the S3 plugin configuration
4. Restart Payload

Files will be stored in: `/var/home/maarten/website-optimization/payload-local/media/`

---

## Security Notes

⚠️ **Never commit `.env` file to Git!**

The `.env` file contains sensitive credentials. It's already in `.gitignore`.

⚠️ **Use different keys for development and production**

Create separate API keys for:
- Development (this machine)
- Production server

---

## Need Help?

- Scaleway Docs: https://www.scaleway.com/en/docs/object-storage/
- Payload S3 Storage: https://payloadcms.com/docs/storage/s3
- Check logs: `tail -f /var/home/maarten/website-optimization/payload-local/payload-dev.log`

---

**Last Updated**: 2026-04-02
**For**: Simply Enak Payload CMS
