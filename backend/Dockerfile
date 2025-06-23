FROM node:20-alpine

WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose port
EXPOSE 1337

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S strapi -u 1001

# Change ownership of the app directory
RUN chown -R strapi:nodejs /opt/app
USER strapi

# Start the application
CMD ["npm", "start"]
