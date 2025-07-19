# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies needed for build
RUN apk add --no-cache curl python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Set Node.js memory limit and build the application
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/src ./src

# Set environment to production
ENV NODE_ENV=production

# Expose Strapi port
EXPOSE 1337

# Health check for Dokploy monitoring (wait for DB connection)
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:1337/_health || exit 1

# Start Strapi
CMD ["npm", "start"]