# ---- Build Stage ----
FROM node:20-alpine AS build

# Use prebuilt Sharp binaries instead of compiling native modules
ENV npm_config_sharp_binary_host="https://npm.taobao.org/mirrors/sharp-libvips"

# Install only essential native deps for light image handling
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  vips-dev \
  git

WORKDIR /opt/app

# Copy only the lockfiles and install production dependencies
COPY package*.json ./

RUN npm install --omit=dev --unsafe-perm

# Copy remaining codebase and build
COPY . .

RUN npm run build

# ---- Final Production Image ----
FROM node:20-alpine

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

# Copy built app from builder
COPY --from=build /opt/app .

ENV NODE_ENV=production

USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
