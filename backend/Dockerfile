# syntax=docker/dockerfile:1
FROM node:20-slim

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Copy package manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy remaining application code
COPY . .

# Adjust permissions for non-root user
RUN chown -R node:node /app

USER node

EXPOSE 4000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 4000) + '/', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

CMD ["node", "server.js"]
