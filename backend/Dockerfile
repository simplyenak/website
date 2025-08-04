# Use official Node.js v22 Slim image
FROM node:22-slim

# Install build tools for native modules
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and lock file
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Build Strapi admin panel
RUN npm run build

# Expose Strapi port
EXPOSE 1337

# Start the Strapi server
CMD ["npm", "start"]

