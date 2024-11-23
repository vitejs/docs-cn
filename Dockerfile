FROM node:18-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git 

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN npm i vitepress-plugin-mermaid mermaid vitepress-plugin-group-icons vitepress-plugin-google-analytics -D

RUN pnpm install --shamefully-hoist

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "run", "serve"]
