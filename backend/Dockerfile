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

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

# Stage 2: Runtime image
FROM node:20-alpine AS production

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

COPY --from=build /opt/app ./
ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD npm run start

