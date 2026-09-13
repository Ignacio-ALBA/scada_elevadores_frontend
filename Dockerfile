# Multi-stage build for SCADA Frontend (React + Vite)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build with Vite
RUN npm run build

# Runtime stage - use slim node image with http-server
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Expose port (internal, nginx will proxy)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Run http-server serving the dist folder on port 3000
CMD ["http-server", "dist", "-p", "3000", "--gzip"]
