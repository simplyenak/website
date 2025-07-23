# Final production image
FROM node:20-alpine AS production

# Install only required runtime libs
RUN apk add --no-cache vips-dev

WORKDIR /opt/app

# Copy app and deps
COPY --from=build /opt/app ./

# Set environment
ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

# Make sure user owns files
RUN chown -R node:node /opt/app

USER node

EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]
