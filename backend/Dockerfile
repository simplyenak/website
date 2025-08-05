# Stage 1: Build
FROM node:lts-slim AS build

# Install dependencies needed for building native modules
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt

# Install only production dependencies first
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
WORKDIR /opt/app
COPY . .

RUN npm run build

# Stage 2: Final production image
FROM node:lts-slim

WORKDIR /opt/app

# Copy app from build container
COPY --from=build /opt/app ./
COPY --from=build /opt/node_modules ./node_modules

ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

EXPOSE 1337
CMD ["npm", "run", "start"]
