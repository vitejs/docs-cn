FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN npm i vitepress-plugin-mermaid mermaid vitepress-plugin-group-icons -D

RUN pnpm install --shamefully-hoist

RUN pnpm install


COPY . .

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "run", "dev"]