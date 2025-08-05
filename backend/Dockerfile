# Stage 1: Build
FROM node:22 AS build
WORKDIR /opt/

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy full app
WORKDIR /opt/app
COPY . .

# Build Strapi Admin
RUN npm run build

# Stage 2: Final production image
FROM node:22

WORKDIR /opt/app

# Copy only needed files from build stage
COPY --from=build /opt/app ./
COPY --from=build /opt/node_modules ./node_modules

# Create non-root user (optional)
RUN useradd -m strapiuser && chown -R strapiuser:strapiuser /opt/app
USER strapiuser

EXPOSE 1337
CMD ["npm", "run", "start"]
