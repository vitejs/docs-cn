FROM node:20-alpine

# Combine RUN commands to reduce layers and set PNPM_HOME
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git wget && \
    npm install -g pnpm

WORKDIR /app

# Create necessary directories with proper permissions
RUN mkdir -p /app/.vitepress && \
    mkdir -p /app/node_modules/.vite-temp && \
    chmod -R 777 /app

# Copy only package files first to leverage cache
COPY package.json pnpm-lock.yaml* ./

# Combine install commands and clean up cache
RUN pnpm install --shamefully-hoist && \
    pnpm install vitepress-plugin-mermaid mermaid vitepress-plugin-group-icons -D && \
    pnpm store prune && \
    rm -rf /root/.npm/* /root/.pnpm-store/* /root/.node-gyp/*

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

# Build the application
RUN pnpm run build

EXPOSE 4173

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1

# Update the CMD to bind to all interfaces (0.0.0.0)
CMD ["pnpm", "run", "serve", "--", "--host", "0.0.0.0"]