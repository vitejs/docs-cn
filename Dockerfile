FROM node:18-alpine

# Combine RUN commands to reduce layers and set PNPM_HOME
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git && \
    npm install -g pnpm

WORKDIR /app

# Create necessary directories with proper permissions
RUN mkdir -p /app/.vitepress && \
    chown -R node:node /app && \
    chmod -R 755 /app

# Copy only package files first to leverage cache
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Combine install commands and clean up cache
RUN pnpm install --shamefully-hoist && \
    pnpm install vitepress-plugin-mermaid mermaid vitepress-plugin-google-analytics vitepress-plugin-group-icons -D && \
    pnpm store prune && \
    rm -rf /root/.npm/* /root/.pnpm-store/* /root/.node-gyp/*

# Copy source after installing dependencies with correct permissions
COPY --chown=node:node . .

# Ensure .vitepress directory and its contents have correct permissions
RUN ls -la /app/.vitepress && \
    chmod -R 755 /app/.vitepress && \
    chown -R node:node /app/.vitepress

# Switch to node user before building
# USER node

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

EXPOSE 5173

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173 || exit 1

CMD ["pnpm", "run", "serve"]