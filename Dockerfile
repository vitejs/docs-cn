FROM node:20-alpine

# Install required tools and bun
RUN apk add --no-cache curl bash git && \
    curl -fsSL https://bun.sh/install | bash && \
    cp ~/.bun/bin/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create directories with permissions
RUN mkdir -p /app/.vitepress /app/node_modules/.vite-temp && \
    chmod -R 777 /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun --version && \
    bun install --frozen-lockfile && \
    bun add -d vitepress-plugin-mermaid mermaid vitepress-plugin-group-icons && \
    rm -rf ~/.npm/* ~/.bun/* ~/.node-gyp/*

# Copy source
COPY . .

# Set permissions
RUN chmod -R 777 /app && \
    chown -R appuser:appgroup /app

# Build
RUN bun run build

# Switch to non-root user
USER appuser

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1

CMD ["bun", "run", "serve"]