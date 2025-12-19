# =============================================================================
# Castify Frontend - Production Dockerfile
# Multi-stage build with Nginx for serving static files
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------------------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /build

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application for production
# Vite will create optimized production bundle in dist/
ENV NODE_ENV=production
RUN npm run build

# Verify build output
RUN ls -lh dist/ && \
    echo "Build size: $(du -sh dist/ | cut -f1)"

# -----------------------------------------------------------------------------
# Stage 2: Runtime Stage with Nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS runtime

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY --from=builder /build/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

# Verify files were copied
RUN ls -lh /usr/share/nginx/html/

# Create nginx user (if not exists) and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Add a simple health check endpoint by creating a health file
RUN echo '{"status":"healthy"}' > /usr/share/nginx/html/health

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# Build instructions:
#
# Development build:
#   docker build -t castify-frontend:dev .
#
# Production build with version tag:
#   docker build -t castify-frontend:1.0.0 -t castify-frontend:latest .
#
# Run container:
#   docker run -d \
#     -p 80:80 \
#     --name castify-frontend \
#     castify-frontend:latest
#
# Run with custom backend URL (build-time):
#   docker build \
#     --build-arg VITE_API_URL=https://api.castify.com \
#     -t castify-frontend:latest .
#
# Check logs:
#   docker logs -f castify-frontend
#
# Shell access:
#   docker exec -it castify-frontend sh
# =============================================================================
