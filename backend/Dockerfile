  # Stage 1: Build Strapi app
  FROM node:20-alpine AS build

  RUN apk add --no-cache \
    build-base \
    autoconf \
    automake \
    libpng-dev \
    vips-dev \
    git

  WORKDIR /opt/app

  # Copy package files first for better layer caching
  COPY package*.json ./
  RUN npm ci --only=production && npm cache clean --force

  COPY . .
  RUN npm run build

  # Stage 2: Runtime image  
  FROM node:20-alpine AS production

  RUN apk add --no-cache vips-dev

  WORKDIR /opt/app

  # Copy built app from build stage
  COPY --from=build /opt/app/dist ./dist
  COPY --from=build /opt/app/node_modules ./node_modules
  COPY --from=build /opt/app/package*.json ./
  COPY --from=build /opt/app/public ./public
  COPY --from=build /opt/app/favicon.ico ./

  ENV NODE_ENV=production
  ENV PATH=/opt/app/node_modules/.bin:$PATH

  RUN chown -R node:node /opt/app
  USER node

  EXPOSE 1337
  CMD ["npm", "run", "start"]
