FROM node:lts-slim AS build

# Install dependencies needed for building native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /opt/app
COPY . .
RUN npm run build

# Final image
FROM node:lts-slim
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY --from=build /opt/node_modules ./node_modules

ENV NODE_ENV=production
ENV PATH=/opt/node_modules/.bin:$PATH

EXPOSE 1337
CMD ["npm", "run", "start"]
