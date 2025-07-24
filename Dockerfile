FROM node:20-alpine

# Install bun package manager
RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /app

# Create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create necessary directories with proper permissions
RUN mkdir -p /app/.vitepress && \
    mkdir -p /app/node_modules/.vite-temp && \
    chmod -R 777 /app

# Copy only package files first to leverage cache
COPY package.json bun.lockb* ./

# Install dependencies using bun and clean up cache
RUN bun install --frozen-lockfile && \
    bun add -d vitepress-plugin-mermaid mermaid vitepress-plugin-group-icons && \
    rm -rf /root/.npm/* /root/.bun/* /root/.node-gyp/*

# Copy source after installing dependencies
COPY . .

# Ensure all directories have very permissive permissions for troubleshooting
RUN chmod -R 777 /app

# Verify the config file exists and has correct permissions
RUN if [ -f "/app/.vitepress/config.ts" ]; then \
      echo "Config file exists and permissions are:" && \
      ls -l /app/.vitepress/config.ts; \
    else \
      echo "Config file is missing!" && \
      exit 1; \
    fi

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app /bun

# Build the application
RUN bun run build

# Switch to non-root user
USER appuser

EXPOSE 4173

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1

# Update the CMD to bind to all interfaces (0.0.0.0)
CMD ["bun", "run", "serve"]