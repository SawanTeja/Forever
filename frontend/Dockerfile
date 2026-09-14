# syntax=docker/dockerfile:1
# ----------------------------------------
# Stage 1: Build Frontend Assets
# ----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency declarations
COPY package*.json ./

# Install all dependencies required for build
RUN npm install

# Copy application source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_RAZORPAY_KEY_ID=""

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

# Build static bundle
RUN npm run build

# ----------------------------------------
# Stage 2: Production Nginx Server
# ----------------------------------------
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
