FROM node:20-alpine

WORKDIR /opt/app

# Install system dependencies
RUN apk add --no-cache curl libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001 && \
    chown -R strapi:nodejs /opt/app

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:1337/_health || exit 1

# Start the application
CMD ["npm", "start"]
