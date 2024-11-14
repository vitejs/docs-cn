FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install VitePress globally
RUN pnpm add -g vitepress

# Copy package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the application code
COPY . .

# Create docs directory if it doesn't exist
RUN mkdir -p docs

# Initialize VitePress
RUN cd docs && pnpm exec vitepress init

# Build the VitePress site
RUN cd docs && pnpm exec vitepress build

# Expose port for the server
EXPOSE 5173

# Start VitePress dev server
CMD ["pnpm", "exec", "vitepress", "dev", "docs"]