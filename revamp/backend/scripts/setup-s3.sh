#!/bin/bash
# Setup S3 for Payload CMS Media Storage
# Run this script to configure Scaleway S3

echo "🪣 Scaleway S3 Setup for Simply Enak CMS"
echo "=========================================="
echo ""

# Get credentials from Scaleway
echo "1. Go to: https://console.scaleway.com/iam/api-keys"
echo "2. Click 'Create API Key'"
echo "3. Give it a name like 'Payload CMS Media'"
echo "4. Copy the Access Key and Secret Key"
echo ""

read -p "Enter your Scaleway Access Key: " ACCESS_KEY
read -sp "Enter your Scaleway Secret Key: " SECRET_KEY
echo ""

# Update .env file
ENV_FILE="/var/home/maarten/website-optimization/payload-local/.env"

sed -i "s/S3_ACCESS_KEY_ID=.*/S3_ACCESS_KEY_ID=$ACCESS_KEY/" "$ENV_FILE"
sed -i "s/S3_SECRET_ACCESS_KEY=.*/S3_SECRET_ACCESS_KEY=$SECRET_KEY/" "$ENV_FILE"

echo ""
echo "✅ S3 credentials saved to .env"
echo ""
echo "📝 Next steps:"
echo "1. Create the bucket 'se-website-images' in Scaleway console"
echo "2. Make sure it's in Amsterdam (nl-ams) region"
echo "3. Set CORS to allow uploads from your domain"
echo "4. Restart the server: npm run dev"
echo ""
echo "🎉 Media uploads will now go to S3!"
