# Use official Node.js v22 Alpine image
FROM node:22-alpine

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

