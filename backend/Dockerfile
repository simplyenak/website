  # ---------- Stage 1: Build ----------
  FROM node:20-bookworm as builder

  # Create app directory
  WORKDIR /opt/app

  # Install required OS dependencies for native modules
  RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

  # Copy package files and install dependencies
  COPY package*.json ./
  RUN npm ci

  # Copy the rest of the Strapi app
  COPY . .

  # Rebuild native dependencies like @swc/core for compatibility
  RUN npm rebuild @swc/core --build-from-source || true

  # Build the Strapi admin panel
  RUN npm run build

  # ---------- Stage 2: Production Image ----------
  FROM node:20-slim

  # Create app directory
  WORKDIR /opt/app

  # Create user first
  RUN addgroup --system strapi && adduser --system --ingroup strapi strapi

  # Install only production dependencies and set ownership
  COPY --from=builder --chown=strapi:strapi /opt/app /opt/app

  # Switch to non-root user
  USER strapi

  EXPOSE 1337

  CMD ["npm", "start"]
