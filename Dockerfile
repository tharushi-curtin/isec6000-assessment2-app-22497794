# Node 16 is used to match the assessment environment.
FROM node:16.20.2-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies from the committed lock file.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --engine-strict \
    && npm cache clean --force

# Copy only the application runtime files.
COPY app.js greeting.js ./

# Run the application without root privileges.
USER node

EXPOSE 8080

CMD ["node", "app.js"]
