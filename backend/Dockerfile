# Stage 1: Build
FROM node:22-alpine AS build

# Install build tools
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git

# Set workdir
WORKDIR /opt/app

# Copy everything (Strapi needs full project during build)
COPY . .

# Install node-gyp and deps
RUN npm install -g node-gyp

# Install ALL dependencies including devDependencies
RUN npm config set fetch-retry-maxtimeout 600000 -g \
  && npm install

# Build Strapi Admin
RUN npm run build

# Stage 2: Final production image
FROM node:22-alpine

# Runtime deps
RUN apk add --no-cache vips-dev

# Set workdir
WORKDIR /opt/app

# Copy built app from builder
COPY --from=build /opt/app .

# Only keep production dependencies
RUN npm prune --omit=dev

# Set environment and permissions
ENV NODE_ENV=production
RUN chown -R node:node /opt/app
USER node

# Expose and run
EXPOSE 1337
CMD ["npm", "run", "start"]
