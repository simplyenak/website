# Multi-platform build support
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Use Node.js LTS base image (Debian-based for better native module compatibility)
FROM --platform=$TARGETPLATFORM node:22-slim

# Install dependencies needed by Strapi and vips
RUN apt-get update && apt-get install -y \
    libvips-dev \
    python3 \
    make \
    g++ \
    libc6-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create app directory and user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs strapi

# Set working directory
WORKDIR /opt/app

# Set environment variables for native compilation
ENV NODE_ENV=production
ENV STRAPI_TELEMETRY_DISABLED=true

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci && \
    npm rebuild && \
    npm cache clean --force

# Copy source code
COPY --chown=strapi:nodejs . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start the application
CMD ["npm", "run", "start"]
