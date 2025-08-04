# Multi-platform build support
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Use Node.js LTS base image
FROM --platform=$TARGETPLATFORM node:22-alpine

# Install dependencies needed by Strapi and vips, including glibc compatibility for native bindings
RUN apk add --no-cache \
    vips \
    vips-dev \
    gcompat \
    build-base \
    python3

# Create app directory and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001 -G nodejs

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY --chown=strapi:nodejs . .

# Build the application
RUN npm run build

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start the application
CMD ["npm", "run", "start"]
