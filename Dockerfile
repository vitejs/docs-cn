# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json to install dependencies
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the application code except for node_modules
COPY . .

# Build the VitePress site
# RUN pnpm run docs:build

# Install a lightweight static file server as a local dependency
RUN pnpm add serve

# Expose port 5000 for the server
EXPOSE 5173

CMD ["pnpm", "run", "docs:dev"]
