FROM node:18-alpine

WORKDIR /app

# Install pnpm and required build dependencies
RUN npm install -g pnpm && \
  apk add --no-cache git python3 make g++

# Copy package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build VitePress site
# RUN pnpm run docs:build

# Expose VitePress dev server port
EXPOSE 5174

# Start VitePress dev server
CMD ["pnpm", "run", "docs:dev"]