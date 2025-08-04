# Multi-platform build support
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Build stage
FROM --platform=$TARGETPLATFORM node:22-slim AS builder

# Install dependencies needed by Strapi and vips for building
RUN apt-get update && apt-get install -y \
    libvips-dev \
    python3 \
    make \
    g++ \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci && npm rebuild

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV STRAPI_TELEMETRY_DISABLED=true

# Build the application
RUN npm run build

# Production stage
FROM --platform=$TARGETPLATFORM node:22-slim AS production

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    libvips \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create app directory and user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs strapi

# Set working directory
WORKDIR /opt/app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=strapi:nodejs /opt/app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /opt/app/build ./build
COPY --from=builder --chown=strapi:nodejs /opt/app/public ./public
COPY --from=builder --chown=strapi:nodejs /opt/app/config ./config
COPY --from=builder --chown=strapi:nodejs /opt/app/database ./database
COPY --from=builder --chown=strapi:nodejs /opt/app/src ./src
COPY --from=builder --chown=strapi:nodejs /opt/app/types ./types

# Set environment variables
ENV NODE_ENV=production
ENV STRAPI_TELEMETRY_DISABLED=true

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start the application
CMD ["npm", "run", "start"]
