# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the application code except for node_modules
COPY . .

# Build the VitePress site
RUN pnpm run docs:build


# Expose port 5000 for the server
EXPOSE 5173

CMD ["pnpm", "exec", "vitepress", "dev", "docs"]